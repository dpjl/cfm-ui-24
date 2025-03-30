
import React, { useRef } from 'react';
import Gallery from '@/components/gallery/Gallery';
import { useGalleryZoom } from '@/hooks/use-gallery-zoom';
import { MobileViewMode } from '@/types/gallery';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface GalleryContentProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  columnsCount: number;
  viewMode?: 'single' | 'split';
  onPreviewItem: (id: string) => void;
  onDeleteSelected: () => void;
  title: string;
  filter?: string;
  position?: 'source' | 'destination';
  onToggleSidebar?: () => void;
  onColumnsChange?: (count: number) => void;
  mobileViewMode?: MobileViewMode;
  onToggleMaximize?: () => void;
}

const GalleryContent: React.FC<GalleryContentProps> = ({
  mediaIds,
  selectedIds,
  onSelectId,
  isLoading,
  isError,
  error,
  columnsCount,
  viewMode = 'single',
  onPreviewItem,
  onDeleteSelected,
  title,
  filter = 'all',
  position = 'source',
  onToggleSidebar,
  onColumnsChange,
  mobileViewMode,
  onToggleMaximize
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Déterminer les limites de colonnes en fonction du mode vue
  const getColumnLimits = () => {
    const isSplitView = viewMode === 'split';
    if (position === 'source') {
      return isSplitView 
        ? { min: 2, max: 10 } 
        : { min: 2, max: 10 };
    } else {
      return isSplitView 
        ? { min: 2, max: 10 } 
        : { min: 2, max: 10 };
    }
  };
  
  const { min: minColumns, max: maxColumns } = getColumnLimits();
  
  // Utiliser le hook de zoom si onColumnsChange est fourni
  if (onColumnsChange) {
    useGalleryZoom(containerRef, {
      minColumns,
      maxColumns,
      initialColumns: columnsCount,
      onColumnsChange
    });
  }

  // Déterminer si la galerie est actuellement maximisée sur mobile
  const isMaximized = isMobile && (
    (position === 'source' && mobileViewMode === 'left') ||
    (position === 'destination' && mobileViewMode === 'right')
  );

  // Déterminer si la galerie est visible sur mobile
  const isVisible = !isMobile || 
    mobileViewMode === 'both' || 
    (mobileViewMode === 'left' && position === 'source') || 
    (mobileViewMode === 'right' && position === 'destination');
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div ref={containerRef} className="h-full w-full">
      <Gallery
        title={title}
        mediaIds={mediaIds}
        selectedIds={selectedIds}
        onSelectId={onSelectId}
        isLoading={isLoading}
        columnsCount={columnsCount}
        onPreviewMedia={onPreviewItem}
        viewMode={isMobile ? (mobileViewMode === 'both' ? 'split' : 'single') : viewMode}
        onDeleteSelected={onDeleteSelected}
        position={position}
        isError={isError}
        error={error}
        filter={filter}
        onToggleSidebar={onToggleSidebar}
        mobileViewMode={mobileViewMode}
        onToggleMaximize={onToggleMaximize}
        gap={4}
        isMaximized={isMaximized}
      />
    </div>
  );
};

export default GalleryContent;
