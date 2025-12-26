
import Image from 'next/image';
import Link from 'next/link';
import { placeholderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Heart, SlidersHorizontal, ShoppingCart, ChevronLeft, ChevronRight, User, Edit } from 'lucide-react';

const menuItems = [
    {
        id: "midnight-chocolate-dream",
        name: "Midnight Chocolate Dream",
        description: "Rich dark chocolate layers with premium ganache drip and cocoa dusting.",
        price: 4500,
        imageHint: "dark chocolate cake"
    },
    {
        id: "classic-ribbon-cake",
        name: "Classic Ribbon Cake",
        description: "Traditional Sri Lankan ribbon cake with creamy butter icing and vanilla layers.",
        price: 3800,
        badge: "Best Seller",
        imageHint: "colorful layered cake"
    },
    {
        id: "berry-bliss-gateau",
        name: "Berry Bliss Gateau",
        description: "Light sponge cake layered with fresh strawberry mousse and topped with berries.",
        price: 5200,
        imageHint: "strawberry gateau"
    },
    {
        id: "red-velvet-cupcakes",
        name: "Red Velvet Cupcakes (6)",
        description: "Moist red velvet cupcakes topped with our signature cream cheese frosting.",
        price: 1800,
        imageHint: "red velvet cupcakes"
    },
    {
        id: "golden-butter-cake",
        name: "Golden Butter Cake",
        description: "A timeless classic. Soft, buttery sponge perfect for tea time.",
        price: 2500,
        imageHint: "butter cake slice"
    },
    {
        id: "custom-wedding-tier",
        name: "Custom Wedding Tier",
        description: "Elegant multi-tier cakes with floral arrangements. Price varies by customization.",
        price: 15000,
        isQuote: true,
        imageHint: "elegant wedding cake"
    },
    {
        id: "coffee-walnut-delight",
        name: "Coffee Walnut Delight",
        description: "Infused with local coffee and topped with caramelized walnuts.",
        price: 4200,
        imageHint: "coffee walnut cake"
    },
    {
        id: "zesty-lemon-drizzle",
        name: "Zesty Lemon Drizzle",
        description: "Tangy lemon sponge soaked in citrus syrup with a crunchy sugar top.",
        price: 3000,
        imageHint: "lemon drizzle cake"
    },
];


const categories = [
    "All Cakes",
    "Birthday",
    "Wedding",
    "Gateaux",
    "Cupcakes",
    "Custom Tiers",
];

export default function MenuPage() {
    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-sm">
                <Link className="text-muted-foreground hover:text-primary transition-colors" href="/">Home</Link>
                <span className="text-muted-foreground">/</span>
                <span className="font-semibold text-foreground">Menu</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-3">Our Delicious Creations</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Handcrafted cakes for every occasion. From classic Sri Lankan Ribbon Cakes to rich Chocolate Ganache, customized just for you.
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mb-10 items-start lg:items-center justify-between">
                <div className="w-full lg:w-96 relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input className="pl-12 pr-4 py-3 h-auto rounded-xl bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Search for cakes, flavors..." type="text"/>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                         <Button key={category} variant={index === 0 ? "default" : "outline"} className="px-5 py-2 rounded-xl text-sm font-bold transition-transform hover:-translate-y-0.5 shadow-sm">
                            {category}
                         </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {menuItems.map((item) => {
                     const image = placeholderImages.find(p => p.id === item.id);
                     return (
                        <div key={item.id} className="group flex flex-col bg-card rounded-2xl p-4 shadow-sm hover:shadow-xl hover:shadow-primary/5 border border-border transition-all duration-300">
                           <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                                {image && (
                                    <Image 
                                        alt={item.name} 
                                        src={image.imageUrl}
                                        fill
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        data-ai-hint={item.imageHint}
                                    />
                                )}
                                <Button size="icon" variant="secondary" className="absolute top-3 right-3 h-8 w-8 bg-white/90 dark:bg-black/50 rounded-full text-muted-foreground hover:text-primary transition-colors backdrop-blur-sm">
                                    <Heart className="w-4 h-4" />
                                </Button>
                                {item.badge && (
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-400/90 backdrop-blur-sm rounded-lg text-black text-[10px] font-bold uppercase tracking-wide">
                                        {item.badge}
                                    </div>
                                )}
                           </div>
                           <div className="flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-foreground leading-tight mb-2">{item.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                                    {item.description}
                                </p>
                                <div className="mt-auto">
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-sm font-medium text-muted-foreground">{item.isQuote ? "Starting LKR" : "LKR"}</span>
                                        <span className="text-xl font-bold text-primary">{item.price.toLocaleString()}</span>
                                    </div>
                                    {item.isQuote ? (
                                        <Button className="w-full h-10 font-bold text-sm" asChild>
                                            <Link href="/order">
                                                <Edit className="mr-2 h-4 w-4" /> Request Quote
                                            </Link>
                                        </Button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="flex-1 h-10 text-sm font-bold flex items-center justify-center gap-2">
                                                <SlidersHorizontal className="h-4 w-4" />
                                                Customize
                                            </Button>
                                            <Button size="icon" className="h-10 w-12">
                                                <ShoppingCart className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                           </div>
                        </div>
                     )
                })}
            </div>

             <div className="mt-12 flex justify-center">
                <nav aria-label="Pagination" className="flex items-center gap-2">
                    <Button variant="outline" size="icon"><ChevronLeft /></Button>
                    <Button size="icon">1</Button>
                    <Button variant="outline" size="icon">2</Button>
                    <Button variant="outline" size="icon">3</Button>
                    <span className="px-2 text-muted-foreground">...</span>
                    <Button variant="outline" size="icon">8</Button>
                    <Button variant="outline" size="icon"><ChevronRight /></Button>
                </nav>
            </div>
        </div>
    );
}
