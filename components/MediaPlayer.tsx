import React, { useState, useEffect, useRef } from 'react';
import { ProductMedia } from '../types';

interface MediaPlayerProps {
  media: ProductMedia;
  alt: string;
  autoPlayVideos?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'cover' | 'contain';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  onClick?: () => void;
  lazyLoading?: boolean;
  posterImage?: string;
}

/**
 * Enhanced MediaPlayer component for optimal image and video handling
 * Provides optimized loading strategies and fallbacks
 */
const MediaPlayer: React.FC<MediaPlayerProps> = ({
  media,
  alt,
  autoPlayVideos = false,
  preload = 'metadata',
  width,
  height,
  className = '',
  objectFit = 'cover',
  priority = false,
  onLoad,
  onError,
  onClick,
  lazyLoading = true,
  posterImage,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Intersection observer for lazy loading videos
  useEffect(() => {
    if (!elementRef.current || media.type !== 'video') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // 10% of the item is visible
      }
    );
    
    observer.observe(elementRef.current);
    
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [media.type]);
  
  // Handle video playback based on visibility
  useEffect(() => {
    if (media.type !== 'video' || !videoRef.current) return;
    
    if (isInView && autoPlayVideos) {
      videoRef.current.play().catch(() => {
        // Auto-play was prevented, do nothing (user needs to tap)
      });
    } else if (!isInView && videoRef.current.played.length > 0) {
      videoRef.current.pause();
    }
  }, [isInView, autoPlayVideos, media.type]);
  
  // Image optimization
  if (media.type === 'image') {
    return (
      <div 
        ref={elementRef}
        className={`relative ${className}`}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        onClick={onClick}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-chocolate border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <img
          src={media.url}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={{ 
            objectFit,
            width: width ? `${width}px` : '100%', 
            height: height ? `${height}px` : '100%' 
          }}
          loading={lazyLoading && !priority ? 'lazy' : 'eager'}
          onLoad={() => {
            setIsLoading(false);
            if (onLoad) onLoad();
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
            if (onError) onError();
          }}
        />
        
        {hasError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-red-500 text-xs text-center p-2">
            <span>Failed to load image</span>
          </div>
        )}
      </div>
    );
  }
  
  // Video handling
  if (media.type === 'video') {
    return (
      <div 
        ref={elementRef}
        className={`relative ${className}`}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        onClick={(e) => {
          // Prevent click from triggering if the user is interacting with video controls
          const target = e.target as HTMLElement;
          if (target.tagName === 'VIDEO' && onClick) {
            onClick();
          }
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-chocolate border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <video
          ref={videoRef}
          src={isInView || !lazyLoading ? media.url : undefined}
          poster={posterImage || undefined}
          controls
          preload={preload}
          muted // Important for autoplay on mobile
          playsInline // Prevents fullscreen on iOS
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={{ 
            objectFit,
            width: width ? `${width}px` : '100%', 
            height: height ? `${height}px` : '100%' 
          }}
          onLoadedData={() => {
            setIsLoading(false);
            if (onLoad) onLoad();
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
            if (onError) onError();
          }}
          // Add data attributes for video quality
          data-quality="auto"
        />
        
        {!isInView && lazyLoading && !isLoading && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-70 flex items-center justify-center">
            <button 
              className="bg-chocolate text-cream rounded-full p-3"
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current) {
                  videoRef.current.src = media.url;
                  videoRef.current.load();
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-red-500 text-xs text-center p-2">
            <span>Failed to load video</span>
          </div>
        )}
      </div>
    );
  }
  
  return null;
};

export default MediaPlayer;