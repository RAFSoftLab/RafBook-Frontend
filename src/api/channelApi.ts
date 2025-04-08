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
                messageDTOList: channel.messageDTOList.reverse(),
              })),
            voiceChannels: category.voiceChannels
              .sort((c1: any, c2: any) => c1.name.localeCompare(c2.name))
              .map((channel: any) => ({
                id: channel.id,
                name: channel.name,
                type: 'voice',
                description: channel.description,
                canSpeak: channel.canSpeak,
                rolePermissions: channel.rolePermissions,
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

export const editMessage = async (messageId: number, messageDto: any): Promise<void> => {
    try {
        const response = await axiosInstance.put(`/messages/${messageId}`, messageDto);
        console.log('Message edited successfully:', response.data);
    } catch (error) {
        console.error('Error editing message:', error);
    }
}

export const deleteMessageBackend = async (messageId: number): Promise<void> => {
    try {
        const response = await axiosInstance.delete(`/messages/${messageId}`);
        console.log('Message deleted successfully:', response.data);
    } catch (error) {
        console.error('Error deleting message:', error);
    }
}

export const uploadFileMessage = async (
  file: File,
  textChannel: number,
  type: string,
  parentMessage?: number,
  fileName: string = file.name,
): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('textChannel', textChannel.toString());
  formData.append('type', type);
  formData.append('fileName', fileName);
  if (parentMessage !== undefined && parentMessage !== null) {
    formData.append('parentMessage', parentMessage.toString());
  }
  return axiosInstance.post('/messages/upload-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};