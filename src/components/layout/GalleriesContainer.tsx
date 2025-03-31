
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { fetchMediaIds } from '@/api/imageApi';
import { GalleryViewMode, ViewModeType } from '@/types/gallery';
import { MediaFilter } from '@/components/AppSidebar';
import GalleryContent from '@/components/gallery/GalleryContent';
import DeleteConfirmationDialog from '@/components/gallery/DeleteConfirmationDialog';
import GalleriesView from './GalleriesView';
import ViewModeSwitcher from './ViewModeSwitcher';

interface BaseGalleryProps {
  columnsCountLeft: number;
  columnsCountRight: number;
  selectedDirectoryIdLeft: string;
  selectedDirectoryIdRight: string;
  selectedIdsLeft: string[];
  setSelectedIdsLeft: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIdsRight: string[];
  setSelectedIdsRight: React.Dispatch<React.SetStateAction<string[]>>;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeSide: 'left' | 'right';
  deleteMutation: any;
  handleDeleteSelected: (side: 'left' | 'right') => void;
  leftFilter?: MediaFilter;
  rightFilter?: MediaFilter;
}

interface SidebarToggleProps {
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
}

interface GalleriesContainerProps extends BaseGalleryProps, SidebarToggleProps {
  galleryViewMode: GalleryViewMode;
  setGalleryViewMode: React.Dispatch<React.SetStateAction<GalleryViewMode>>;
  onColumnsChange?: (side: 'left' | 'right', count: number) => void;
}

const GalleriesContainer: React.FC<GalleriesContainerProps> = ({
  columnsCountLeft,
  columnsCountRight,
  selectedIdsLeft,
  setSelectedIdsLeft,
  selectedIdsRight,
  setSelectedIdsRight,
  selectedDirectoryIdLeft,
  selectedDirectoryIdRight,
  deleteDialogOpen,
  setDeleteDialogOpen,
  activeSide,
  deleteMutation,
  handleDeleteSelected,
  galleryViewMode,
  setGalleryViewMode,
  leftFilter,
  rightFilter,
  onToggleLeftPanel,
  onToggleRightPanel,
  onColumnsChange
}) => {
  const isMobile = useIsMobile();

  // Fetch left gallery media IDs
  const { data: leftMediaIds = [], isLoading: isLoadingLeftMediaIds, error: errorLeftMediaIds } = useQuery({
    queryKey: ['leftMediaIds', selectedDirectoryIdLeft, leftFilter],
    queryFn: () => fetchMediaIds(selectedDirectoryIdLeft, 'source', leftFilter as string)
  });
  
  // Fetch right gallery media IDs
  const { data: rightMediaIds = [], isLoading: isLoadingRightMediaIds, error: errorRightMediaIds } = useQuery({
    queryKey: ['rightMediaIds', selectedDirectoryIdRight, rightFilter],
    queryFn: () => fetchMediaIds(selectedDirectoryIdRight, 'destination', rightFilter as string)
  });

  // Handler functions
  const handleSelectIdLeft = (id: string) => setSelectedIdsLeft((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  const handleSelectIdRight = (id: string) => setSelectedIdsRight((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  const handlePreviewItemLeft = (id: string) => console.log(`Previewing item ${id} in source`);
  const handlePreviewItemRight = (id: string) => console.log(`Previewing item ${id} in destination`);
  const handleConfirmDelete = (side: 'left' | 'right') => () => handleDeleteSelected(side);

  // Column change handlers
  const handleLeftColumnsChange = (count: number) => {
    if (onColumnsChange) {
      console.log('Left columns changed to:', count);
      onColumnsChange('left', count);
    }
  };

  const handleRightColumnsChange = (count: number) => {
    if (onColumnsChange) {
      console.log('Right columns changed to:', count);
      onColumnsChange('right', count);
    }
  };

  // Toggle full view handlers
  const handleToggleLeftFullView = () => {
    if (galleryViewMode === 'left') {
      setGalleryViewMode('both');
    } else {
      setGalleryViewMode('left');
    }
  };

  const handleToggleRightFullView = () => {
    if (galleryViewMode === 'right') {
      setGalleryViewMode('both');
    } else {
      setGalleryViewMode('right');
    }
  };

  // Prepare content for left and right galleries
  const leftGalleryContent = (
    <GalleryContent
      title="Source"
      mediaIds={leftMediaIds || []}
      selectedIds={selectedIdsLeft}
      onSelectId={handleSelectIdLeft}
      isLoading={isLoadingLeftMediaIds}
      isError={!!errorLeftMediaIds}
      error={errorLeftMediaIds}
      columnsCount={columnsCountLeft}
      viewMode={galleryViewMode === 'both' ? 'split' : 'single'}
      onPreviewItem={handlePreviewItemLeft}
      onDeleteSelected={handleConfirmDelete('left')}
      position="source"
      filter={leftFilter}
      onToggleSidebar={onToggleLeftPanel}
      onColumnsChange={handleLeftColumnsChange}
      galleryViewMode={galleryViewMode}
      onToggleFullView={handleToggleLeftFullView}
    />
  );

  const rightGalleryContent = (
    <GalleryContent
      title="Destination"
      mediaIds={rightMediaIds || []}
      selectedIds={selectedIdsRight}
      onSelectId={handleSelectIdRight}
      isLoading={isLoadingRightMediaIds}
      isError={!!errorRightMediaIds}
      error={errorRightMediaIds}
      columnsCount={columnsCountRight}
      viewMode={galleryViewMode === 'both' ? 'split' : 'single'}
      onPreviewItem={handlePreviewItemRight}
      onDeleteSelected={handleConfirmDelete('right')}
      position="destination"
      filter={rightFilter}
      onToggleSidebar={onToggleRightPanel}
      onColumnsChange={handleRightColumnsChange}
      galleryViewMode={galleryViewMode}
      onToggleFullView={handleToggleRightFullView}
    />
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <GalleriesView
        viewMode={galleryViewMode}
        leftContent={leftGalleryContent}
        rightContent={rightGalleryContent}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => handleDeleteSelected(activeSide)}
        selectedIds={activeSide === 'left' ? selectedIdsLeft : selectedIdsRight}
        onCancel={() => setDeleteDialogOpen(false)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
};

export default GalleriesContainer;
