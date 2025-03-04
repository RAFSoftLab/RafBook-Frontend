import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ImageIcon from '@mui/icons-material/Image';
import VideoIcon from '@mui/icons-material/VideoLibrary';
import ZipIcon from '@mui/icons-material/Archive';
import { Message, MessageDTO, Attachment, Sender, UserState } from './types/global';
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
  const attachment: Attachment | null =
  msg.mediaUrl && msg.mediaUrl.length > 0
    ? {
        id: Number(msg.id),
        type: msg.type.toLowerCase() as 'image' | 'video' | 'voice' | 'file',
        url: msg.mediaUrl[0],
        name:
          msg.type === 'IMAGE'
            ? 'Image'
            : msg.type === 'VIDEO'
              ? 'Video'
              : msg.type === 'VOICE'
                ? 'Voice'
                : 'File',
      }
    : null;

  const deleted = msg.deleted;

  return {
    id: msg.id,
    channelId: channelId,
    sender: msg.sender,
    type: deleted ? 'text' : (msg.type.toLowerCase() as 'text' | 'image' | 'video' | 'voice'),
    content: msg.content,
    timestamp: msg.createdAt,
    reactions: msg.reactions,
    parentMessage: msg.parentMessage,
    deleted: deleted,
    edited: msg.edited,
    attachments: attachment ? [attachment] : [],
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

export const getSenderFromUser = (user: UserState): Sender => {
  const [firstName, ...lastNameParts] = user.name.split(' ');
  const lastName = lastNameParts.join(' ') || ''; // In case there's only one name
  return {
    id: user.id,
    firstName,
    lastName,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};

export const groupMessages = (messages: Message[]): Message[][] => {
  if (!messages.length) return [];
  const groups: Message[][] = [];
  let currentGroup: Message[] = [messages[0]];

  for (let i = 1; i < messages.length; i++) {
    const message = messages[i];

    const groupAnchorTime = new Date(currentGroup[0].timestamp).getTime();
    const messageTime = new Date(message.timestamp).getTime();

    if (message.sender.id === currentGroup[0].sender.id && messageTime - groupAnchorTime <= 7 * 60 * 1000) {
      currentGroup.push(message);
    } else {
      groups.push(currentGroup);
      currentGroup = [message];
    }
  }
  groups.push(currentGroup);
  return groups;
};


