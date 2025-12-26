'use client';
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  BarChart3,
  Menu,
  X,
  Bell
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

function DashboardHeader({children}: {children: React.ReactNode}) {
  return (
    <header className="w-full bg-background dark:bg-background-dark py-6 px-8 flex flex-col gap-6 shrink-0 z-10">
        {children}
    </header>
  )
}

function NavContent({ links }: { links: { href: string; icon: React.ElementType; label: string }[] }) {
    const pathname = usePathname();
    return (
        <nav className="flex flex-col gap-2">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg text-foreground dark:text-gray-300 hover:bg-muted dark:hover:bg-white/5 transition-colors group",
                        pathname === link.href && "bg-primary/10 text-primary"
                    )}
                >
                    <link.icon className={cn("h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors", pathname === link.href && "text-primary")} />
                    <p className={cn("text-sm font-medium leading-normal", pathname === link.href && "font-bold")}>{link.label}</p>
                </Link>
            ))}
        </nav>
    );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setIsUserLoading(false);
    }
    getUser();
  }, [supabase.auth]);

  if (isUserLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  if (!user) {
    redirect('/admin');
  }

  const navLinks = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/dashboard/orders", icon: Package, label: "Orders" },
    { href: "/admin/dashboard/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/admin/dashboard/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-card dark:bg-card-dark border-r border-border transition-all duration-300">
        <div className="flex h-full flex-col justify-between p-4">
            <div className="flex flex-col gap-6">
                 <div className="flex items-center gap-3 px-2">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarImage src="https://picsum.photos/seed/admin/48/48" alt="Admin Avatar" data-ai-hint="smiling person" />
                        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <h1 className="text-foreground text-base font-bold leading-normal">CakesLK Admin</h1>
                        <p className="text-muted-foreground text-xs font-normal leading-normal">Management Portal</p>
                    </div>
                </div>
                <NavContent links={navLinks} />
            </div>
             <form action={signOut}>
                <Button variant="outline" className="w-full justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
                </Button>
            </form>
        </div>
      </aside>

      {/* Mobile Header and Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="lg:hidden flex h-16 items-center justify-between border-b bg-background px-4 shrink-0">
          <Link href="/admin/dashboard" className="font-bold text-lg">CakesLK Admin</Link>
          <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
               <div className="flex h-full flex-col justify-between">
                 <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 px-2">
                        <h1 className="text-foreground text-xl font-bold leading-normal">Menu</h1>
                    </div>
                    <NavContent links={navLinks} />
                  </div>
                  <form action={signOut}>
                    <Button variant="outline" className="w-full justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                    </Button>
                 </form>
               </div>
            </SheetContent>
          </Sheet>
        </header>

         {/* Top Header */}
        <header className="w-full bg-background dark:bg-background-dark py-6 px-8 flex-col gap-6 shrink-0 z-10 hidden lg:flex">
          {children.props.header}
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8 pt-6 lg:pt-0">
            {children}
        </div>
      </div>
    </div>
  )
}