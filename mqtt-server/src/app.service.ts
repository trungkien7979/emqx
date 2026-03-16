import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<a href="http://localhost:18083/#/dashboard/overview" target="_blank">Dashboard</a>';
  }
}
