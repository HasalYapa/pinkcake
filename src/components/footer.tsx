import Link from 'next/link';
import { Instagram, Facebook, Heart, MessageSquare } from 'lucide-react';

function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="group size-10 flex items-center justify-center rounded-full bg-white dark:bg-[#2d1b22] text-primary hover:text-[#E1306C] shadow-sm hover:shadow-md hover:scale-110 transition-all border border-pink-100 dark:border-[#3a1f26]">
            {children}
        </a>
    );
}

export function Footer() {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
    const whatsappChatUrl = `https://wa.me/${whatsappNumber}?text=I'd like to place an order!`;

    return (
        <>
        <footer className="bg-[#fff9fc] dark:bg-[#1a0c10] border-t border-[#fcebf1] dark:border-[#3a1f26] pt-16 pb-8 px-4 md:px-10 lg:px-40">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-16">
                    <div className="lg:col-span-4 flex flex-col items-start gap-5">
                        <div className="flex items-center gap-3">
                            <span className="text-text-main dark:text-white font-extrabold text-2xl tracking-tight">pinkcakeboutique</span>
                        </div>
                        <p className="text-muted-foreground dark:text-text-dark text-base leading-relaxed pr-4">
                            Handcrafted happiness delivered to your doorstep. We bake memories with the finest ingredients in Sri Lanka.
                        </p>
                        <div className="flex gap-3">
                            <SocialLink href="https://instagram.com">
                                <Instagram className="h-5 w-5" />
                            </SocialLink>
                            <SocialLink href="https://facebook.com">
                                <Facebook className="h-5 w-5" />
                            </SocialLink>
                        </div>
                    </div>
                    <div className="lg:col-span-2 md:col-span-1 flex flex-col gap-4">
                        <h3 className="text-foreground dark:text-white font-bold text-lg">Company</h3>
                        <div className="flex flex-col gap-3">
                            <Link className="text-muted-foreground dark:text-text-dark hover:text-primary transition-colors text-sm font-medium" href="/#about">About Us</Link>
                            <Link className="text-muted-foreground dark:text-text-dark hover:text-primary transition-colors text-sm font-medium" href="/menu">Our Menu</Link>
                            <Link className="text-muted-foreground dark:text-text-dark hover:text-primary transition-colors text-sm font-medium" href="/#reviews">Reviews</Link>
                        </div>
                    </div>
                    <div className="lg:col-span-2 md:col-span-1 flex flex-col gap-4">
                        <h3 className="text-foreground dark:text-white font-bold text-lg">Support</h3>
                        <div className="flex flex-col gap-3">
                            <Link className="text-muted-foreground dark:text-text-dark hover:text-primary transition-colors text-sm font-medium" href="#">Delivery Info</Link>
                            <Link className="text-muted-foreground dark:text-text-dark hover:text-primary transition-colors text-sm font-medium" href="#">Privacy Policy</Link>
                            <Link className="text-muted-foreground dark:text-text-dark hover:text-primary transition-colors text-sm font-medium" href="#">Terms of Service</Link>
                        </div>
                    </div>
                    <div className="lg:col-span-4 flex flex-col gap-5 bg-white dark:bg-[#2d1b22] p-6 rounded-2xl border border-pink-100 dark:border-[#3a1f26] shadow-sm">
                        <div>
                            <h3 className="text-foreground dark:text-white font-bold text-lg">Have a Question?</h3>
                            <p className="text-muted-foreground dark:text-text-dark text-sm mt-1">Our team is ready to help you with your custom order.</p>
                        </div>
                        <a className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg transform active:scale-95 group" href={whatsappChatUrl} target='_blank' rel='noopener noreferrer'>
                            <MessageSquare />
                            <span>Chat on WhatsApp</span>
                        </a>
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-[#3a1f26] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground dark:text-text-dark/60 font-medium">
                        © {new Date().getFullYear()} pinkcakeboutique. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-text-dark/60 font-medium flex items-center gap-1">
                        Made with pinkcakeboutique
                    </p>
                </div>
            </div>
        </footer>
        <a className="fixed bottom-6 right-6 z-50 flex items-center justify-center size-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all cursor-pointer group" href={whatsappChatUrl} target="_blank" rel="noopener noreferrer">
            <MessageSquare className="h-8 w-8" />
            <span className="absolute right-full mr-3 bg-white dark:bg-[#2d1b22] text-foreground dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat with us
            </span>
        </a>
        </>
    );
}
