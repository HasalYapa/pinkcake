'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from '@/lib/actions'
import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'

function LoginButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Sign In
    </Button>
  )
}

export default function AdminAuthForm() {
  return (
    <form action={signIn} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@cakes.lk"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <LoginButton />
    </form>
  )
}
