
import { Header } from "@/components/layout/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Affiliate Program Policy | Ayuniv Rituals",
    description: "Terms and conditions for the Ayuniv Affiliate Program.",
};

export default function AffiliatePolicyPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-[#FDFBF7]">
            <Header />
            <article className="max-w-3xl mx-auto prose prose-stone lg:prose-lg prose-headings:font-heading prose-headings:text-[#2D3A3A] prose-p:text-[#5A6A6A]">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A8A8A] block mb-4">Legal</span>
                <h1 className="font-heading text-4xl text-[#2D3A3A] mb-8">Affiliate Program Policy</h1>

                <p className="lead text-xl text-[#5A6A6A] font-light">
                    Join the Ayuniv wellness movement. Share natural rituals and earn rewards.
                </p>

                <hr className="my-12 border-[#E8E6E2]" />

                <h3>1. Program Overview</h3>
                <p>
                    The Ayuniv Affiliate Program allows you ("Affiliate") to promote Ayuniv products using a unique coupon code.
                    When a customer uses your code, they receive a <strong>5% discount</strong> on their purchase, and you earn a <strong>5% commission</strong> on the Net Sales Amount.
                </p>

                <h3>2. Eligibility</h3>
                <p>
                    Anyone with an active Ayuniv account can join the program. We reserve the right to revoke affiliate status if we find evidence of fraud, spamming, or misrepresentation of our brand.
                </p>

                <h3>3. Commission Structure & Calculations</h3>
                <ul>
                    <li><strong>Commission Rate:</strong> 5% of the Net Sales Amount.</li>
                    <li><strong>Net Sales Amount:</strong> Calculated as the Total Order Value minus discounts, shipping fees, COD charges, and taxes (GST).</li>
                    <li><strong>Tracking:</strong> Commissions are tracked automatically when your unique coupon code is applied at checkout.</li>
                </ul>

                <h3>4. Payouts & Schedules</h3>
                <p>
                    We process payouts on a <strong>bi-weekly basis (every 14 days)</strong> via UPI or Bank Transfer.
                </p>
                <ul>
                    <li><strong>Minimum Payout:</strong> ₹500. Earnings below this amount will roll over to the next cycle.</li>
                    <li><strong>Payment Eligibility:</strong> Commissions are only paid on <strong>successful, non-returned orders</strong>.</li>
                    <li><strong>Return & Cancellation Policy:</strong> If a customer cancels an order or returns a product for a refund, the commission associated with that order will be <strong>revoked/deducted</strong> from your account balance.</li>
                    <li><strong>Holding Period:</strong> To ensure order validity, commissions may be subject to a 7-14 day holding period (matching our return window) before becoming eligible for payout.</li>
                    <li>You must provide valid payment details in your profile to receive funds.</li>
                </ul>

                <h3>5. Restrictions</h3>
                <p>
                    Affiliates are prohibited from:
                </p>
                <ul>
                    <li>Posting coupon codes on coupon aggregator websites.</li>
                    <li>Running paid ads (Google Ads, Facebook Ads) bidding on Ayuniv brand keywords.</li>
                    <li>Self-referrals (using your own code for personal purchases).</li>
                    <li>Misrepresenting product benefits or making false medical claims.</li>
                </ul>

                <h3>6. Termination</h3>
                <p>
                    Ayuniv reserves the right to terminate your participation in the program at any time for violation of these terms. Upon termination, any pending valid commissions will be paid out in the next cycle, subject to the return policy clauses above.
                </p>

                <p className="text-xs text-[#7A8A8A] mt-12">
                    Last Updated: January 2026
                </p>

            </article>

        </div>
    );
}
