import React, { useState, useEffect } from 'react';
import { ProductMedia } from '../types';
import MediaPlayer from './MediaPlayer';

interface MediaCarouselProps {
  media: ProductMedia[];
  productName: string;
  className?: string;
  aspectRatio?: string;
  onMediaChange?: (index: number) => void;
  initialIndex?: number;
  thumbnailsPosition?: 'bottom' | 'side';
  autoplay?: boolean;
  autoplayInterval?: number;
  showControls?: boolean;
  onClick?: () => void;
}

/**
 * Enhanced carousel component for displaying product media
 * Optimized for both images and videos with thumbnail navigation
 */
const MediaCarousel: React.FC<MediaCarouselProps> = ({
  media,
  productName,
  className = '',
  aspectRatio = '1/1',
  onMediaChange,
  initialIndex = 0,
  thumbnailsPosition = 'bottom',
  autoplay = false,
  autoplayInterval = 5000,
  showControls = true,
  onClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Reset to initial index when media array changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [media, initialIndex]);
  
  // Handle autoplay
  useEffect(() => {
    if (!autoplay || media.length <= 1 || isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
    }, autoplayInterval);
    
    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, media.length, isPlaying]);
  
  // Notify parent of media changes
  useEffect(() => {
    if (onMediaChange) onMediaChange(currentIndex);
  }, [currentIndex, onMediaChange]);
  
  // Handle navigation
  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };
  
  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length);
  };
  
  const handleThumbnailClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(index);
    
    // Pause any playing videos when switching media
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (!video.paused) {
        video.pause();
      }
    });
  };
  
  // Check if we need to show controls
  const shouldShowControls = showControls && media.length > 1;
  
  return (
    <div className={`media-carousel relative ${className}`}>
      {/* Main Media Display */}
      <div 
        className="main-media relative rounded-lg overflow-hidden"
        style={{ aspectRatio }}
        onClick={onClick}
      >
        {media[currentIndex] && (
          <MediaPlayer
            media={media[currentIndex]}
            alt={`${productName} image ${currentIndex + 1}`}
            className="w-full h-full transition-opacity duration-300"
            objectFit="contain"
            onLoad={() => setIsPlaying(media[currentIndex].type === 'video')}
            priority={currentIndex === 0}
            posterImage={media[currentIndex].type === 'video' && media[0].type === 'image' ? media[0].url : undefined}
          />
        )}
        
        {/* Navigation Controls */}
        {shouldShowControls && (
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-2 pointer-events-none z-10">
            <button
              className="z-20 bg-white/80 hover:bg-chocolate text-chocolate hover:text-white rounded-full p-3 shadow-lg text-xl transition-all duration-200 pointer-events-auto"
              onClick={handlePrev}
              disabled={currentIndex === 0 && !autoplay}
              aria-label="Previous image"
            >
              &#8592;
            </button>
            <button
              className="z-20 bg-white/80 hover:bg-chocolate text-chocolate hover:text-white rounded-full p-3 shadow-lg text-xl transition-all duration-200 pointer-events-auto"
              onClick={handleNext}
              disabled={currentIndex === media.length - 1 && !autoplay}
              aria-label="Next image"
            >
              &#8594;
            </button>
          </div>
        )}
      </div>
      
      {/* Thumbnail Navigation */}
      {media.length > 1 && (
        <div className={`thumbnails mt-4 flex ${thumbnailsPosition === 'side' ? 'flex-col gap-2' : 'flex-row flex-wrap gap-3 justify-center'}`}>
          {media.map((item, idx) => (
            <button
              key={idx}
              onClick={(e) => handleThumbnailClick(idx, e)}
              className={`relative rounded-md overflow-hidden transition-all duration-200 ${
                idx === currentIndex 
                  ? 'border-2 border-chocolate shadow-md scale-105' 
                  : 'border border-chocolate/20 hover:border-chocolate/60 opacity-70 hover:opacity-100'
              }`}
              aria-label={`View media ${idx + 1}`}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className={`${thumbnailsPosition === 'side' ? 'w-12 h-12' : 'w-16 h-16'} object-cover`}
                  loading="lazy"
                />
              ) : (
                <div className={`relative ${thumbnailsPosition === 'side' ? 'w-12 h-12' : 'w-16 h-16'} bg-black/5 flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/20">
                    <img
                      src={item.url.replace('.mp4', '.jpg')} 
                      alt={`${productName} video thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-chocolate/70 flex items-center justify-center">
                      <span className="text-white text-xs">▶</span>
                    </div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* Media Counter */}
      {media.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {media.length}
        </div>
      )}
    </div>
  );
};

export default MediaCarousel;