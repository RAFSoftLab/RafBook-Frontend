// src/api/voiceChannelApi.ts
import axiosInstance from './axiosConfig';
import { AxiosResponse } from 'axios';

/**
 * Adds the current user to a voice channel.
 * The backend will broadcast a USER_JOINED event.
 * @param channelId The UUID of the voice channel.
 */
export const addUserToVoiceChannel = async (channelId: string): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.post(`/voice-channel/add-user/${channelId}`);
    console.log('[VoiceChannelApi] User added to voice channel:', response.data);
    return response;
  } catch (error: any) {
    console.error('[VoiceChannelApi] Error adding user to voice channel:', error);
    throw new Error(error.response?.data?.message || 'Failed to add user to voice channel');
  }
};

/**
 * Removes the current user from a voice channel.
 * The backend will broadcast a USER_LEFT event.
 * @param channelId The UUID of the voice channel.
 */
export const removeUserFromVoiceChannel = async (channelId: string): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.delete(`/voice-channel/remove-user/${channelId}`);
    console.log('[VoiceChannelApi] User removed from voice channel:', response.data);
    return response;
  } catch (error: any) {
    console.error('[VoiceChannelApi] Error removing user from voice channel:', error);
    throw new Error(error.response?.data?.message || 'Failed to remove user from voice channel');
  }
};

/**
 * Retrieves all users currently present in the voice channel.
 * @param channelId The UUID of the voice channel.
 */
export const getVoiceChannelUsers = async (channelId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/voice-channel/users/${channelId}`);
    console.log('[VoiceChannelApi] Retrieved voice channel users:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[VoiceChannelApi] Error fetching voice channel users:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch voice channel users');
  }
};
