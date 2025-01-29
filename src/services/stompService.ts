// src/services/stompService.ts

import { Client, IMessage, IFrame, StompSubscription } from '@stomp/stompjs';
import { receiveMessage } from '../store/messageSlice'; // Correct import
import { AppDispatch } from '../store';

class StompService {
  private client: Client;
  private dispatch: AppDispatch;
  private subscriptions: { [key: number]: StompSubscription } = {}; // Map channelId to subscription

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/api/ws',
      connectHeaders: {

      },
      debug: function (str) {
        console.log(`[STOMP DEBUG]: ${str}`);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: this.onConnect.bind(this),
      onStompError: this.onStompError.bind(this),
      onWebSocketClose: this.onWebSocketClose.bind(this),
      onWebSocketError: this.onWebSocketError.bind(this),
    });
  }

  public connect() {
    console.log('Activating STOMP client...');
    this.client.activate();
  }

  public disconnect() {
    console.log('Deactivating STOMP client...');
    this.client.deactivate();
  }

  private onConnect(frame: IFrame) {
    console.log('✅ Connected to STOMP broker');

    const generalSubscription = this.client.subscribe('/topic/channels', (message: IMessage) => {
      const msg = JSON.parse(message.body);
      console.log('Received general message:', msg);
      this.dispatch(receiveMessage(msg));
    });

    this.subscriptions[-1] = generalSubscription;
  }

  private onStompError(frame: IFrame) {
    console.error('❌ STOMP Broker reported error: ' + frame.headers['message']);
    console.error('❌ Additional details: ' + frame.body);
  }

  private onWebSocketClose(event: CloseEvent) {
    console.warn('🔴 WebSocket connection closed:', event);
  }

  private onWebSocketError(event: Event) {
    console.error('❌ WebSocket encountered an error:', event);
  }

  private onMessageReceived(message: IMessage) {
    try {
      const body = JSON.parse(message.body);
      console.log('📩 Message received:', body);
      this.dispatch(receiveMessage(body));
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  }

  public sendMessage(destination: string, message: any) {
    if (this.client.connected) {
      console.log(`📤 Sending message to ${destination}:`, message);
      this.client.publish({
        destination,
        body: JSON.stringify(message),
      });
    } else {
      console.error('❌ Cannot send message; STOMP client is not connected');
    }
  }

  /**
   * Subscribes to a specific channel's topic.
   * @param channelId The ID of the channel to subscribe to.
   */
  public subscribeToChannel(channelId: number) {
    const destination = `/topic/channel/${channelId}`;

    if (this.subscriptions[channelId]) {
      console.warn(`⚠️ Already subscribed to channel ${channelId}`);
      return;
    }

    console.log(`🔔 Subscribing to ${destination}`);
    const subscription = this.client.subscribe(destination, this.onMessageReceived.bind(this));

    this.subscriptions[channelId] = subscription;
    console.log(`✅ Subscribed to ${destination}`);
  }

  /**
   * Unsubscribes from a specific channel's topic.
   * @param channelId The ID of the channel to unsubscribe from.
   */
  public unsubscribeFromChannel(channelId: number) {
    const subscription = this.subscriptions[channelId];
    if (subscription) {
      console.log(`🔕 Unsubscribing from /topic/channel/${channelId}`);
      subscription.unsubscribe();
      delete this.subscriptions[channelId];
      console.log(`✅ Unsubscribed from /topic/channel/${channelId}`);
    } else {
      console.warn(`⚠️ No active subscription found for channel ${channelId}`);
    }
  }
}

export default StompService;
