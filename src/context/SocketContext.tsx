// In your SocketContext.tsx

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { receiveMessage, updateMessage, deleteMessage } from '../store/messageSlice';

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

// Update subscriptions type to store multiple subscriptions per channel
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
      console.log(str);
    },
    onConnect: () => {
      console.log('Connected to STOMP');

      // General subscription can remain for global messages if needed.
      const generalSubscription = stompClient.subscribe('/topic/channels', (message: IMessage) => {
        const msg = JSON.parse(message.body);
        console.log('Received general message:', msg);
        dispatch(receiveMessage(msg));
      });

      // Store the general subscription using a special key, if desired.
      subscriptions.current.set(-1, { 
        sendSubscription: generalSubscription, 
        editSubscription: generalSubscription, 
        deleteSubscription: generalSubscription 
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

  // Subscribe to send messages
  const sendSubscription = stompClient.subscribe(
    `/topic/channels/send/${channelId}`,
    (message: IMessage) => {
      console.log(`[DEBUG] Received message on SEND topic for channel ${channelId}`);
      try {
        const msg = JSON.parse(message.body);
        const transformedMessage = { ...msg, channelId };
        console.log(`[DEBUG] SEND subscription - transformed message:`, transformedMessage);
        dispatch(receiveMessage({ message: transformedMessage, currentId: currentUser.id }));
      } catch (error) {
        console.error(`[ERROR] Parsing SEND message for channel ${channelId}:`, error);
      }
    }
  );

  // Subscribe to edit messages
  const editSubscription = stompClient.subscribe(
    `/topic/channels/edit/${channelId}`,
    (message: IMessage) => {
      console.log(`[DEBUG] Received message on EDIT topic for channel ${channelId}`);
      try {
        const msg = JSON.parse(message.body);
        const transformedMessage = { ...msg, channelId };
        console.log(`[DEBUG] EDIT subscription - transformed message:`, transformedMessage);
        dispatch(updateMessage(transformedMessage));
      } catch (error) {
        console.error(`[ERROR] Parsing EDIT message for channel ${channelId}:`, error);
      }
    }
  );

  // Subscribe to delete messages
  const deleteSubscription = stompClient.subscribe(
    `/topic/channels/delete/${channelId}`,
    (message: IMessage) => {
      console.log(`[DEBUG] Received message on DELETE topic for channel ${channelId}`);
      try {
        const msg = JSON.parse(message.body);
        const transformedMessage = { ...msg, channelId };
        console.log(`[DEBUG] DELETE subscription - transformed message:`, transformedMessage);
        // Assumes deleteMessage expects an object with channelId and messageId.
        dispatch(deleteMessage({ channelId, messageId: transformedMessage.id }));
      } catch (error) {
        console.error(`[ERROR] Parsing DELETE message for channel ${channelId}:`, error);
      }
    }
  );

    subscriptions.current.set(channelId, { sendSubscription, editSubscription, deleteSubscription });
    console.log(`Subscribed to channel ${channelId} for send, edit, and delete`);
  };

  const unsubscribeFromChannel = (channelId: number) => {
    const subs = subscriptions.current.get(channelId);
    if (subs) {
      subs.sendSubscription.unsubscribe();
      subs.editSubscription.unsubscribe();
      subs.deleteSubscription.unsubscribe();
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
