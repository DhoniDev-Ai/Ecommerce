// Dashboard Types
export interface Address {
    id: string;
    user_id: string;
    full_name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    pincode: string;
    is_default: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Order {
    id: string;
    user_id: string;
    status: string;
    total: number;
    cashfree_order_id?: string;
    created_at: string;
    updated_at?: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price_at_purchase: number;
}
