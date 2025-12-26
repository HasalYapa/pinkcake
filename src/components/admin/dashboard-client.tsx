'use client';

import { useTransition } from 'react';
import { CakeOrder, OrderStatus, PaymentStatus } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@/lib/constants';
import { deleteOrder, updateOrderStatus, updatePaymentStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Timestamp } from 'firebase/firestore';

interface DashboardClientProps {
  initialOrders: CakeOrder[];
}

export function DashboardClient({ initialOrders }: DashboardClientProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleOrderStatusChange = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
        const result = await updateOrderStatus(orderId, newStatus);
        if (result.success) {
            toast({ title: "Success", description: result.message });
        } else {
            toast({ title: "Error", description: result.message, variant: 'destructive' });
        }
    });
  };

  const handlePaymentStatusChange = (orderId: string, newStatus: PaymentStatus) => {
    startTransition(async () => {
        const result = await updatePaymentStatus(orderId, newStatus);
        if (result.success) {
            toast({ title: "Success", description: result.message });
        } else {
            toast({ title: "Error", description: result.message, variant: 'destructive' });
        }
    });
  };
  
  const handleDeleteOrder = (orderId: string) => {
    startTransition(async () => {
        const result = await deleteOrder(orderId);
        if (result.success) {
            toast({ title: "Success", description: result.message });
        } else {
            toast({ title: "Error", description: result.message, variant: 'destructive' });
        }
    });
  }

  const formatDate = (dateValue: string | Timestamp) => {
    if (typeof dateValue === 'string') {
        return format(new Date(dateValue), "dd MMM yyyy");
    }
    if (dateValue instanceof Timestamp) {
        return format(dateValue.toDate(), "dd MMM yyyy");
    }
    return 'Invalid Date';
  }


  return (
    <div className="border shadow-sm rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Cake Details</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <div className="font-medium">{order.customer_name}</div>
                <div className="text-sm text-muted-foreground">{order.phone_number}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{order.cake_category}</div>
                <div className="text-sm text-muted-foreground">{order.flavor} ({order.cake_size})</div>
              </TableCell>
              <TableCell>
                {formatDate(order.delivery_date)}
              </TableCell>
              <TableCell>LKR {order.total_price.toLocaleString()}</TableCell>
              <TableCell>
                 <Select 
                    defaultValue={order.order_status} 
                    onValueChange={(value) => handleOrderStatusChange(order.id, value as OrderStatus)}
                    disabled={isPending}
                 >
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {ORDER_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select 
                    defaultValue={order.payment_status} 
                    onValueChange={(value) => handlePaymentStatusChange(order.id, value as PaymentStatus)}
                    disabled={isPending}
                >
                    <SelectTrigger className="w-[110px] h-8 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {PAYMENT_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <AlertDialog>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the order
                            for <span className='font-semibold'>{order.customer_name}</span> (ID: {order.id}).
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteOrder(order.id)} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete order
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
       {initialOrders.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
              No orders found.
          </div>
      )}
    </div>
  );
}
