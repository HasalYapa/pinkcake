import AdminAuthForm from '@/components/admin/admin-auth-form';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { ArrowRight, CakeSlice } from 'lucide-react';

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const loginImage = placeholderImages.find(p => p.id === 'wedding-cake-new');
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Section: Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-end bg-black">
        {loginImage && (
            <Image
                src={loginImage.imageUrl}
                alt="A beautiful pink tiered cake with floral decorations"
                fill
                className="absolute inset-0 object-cover opacity-90"
                data-ai-hint="elegant wedding cake"
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="relative z-10 p-16 pb-20">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                <CakeSlice />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">Sweet Management</span>
          </div>
          <h2 className="text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">Crafting moments of joy, <br/>one slice at a time.</h2>
          <p className="text-lg text-white/80 max-w-lg">Manage your orders, inventory, and deliveries seamlessly from your dedicated admin portal.</p>
        </div>
      </div>
      {/* Right Section: Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center px-6 py-12 lg:px-20 relative bg-background">
        <div className="absolute top-8 right-8 lg:top-12 lg:right-12">
            <Link href="/" className="group flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors duration-200">
                <span>Return to Store</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1"/>
            </Link>
        </div>
        <div className="w-full max-w-[440px]">
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-flex lg:hidden mb-6 h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                 <CakeSlice className="h-6 w-6"/>
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-foreground mb-3">Welcome Back!</h1>
            <p className="text-muted-foreground text-base font-normal leading-relaxed">Please enter your details below to access your cake business dashboard.</p>
          </div>
          {/* Form */}
          <AdminAuthForm />
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-destructive/10 text-destructive text-center rounded-lg">
              {searchParams.message}
            </p>
          )}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} pinkcake Admin. Made with love in Sri Lanka.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
