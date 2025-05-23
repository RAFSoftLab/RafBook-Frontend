export type Channel = TextChannel | VoiceChannel;

export interface BaseChannel {
    id: number;
    name: string;
    description: string;
    uniqueId: string;
}

export interface TextChannel extends BaseChannel {
    type: 'text';
    canWrite: boolean;
    messageDTOList: MessageDTO[];
}

export interface VoiceChannel extends BaseChannel {
    type: 'voice';
    canSpeak: boolean;
    rolePermissions: any[];
}

export interface ChannelState {
    selectedChannelId: number | null;
    prevSelectedChannelId: number | null;
    studyLevels: StudyLevel[];
    selectedStudyLevel: StudyLevel | null;
    selectedStudyProgram: StudyProgram | null;
    loading: boolean;
    error: string | null;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    textChannels: TextChannel[];
    voiceChannels: VoiceChannel[];
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
    previewMode: boolean;
    setPreviewMode: React.Dispatch<React.SetStateAction<boolean>>;
    inputRef?: React.Ref<HTMLInputElement>;
}

export enum Type {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    VOICE = 'VOICE',
    FILE = 'FILE',
}

export interface Message {
    id: number;
    channelId: number;
    sender: Sender;
    type: Type;
    content: string;
    timestamp: string;
    reactions: Reaction[];
    parentMessage: number | null;
    deleted: boolean;
    edited: boolean;
    attachments?: Attachment[];
    status?: 'pending' | 'sent' | 'error';
    tempId?: number;
    uploadProgress?: number;
}

export interface Reaction {
    emotes: Emote;
    users: Sender[];
}

export interface Emote {
    id: number;
    name: string;
    data?: Uint8Array;
}
  
export interface Sender {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: string[];
}

export interface MessageDTO {
    id: number;
    sender: Sender;
    type: Type;
    content: string;
    createdAt: string;
    reactions: any[];
    parentMessage: number | null;
    deleted: boolean;
    edited: boolean;
    mediaUrl: string | null;
}

export interface NewMessageDTO {
    content: string;
    type: Type;
    mediaUrl: string | null;
    parentMessage: number | null;
    textChannel: number;
}

export interface Attachment {
    id: number;
    type: Type;
    url: string;
    name?: string;
    file?: File;
}

export interface AttachmentPreviewProps {
    attachments: Attachment[];
    onRemoveAttachment: (id: number) => void;
    maxVisibleImages: number;
}

export interface MessageItemProps {
    message: Message;
    onEditMessage?: (message: Message) => void;
    onReplyMessage?: (message: Message) => void;
    showMetadata?: boolean;
}

export interface MessageListProps {
    selectedChannel: number;
    onEditMessage?: (message: Message) => void;
    onReplyMessage?: (message: Message) => void;
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

export interface ThemeState {
    mode: 'light' | 'dark';
}

export interface UserState {
    id: number;
    name: string;
    avatar: string;
    role: string[];
    username: string;
    email: string;
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
