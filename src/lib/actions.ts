'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CakeOrder, OrderStatus, PaymentStatus } from './types';
import { 
    addDoc, 
    collection, 
    getDocs, 
    getFirestore, 
    query, 
    where, 
    Timestamp,
    doc,
    updateDoc,
    deleteDoc,
    getDoc,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInWithEmailAndPassword } from 'firebase/auth';

const { firestore, auth } = initializeFirebase();
const storage = getStorage();

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
    try {
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
  const validatedFields = orderSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { ...orderData } = validatedFields.data;

  let imageUrl: string | null = null;
  const imageFile = formData.get('reference_image') as File;

  if (imageFile && imageFile.size > 0) {
    const fileName = `${Date.now()}-${imageFile.name}`;
    const storageRef = ref(storage, `cake-references/${fileName}`);
    
    try {
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
    } catch (uploadError) {
        console.error('Storage Error:', uploadError);
        return {
            errors: { _form: ['Failed to upload reference image.'] },
        };
    }
  }

  const newOrder: Omit<CakeOrder, 'id' | 'order_id'> = {
    ...orderData,
    image_url: imageUrl,
    order_status: 'Pending',
    payment_status: 'Pending',
    created_at: Timestamp.now(),
  };

  try {
    const docRef = await addDoc(collection(firestore, "orders"), newOrder);
    revalidatePath('/');
    redirect(`/order-success?id=${docRef.id}`);
  } catch (error) {
    console.error('Database Error:', error);
    return {
      errors: { _form: ['Database error: Failed to create order.'] },
    };
  }
}

export async function getOrderById(orderId: string) {
  if (!orderId) return null;
  
  try {
    const docRef = doc(firestore, 'orders', orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            created_at: data.created_at.toDate().toISOString(),
            delivery_date: data.delivery_date.toDate ? data.delivery_date.toDate().toISOString() : data.delivery_date,
        } as CakeOrder;
    } else {
        return null;
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

// Admin Actions
export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    return redirect('/admin?message=Could not authenticate user');
  }

  return redirect('/admin/dashboard');
}

export async function signOut() {
  await auth.signOut();
  return redirect('/admin');
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
        const orderRef = doc(firestore, "orders", orderId);
        await updateDoc(orderRef, { order_status: status });
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Order status updated.' };
    } catch (error) {
        console.error("Failed to update order status", error);
        return { success: false, message: 'Failed to update order status.' };
    }
}

export async function updatePaymentStatus(orderId: string, status: PaymentStatus) {
    try {
        const orderRef = doc(firestore, "orders", orderId);
        await updateDoc(orderRef, { payment_status: status });
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Payment status updated.' };
    } catch(error) {
        console.error("Failed to update payment status", error);
        return { success: false, message: 'Failed to update payment status.' };
    }
}

export async function deleteOrder(orderId: string) {
    try {
        await deleteDoc(doc(firestore, "orders", orderId));
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Order deleted.' };
    } catch (error) {
        console.error("Failed to delete order", error);
        return { success: false, message: 'Failed to delete order.' };
    }
}
