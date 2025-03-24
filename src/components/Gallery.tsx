
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import GalleryGrid from './gallery/GalleryGrid';
import GalleryEmptyState from './gallery/GalleryEmptyState';
import GallerySkeletons from './gallery/GallerySkeletons';
import GallerySelectionBar from './gallery/GallerySelectionBar';
import GalleryCountInfo from './gallery/GalleryCountInfo';
import { useIsMobile } from '@/hooks/use-breakpoint';

export interface ImageItem {
  id: string;
  src?: string;
  alt?: string;
  directory?: string;
  createdAt?: string;
  type?: "image" | "video";
}

interface GalleryProps {
  title: string;
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  isLoading?: boolean;
  columnsClassName?: string;
  onPreviewMedia?: (id: string) => void;
  viewMode?: 'single' | 'split';
}

const Gallery: React.FC<GalleryProps> = ({
  title,
  mediaIds,
  selectedIds,
  onSelectId,
  isLoading = false,
  columnsClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  onPreviewMedia,
  viewMode = 'single'
}) => {
  const [mounted, setMounted] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  // We'll update these counts when we have metadata
  const [countInfo, setCountInfo] = useState({ photoCount: 0, videoCount: 0 });
  
  useEffect(() => {
    setMounted(true);
    // Default count - we'll assume all are photos initially
    setCountInfo({ photoCount: mediaIds.length, videoCount: 0 });
    return () => setMounted(false);
  }, [mediaIds.length]);

  const handleSelectAll = () => {
    if (selectedIds.length === mediaIds.length) {
      // Deselect all media
      selectedIds.forEach(id => onSelectId(id));
    } else {
      // Select all unselected media
      mediaIds.forEach(id => {
        if (!selectedIds.includes(id)) {
          onSelectId(id);
        }
      });
    }
  };

  const toggleDates = () => {
    setShowDates(prev => !prev);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <GalleryCountInfo 
          photoCount={0} 
          videoCount={0} 
        />
        <div className="mt-2">
          <GallerySkeletons columnsClassName={columnsClassName} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full space-y-1">
      <GalleryCountInfo 
        photoCount={countInfo.photoCount} 
        videoCount={countInfo.videoCount} 
      />
      
      <GallerySelectionBar 
        selectedIds={selectedIds}
        mediaIds={mediaIds}
        onSelectAll={handleSelectAll}
        showDates={showDates}
        onToggleDates={toggleDates}
      />
      
      {mediaIds.length === 0 ? (
        <GalleryEmptyState />
      ) : (
        <div className={isMobile ? "mt-0.5" : "mt-1"}>
          <GalleryGrid
            mediaIds={mediaIds}
            selectedIds={selectedIds}
            onSelectId={onSelectId}
            onPreviewMedia={onPreviewMedia}
            columnsClassName={columnsClassName}
            viewMode={viewMode}
            showDates={showDates}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
