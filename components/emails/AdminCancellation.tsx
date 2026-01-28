import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img, // Added Img
    Link,
    Preview,
    Row,
    Section,
    Text,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

interface AdminCancellationAlertProps {
    orderId: string;
    customerName: string;
    email: string;
    phone: string;
    reason: string;
    totalAmount: number;
    refundStatus: string;
    isCod: boolean;
    items: { // Added items to the interface
        name: string;
        quantity: number;
        price: number;
        image_url: string;
    }[];
}

export const AdminCancellationAlert = ({
    orderId,
    customerName,
    email,
    phone,
    reason,
    totalAmount,
    refundStatus,
    isCod,
    items, // Destructured items
}: AdminCancellationAlertProps) => {
    return (
        <Html>
            <Head />
            <Preview>Order Cancelled: {customerName} (₹{String(totalAmount)})</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans antialiased">
                    <Container className="border border-red-200 rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Heading className="text-red-700 text-[20px] font-bold text-center p-0 my-[30px] mx-0">
                            Order Cancelled ❌
                        </Heading>

                        <Section className="bg-red-50 p-4 rounded mb-6">
                            <Text className="text-red-800 font-bold text-sm m-0 mb-1">CANCELLATION REASON</Text>
                            <Text className="text-red-700 text-base m-0 italic">"{reason}"</Text>
                        </Section>

                        <Text className="text-gray-700 text-[14px]">
                            <strong>Customer:</strong> {customerName}<br />
                            <strong>Email:</strong> {email}<br />
                            <strong>Phone:</strong> {phone}
                        </Text>
                        <Text className="text-gray-700 text-[14px]">
                            <strong>Order ID:</strong> {orderId}
                        </Text>
                        <Text className="text-gray-700 text-[14px]">
                            <strong>Type:</strong> {isCod ? "COD" : "Online"}
                        </Text>

                        <Hr className="border border-gray-200 my-[20px] w-full" />

                        <Text className="uppercase text-xs font-bold text-gray-500 mb-2">Cancelled Items</Text>
                        {items.map((item, index) => (
                            <Row key={index} className="mb-4">
                                <Column className="w-16">
                                    <Img
                                        src={item.image_url || 'https://via.placeholder.com/64'}
                                        width="50"
                                        height="50"
                                        alt={item.name}
                                        className="rounded border border-gray-200"
                                    />
                                </Column>
                                <Column className="pl-4">
                                    <Text className="text-gray-800 text-sm font-bold m-0">{item.name}</Text>
                                    <Text className="text-gray-500 text-xs m-0">Qty: {item.quantity}</Text>
                                </Column>
                                <Column className="text-right">
                                    <Text className="text-gray-800 text-sm font-bold m-0">₹{item.price * item.quantity}</Text>
                                </Column>
                            </Row>
                        ))}

                        <Hr className="border border-gray-200 my-[20px] w-full" />

                        <Row>
                            <Column>
                                <Text className="font-bold text-lg m-0">Total Refund Value</Text>
                            </Column>
                            <Column className="text-right">
                                <Text className="font-bold text-lg m-0 text-red-600">₹{totalAmount}</Text>
                            </Column>
                        </Row>

                        <Text className="text-sm font-bold text-gray-500 mt-4 mb-1">Refund Status</Text>
                        <Text className="text-base text-gray-800 m-0">{refundStatus}</Text>

                        <Section className="text-center mt-[32px]">
                            <Link
                                href={`https://ayuniv.com/admin/orders`}
                                className="bg-red-700 text-white rounded px-4 py-3 font-bold text-sm no-underline"
                            >
                                View in Admin Panel
                            </Link>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default AdminCancellationAlert;
