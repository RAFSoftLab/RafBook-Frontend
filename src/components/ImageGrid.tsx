// src/components/ImageGrid.tsx

import React from 'react';
import { Grid } from '@mui/material';
import ImageThumbnail from './ImageThumbnail';
import { Attachment } from '../types/global';

interface ImageGridProps {
  imageAttachments: Attachment[];
  maxVisibleImages: number;
  onImageClick: (index: number) => void;
  onRemoveImage?: (id: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  imageAttachments,
  maxVisibleImages,
  onImageClick,
  onRemoveImage,
}) => {
  const visibleImages = imageAttachments.slice(0, maxVisibleImages);
  const excessImageCount = imageAttachments.length - maxVisibleImages;

  return (
    <Grid container spacing={1}>
      {visibleImages.map((attachment, index) => {
        let gridXs = 4; // Default for up to 3 images

        if (imageAttachments.length === 1) gridXs = 12;
        else if (imageAttachments.length === 2) gridXs = 6;
        else if (imageAttachments.length === 3) gridXs = 4;
        else if (imageAttachments.length >= 4) gridXs = 6; // For 2x2 grid

        const isLastVisible = index === maxVisibleImages - 1 && excessImageCount > 0;

        return (
          <Grid item xs={gridXs} key={attachment.id}>
            <ImageThumbnail
              attachment={attachment}
              onClick={() => onImageClick(index)}
              showOverlay={isLastVisible}
              overlayCount={excessImageCount}
              onRemove={onRemoveImage ? () => onRemoveImage(attachment.id) : undefined}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default React.memo(ImageGrid);
