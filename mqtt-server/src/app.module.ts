import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttService } from './mqtt/mqtt.service';
import { WsGateway } from 'src/ws/ws.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MqttService, WsGateway],
})
export class AppModule {}
