'use client';
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  BarChart3
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const pathname = usePathname();

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
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-card dark:bg-card-dark border-r border-border transition-all duration-300">
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-6">
            {/* Brand/Profile */}
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
            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
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
          </div>
          {/* Logout */}
          <form action={signOut}>
            <Button variant="outline" className="w-full justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </form>
        </div>
      </aside>
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="w-full bg-background dark:bg-background-dark py-6 px-8 flex flex-col gap-6 shrink-0 z-10">
          {children.props.header}
        </header>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
            {children}
        </div>
      </main>
    </div>
  )
}
