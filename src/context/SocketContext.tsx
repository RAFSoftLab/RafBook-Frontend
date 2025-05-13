import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { receiveMessage, updateMessage, deleteMessage, updateMessageReactions } from '../store/messageSlice';

interface StompService {
  sendMessage: (destination: string, body: any) => void;
  subscribeToChannel: (channelId: number) => void;
  unsubscribeFromChannel: (channelId: number) => void;
  subscribeToWebRTC: (channelId: string, callback: (message: IMessage) => void) => StompSubscription;
  subscribeToVoiceChannel: (channelId: string, callback: (message: IMessage) => void) => StompSubscription;
}

interface SocketContextProps {
  stompService: StompService;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

type ChannelSubscriptions = {
  sendSubscription: StompSubscription;
  editSubscription: StompSubscription;
  deleteSubscription: StompSubscription;
  reactionSubscription: StompSubscription;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const stompClient: Client = new Client({
    brokerURL: 'ws://localhost:8080/api/ws',
    reconnectDelay: 5000,
    debug: (str) => {
      console.log('[SocketContext] Debug:', str);
    },
    onConnect: () => {
      console.log('[SocketContext] STOMP client connected.');
      const generalSubscription = stompClient.subscribe('/topic/channels', (message: IMessage) => {
        const msg = JSON.parse(message.body);
        dispatch(receiveMessage(msg));
      });
      subscriptions.current.set(-1, {
        sendSubscription: generalSubscription,
        editSubscription: generalSubscription,
        deleteSubscription: generalSubscription,
      } as ChannelSubscriptions);
    },
    onStompError: (frame) => {
      console.error('[SocketContext] Broker reported error:', frame.headers['message']);
      console.error('[SocketContext] Additional details:', frame.body);
    },
  });

  const subscriptions = React.useRef<Map<number, ChannelSubscriptions>>(new Map());
  const currentUser = useAppSelector((state) => state.user);

  useEffect(() => {
    console.log('[SocketContext] Activating STOMP client.');
    stompClient.activate();
    return () => {
      console.log('[SocketContext] Deactivating STOMP client.');
      stompClient.deactivate();
    };
  }, [stompClient]);

  const sendMessage = (destination: string, body: any) => {
    console.log('[SocketContext] Sending message to', destination, body);
    stompClient.publish({
      destination,
      body: JSON.stringify(body),
    });
  };

  const subscribeToWebRTC = (channelId: string, callback: (message: IMessage) => void): StompSubscription => {
    console.log('[SocketContext] Subscribing to WebRTC on channel', channelId);
    return stompClient.subscribe(`/topic/webrtc/${channelId}`, (message: IMessage) => {
      console.log('[SocketContext] Received WebRTC message on channel', channelId, message.body);
      callback(message);
    });
  };

  const subscribeToVoiceChannel = (channelId: string, callback: (message: IMessage) => void): StompSubscription => {
    console.log('[SocketContext] Subscribing to voice notifications on channel', channelId);
    return stompClient.subscribe(`/topic/voice-channel/${channelId}`, (message: IMessage) => {
      console.log('[SocketContext] Received voice notification on channel', channelId, message.body);
      callback(message);
    });
  };

  // (subscribeToChannel and unsubscribeFromChannel remain unchanged.)
  const subscribeToChannel = (channelId: number) => {
    if (subscriptions.current.has(channelId)) {
      console.warn(`[SocketContext] Already subscribed to channel ${channelId}`);
      return;
    }
    const sendSubscription = stompClient.subscribe(
      `/topic/channels/send/${channelId}`,
      (message: IMessage) => {
        try {
          const msg = JSON.parse(message.body);
          const transformedMessage = { ...msg, channelId };
          dispatch(receiveMessage({ message: transformedMessage, currentId: currentUser.id }));
        } catch (error) {
          console.error(`[SocketContext] Error parsing SEND message for channel ${channelId}:`, error);
        }
      }
    );
    const editSubscription = stompClient.subscribe(
      `/topic/channels/edit/${channelId}`,
      (message: IMessage) => {
        try {
          const msg = JSON.parse(message.body);
          const transformedMessage = { ...msg, channelId };
          dispatch(updateMessage(transformedMessage));
        } catch (error) {
          console.error(`[SocketContext] Error parsing EDIT message for channel ${channelId}:`, error);
        }
      }
    );
    const deleteSubscription = stompClient.subscribe(
      `/topic/channels/delete/${channelId}`,
      (message: IMessage) => {
        try {
          const msg = JSON.parse(message.body);
          const transformedMessage = { ...msg, channelId };
          dispatch(deleteMessage({ channelId, messageId: transformedMessage.id }));
        } catch (error) {
          console.error(`[SocketContext] Error parsing DELETE message for channel ${channelId}:`, error);
        }
      }
    );
    const reactionSubscription = stompClient.subscribe(
      `/topic/channels/reaction/${channelId}`,
      (message: IMessage) => {
        try {
          const msg = JSON.parse(message.body);
          const transformedMessage = { ...msg, channelId };
          dispatch(updateMessageReactions(transformedMessage));
        } catch (error) {
          console.error(`[SocketContext] Error parsing REACTION message for channel ${channelId}:`, error);
        }
      }
    );
    subscriptions.current.set(channelId, { sendSubscription, editSubscription, deleteSubscription, reactionSubscription });
  };

  const unsubscribeFromChannel = (channelId: number) => {
    const subs = subscriptions.current.get(channelId);
    if (subs) {
      subs.sendSubscription.unsubscribe();
      subs.editSubscription.unsubscribe();
      subs.deleteSubscription.unsubscribe();
      subs.reactionSubscription.unsubscribe();
      subscriptions.current.delete(channelId);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        stompService: {
          sendMessage,
          subscribeToChannel,
          unsubscribeFromChannel,
          subscribeToWebRTC,
          subscribeToVoiceChannel,
        },
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
