"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttService = void 0;
const common_1 = require("@nestjs/common");
const mqtt = __importStar(require("mqtt"));
const ws_gateway_1 = require("../ws/ws.gateway");
let MqttService = class MqttService {
    ws;
    client;
    constructor(ws) {
        this.ws = ws;
    }
    onModuleInit() {
        this.client = mqtt.connect('mqtt://localhost:1883');
        this.client.on('connect', () => {
            console.log('NestJS connected to EMQX');
            this.client.subscribe('gateway/device/data', (err) => {
                if (err) {
                    console.log('Subscribe error:', err);
                }
                else {
                    console.log('Subscribed to gateway/device/data');
                }
            });
        });
        this.client.on('message', (topic, message) => {
            try {
                const payload = JSON.parse(message.toString());
                console.log('Received:', payload);
                this.ws.send(payload);
            }
            catch (error) {
                console.log('JSON parse error:', error);
            }
        });
        this.client.on('error', (error) => {
            console.log('MQTT Error:', error);
        });
    }
};
exports.MqttService = MqttService;
exports.MqttService = MqttService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ws_gateway_1.WsGateway])
], MqttService);
//# sourceMappingURL=mqtt.service.js.map