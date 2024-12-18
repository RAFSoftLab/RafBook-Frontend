import React from 'react';
import { Box, Link } from '@mui/material';
import { Attachment } from '../types/global';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ImageIcon from '@mui/icons-material/Image';

interface AttachmentItemProps {
  attachment: Attachment;
}

const AttachmentItem: React.FC<AttachmentItemProps> = ({ attachment }) => {
  const renderAttachment = () => {
    switch (attachment.type) {
      case 'image':
        return (
          <Box
            component="img"
            src={attachment.url}
            alt={attachment.name || 'Image Attachment'}
            sx={{
              maxWidth: '100%',
              borderRadius: 2,
              mt: 1,
            }}
          />
        );
      case 'audio':
        return (
          <Box sx={{ mt: 1 }}>
            <audio controls>
              <source src={attachment.url} />
              Your browser does not support the audio element.
            </audio>
          </Box>
        );
      case 'file':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {getFileIcon(attachment.name)}
            <Link href={attachment.url} download underline="hover" sx={{ ml: 1 }}>
              {attachment.name || 'Download File'}
            </Link>
          </Box>
        );
      default:
        return null;
    }
  };

  const getFileIcon = (fileName?: string) => {
    if (fileName) {
      const extension = fileName.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'pdf':
          return <PictureAsPdfIcon />;
        case 'doc':
        case 'docx':
          return <DescriptionIcon />;
        case 'mp3':
        case 'wav':
          return <AudiotrackIcon />;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return <ImageIcon />;
        default:
          return <InsertDriveFileIcon />;
      }
    }
    return <InsertDriveFileIcon />;
  };

  return <>{renderAttachment()}</>;
};

export default React.memo(AttachmentItem);
