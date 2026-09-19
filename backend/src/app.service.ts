import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private prisma: PrismaService) {}

  async processEvent(payload: any) {
    this.logger.log(`Received event: ${JSON.stringify(payload)}`);
    // Identity Resolution
    const customerId = await this.resolveIdentity(payload.identifiers);
    
    // Normalize Event
    const event = await this.prisma.event.create({
      data: {
        customerId,
        channel: payload.channel,
        eventType: payload.eventType,
        identifierUsed: 'DYNAMIC', // Would be properly tracked in full logic
        metadata: JSON.stringify(payload.metadata || {}),
        timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
      }
    });

    // Check for Churn Triggers or Support Tickets
    await this.evaluateJourneyEvents(customerId);

    return { status: 'success', eventId: event.id, customerId };
  }

  private async resolveIdentity(identifiers: Record<string, string>): Promise<string> {
    const priorityList = ['customerId', 'email', 'phone', 'deviceId', 'loyaltyId'];
    let matchedCustomerId: string | null = null;

    // 1. Try to find existing customer by checking identifiers in priority order
    for (const idType of priorityList) {
      if (identifiers[idType]) {
        const match = await this.prisma.identity.findFirst({
          where: { type: idType, value: identifiers[idType] }
        });
        if (match) {
          matchedCustomerId = match.customerId;
          break;
        }
      }
    }

    // 2. If no match found, create a new customer
    if (!matchedCustomerId) {
      const newCustomer = await this.prisma.customer.create({
        data: { name: identifiers['email'] ? identifiers['email'].split('@')[0] : 'Unknown' }
      });
      matchedCustomerId = newCustomer.id;
    }

    // 3. Add all provided identifiers to this customer's graph
    for (const [type, value] of Object.entries(identifiers)) {
      if (value) {
        // Use upsert to only create if it doesn't exist
        await this.prisma.identity.upsert({
          where: { type_value: { type, value: String(value) } },
          update: { customerId: matchedCustomerId }, // Link to this customer if it existed elsewhere (graph merge!)
          create: { type, value: String(value), customerId: matchedCustomerId }
        });
      }
    }

    return matchedCustomerId || '';
  }

  private async evaluateJourneyEvents(customerId: string) {
    const events = await this.prisma.event.findMany({
      where: { customerId },
      orderBy: { timestamp: 'asc' }
    });
    
    let churnScore = 0;
    let supportContacts = 0;
    
    for (const e of events) {
      if (e.eventType === 'PAYMENT_FAILED') churnScore += 20;
      if (e.eventType === 'REFUND_REQUESTED') churnScore += 25;
      if (e.eventType === 'SUPPORT_CALL') supportContacts++;
      if (e.eventType === 'ESCALATED') churnScore += 15;
    }
    
    if (supportContacts > 2) churnScore += 20;
    
    await this.prisma.customer.update({
      where: { id: customerId },
      data: { churnScore: Math.min(100, churnScore) }
    });
  }

  // API Endpoints
  async getDashboardStats() {
    const totalCustomers = await this.prisma.customer.count();
    const totalEvents = await this.prisma.event.count();
    // Simplified for MVP
    return {
      totalCustomers,
      totalEvents,
      activeJourneys: totalCustomers,
      escalations: await this.prisma.event.count({ where: { eventType: 'ESCALATED' }}),
      highChurnRisk: await this.prisma.customer.count({ where: { churnScore: { gte: 60 } } })
    };
  }

  async getAllCustomers() {
    return this.prisma.customer.findMany({ include: { identities: true } });
  }

  async getCustomerJourney(id: string) {
    return this.prisma.event.findMany({ where: { customerId: id }, orderBy: { timestamp: 'asc' } });
  }

  async getAllEvents() {
    return this.prisma.event.findMany({ 
      orderBy: { timestamp: 'desc' },
      include: { customer: true }
    });
  }

  async getAllIdentities() {
    return this.prisma.identity.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
