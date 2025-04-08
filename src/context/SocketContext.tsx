import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { receiveMessage, updateMessage, deleteMessage } from '../store/messageSlice';

interface StompService {
  sendMessage: (destination: string, body: any) => void;
  subscribeToChannel: (channelId: number) => void;
  unsubscribeFromChannel: (channelId: number) => void;
  subscribeToWebRTC: (channelId: number) => void;
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
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const stompClient: Client = new Client({
    brokerURL: 'ws://localhost:8080/api/ws',
    reconnectDelay: 5000,
    debug: (str) => {
      // console.log(str);
    },
    onConnect: () => {
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
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    },
  });

  const subscriptions = React.useRef<Map<number, ChannelSubscriptions>>(new Map());
  const currentUser = useAppSelector((state) => state.user);

  useEffect(() => {
    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, [stompClient]);

  const sendMessage = (destination: string, body: any) => {
    stompClient.publish({
      destination,
      body: JSON.stringify(body),
    });
  };

  const subscribeToChannel = (channelId: number) => {
    if (subscriptions.current.has(channelId)) {
      console.warn(`Already subscribed to channel ${channelId}`);
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
          console.error(`[ERROR] Parsing SEND message for channel ${channelId}:`, error);
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
          console.error(`[ERROR] Parsing EDIT message for channel ${channelId}:`, error);
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
          console.error(`[ERROR] Parsing DELETE message for channel ${channelId}:`, error);
        }
      }
    );
    subscriptions.current.set(channelId, { sendSubscription, editSubscription, deleteSubscription });
  };

  const unsubscribeFromChannel = (channelId: number) => {
    const subs = subscriptions.current.get(channelId);
    if (subs) {
      subs.sendSubscription.unsubscribe();
      subs.editSubscription.unsubscribe();
      subs.deleteSubscription.unsubscribe();
      subscriptions.current.delete(channelId);
    }
  };

  const subscribeToWebRTC = (channelId: number) => {
    const webrtcSubscription = stompClient.subscribe(
      `/topic/webrtc/${channelId}`,
      (message: IMessage) => {
        try {
          const msg = JSON.parse(message.body);
          console.log(`[WebRTC] Received signaling message for channel ${channelId}:`, msg);
        } catch (error) {
          console.error(`[WebRTC] Error parsing message for channel ${channelId}:`, error);
        }
      }
    );
  };

  return (
    <SocketContext.Provider
      value={{ stompService: { sendMessage, subscribeToChannel, unsubscribeFromChannel, subscribeToWebRTC } }}
    >
      {children}
    </SocketContext.Provider>
  );
};
