
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { GalleryHorizontal, GalleryVertical, GalleryVerticalEnd } from 'lucide-react';
import { MobileViewMode } from '@/types/gallery';

interface MobileViewSwitcherProps {
  mobileViewMode: MobileViewMode;
  setMobileViewMode: React.Dispatch<React.SetStateAction<MobileViewMode>>;
}

const MobileViewSwitcher: React.FC<MobileViewSwitcherProps> = ({
  mobileViewMode,
  setMobileViewMode
}) => {
  // Use memoized callbacks to prevent unnecessary re-renders
  const handleLeftView = useCallback(() => {
    setMobileViewMode('left');
  }, [setMobileViewMode]);
  
  const handleSplitView = useCallback(() => {
    setMobileViewMode('both');
  }, [setMobileViewMode]);
  
  const handleRightView = useCallback(() => {
    setMobileViewMode('right');
  }, [setMobileViewMode]);
  
  return (
    <div className="bg-background shadow-md border border-border rounded-full p-2 flex gap-2">
      <Button 
        variant={mobileViewMode === 'left' ? "default" : "ghost"} 
        size="icon" 
        onClick={handleLeftView}
        className="h-10 w-10 rounded-full"
        title="Source Gallery View"
      >
        <GalleryVertical className="h-5 w-5" />
      </Button>
      
      <Button 
        variant={mobileViewMode === 'both' ? "default" : "ghost"} 
        size="icon" 
        onClick={handleSplitView}
        className="h-10 w-10 rounded-full"
        title="Split View"
      >
        <GalleryHorizontal className="h-5 w-5" />
      </Button>
      
      <Button 
        variant={mobileViewMode === 'right' ? "default" : "ghost"} 
        size="icon" 
        onClick={handleRightView}
        className="h-10 w-10 rounded-full"
        title="Destination Gallery Only"
      >
        <GalleryVerticalEnd className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MobileViewSwitcher;
