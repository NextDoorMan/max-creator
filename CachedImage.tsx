import { useState, useEffect } from 'react';
import { assetCache } from '../utils/persistentAssetCache';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const CachedImage: React.FC<CachedImageProps> = ({ src, alt, ...props }) => {
  const [cachedSrc, setCachedSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const cached = assetCache.getCachedUrl(src);
        if (cached) {
          setCachedSrc(cached);
          setIsLoading(false);
        } else {
          const url = await assetCache.cacheAsset(src, 'image');
          setCachedSrc(url);
          setIsLoading(false);
        }
      } catch (error) {
        console.warn(`Failed to load cached image: ${src}`, error);
        setCachedSrc(src);
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src]);

  return (
    <img
      {...props}
      src={cachedSrc}
      alt={alt}
      style={{
        ...props.style,
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 0.3s ease-in-out'
      }}
      onLoad={() => setIsLoading(false)}
    />
  );
};
