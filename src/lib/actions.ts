'use server';

import { z } from 'zod';
import { createServerClient } from './supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CakeOrder, OrderStatus, PaymentStatus } from './types';

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
});

// Mock AI function
async function getAiSuggestionFromFlow(prompt: string): Promise<string> {
    console.log(`Getting AI suggestion for: ${prompt}`);
    // In a real scenario, this would call the Genkit flow
    // For now, returning a mock response
    try {
        // const { suggestCake } = await import('@/ai/flows/suggestCake');
        // const response = await suggestCake.run({ prompt });
        // return response;
        await new Promise(resolve => setTimeout(resolve, 1000));
        return `Based on "${prompt}", a Chocolate Fudge cake with a 'Happy Birthday' message would be a great choice! It's a classic crowd-pleaser.`;
    } catch (error) {
        console.error("AI flow not found or failed. Using mock response.", error);
        return `We think a classic Chocolate Fudge cake would be perfect for "${prompt}"!`;
    }
}


export async function getAiCakeSuggestion(occasion: string, category: string) {
    if (!occasion || !category) {
        return { error: 'Occasion and category are required for a suggestion.' };
    }
    const prompt = `Suggest a cake for a ${occasion} from the ${category} category.`;
    try {
        const suggestion = await getAiSuggestionFromFlow(prompt);
        return { suggestion };
    } catch (error) {
        console.error('Error getting AI suggestion:', error);
        return { error: 'Could not get an AI suggestion at this time.' };
    }
}


export async function createOrder(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  const validatedFields = orderSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { data: orderData, ...rest } = validatedFields.data;

  let imageUrl: string | null = null;
  const imageFile = formData.get('reference_image') as File;

  if (imageFile && imageFile.size > 0) {
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cake-references')
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error('Storage Error:', uploadError);
      return {
        errors: { _form: ['Failed to upload reference image.'] },
      };
    }
    
    const { data: publicUrlData } = supabase.storage
        .from('cake-references')
        .getPublicUrl(uploadData.path);
    
    imageUrl = publicUrlData.publicUrl;
  }

  const newOrder: Omit<CakeOrder, 'id' | 'created_at' | 'order_id'> = {
    ...rest,
    ...validatedFields.data,
    image_url: imageUrl,
    order_status: 'Pending',
    payment_status: 'Pending',
  };

  const { data: insertedOrder, error } = await supabase
    .from('orders')
    .insert(newOrder)
    .select('order_id')
    .single();

  if (error) {
    console.error('Database Error:', error);
    return {
      errors: { _form: ['Database error: Failed to create order.'] },
    };
  }

  revalidatePath('/');
  redirect(`/order-success?id=${insertedOrder.order_id}`);
}

export async function getOrderById(orderId: number) {
  if (isNaN(orderId)) return null;
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }
  return data as CakeOrder;
}

// Admin Actions
export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect('/admin?message=Could not authenticate user');
  }

  return redirect('/admin/dashboard');
}

export async function signOut() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  await supabase.auth.signOut();
  return redirect('/admin');
}

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);

    const { error } = await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('order_id', orderId);

    if (error) {
        console.error("Failed to update order status", error);
        return { success: false, message: 'Failed to update order status.' };
    }

    revalidatePath('/admin/dashboard');
    return { success: true, message: 'Order status updated.' };
}

export async function updatePaymentStatus(orderId: number, status: PaymentStatus) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);

    const { error } = await supabase
        .from('orders')
        .update({ payment_status: status })
        .eq('order_id', orderId);

    if (error) {
        console.error("Failed to update payment status", error);
        return { success: false, message: 'Failed to update payment status.' };
    }

    revalidatePath('/admin/dashboard');
    return { success: true, message: 'Payment status updated.' };
}

export async function deleteOrder(orderId: number) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);

    const { error } = await supabase
        .from('orders')
        .delete()
        .eq('order_id', orderId);

    if (error) {
        console.error("Failed to delete order", error);
        return { success: false, message: 'Failed to delete order.' };
    }

    revalidatePath('/admin/dashboard');
    return { success: true, message: 'Order deleted.' };
}
