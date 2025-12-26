'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from '@/lib/actions'
import { Loader2, Mail, Lock, Eye, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'

function LoginButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="relative w-full overflow-hidden rounded-full bg-primary h-14 text-white font-bold text-base shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span>Signing In...</span>
        </>
      ) : (
        <>
          <span>Log In</span>
          <LogIn className="h-5 w-5" />
        </>
      )}
    </Button>
  )
}

export default function AdminAuthForm() {
  return (
    <form action={signIn} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-bold leading-normal">Email Address</Label>
        <div className="relative">
          <Input 
            name="email"
            type="email"
            className="block w-full rounded-xl border-2 border-border bg-background px-4 h-14 text-base font-medium placeholder:text-muted-foreground/60 focus:border-primary focus:ring-0 focus:outline-none transition-all duration-200"
            placeholder="name@example.com"
            required
           />
          <div className="absolute inset-y-0 right-4 flex items-center text-muted-foreground">
            <Mail className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
            <Label className="text-sm font-bold leading-normal">Password</Label>
            <Link href="#" className="text-sm font-bold text-primary hover:text-primary/80 hover:underline transition-colors">Forgot Password?</Link>
        </div>
        <div className="relative">
          <Input 
            name="password"
            type="password" 
            className="block w-full rounded-xl border-2 border-border bg-background pl-4 pr-12 h-14 text-base font-medium placeholder:text-muted-foreground/60 focus:border-primary focus:ring-0 focus:outline-none transition-all duration-200"
            placeholder="Enter your password"
            required 
          />
          <button className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" type="button">
            <Eye className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="pt-2">
        <LoginButton />
      </div>
    </form>
  )
}
