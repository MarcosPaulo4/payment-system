import { Injectable } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class PaymentService {
  constructor(private readonly stripeService: StripeService) {}

  async createPaymentSession(
    transactionId: string,
    userId: string,
    userEmail: string,
  ) {
    const paymentIntent = await this.stripeService.createPaymentIntent(
      userId,
      userEmail,
    );
    return console.log(paymentIntent.url);
  }
}
