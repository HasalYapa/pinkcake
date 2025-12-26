import Link from 'next/link';
import { Button } from './ui/button';
import { CakeIcon } from './icons';

function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            {children}
        </Link>
    );
}

export function Footer() {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const whatsappLink = `https://wa.me/${whatsappNumber}`;
    return (
        <footer className="bg-secondary/70 border-t">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <CakeIcon className="h-8 w-8 text-primary" />
                            <span className="font-headline font-bold text-2xl">CakesLK</span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm">
                            Homemade with love, delivered to your doorstep.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-headline font-semibold mb-4 text-lg">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/order" className="hover:text-primary transition-colors">Order Now</Link></li>
                            <li><Link href="/track" className="hover:text-primary transition-colors">Track Order</Link></li>
                            <li><Link href="/admin" className="hover:text-primary transition-colors">Admin</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-headline font-semibold mb-4 text-lg">Contact Us</h3>
                        <p className="text-muted-foreground mb-4">Have questions? Get in touch!</p>
                        {whatsappNumber && (
                           <Button asChild>
                               <a href={whatsappLink} target="_blank" rel="noopener noreferrer">Contact on WhatsApp</a>
                           </Button>
                        )}
                         <div className="flex justify-center md:justify-start gap-4 mt-4">
                            <SocialLink href="https://instagram.com">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><title>Instagram</title><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                                <span className="sr-only">Instagram</span>
                            </SocialLink>
                            <SocialLink href="https://facebook.com">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><title>Facebook</title><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                <span className="sr-only">Facebook</span>
                            </SocialLink>
                        </div>
                    </div>
                </div>
                <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} CakesLK. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
