import { createServiceRoleClient } from "@/lib/supabase/server";
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

async function getDashboardData() {
    const supabase = createServiceRoleClient();
    
    const { data: orders, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching dashboard data:", error);
        return { orders: [], todayCount: 0, monthCount: 0, totalRevenue: 0 };
    }

    const todayStart = startOfToday().toISOString();
    const monthStart = startOfMonth(new Date()).toISOString();

    const todayCount = orders.filter(o => o.created_at >= todayStart).length;
    const monthCount = orders.filter(o => o.created_at >= monthStart).length;
    const totalRevenue = orders.filter(o => o.payment_status === 'Paid').reduce((acc, o) => acc + o.total_price, 0);

    return {
        orders: orders as CakeOrder[],
        todayCount,
        monthCount,
        totalRevenue
    };
}

export default async function DashboardPage() {
    const { orders, todayCount, monthCount, totalRevenue } = await getDashboardData();
    
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
