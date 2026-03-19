import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class WsGateway {
  @WebSocketServer()
  server: Server;
  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }
  send(data: any) {
    this.server.emit('device_data', data);
  }
}
