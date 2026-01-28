import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

interface OrderCancellationEmailProps {
    orderId: string;
    customerName: string;
    items: {
        name: string;
        quantity: number;
        price: number;
        image_url: string;
    }[];
    totalAmount: number;
    reason: string;
    refundStatus: string; // "Refund Initiated" or "No Refund (COD/Pending)"
}

export const OrderCancellationEmail = ({
    orderId,
    customerName,
    items,
    totalAmount,
    reason,
    refundStatus,
}: OrderCancellationEmailProps) => {
    const previewText = `Updates regarding your Ayuniv Ritual #${orderId.slice(0, 8)}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-[#FDFBF7] my-auto mx-auto font-sans antialiased">
                    <Container className="border border-[#E8E6E2] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px]">
                            <Text className="text-[#5A7A6A] text-[12px] font-bold uppercase tracking-[0.3em] text-center mb-4">
                                Ayuniv
                            </Text>
                            <Heading className="text-[#991B1B] text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                                Ritual Cancelled
                            </Heading>
                            <Text className="text-[#5A6A6A] text-[14px] leading-[24px]">
                                Hello {customerName},
                            </Text>
                            <Text className="text-[#5A6A6A] text-[14px] leading-[24px]">
                                Your order has been cancelled as requested.
                            </Text>
                            <Section className="bg-[#FEF2F2] border border-red-100 rounded p-4 my-4">
                                <Text className="text-red-800 text-[12px] font-bold uppercase tracking-wide mb-1">Reason</Text>
                                <Text className="text-red-700 text-[14px] mb-4">{reason}</Text>

                                <Text className="text-red-800 text-[12px] font-bold uppercase tracking-wide mb-1">Refund Status</Text>
                                <Text className="text-red-700 text-[14px] font-medium">{refundStatus}</Text>

                                {!refundStatus.includes("No Refund") && (
                                    <Text className="text-red-600 text-[11px] mt-2 italic">
                                        Note: If your refund is approved, it typically takes 5-7 business days to appear in your bank account.
                                    </Text>
                                )}
                            </Section>
                        </Section>

                        <Hr className="border border-[#E8E6E2] my-[26px] mx-0 w-full" />

                        <Section>
                            <Text className="text-[#5A7A6A] text-[10px] font-bold uppercase tracking-widest mb-4">
                                Cancelled Items
                            </Text>
                            {items.map((item, index) => (
                                <Row key={index} className="mb-4 opacity-50">
                                    <Column className="w-16">
                                        <Img
                                            src={item.image_url}
                                            width="64"
                                            height="64"
                                            alt={item.name}
                                            className="rounded grayscale"
                                        />
                                    </Column>
                                    <Column className="pl-4">
                                        <Text className="text-[#2D3A3A] text-[14px] font-medium m-0">
                                            {item.name}
                                        </Text>
                                        <Text className="text-[#7A8A8A] text-[12px] m-0">
                                            Qty: {item.quantity}
                                        </Text>
                                    </Column>
                                </Row>
                            ))}
                        </Section>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                href={`https://ayuniv.com/shop`}
                                className="bg-[#2D3A3A] rounded-full text-white text-[10px] font-bold uppercase tracking-[0.2em] px-[20px] py-[12px] no-underline"
                            >
                                Browse Other Rituals
                            </Link>
                        </Section>

                        <Hr className="border border-[#E8E6E2] my-[26px] mx-0 w-full" />

                        <Text className="text-[#9CA299] text-[12px] text-center">
                            If this was a mistake, please contact us immediately.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default OrderCancellationEmail;
