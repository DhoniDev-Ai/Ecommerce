declare module '@cashfreepayments/cashfree-js' {
  export interface CashfreeConfig {
    mode: 'sandbox' | 'production';
  }

  export interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: '_self' | '_blank' | '_parent' | '_top';
    onSuccess?: (data: any) => void;
    onFailure?: (data: any) => void;
  }

  export interface Cashfree {
    checkout(options: CheckoutOptions): Promise<any>;
  }

  export function load(config: CashfreeConfig): Promise<Cashfree>;
}
