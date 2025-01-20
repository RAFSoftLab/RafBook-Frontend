import axiosInstance from './axiosConfig';
import { StudyLevel, StudyProgram, Category, Channel } from '../types/global';

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
