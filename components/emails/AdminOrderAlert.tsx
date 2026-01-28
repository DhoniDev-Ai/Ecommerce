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

interface AdminOrderAlertProps {
    orderId: string;
    customerName: string;
    email: string;
    items: {
        name: string;
        quantity: number;
        price: number;
        image_url: string;
    }[];
    totalAmount: any;
    shippingAddress: any;
    paymentMethod?: string;
}

export const AdminOrderAlert = ({
    orderId,
    customerName,
    email,
    items,
    totalAmount,
    shippingAddress,
    paymentMethod = "Online",
}: AdminOrderAlertProps) => {
    return (
        <Html>
            <Head />
            <Preview>New Order: {customerName} spent ₹{totalAmount}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans antialiased">
                    <Container className="border border-gray-200 rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Heading className="text-black text-[20px] font-bold text-center p-0 my-[30px] mx-0">
                            New Order Received 🚀
                        </Heading>
                        <Text className="text-gray-700 text-[14px]">
                            <strong>Customer:</strong> {customerName} ({email})
                        </Text>
                        <Text className="text-gray-700 text-[14px]">
                            <strong>Order ID:</strong> {orderId}
                        </Text>

                        <Hr className="border border-gray-200 my-[20px] w-full" />

                        <Text className="uppercase text-xs font-bold text-gray-500 mb-2">Items</Text>
                        {items.map((item, index) => (
                            <Row key={index} className="mb-2">
                                <Column>
                                    <Text className="text-sm m-0">{item.name} x {item.quantity}</Text>
                                </Column>
                                <Column className="text-right">
                                    <Text className="text-sm font-bold m-0">₹{item.price * item.quantity}</Text>
                                </Column>
                            </Row>
                        ))}

                        <Hr className="border border-gray-200 my-[20px] w-full" />

                        <Row>
                            <Column>
                                <Text className="font-bold text-lg m-0">Total Revenue</Text>
                            </Column>
                            <Column className="text-right">
                                <Text className="font-bold text-lg m-0">
                                    ₹{totalAmount} <span className="text-gray-500 font-normal text-sm">({paymentMethod})</span>
                                </Text>
                            </Column>
                        </Row>

                        <Hr className="border border-gray-200 my-[20px] w-full" />

                        <Text className="uppercase text-xs font-bold text-gray-500 mb-2">Shipping Details</Text>
                        <Text className="text-sm text-gray-700 leading-relaxed">
                            {shippingAddress.fullName}<br />
                            {shippingAddress.phone}<br />
                            {shippingAddress.addressLine}, {shippingAddress.city}<br />
                            {shippingAddress.state} - {shippingAddress.pincode}
                        </Text>

                        <Section className="text-center mt-[32px]">
                            <Link
                                href={`https://ayuniv.com/admin/orders`}
                                className="bg-black text-white rounded px-4 py-3 font-bold text-sm no-underline"
                            >
                                Process Order in Admin
                            </Link>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html >
    );
};

export default AdminOrderAlert;
