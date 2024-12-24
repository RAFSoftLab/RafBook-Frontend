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

  const columns = 2;

  return (
    <Grid container spacing={1}>
      {visibleImages.map((attachment, index) => {
        const gridXs = 12 / columns;

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
