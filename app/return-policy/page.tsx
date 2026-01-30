import { Metadata } from "next";
import { ReturnPolicyClient } from "./ReturnPolicyClient";

export const metadata: Metadata = {
    title: "Return & Refund Policy | Ayuniv Sanctuary",
    description: "Our transparent commitment to your satisfaction. Understand our return process, eligibility criteria, and refund timelines for Ayuniv rituals.",
    openGraph: {
        title: "Return & Refund Policy | Ayuniv Sanctuary",
        description: "Our transparent commitment to your satisfaction. Understand our return process, eligibility criteria, and refund timelines.",
        url: "https://ayuniv.com/return-policy",
        type: "website",
    },
};

export default function ReturnPolicyPage() {
    return <ReturnPolicyClient />;
}
