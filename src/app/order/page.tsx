import { OrderForm } from "@/components/order/order-form";
import { Suspense } from "react";

export default function OrderPage() {
    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-10 py-8">
             <div className="mb-10">
                <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-2">Customize Your Cake</h1>
                <p className="text-muted-foreground text-lg font-normal">Freshly baked with love and personalized just for you.</p>
            </div>
            <Suspense fallback={<div>Loading form...</div>}>
                <OrderForm />
            </Suspense>
        </div>
    );
}
