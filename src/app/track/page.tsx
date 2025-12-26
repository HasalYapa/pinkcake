import { getOrderById } from "@/lib/actions";
import { TrackOrderForm } from "@/components/track/track-order-form";
import OrderStatusVisualizer from "@/components/track/order-status-visualizer";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { CakeOrder } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

async function OrderDetails({ orderId }: { orderId: number }) {
    const order = await getOrderById(orderId);

    if (!order) {
        return (
             <Alert variant="destructive" className="mt-8">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Order Not Found</AlertTitle>
                <AlertDescription>
                    We couldn't find an order with that ID. Please double-check the ID and try again.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <Card className="mt-8 w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Order Status for ID: {order.order_id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <OrderStatusVisualizer currentStatus={order.order_status} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-4 border-t">
                    <div><strong>Customer:</strong> {order.customer_name}</div>
                    <div><strong>Delivery Date:</strong> {format(new Date(order.delivery_date), 'PPP')}</div>
                    <div><strong>Cake:</strong> {order.cake_category} ({order.cake_size})</div>
                    <div><strong>Flavor:</strong> {order.flavor}</div>
                    <div className="md:col-span-2 flex items-center gap-2">
                        <strong>Payment Status:</strong> 
                        <Badge variant="outline" className={cn(
                            order.payment_status === 'Paid' 
                            ? 'bg-success/20 text-success border-transparent' 
                            : 'bg-warning/20 text-warning border-transparent'
                        )}>
                           {order.payment_status}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


export default function TrackPage({ searchParams }: { searchParams: { id?: string } }) {
    const orderId = searchParams.id ? parseInt(searchParams.id, 10) : undefined;
    
    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl font-headline font-bold">Track Your Cake's Journey</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Enter your order ID below to see the current status of your delicious creation.
                </p>
                <TrackOrderForm />

                {orderId && (
                    <Suspense fallback={<div className="mt-8">Loading order status...</div>}>
                        <OrderDetails orderId={orderId} />
                    </Suspense>
                )}
            </div>
        </div>
    );
}
