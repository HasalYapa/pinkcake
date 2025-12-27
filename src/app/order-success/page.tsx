'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');

    if (!orderId) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                 <h1 className="text-2xl font-bold text-destructive">Order ID not found.</h1>
                 <p className="text-muted-foreground mt-2">There was an issue processing your order. Please try again.</p>
                 <Button asChild className="mt-6">
                    <Link href="/order">Back to Order Page</Link>
                 </Button>
            </div>
        )
    }

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const message = `Hello pinkcakeboutique! I've just placed an order. My Order ID is ${orderId}. Please confirm my order. Thank you!`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center bg-secondary/30 p-8 rounded-lg shadow-md">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-headline font-bold">Thank You! Your Order is Placed.</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    We've received your order and will start preparing it soon. Your kitchen journey begins now!
                </p>
                <div className="mt-8 bg-background/70 p-4 rounded-md border border-dashed">
                    <p className="text-sm text-muted-foreground">Your Unique Order ID is:</p>
                    <p className="text-2xl md:text-3xl font-bold font-mono tracking-widest text-primary break-all px-2">{orderId}</p>
                </div>
                <p className="mt-6 text-muted-foreground">
                    Please keep this ID safe. You can use it to track your order in the future.
                </p>
                <div className="mt-8 space-y-4">
                    <Button asChild size="lg" className="w-full md:w-auto">
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                            Confirm Order on WhatsApp
                        </a>
                    </Button>
                </div>
                 <Button asChild variant="link" className="mt-8">
                     <Link href="/">Back to Home</Link>
                 </Button>
            </div>
        </div>
    );
}
