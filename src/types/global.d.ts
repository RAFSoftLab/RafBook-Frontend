export interface Channel {
    id: number;
    name: string;
    type: 'text' | 'voice';
}

export interface ChannelListProps {
    channels: Channel[];
    selectedChannel: number | null;
    onSelectChannel: (id: number) => void;
}

export interface HeaderProps {
    drawerWidth: number;
    handleDrawerToggle: () => void;
    channelName: string;
}

export interface MessageInputProps {
    newMessage: string;
    setNewMessage: React.Dispatch<React.SetStateAction<string>>;
    onSend: () => void;
    onSendGif: (gifUrl: string) => void;
    onSendAttachments: (newAttachments: Attachment[]) => void;
    onRemoveAttachment: (id: number) => void;
  }

export interface Message {
    id: number;
    channelId: number;
    sender: string;
    type: 'text' | 'gif' | 'file';
    content: string;
    gifUrl?: string;
    timestamp: string;
    attachments?: Attachment[];
}

export interface Attachment {
    id: number;
    type: 'image' | 'audio' | 'file';
    url: string;
    name?: string;
}

export interface AttachmentPreviewProps {
    attachments: Attachment[];
    onRemoveAttachment: (id: number) => void;
    maxVisibleImages: number;
}

export interface MessageItemProps {
    message: Message;
}

export interface MessageListProps {
    selectedChannel: number;
}

export interface MessageState {
    messages: {
        [channelId: number]: Message[];
    };
}

export interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
}

export interface SidebarProps {
    channels: Channel[];
    selectedChannel: number | null;
    onSelectChannel: (id: number) => void;
    drawerWidth: number;
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

export interface UserControlsProps {
    user: {
        name: string;
        avatar: string;
    };
    isMuted: boolean;
    isDeafened: boolean;
    onToggleMute: () => void;
    onToggleDeafen: () => void;
    onOpenSettings: () => void;
}

export interface VoiceChannelProps {
    selectedChannel: number;
}

export interface ChannelState {
    selectedChannelId: number | null;
    channels: Channel[];
}

export interface ThemeState {
    mode: 'light' | 'dark';
}

export interface UserState {
    name: string;
    avatar: string;
}

export interface VoiceState {
    isMuted: boolean;
    isDeafened: boolean;
    channelType: 'voice' | 'text';
    participants: string[];
    isJoined: boolean;
}

export interface EmojiPickerProps {
    open: boolean;
    onClose: () => void;
    onSelectEmoji: (emoji: EmojiData) => void;
    anchorEl: HTMLElement | null;
  }

export interface EmojiData {
    id: string;
    name: string;
    native: string;
}