// src/api/channelApi.ts

import axiosInstance from './axiosConfig';
import { MessageDTO, StudyLevel } from '../types/global';
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
            categories: program.categories
                .sort((a: any, b: any) => a.name.localeCompare(b.name))
                .map((category: any) => ({
                    id: category.id,
                    name: category.name,
                    description: category.description,
                    textChannels: category.textChannels
                        .sort((c1: any, c2: any) => c1.name.localeCompare(c2.name))
                        .map((channel: any) => ({
                            id: channel.id,
                            name: channel.name,
                            type: 'text',
                            description: channel.description,
                            canWrite: channel.canWrite,
                            messageDTOList: channel.messageDTOList
                                .reverse(),
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

export const editMessage = async (messageId: number, messageDto: MessageDTO): Promise<void> => {
    try {
        const response = await axiosInstance.put(`/messages/${messageId}`, messageDto);
        console.log('Message edited successfully:', response.data);
    } catch (error) {
        console.error('Error editing message:', error);
    }
}