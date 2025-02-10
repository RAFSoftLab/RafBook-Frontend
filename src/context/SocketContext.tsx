// src/context/SocketContext.tsx

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { receiveMessage } from '../store/messageSlice';

interface StompService {
  sendMessage: (destination: string, body: any) => void;
  subscribeToChannel: (channelId: number) => void;
  unsubscribeFromChannel: (channelId: number) => void;
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

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const stompClient: Client = new Client({
    brokerURL: 'ws://localhost:8080/api/ws',
    reconnectDelay: 5000,
    debug: (str) => {
      console.log(str);
    },
    onConnect: () => {
      console.log('Connected to STOMP');

      const generalSubscription = stompClient.subscribe('/topic/channels', (message: IMessage) => {
        const msg = JSON.parse(message.body);
        console.log('Received general message:', msg);
        dispatch(receiveMessage(msg));
      });

      subscriptions.current.set(-1, generalSubscription);
    },
    onStompError: (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    },
  });

  const subscriptions = React.useRef<Map<number, StompSubscription>>(new Map());

  const currentUser = useAppSelector((state) => state.user);

  useEffect(() => {
    stompClient.activate();

    return () => {
      stompClient.deactivate();
      console.log('Disconnected from STOMP');
    };
  }, [stompClient]);

  const sendMessage = (destination: string, body: any) => {
    console.log(`Sending message to ${destination}:`, body);
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

    const subscription = stompClient.subscribe(`/topic/channels/${channelId}`, (message: IMessage) => {
      const msg = JSON.parse(message.body);
      const transformedMessage = {
        ...msg,
        channelId,
      };
      console.log(`Received message in channel ${channelId}:`, transformedMessage);
      dispatch(receiveMessage({ message: transformedMessage, currentId: currentUser.id }));
    });

    subscriptions.current.set(channelId, subscription);
    console.log(`Subscribed to channel ${channelId}`);
  };

  const unsubscribeFromChannel = (channelId: number) => {
    const subscription = subscriptions.current.get(channelId);
    if (subscription) {
      subscription.unsubscribe();
      subscriptions.current.delete(channelId);
      console.log(`Unsubscribed from channel ${channelId}`);
    } else {
      console.warn(`No active subscription found for channel ${channelId}`);
    }
  };

  return (
    <SocketContext.Provider
      value={{ stompService: { sendMessage, subscribeToChannel, unsubscribeFromChannel } }}
    >
      {children}
    </SocketContext.Provider>
  );
};
