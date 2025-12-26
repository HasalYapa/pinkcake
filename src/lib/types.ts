import { ORDER_STATUSES, PAYMENT_STATUSES } from "./constants";
import { Timestamp } from "firebase/firestore";

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface CakeOrder {
  id: string;
  order_id?: number; // Kept for compatibility if needed, but firestore uses id.
  created_at: string | Timestamp;
  customer_name: string;
  phone_number: string;
  cake_category: string;
  cake_size: string;
  flavor: string;
  message_on_cake?: string;
  delivery_date: string;
  delivery_location: string;
  image_url?: string | null;
  total_price: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
}
