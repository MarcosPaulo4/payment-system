import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(private readonly config: ConfigService) {
    this.stripe = new Stripe(config.get<string>('STRIPE_SECRET_KEY') || '');
  }

  async createCustomer(data: { email: string; name: string }) {
    const customerAlreadyExists = await this.customerAlreadyExists(data.email);
    if (customerAlreadyExists) {
      return customerAlreadyExists;
    }
    return await this.stripe.customers.create(data);
  }

  async createPaymentIntent(userId: string, email: string) {
    const customer = await this.customerAlreadyExists(email);
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customer.id,
      success_url: 'http://localhost:3000/',
      cancel_url: 'http://localhost:3000/',
      line_items: [
        {
          price: this.config.get<string>('STRIPE_PRICE_ID'),
          quantity: 1,
        },
      ],
    });

    return {
      url: session.url,
    };
  }

  private async customerAlreadyExists(email: string) {
    const customer = await this.stripe.customers.list({ email });
    return customer.data[0];
  }
}
