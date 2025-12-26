import AdminAuthForm from '@/components/admin/admin-auth-form'
import { CakeIcon } from '@/components/icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link'

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-sm p-8 space-y-6">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
              <CakeIcon className="h-8 w-8 text-primary" />
              <span className="font-headline font-bold text-2xl">CakesLK Admin</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the dashboard
          </p>
        </div>
        <AdminAuthForm />
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-destructive/10 text-destructive text-center rounded-lg">
            {searchParams.message}
          </p>
        )}
         <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Admin Account</AlertTitle>
            <AlertDescription>
                Please use the Supabase dashboard to create an admin user with an email and password. The placeholder email is <code className="font-mono bg-muted px-1 rounded-sm">admin@cakes.lk</code>.
            </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
