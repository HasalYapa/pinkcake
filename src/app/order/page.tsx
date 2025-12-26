import { OrderForm } from "@/components/order/order-form";
import { Suspense } from "react";

export default function OrderPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-headline font-bold">Create Your Dream Cake</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Fill out the details below and let us craft something special for you.
                    </p>
                </div>
                <Suspense fallback={<div>Loading form...</div>}>
                    <OrderForm />
                </Suspense>
            </div>
        </div>
    );
}
