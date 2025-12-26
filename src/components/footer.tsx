import Link from 'next/link';
import { Button } from './ui/button';
import { CakeIcon } from './icons';
import { Instagram, Facebook } from 'lucide-react';

function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-card-dark text-foreground dark:text-white hover:bg-primary hover:text-white transition-colors">
            {children}
        </a>
    );
}

export function Footer() {
    return (
        <footer className="bg-card dark:bg-[#1a0c10] border-t px-4 py-10 md:px-10 lg:px-40">
            <div className="flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto gap-6">
                <div className="flex items-center gap-3">
                    <CakeIcon className="h-6 w-6 text-primary" />
                    <span className="text-foreground dark:text-white font-bold text-lg">pinkcakeboutique</span>
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link className="text-sm text-muted-foreground dark:text-text-dark hover:text-primary transition-colors" href="#">Privacy Policy</Link>
                    <Link className="text-sm text-muted-foreground dark:text-text-dark hover:text-primary transition-colors" href="#">Terms of Service</Link>
                    <Link className="text-sm text-muted-foreground dark:text-text-dark hover:text-primary transition-colors" href="#">Delivery Info</Link>
                </div>
                <div className="flex gap-4">
                    <SocialLink href="https://instagram.com">
                        <Instagram className="h-4 w-4" />
                        <span className="sr-only">Instagram</span>
                    </SocialLink>
                    <SocialLink href="https://facebook.com">
                        <Facebook className="h-4 w-4" />
                        <span className="sr-only">Facebook</span>
                    </SocialLink>
                </div>
            </div>
            <div className="mt-8 text-center text-xs text-muted-foreground dark:text-text-dark/50">
                 © {new Date().getFullYear()} pinkcakeboutique. All Rights Reserved.
             </div>
        </footer>
    );
}
