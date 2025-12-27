'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CakeOrder, OrderStatus, PaymentStatus } from './types';
import { suggestCake } from '@/ai/ai-cake-suggestion';

export async function getAiCakeSuggestion(occasion: string, category: string) {
    if (!occasion || !category) {
        return { error: 'Occasion and category are required for a suggestion.' };
    }
    
    try {
        const result = await suggestCake({
            category: category,
            size: '',
            flavor: '',
            message: occasion,
            deliveryDate: '',
            deliveryLocation: ''
        });
        const suggestion = `${result.suggestion}. ${result.reason}`;
        return { suggestion };
    } catch (error) {
        console.error('Error getting AI suggestion:', error);
        return { error: 'Could not get an AI suggestion at this time.' };
    }
}

// NOTE: The following functions are placeholders and will not work without a database.
// You will need to implement your own database logic to make them functional.

const orderSchema = z.object({
  customer_name: z.string().min(2, { message: "Name is required." }),
  phone_number: z.string().min(10, { message: "A valid phone number is required." }),
  cake_category: z.string().min(1, { message: "Please select a cake category." }),
  cake_size: z.string().min(1, { message: "Please select a cake size." }),
  flavor: z.string().min(1, { message: "Please select a flavor." }),
  message_on_cake: z.string().max(100).optional(),
  delivery_date: z.string().min(1, { message: "Please pick a delivery date." }),
  delivery_location: z.string().min(5, { message: "Delivery address is required." }),
  total_price: z.coerce.number(),
  reference_image: z.any().optional(),
});

export async function createOrder(formData: FormData) {
    console.log("createOrder called, but no database is connected.");
    const validatedFields = orderSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    // Since there is no database, we'll simulate a success response.
    const mockOrderId = `mock_${new Date().getTime()}`;
    console.log("Simulating order creation with data:", validatedFields.data);
    revalidatePath('/');
    redirect(`/order-success?id=${mockOrderId}`);
}


export async function getOrderById(orderId: string): Promise<{order: CakeOrder | null, error: string | null}> {
  console.log(`getOrderById called for ${orderId}, but no database is connected.`);
  return { order: null, error: "Database not connected. Cannot fetch order." };
}

export async function signIn(formData: FormData) {
  console.log("signIn called, but no auth is configured.");
  return redirect(`/admin?message=Admin dashboard has been removed.`);
}

export async function signOut() {
  console.log("signOut called, but no auth is configured.");
  return redirect('/');
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    console.log(`updateOrderStatus called for order ${orderId} to ${status}, but no database is connected.`);
    return { error: "Database not connected." };
}

export async function updatePaymentStatus(orderId: string, status: PaymentStatus) {
    console.log(`updatePaymentStatus called for order ${orderId} to ${status}, but no database is connected.`);
    return { error: "Database not connected." };
}

export async function deleteOrder(orderId: string) {
    console.log(`deleteOrder called for order ${orderId}, but no database is connected.`);
    return { error: "Database not connected." };
}
