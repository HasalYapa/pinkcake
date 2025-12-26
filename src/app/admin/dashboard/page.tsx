'use client';
import { useState, useEffect } from 'react';
import { CakeOrder, OrderStatus, PaymentStatus } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Search, Bell, Plus, Trash2, TrendingUp, Receipt, Calendar, DollarSign, ChevronLeft, ChevronRight, CheckCircle, Hourglass } from 'lucide-react';
import { startOfMonth, startOfToday } from "date-fns";
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { deleteOrder, updateOrderStatus, updatePaymentStatus } from '@/lib/actions';
import { useTransition } from 'react';
import { format } from 'date-fns';

function DashboardHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
            <h1 className="text-foreground text-[32px] font-bold leading-tight tracking-tight">Welcome back, Baker!</h1>
            <p className="text-muted-foreground text-sm font-normal">Here is what is happening with your bakery today.</p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="bg-card dark:bg-card-dark text-primary h-10 w-10 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <Bell className="h-6 w-6" />
            </Button>
            <Button className="rounded-lg h-10 px-4 text-sm font-bold shadow-md gap-2">
                <Plus className="h-5 w-5" />
                <span>New Order</span>
            </Button>
        </div>
    </div>
  )
}

export default function DashboardPage() {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<CakeOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<CakeOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const [todayCount, setTodayCount] = useState(0);
    const [monthCount, setMonthCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
      const getInitialUser = async () => {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
        if (!currentUser) {
          setLoading(false);
        }
      };

      getInitialUser();

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (event === 'SIGNED_OUT') {
            setOrders([]);
          }
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    }, [supabase]);


    useEffect(() => {
        if (!user) {
            if (!loading) setLoading(true);
            return;
        };

        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            const { data: ordersData, error: err } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to fetch orders.");
                setLoading(false);
                return;
            }

            if (ordersData) {
                const formattedOrders = ordersData.map((o: any) => ({
                    ...o,
                    id: o.id.toString(),
                })) as CakeOrder[];

                setOrders(formattedOrders);

                const todayStart = startOfToday();
                const monthStart = startOfMonth(new Date());

                const newTodayCount = formattedOrders.filter(o => new Date(o.created_at as string) >= todayStart).length;
                const newMonthCount = formattedOrders.filter(o => new Date(o.created_at as string) >= monthStart).length;
                const newTotalRevenue = formattedOrders.filter(o => o.payment_status === 'Paid').reduce((acc, o) => acc + o.total_price, 0);

                setTodayCount(newTodayCount);
                setMonthCount(newMonthCount);
                setTotalRevenue(newTotalRevenue);
            }
            setLoading(false);
        };
        
        fetchOrders();

        const channel = supabase.channel('realtime-orders')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'orders'
            }, (payload) => {
                fetchOrders();
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, supabase]);

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = orders.filter(order => 
            order.id.toString().includes(lowercasedQuery) ||
            order.customer_name.toLowerCase().includes(lowercasedQuery) ||
            order.cake_category.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredOrders(filtered);
    }, [searchQuery, orders]);


    const handleOrderStatusChange = (orderId: string, newStatus: OrderStatus) => {
      startTransition(async () => {
          const { error } = await updateOrderStatus(orderId, newStatus);
          if (error) {
              toast({ title: "Error", description: error, variant: 'destructive' });
          } else {
              toast({ title: "Success", description: "Order status updated." });
          }
      });
    };
  
    const handlePaymentStatusChange = (orderId: string, newStatus: PaymentStatus) => {
      startTransition(async () => {
          const { error } = await updatePaymentStatus(orderId, newStatus);
          if (error) {
              toast({ title: "Error", description: error, variant: 'destructive' });
          } else {
              toast({ title: "Success", description: "Payment status updated." });
          }
      });
    };
    
    const handleDeleteOrder = (orderId: string) => {
      startTransition(async () => {
          const { error } = await deleteOrder(orderId);
          if (error) {
              toast({ title: "Error", description: error, variant: 'destructive' });
          } else {
              toast({ title: "Success", description: "Order deleted." });
          }
      });
    }

    const getStatusBadge = (status: OrderStatus) => {
      const styles: {[key: string]: string} = {
        'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100',
        'Accepted': 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100',
        'Baking': 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100',
        'Ready': 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100',
        'Delivered': 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100',
      };
      const dotStyles: {[key:string]: string} = {
        'Pending': 'bg-yellow-600',
        'Accepted': 'bg-purple-600',
        'Baking': 'bg-blue-600',
        'Ready': 'bg-indigo-600',
        'Delivered': 'bg-green-600',
      }
      return (
        <Select 
            defaultValue={status} 
            onValueChange={(value) => handleOrderStatusChange(status, value as OrderStatus)}
            disabled={isPending}
        >
            <SelectTrigger className={cn("w-full max-w-[140px] text-xs font-bold rounded-full border px-3 py-1.5 h-auto transition-colors", styles[status])}>
                <SelectValue>
                    <span className='flex items-center gap-1.5'>
                        <span className={cn('w-1.5 h-1.5 rounded-full', dotStyles[status])}></span>
                        {status}
                    </span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {ORDER_STATUSES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      )
    }

    if (loading && orders.length === 0) {
        return (
             <div className="flex-1 overflow-y-auto px-8 pb-8">
                <p>Loading dashboard...</p>
             </div>
        )
    }

    return (
        <>
            <div className="lg:hidden flex flex-wrap items-end justify-between gap-4 mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-foreground text-[28px] font-bold leading-tight tracking-tight">Welcome back!</h1>
                    <p className="text-muted-foreground text-sm font-normal">Here's what's happening today.</p>
                </div>
            </div>
            <div className="flex flex-col gap-8 max-w-[1200px] mx-auto">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="flex flex-col gap-2 rounded-xl p-6 bg-card dark:bg-card-dark border-border shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Today's Orders</p>
                            <div className="bg-primary/10 p-2 rounded-full text-primary">
                                <Receipt className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="flex items-end gap-3 mt-2">
                            <p className="text-foreground text-3xl font-bold leading-none">{todayCount}</p>
                            <Badge variant="outline" className="text-green-600 bg-green-500/10 border-transparent mb-1">
                                <TrendingUp className="h-4 w-4 mr-1" /> 20%
                            </Badge>
                        </div>
                    </Card>
                    <Card className="flex flex-col gap-2 rounded-xl p-6 bg-card dark:bg-card-dark border-border shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Monthly Orders</p>
                            <div className="bg-primary/10 p-2 rounded-full text-primary">
                                <Calendar className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="flex items-end gap-3 mt-2">
                            <p className="text-foreground text-3xl font-bold leading-none">{monthCount}</p>
                             <Badge variant="outline" className="text-green-600 bg-green-500/10 border-transparent mb-1">
                                <TrendingUp className="h-4 w-4 mr-1" /> 12%
                            </Badge>
                        </div>
                    </Card>
                    <Card className="flex flex-col gap-2 rounded-xl p-6 bg-card dark:bg-card-dark border-border shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Total Revenue</p>
                            <div className="bg-primary/10 p-2 rounded-full text-primary">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="flex items-end gap-3 mt-2">
                            <p className="text-foreground text-3xl font-bold leading-none">LKR {totalRevenue.toLocaleString()}</p>
                            <Badge variant="outline" className="text-green-600 bg-green-500/10 border-transparent mb-1">
                                <TrendingUp className="h-4 w-4 mr-1" /> 5%
                            </Badge>
                        </div>
                    </Card>
                </section>
                <section className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input 
                              placeholder="Search by ID, customer, or cake type..." 
                              className="w-full bg-card dark:bg-card-dark border-border rounded-lg py-2.5 pl-10 pr-4 h-auto text-sm focus:border-primary placeholder:text-muted-foreground"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                     <div className="w-full overflow-hidden rounded-xl border border-border bg-card dark:bg-card-dark shadow-sm">
                         <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 dark:bg-muted/10 border-b-border">
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Cake Type</TableHead>
                                        <TableHead>Delivery Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-muted/30">
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={`https://i.pravatar.cc/40?u=${order.id}`} alt={order.customer_name} />
                                                    <AvatarFallback>{order.customer_name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{order.customer_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{order.cake_category}</TableCell>
                                        <TableCell className="text-muted-foreground">{format(new Date(order.delivery_date), 'MMM dd, yyyy')}</TableCell>
                                        <TableCell>
                                            {getStatusBadge(order.order_status)}
                                        </TableCell>
                                        <TableCell>
                                          {order.payment_status === 'Paid' ? (
                                              <Badge className="bg-green-100/10 text-green-600 gap-1.5 border-transparent">
                                                  <CheckCircle className="h-3.5 w-3.5" />
                                                  Paid
                                              </Badge>
                                          ) : (
                                              <Badge variant="outline" className="bg-gray-100 text-gray-600 gap-1.5 border-gray-200">
                                                  <Hourglass className="h-3.5 w-3.5" />
                                                  Unpaid
                                              </Badge>
                                          )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full hover:bg-primary/5">
                                                            <MoreVertical className="h-5 w-5" />
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
                         </div>
                        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/50 dark:bg-muted/10">
                            <span className="text-sm text-muted-foreground">Showing <strong>1-{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders</span>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronLeft className="h-4 w-4" /></Button>
                                <Button size="icon" className="h-8 w-8">1</Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronRight className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

DashboardPage.defaultProps = {
  header: <DashboardHeader/>
}