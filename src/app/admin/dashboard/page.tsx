'use client';
import { useState, useEffect } from 'react';
import { DashboardClient } from "@/components/admin/dashboard-client";
import { CakeOrder } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, Package } from "lucide-react";
import { startOfMonth, startOfToday } from "date-fns";
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function DashboardPage() {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<CakeOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            // If there's no user, don't attempt to fetch orders.
            if (!loading) setLoading(true); // Reset loading state if user logs out
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
                    id: o.id.toString(), // Ensure id is a string
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
                console.log('Change received!', payload)
                fetchOrders();
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, supabase]);

    if (loading) {
        return <div>Loading dashboard...</div>
    }

    if (error) {
        return <div className="text-destructive">{error}</div>
    }
    
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Revenue (Paid)
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">LKR {totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        From all completed payments
                    </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Orders (This Month)
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">+{monthCount}</div>
                    <p className="text-xs text-muted-foreground">
                        Total orders since the start of the month
                    </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Orders (Today)</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">+{todayCount}</div>
                    <p className="text-xs text-muted-foreground">
                        New orders placed today
                    </p>
                    </CardContent>
                </Card>
            </div>
            <DashboardClient initialOrders={orders} />
        </>
    );
}
