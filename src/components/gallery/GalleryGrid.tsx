
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import LazyMediaItem from '@/components/LazyMediaItem';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface GalleryGridProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  onPreviewMedia?: (id: string) => void;
  columnsClassName?: string;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  mediaIds,
  selectedIds,
  onSelectId,
  onPreviewMedia,
  columnsClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
}) => {
  const isMobile = useIsMobile();
  
  // Déterminer si la classe contient déjà mobile-gallery-grid pour éviter la duplication
  const hasCustomMobileClass = columnsClassName.includes('mobile-gallery-grid');
  
  return (
    <div className={cn(
      "grid h-full content-start", 
      isMobile ? "gap-1" : "gap-4",
      columnsClassName,
      // Ajouter la classe mobile-gallery-grid uniquement si elle n'est pas déjà présente 
      // et si nous sommes en mode mobile avec grid-cols-2
      isMobile && !hasCustomMobileClass && columnsClassName.includes('grid-cols-2') ? "mobile-gallery-grid" : ""
    )}>
      <AnimatePresence>
        {mediaIds.map((id, index) => (
          <LazyMediaItem
            key={id}
            id={id}
            selected={selectedIds.includes(id)}
            onSelect={() => onSelectId(id)}
            onPreview={() => onPreviewMedia ? onPreviewMedia(id) : null}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GalleryGrid;
