import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  connect(onConnected) {
    const socket = new SockJS('http://localhost:8080/ws');
    
    this.client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('WebSocket connected');
      this.connected = true;
      if (onConnected) onConnected();
    };

    this.client.onStompError = (frame) => {
      console.error('Broker error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }

  subscribeToNewOrders(callback) {
    if (this.client && this.connected) {
      return this.client.subscribe('/topic/orders/new', (message) => {
        const order = JSON.parse(message.body);
        callback(order);
      });
    }
  }

  subscribeToOrderStatusUpdates(callback) {
    if (this.client && this.connected) {
      return this.client.subscribe('/topic/orders/status', (message) => {
        const order = JSON.parse(message.body);
        callback(order);
      });
    }
  }

  subscribeToChefOrders(callback) {
    if (this.client && this.connected) {
      return this.client.subscribe('/topic/chef/orders', (message) => {
        const orderDetail = JSON.parse(message.body);
        callback(orderDetail);
      });
    }
  }

  subscribeToOrderStaffUpdates(callback) {
    if (this.client && this.connected) {
      return this.client.subscribe('/topic/order-staff/orders', (message) => {
        const order = JSON.parse(message.body);
        callback(order);
      });
    }
  }
}

const websocketService = new WebSocketService();
export default websocketService;

