'use client'

import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { Menu, User } from "lucide-react"

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className="text-foreground dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors">
        {children}
    </Link>
)

export function Header() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b bg-card/90 dark:bg-background-dark/90 backdrop-blur-md px-6 lg:px-10 py-3">
            <div className="flex items-center gap-4 text-foreground dark:text-white">
                <Link href="/" className="flex items-center gap-2">
                    <h2 className="text-foreground dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">pinkcakeboutique</h2>
                </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex flex-1 justify-end gap-8">
                <nav className="flex items-center gap-9">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/menu">Menu</NavLink>
                    <NavLink href="/#about">About</NavLink>
                    <NavLink href="/#reviews">Reviews</NavLink>
                </nav>
                <div className="flex gap-2">
                    <Button asChild className="font-bold tracking-[0.015em]">
                        <Link href="/admin">Log In</Link>
                    </Button>
                    <Button variant="outline" size="icon" className="bg-background dark:bg-muted">
                        <User className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                         <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                         </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader className="sr-only">
                          <SheetTitle>Mobile Menu</SheetTitle>
                        </SheetHeader>
                        <nav className="grid gap-6 text-lg font-medium p-6">
                            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                                <span className="font-bold text-xl">pinkcakeboutique</span>
                            </Link>
                            <NavLink href="/">Home</NavLink>
                            <NavLink href="/menu">Menu</NavLink>
                            <NavLink href="/#about">About</NavLink>
                            <NavLink href="/#reviews">Reviews</NavLink>
                            <Button asChild className="w-full mt-4">
                                <Link href="/admin">Log In</Link>
                            </Button>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
