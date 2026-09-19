import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('events')
  async ingestEvent(@Body() payload: any) {
    // In a full architecture, this would publish to RabbitMQ.
    // For this MVP, we process synchronously.
    return this.appService.processEvent(payload);
  }

  @Get('analytics/overview')
  async getOverview() {
    return this.appService.getDashboardStats();
  }

  @Get('customers')
  async getCustomers() {
    return this.appService.getAllCustomers();
  }

  @Get('customers/:id/journey')
  async getCustomerJourney(@Param('id') id: string) {
    return this.appService.getCustomerJourney(id);
  }

  @Get('events')
  async getEvents() {
    return this.appService.getAllEvents();
  }

  @Get('identities')
  async getIdentities() {
    return this.appService.getAllIdentities();
  }
}
