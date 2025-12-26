import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Cake, Gift, Heart, PartyPopper } from 'lucide-react';

const categories = [
  { name: 'Birthday Cakes', icon: PartyPopper, imageId: 'birthday-cake' },
  { name: 'Bento Cakes', icon: Gift, imageId: 'bento-cake' },
  { name: 'Wedding Cakes', icon: Heart, imageId: 'wedding-cake' },
  { name: 'Custom Cakes', icon: Cake, imageId: 'custom-cake' },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-cake');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-background">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover object-center"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-primary-foreground p-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight drop-shadow-md">
            Crafted with Love, Baked to Perfection
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Discover the finest homemade cakes in Sri Lanka, perfect for every celebration.
          </p>
          <Button asChild size="lg" className="mt-8 font-bold text-lg">
            <Link href="/order">Order Your Cake Now <ArrowRight className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      <section id="categories" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">For Every Special Moment</h2>
            <p className="mt-2 text-lg text-muted-foreground">Choose from our delightful range of cakes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => {
              const categoryImage = PlaceHolderImages.find(p => p.id === category.imageId);
              return (
                <Link href={`/order?category=${encodeURIComponent(category.name)}`} key={category.name}>
                  <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-primary">
                    <CardHeader className="p-0">
                      <div className="relative h-60 w-full">
                        {categoryImage && (
                           <Image
                            src={categoryImage.imageUrl}
                            alt={categoryImage.description}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={categoryImage.imageHint}
                          />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 text-center">
                      <category.icon className="mx-auto h-8 w-8 text-primary mb-2" />
                      <CardTitle className="font-headline text-xl">{category.name}</CardTitle>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Ready to Track Your Masterpiece?</h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your Order ID to see the real-time status of your cake creation.
          </p>
          <Button asChild size="lg" className="mt-8 font-bold">
            <Link href="/track">Track Your Order</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
