export interface Channel {
    id: number;
    name: string;
    type: 'text' | 'voice';
    description: string;
    canWrite: boolean;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    textChannels: Channel[];
}

export interface StudyProgram {
    id: number;
    name: string;
    description: string;
    categories: Category[];
}

export interface StudyLevel {
    id: number;
    name: string;
    description: string;
    studyPrograms: StudyProgram[];
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
    studyLevels: StudyLevel[];
    selectedStudyLevel: StudyLevel | null;
    selectedStudyProgram: StudyProgram | null;
    onSelectStudyLevel: (StudyLevel: StudyLevel) => void;
    onSelectStudyProgram: (studyProgram: StudyProgram) => void;
    onSelectChannel: (id: number) => void;
    selectedChannelId: number | null;
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
    studyLevels: StudyLevel[];
    selectedStudyLevel: StudyLevel | null;
    selectedStudyProgram: StudyProgram | null;
    loading: boolean;
    error: string | null;
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
