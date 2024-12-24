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

  // Determine the number of columns based on maxVisibleImages
  // For example, aim for 2 columns on small screens, more on larger screens
  let columns = 2; // default

  if (maxVisibleImages >= 6) {
    columns = 3;
  } else if (maxVisibleImages >= 4) {
    columns = 2;
  } else {
    columns = 1;
  }

  return (
    <Grid container spacing={1}>
      {visibleImages.map((attachment, index) => {
        const gridXs = Math.floor(12 / columns); // Ensures equal width for all grid items

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
