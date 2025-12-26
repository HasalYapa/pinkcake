import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  Bell,
  Home,
  LogOut,
  Package,
  Package2,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createServerClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/actions'
import { CakeIcon } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PlaceHolderImages } from '@/lib/placeholder-images'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin')
  }

  const avatarImg = PlaceHolderImages.find(p => p.id === 'avatar-female');

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-background md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <CakeIcon className="h-6 w-6 text-primary" />
              <span className="font-headline text-lg">CakesLK</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
             <div className="flex items-center gap-4">
                <Avatar className="h-9 w-9">
                    {avatarImg && <AvatarImage src={avatarImg.imageUrl} alt="Admin Avatar" data-ai-hint={avatarImg.imageHint} />}
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid gap-0.5">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <form action={signOut} className='ml-auto'>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </form>
             </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
           {/* Mobile Nav could be added here if needed */}
           <div className='w-full flex-1'>
            {/* Can add search bar here */}
           </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
