'use client'

import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { Menu, Package2 } from "lucide-react"
import { CakeIcon } from "./icons"

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className="text-foreground/80 transition-colors hover:text-foreground">
        {children}
    </Link>
)

export function Header() {
    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 z-50">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                    <CakeIcon className="h-7 w-7 text-primary" />
                    <span className="font-headline font-bold text-xl">CakesLK</span>
                </Link>
                <div className="flex items-center gap-4 md:gap-5 ml-auto">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/order">Order Now</NavLink>
                    <NavLink href="/track">Track Order</NavLink>
                </div>
                <Button asChild>
                    <Link href="/admin">Admin Login</Link>
                </Button>
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                             <CakeIcon className="h-7 w-7 text-primary" />
                            <span className="font-headline font-bold text-xl">CakesLK</span>
                        </Link>
                        <Link href="/" className="text-foreground/80 hover:text-foreground">Home</Link>
                        <Link href="/order" className="text-foreground/80 hover:text-foreground">Order Now</Link>
                        <Link href="/track" className="text-foreground/80 hover:text-foreground">Track Order</Link>
                        <Link href="/admin" className="text-foreground/80 hover:text-foreground">Admin Login</Link>
                    </nav>
                </SheetContent>
            </Sheet>
        </header>
    )
}
