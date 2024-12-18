import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ImageIcon from '@mui/icons-material/Image';

/**
 * Returns an appropriate icon component based on the file extension.
 * @param fileName - The name of the file.
 * @returns A React component representing the file type.
 */
export const getFileIcon = (fileName?: string) => {
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
