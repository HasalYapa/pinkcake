import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { placeholderImages } from '@/lib/placeholder-images';
import { ArrowRight, Star } from 'lucide-react';
import { CakeIcon } from '@/components/icons';

const categories = [
  { 
    name: 'Birthday Cakes', 
    description: "Make their day special with our themed birthday cakes custom made for you.",
    buttonText: "Browse Catalog",
    imageId: 'birthday-cake-new' 
  },
  { 
    name: 'Bento Cakes', 
    description: "Cute, lunchbox-sized cakes perfect for small celebrations and gifts.",
    buttonText: "Browse Catalog",
    imageId: 'bento-cake-new' 
  },
  { 
    name: 'Wedding Structures',
    description: "Elegant structures and real cakes for your big day. Consultation required.",
    buttonText: "Book Consult",
    imageId: 'wedding-cake-new'
  },
  { 
    name: 'Custom Designs', 
    description: "Have a specific design in mind? Upload your photo and we'll bake it.",
    buttonText: "Upload Design",
    imageId: 'custom-cake-new'
  },
];

const reviews = [
    {
        stars: 5,
        text: "The chocolate fudge cake I ordered for my husband's birthday was absolutely divine! Not too sweet, just perfect. Delivered right on time in Colombo.",
        author: "Sarah Perera",
        location: "Colombo 05",
        avatarInitial: "S",
        avatarColor: "bg-purple-100 text-purple-600"
    },
    {
        stars: 5,
        text: "Ordered a Bento cake for a small get-together. The design was exactly what I asked for, super cute and tasty. Highly recommend their service!",
        author: "Dilshan K.",
        location: "Nugegoda",
        avatarInitial: "D",
        avatarColor: "bg-blue-100 text-blue-600"
    },
    {
        stars: 4.5,
        text: "Great service and responsive on WhatsApp. The ribbon cake brought back so many childhood memories. Will order again!",
        author: "Nuwanthi De Silva",
        location: "Mount Lavinia",
        avatarInitial: "N",
        avatarColor: "bg-green-100 text-green-600"
    }
]

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-cake-new');

  return (
    <>
      {/* Hero Section */}
      <section className="relative px-4 py-6 md:px-10 lg:px-40 flex justify-center">
        <div className="w-full max-w-[1200px] flex flex-col-reverse lg:flex-row gap-8 lg:gap-16 items-center py-10">
          <div className="flex flex-col gap-6 lg:w-1/2 items-start text-left">
            <div className="flex flex-col gap-4">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit">Sri Lanka's Finest</span>
              <h1 className="text-foreground dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.033em]">
                Order Fresh Custom Cakes Online
              </h1>
              <h2 className="text-muted-foreground dark:text-text-dark text-lg font-normal leading-relaxed max-w-lg">
                Handcrafted with love in Sri Lanka. Perfect cakes for birthdays, weddings & special moments delivered to your doorstep.
              </h2>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <Button asChild size="lg" className="flex-1 sm:flex-none text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 transition-all hover:scale-105 h-12 px-6">
                <Link href="/order">Order Now</Link>
              </Button>
               <Button asChild size="lg" variant="outline" className="flex-1 sm:flex-none text-base font-bold leading-normal h-12 px-6">
                <Link href="#menu">View Menu</Link>
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <div className="flex -space-x-2">
                    <Image alt="Customer avatar" width={32} height={32} className="inline-block rounded-full ring-2 ring-white dark:ring-background-dark" data-ai-hint="smiling woman" src="https://picsum.photos/seed/101/32/32"/>
                    <Image alt="Customer avatar" width={32} height={32} className="inline-block rounded-full ring-2 ring-white dark:ring-background-dark" data-ai-hint="smiling man" src="https://picsum.photos/seed/102/32/32"/>
                    <Image alt="Customer avatar" width={32} height={32} className="inline-block rounded-full ring-2 ring-white dark:ring-background-dark" data-ai-hint="man glasses" src="https://picsum.photos/seed/103/32/32"/>
                </div>
                <p className="text-sm font-medium text-muted-foreground dark:text-text-dark ml-2">Loved by 500+ locals</p>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl z-10"></div>
              {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover z-20 hover:scale-105 transition-transform duration-700"
                    priority
                    data-ai-hint={heroImage.imageHint}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 py-12 md:px-10 lg:px-40 bg-card dark:bg-card-dark rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]" id="menu">
        <div className="flex flex-col max-w-[1200px] mx-auto w-full">
            <div className="text-center pb-10 pt-5">
                <h2 className="text-foreground dark:text-white tracking-tight text-[28px] md:text-4xl font-extrabold leading-tight px-4">Our Specialties</h2>
                <p className="mt-2 text-muted-foreground dark:text-text-dark">Explore our range of handcrafted delights</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => {
                    const categoryImage = placeholderImages.find(p => p.id === category.imageId);
                    return (
                        <div key={category.name} className="@container group">
                            <div className="flex flex-col items-stretch justify-start rounded-2xl @xl:flex-row @xl:items-center shadow-lg hover:shadow-xl transition-shadow bg-background dark:bg-[#221016] border border-gray-100 dark:border-[#3a1f26] overflow-hidden h-full">
                                <div className="relative w-full @xl:w-1/2 h-48 @xl:h-full">
                                    {categoryImage && (
                                        <Image
                                            src={categoryImage.imageUrl}
                                            alt={categoryImage.description}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            data-ai-hint={categoryImage.imageHint}
                                        />
                                    )}
                                </div>
                                <div className="flex w-full @xl:w-1/2 grow flex-col items-start justify-center gap-3 p-6">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-foreground dark:text-white text-xl font-bold leading-tight">{category.name}</p>
                                        <p className="text-muted-foreground dark:text-text-dark text-sm font-normal leading-normal">{category.description}</p>
                                    </div>
                                    <Button asChild variant="secondary" className="bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all h-9 px-4 text-sm font-bold">
                                        <Link href={`/order?category=${encodeURIComponent(category.name)}`}>{category.buttonText}</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="px-4 py-16 md:px-10 lg:px-40 bg-background dark:bg-background-dark" id="reviews">
        <div className="flex flex-col max-w-[1200px] mx-auto w-full">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-foreground dark:text-white text-3xl font-bold leading-tight">Customer Reviews</h2>
                    <p className="text-muted-foreground dark:text-text-dark mt-2">See why our customers keep coming back</p>
                </div>
                <div className="hidden md:flex gap-2">
                    <Button size="icon" variant="outline" className='rounded-full bg-card dark:bg-[#221016]'>
                        <ArrowRight className="h-4 w-4 transform rotate-180" />
                    </Button>
                    <Button size="icon" className='rounded-full shadow-lg shadow-primary/20'>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map((review, index) => (
                    <div key={index} className="bg-card dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-muted flex flex-col gap-4">
                        <div className="flex gap-1 text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < Math.floor(review.stars) ? 'fill-current' : ''} ${review.stars % 1 !== 0 && i === Math.floor(review.stars) ? 'star-half' : ''}`} />
                            ))}
                        </div>
                        <p className="text-foreground dark:text-gray-200 leading-relaxed">{review.text}</p>
                        <div className="flex items-center gap-3 mt-auto">
                            <div className={`size-10 rounded-full ${review.avatarColor} flex items-center justify-center font-bold`}>{review.avatarInitial}</div>
                            <div>
                                <p className="font-bold text-foreground dark:text-white text-sm">{review.author}</p>
                                <p className="text-xs text-muted-foreground dark:text-text-dark">{review.location}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
      {/* Floating Action Button */}
        <a className="fixed bottom-6 right-6 z-50 flex items-center justify-center size-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all cursor-pointer group" href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <span className="absolute right-full mr-3 bg-card dark:bg-card-dark text-foreground dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat with us
            </span>
        </a>
    </>
  );
}
