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

interface OrderConfirmationEmailProps {
    orderId: string;
    customerName: string;
    items: {
        name: string;
        quantity: number;
        price: number;
        image_url: string;
    }[];
    totalAmount: number;
    shippingAddress: any;
}

export const OrderConfirmationEmail = ({
    orderId,
    customerName,
    items,
    totalAmount,
    shippingAddress,
}: OrderConfirmationEmailProps) => {
    const previewText = `Your Ayuniv Ritual #${orderId.slice(0, 8)} is confirmed.`;

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
                            <Heading className="text-[#2D3A3A] text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                                Ritual Confirmed
                            </Heading>
                            <Text className="text-[#5A6A6A] text-[14px] leading-[24px]">
                                Hello {customerName},
                            </Text>
                            <Text className="text-[#5A6A6A] text-[14px] leading-[24px]">
                                Thank you for choosing Ayuniv. Your wellness ritual has been initiated and is being prepared with care.
                            </Text>
                        </Section>

                        <Hr className="border border-[#E8E6E2] my-[26px] mx-0 w-full" />

                        <Section>
                            <Text className="text-[#5A7A6A] text-[10px] font-bold uppercase tracking-widest mb-4">
                                Order Summary (#{orderId.slice(0, 8)})
                            </Text>
                            {items.map((item, index) => (
                                <Row key={index} className="mb-4">
                                    <Column className="w-16">
                                        <Img
                                            src={item.image_url}
                                            width="64"
                                            height="64"
                                            alt={item.name}
                                            className="rounded"
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
                                    <Column className="text-right">
                                        <Text className="text-[#2D3A3A] text-[14px] font-medium m-0">
                                            ₹{item.price * item.quantity}
                                        </Text>
                                    </Column>
                                </Row>
                            ))}
                        </Section>

                        <Hr className="border border-[#E8E6E2] my-[26px] mx-0 w-full" />

                        <Section>
                            <Row>
                                <Column>
                                    <Text className="text-[#5A6A6A] text-[14px] font-bold">Total</Text>
                                </Column>
                                <Column className="text-right">
                                    <Text className="text-[#2D3A3A] text-[18px] font-bold">
                                        ₹{totalAmount}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        <Hr className="border border-[#E8E6E2] my-[26px] mx-0 w-full" />

                        <Section>
                            <Text className="text-[#5A7A6A] text-[10px] font-bold uppercase tracking-widest mb-2">
                                Shipping To
                            </Text>
                            <Text className="text-[#5A6A6A] text-[14px] leading-[24px]">
                                {shippingAddress.fullName}<br />
                                {shippingAddress.addressLine}<br />
                                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}<br />
                                {shippingAddress.phone}
                            </Text>
                        </Section>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                href={`https://ayuniv.com/dashboard/orders/${orderId}`}
                                className="bg-[#2D3A3A] rounded-full text-white text-[10px] font-bold uppercase tracking-[0.2em] px-[20px] py-[12px] no-underline"
                            >
                                Track Ritual
                            </Link>
                        </Section>

                        <Hr className="border border-[#E8E6E2] my-[26px] mx-0 w-full" />

                        <Text className="text-[#9CA299] text-[12px] text-center">
                            Ayuniv Wellness. Jaipur, India.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default OrderConfirmationEmail;
