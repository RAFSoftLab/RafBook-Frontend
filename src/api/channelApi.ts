// src/api/channelApi.ts

import axiosInstance from './axiosConfig';
import { StudyLevel } from '../types/global';
import { NewMessageDTO } from '../types/global';

const mapBackendChannelsToFrontend = (data: any[]): StudyLevel[] => {
    return data.map((studyLevel: any) => ({
        id: studyLevel.id,
        name: studyLevel.name,
        description: studyLevel.description,
        studyPrograms: studyLevel.studyPrograms.map((program: any) => ({
            id: program.id,
            name: program.name,
            description: program.description,
            categories: program.categories.map((category: any) => ({
                id: category.id,
                name: category.name,
                description: category.description,
                textChannels: category.textChannels.map((channel: any) => ({
                    id: channel.id,
                    name: channel.name,
                    type: 'text',
                    description: channel.description,
                    canWrite: channel.canWrite,
                    messageDTOList: channel.messageDTOList.map((msg: any) => {
                        const attachments =
                            msg.mediaUrl && msg.mediaUrl.length > 0
                                ? msg.mediaUrl.map((url: string, index: number) => ({
                                    id: Number(`${msg.id}${index}`),
                                    type: msg.type.toLowerCase(),
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
                            content: msg.content,
                            createdAt: msg.createdAt,
                            type: msg.type,
                            attachments,
                            sender: msg.sender,
                            reactions: msg.reactions,
                            parentMessage: msg.parentMessage,
                            deleted: msg.deleted,
                            edited: msg.edited,
                        };
                    }),
                })),
            })),
        })),
    }));
};

export const fetchUserChannels = async (): Promise<StudyLevel[]> => {
    try {
        const response = await axiosInstance.get('/text-channel/for-user');
        const studyLevels = mapBackendChannelsToFrontend(response.data);
        return studyLevels;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch channels');
    }
};

export const sendMessage = async (newMessageDTO: NewMessageDTO): Promise<void> => {
    try {
        const response = await axiosInstance.post('/messages', newMessageDTO);
        console.log('Message posted successfully:', response.data);
    } catch (error) {
        console.error('Error posting message:', error);
    }
}