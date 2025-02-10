import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ImageIcon from '@mui/icons-material/Image';
import VideoIcon from '@mui/icons-material/VideoLibrary';
import ZipIcon from '@mui/icons-material/Archive';
import { Message, MessageDTO, Attachment, Sender } from './types/global';
import { jwtDecode } from 'jwt-decode';

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
      case 'mp4':
      case 'avi':
      case 'mov':
        return <VideoIcon />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon />;
      case 'zip':
      case 'rar':
        return <ZipIcon />;
      default:
        return <InsertDriveFileIcon />;
    }
  }
  return <InsertDriveFileIcon />;
};

export const transformBackendMessage = (msg: MessageDTO, channelId: number): Message => {
  const attachments: Attachment[] =
    msg.mediaUrl && msg.mediaUrl.length > 0
      ? msg.mediaUrl.map((url: string, index: number) => ({
        id: Number(`${msg.id}${index}`),
        type: msg.type.toLowerCase() as 'image' | 'video' | 'voice' | 'file',
        url,
        name:
          msg.type === 'IMAGE'
            ? 'Image'
            : msg.type === 'VIDEO'
              ? 'Video'
              : msg.type === 'VOICE'
                ? 'Voice'
                : 'File',
      }))
      : [];

  return {
    id: msg.id,
    channelId: channelId,
    sender: msg.sender,
    type: msg.type.toLowerCase() as 'text' | 'image' | 'video' | 'voice',
    content: msg.content,
    timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    reactions: msg.reactions,
    parentMessage: msg.parentMessage?.id,
    deleted: msg.deleted,
    edited: msg.edited,
    attachments: attachments.length > 0 ? attachments : undefined,
  };
};

export const getCurrentUser = (): Sender => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    const decoded: any = jwtDecode(token);
    return {
      id: decoded.id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      username: decoded.username,
      email: decoded.email,
      role: decoded.roles,
    };
  }
  return {
    id: 0,
    firstName: 'You',
    lastName: '',
    username: 'You',
    email: '',
    role: [],
  };
};