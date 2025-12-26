import AdminAuthForm from '@/components/admin/admin-auth-form'
import { CakeIcon } from '@/components/icons'
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
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center rounded-lg">
            {searchParams.message}
          </p>
        )}
      </div>
    </div>
  )
}
