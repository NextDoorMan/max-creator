export const createImageWithRetry = (src: string, maxRetries: number = 3): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const tryLoad = () => {
      const img = new Image();

      img.onload = () => resolve(img);

      img.onerror = () => {
        attempts++;
        if (attempts < maxRetries) {
          setTimeout(tryLoad, 1000 * attempts);
        } else {
          reject(new Error(`Failed to load image after ${maxRetries} attempts: ${src}`));
        }
      };

      img.src = src;
    };

    tryLoad();
  });
};

export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>,
  originalSrc: string,
  onRetry?: () => void
): void => {
  const img = event.currentTarget;
  const retryCount = parseInt(img.dataset.retryCount || '0', 10);

  if (retryCount < 3) {
    img.dataset.retryCount = String(retryCount + 1);

    setTimeout(() => {
      const timestamp = new Date().getTime();
      img.src = `${originalSrc}?retry=${timestamp}`;
      if (onRetry) onRetry();
    }, 1000 * (retryCount + 1));
  } else {
    console.error(`Image failed to load after 3 retries: ${originalSrc}`);
  }
};

export const handleAudioError = (
  audioElement: HTMLAudioElement,
  originalSrc: string,
  maxRetries: number = 3
): void => {
  const retryCount = parseInt(audioElement.dataset.retryCount || '0', 10);

  if (retryCount < maxRetries) {
    audioElement.dataset.retryCount = String(retryCount + 1);

    setTimeout(() => {
      const timestamp = new Date().getTime();
      audioElement.src = `${originalSrc}?retry=${timestamp}`;
      audioElement.load();
      audioElement.play().catch(err => {
        console.warn(`Audio retry ${retryCount + 1} failed:`, err);
      });
    }, 1000 * (retryCount + 1));
  } else {
    console.error(`Audio failed to load after ${maxRetries} retries: ${originalSrc}`);
  }
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadAudio = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => resolve();
    audio.onerror = reject;
    audio.src = src;
    audio.load();
  });
};
