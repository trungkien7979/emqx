import { Server } from 'socket.io';
export declare class WsGateway {
    server: Server;
    handleConnection(client: any): void;
    send(data: any): void;
}
