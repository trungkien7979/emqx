import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { WsGateway } from '../ws/ws.gateway';
import { log } from 'console';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;

  constructor(private readonly ws: WsGateway) {}

  onModuleInit() {
    // Kết nối MQTT broker
    this.client = mqtt.connect('mqtt://localhost:1883');

    // Khi connect thành công
    this.client.on('connect', () => {
      console.log('NestJS connected to EMQX');

      this.client.subscribe('gateway/device/data', (err) => {
        if (err) {
          console.log('Subscribe error:', err);
        } else {
          console.log('Subscribed to gateway/device/data');
        }
      });
    });

    // Khi nhận message
    this.client.on('message', (topic: string, message: Buffer) => {
      try {
        const payload = JSON.parse(message.toString());
        console.log('Received:', payload);
        // gửi realtime qua websocket
        this.ws.send(payload);
      } catch (error) {
        console.log('JSON parse error:', error);
      }
    });

    // Khi lỗi MQTT
    this.client.on('error', (error) => {
      console.log('MQTT Error:', error);
    });
  }
}