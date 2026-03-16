import { OnModuleInit } from '@nestjs/common';
import { WsGateway } from '../ws/ws.gateway';
export declare class MqttService implements OnModuleInit {
    private readonly ws;
    private client;
    constructor(ws: WsGateway);
    onModuleInit(): void;
}
