/**
 * Image Optimization Utility
 * Provides lazy loading, WebP support, and responsive images
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Optimized Image Component with lazy loading and WebP support
 */
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  placeholder = '/assets/images/no_image.png',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      return;
    }

    // Check if browser supports WebP
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      if (canvas?.getContext && canvas?.getContext('2d')) {
        return canvas?.toDataURL('image/webp')?.indexOf('data:image/webp') === 0;
      }
      return false;
    };

    // Convert to WebP if supported and not already WebP
    const optimizedSrc = supportsWebP() && !src?.endsWith('.webp')
      ? src?.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      : src;

    // Use Intersection Observer for lazy loading
    if (loading === 'lazy' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(optimizedSrc);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px'
        }
      );

      if (imgRef?.current) {
        observer?.observe(imgRef?.current);
      }

      return () => {
        observer?.disconnect();
      };
    } else {
      setImageSrc(optimizedSrc);
    }
  }, [src, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(placeholder);
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
};

/**
 * Responsive Image Component with srcset support
 */
export const ResponsiveImage = ({
  src,
  alt,
  sizes = '100vw',
  className = '',
  ...props
}) => {
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc) return '';
    
    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths?.map((width) => `${baseSrc}?w=${width} ${width}w`)?.join(', ');
  };

  return (
    <OptimizedImage
      src={src}
      srcSet={generateSrcSet(src)}
      sizes={sizes}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

/**
 * Image preloader utility
 */
export const preloadImages = (imageUrls) => {
  return Promise.all(
    imageUrls?.map(
      (url) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(url);
          img.onerror = () => reject(url);
          img.src = url;
        })
    )
  );
};

/**
 * Image compression utility (client-side)
 */
export const compressImage = async (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target?.result;
    };
    
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
};

/**
 * Generate blur placeholder for images
 */
export const generateBlurPlaceholder = (src) => {
  // Return a tiny blurred version of the image
  return `${src}?w=20&blur=10`;
};

/**
 * Check if image exists
 */
export const imageExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response?.ok;
  } catch {
    return false;
  }
};

export default OptimizedImage;