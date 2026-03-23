let keepAliveInterval: number | null = null;

export const startKeepAlive = (): void => {
  if (keepAliveInterval) return;

  const pingAsset = async () => {
    try {
      const timestamp = new Date().getTime();
      await fetch(`/assets/game_logo.png?ping=${timestamp}`, {
        method: 'HEAD',
        cache: 'no-cache'
      });
    } catch (err) {
      console.warn('Keep-alive ping failed:', err);
    }
  };

  keepAliveInterval = window.setInterval(pingAsset, 30000);

  pingAsset();
};

export const stopKeepAlive = (): void => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
};
