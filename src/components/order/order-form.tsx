'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check, CloudUpload, Loader2, MessageSquare, Verified, ArrowRight, LocateIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CAKE_CATEGORIES, CAKE_SIZES, CAKE_FLAVORS } from '@/lib/constants';
import { createOrder } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { placeholderImages } from '@/lib/placeholder-images';

const orderFormSchema = z.object({
  customer_name: z.string().min(2, { message: 'Name is required.' }),
  phone_number: z.string().min(10, { message: 'A valid phone number is required.' }),
  cake_category: z.string().min(1, { message: 'Please select a cake category.' }),
  cake_size: z.string().min(1, { message: 'Please select a cake size.' }),
  flavor: z.string().min(1, { message: 'Please select a flavor.' }),
  message_on_cake: z.string().max(100, 'Message cannot exceed 100 characters.').optional(),
  delivery_date: z.date({ required_error: 'Please pick a delivery date.' }),
  delivery_location: z.string().min(5, { message: 'Delivery address is required.' }),
  reference_image: z.instanceof(File).optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;


export function OrderForm() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const categoryFromUrl = searchParams.get('category');

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
        customer_name: '',
        phone_number: '',
        cake_category: categoryFromUrl || 'Birthday Cakes',
        cake_size: '1kg',
        flavor: 'Chocolate Fudge',
        message_on_cake: '',
        delivery_location: '',
        },
    });

    const watchCategory = form.watch('cake_category');
    const watchSize = form.watch('cake_size');
    const watchFlavor = form.watch('flavor');

    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const selectedSize = CAKE_SIZES.find(s => s.size === watchSize);
        const deliveryFee = 350; // Example fixed delivery fee
        setTotalPrice((selectedSize ? selectedSize.price : 0) + deliveryFee);
    }, [watchSize]);
    

    const onSubmit = (data: OrderFormValues) => {
        startTransition(async () => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value) {
                if (key === 'delivery_date') {
                    formData.append(key, (value as Date).toISOString());
                } else if (key === 'reference_image') {
                    // Only append if it's a file
                    if (value instanceof File) {
                        formData.append(key, value as Blob);
                    }
                }
                else {
                    formData.append(key, value as string);
                }
            }
        });
        formData.append('total_price', totalPrice.toString());

        const result = await createOrder(formData);

        if (result?.errors) {
            Object.entries(result.errors).forEach(([field, messages]) => {
            if (field === '_form') {
                toast({
                title: 'Error submitting order',
                description: messages.join(', '),
                variant: 'destructive',
                });
            } else {
                form.setError(field as keyof OrderFormValues, {
                type: 'manual',
                message: (messages as string[]).join(', '),
                });
            }
            });
        }
        });
    };

    const categoryImageMap: {[key:string]: string} = {
        "Birthday Cakes": "birthday-cake-new",
        "Bento Cakes": "bento-cake-new",
        "Wedding Cakes": "wedding-cake-new",
        "Custom Cakes": "custom-cake-new"
    }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Step 1 */}
            <section className="bg-card dark:bg-card-dark p-6 md:p-8 rounded-xl shadow-sm border">
                <div className="flex items-center gap-3 mb-6">
                    <span className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold text-sm">1</span>
                    <h2 className="text-xl font-bold">Choose Your Base</h2>
                </div>
                 <div className="mb-8">
                    <Label className="block text-sm font-semibold mb-3">Cake Category</Label>
                    <Controller
                        control={form.control}
                        name="cake_category"
                        render={({ field }) => (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {CAKE_CATEGORIES.map((category) => {
                                    const image = placeholderImages.find(p => p.id === categoryImageMap[category]);
                                    const isSelected = field.value === category;
                                    return (
                                        <div key={category} onClick={() => field.onChange(category)} className={cn("group cursor-pointer relative flex flex-col gap-3 pb-3 p-2 rounded-xl border-2 transition-all", isSelected ? "border-primary bg-primary/5" : "border-transparent hover:border-border")}>
                                             {isSelected && (
                                                <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-0.5 shadow-sm z-10">
                                                    <Check className="text-[16px] h-4 w-4" />
                                                </div>
                                             )}
                                             <div className="relative w-full aspect-square bg-cover rounded-lg overflow-hidden">
                                                {image && <Image src={image.imageUrl} alt={image.description} fill className="object-cover group-hover:opacity-100 transition-opacity" />}
                                             </div>
                                            <p className={cn("text-sm font-medium text-center", isSelected ? "text-primary font-bold" : "text-foreground")}>{category}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="block text-sm font-semibold mb-3">Size (Weight)</Label>
                        <Controller
                            name="cake_size"
                            control={form.control}
                            render={({ field }) => (
                                <div className="flex bg-background p-1.5 rounded-full border">
                                {CAKE_SIZES.map(({ size }) => (
                                    <button
                                    key={size}
                                    type="button"
                                    onClick={() => field.onChange(size)}
                                    className={cn(
                                        "flex-1 py-2 px-4 rounded-full text-sm transition-all",
                                        field.value === size
                                        ? "bg-card text-primary font-bold shadow-sm"
                                        : "text-muted-foreground font-medium hover:text-foreground"
                                    )}
                                    >
                                    {size}
                                    </button>
                                ))}
                                </div>
                            )}
                        />
                    </div>
                     <div>
                        <Label className="block text-sm font-semibold mb-3">Flavor Base</Label>
                         <Controller
                            name="flavor"
                            control={form.control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a flavor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CAKE_FLAVORS.map((flavor) => (
                                            <SelectItem key={flavor} value={flavor}>{flavor}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>
            </section>

             {/* Step 2: Personalize */}
            <section className="bg-card dark:bg-card-dark p-6 md:p-8 rounded-xl shadow-sm border">
                <div className="flex items-center gap-3 mb-6">
                    <span className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold text-sm">2</span>
                    <h2 className="text-xl font-bold">Personalize</h2>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="message_on_cake">Wording on Cake</Label>
                        <Textarea id="message_on_cake" {...form.register('message_on_cake')} placeholder="e.g. Happy Birthday Amma!" rows={3} />
                    </div>
                     <div>
                        <Label htmlFor="reference_image">Upload Design Reference (Optional)</Label>
                        <Controller
                            name="reference_image"
                            control={form.control}
                            render={({ field }) => (
                                <div 
                                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl bg-background/50 hover:bg-background cursor-pointer transition-colors group"
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {field.value ? (
                                        <>
                                            <Check className="text-green-500 text-4xl mb-2" />
                                            <p className="mb-1 text-sm text-foreground">{field.value.name}</p>
                                            <p className="text-xs text-muted-foreground">Click to change file</p>
                                        </>
                                    ) : (
                                        <>
                                            <CloudUpload className="text-muted-foreground text-4xl mb-2 group-hover:text-primary transition-colors" />
                                            <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG (MAX. 5MB)</p>
                                        </>
                                    )}
                                </div>
                                <Input 
                                    id="file-upload"
                                    type="file" 
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => field.onChange(e.target.files?.[0])}
                                />
                                </div>
                            )}
                        />
                    </div>
                </div>
            </section>
             {/* Step 3: Delivery */}
            <section className="bg-card dark:bg-card-dark p-6 md:p-8 rounded-xl shadow-sm border">
                 <div className="flex items-center gap-3 mb-6">
                    <span className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold text-sm">3</span>
                    <h2 className="text-xl font-bold">Your Info & Delivery</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="customer_name">Full Name</Label>
                        <Input id="customer_name" {...form.register('customer_name')} placeholder="e.g., Nimali Perera" required />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="phone_number">Phone Number</Label>
                        <Input id="phone_number" {...form.register('phone_number')} placeholder="e.g., 0771234567" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Delivery Date</Label>
                        <Controller
                            name="delivery_date"
                            control={form.control}
                            render={({ field }) => (
                                <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !field.value && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate()))}
                                    initialFocus
                                    />
                                </PopoverContent>
                                </Popover>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="delivery_location">Delivery Location</Label>
                        <div className="relative">
                            <LocateIcon className="absolute inset-y-0 left-3 my-auto text-muted-foreground" />
                             <Input id="delivery_location" {...form.register('delivery_location')} className="pl-10" placeholder="City or Street Address" required />
                        </div>
                    </div>
                </div>
            </section>
        </div>
         {/* Right Column: Sticky Summary */}
        <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
                <div className="bg-card dark:bg-card-dark p-6 rounded-xl shadow-lg border">
                    <h3 className="text-lg font-bold mb-5 border-b pb-3">Order Summary</h3>
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex gap-3">
                             <div className="relative w-16 h-16 rounded-lg bg-cover bg-center shrink-0 overflow-hidden">
                                { watchCategory && categoryImageMap[watchCategory] && (
                                     <Image src={placeholderImages.find(p => p.id === categoryImageMap[watchCategory])?.imageUrl || ''} alt={watchCategory} fill className="object-cover"/>
                                )}
                            </div>
                             <div>
                                <p className="font-bold text-sm">{watchCategory}</p>
                                <p className="text-muted-foreground text-xs mt-1">{watchSize} • {watchFlavor}</p>
                            </div>
                            <div className="ml-auto">
                                <p className="font-semibold text-sm">LKR {(totalPrice - 350).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                     <div className="flex flex-col gap-2 pt-4 border-t mb-6">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">LKR {(totalPrice - 350).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Delivery (Est.)</span>
                            <span className="font-medium">LKR 350</span>
                        </div>
                        <div className="flex justify-between items-center text-base font-bold mt-2 pt-2 border-t border-dashed">
                            <span>Total</span>
                            <span className="text-primary text-xl">LKR {totalPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button type="submit" size="lg" className="w-full font-bold text-lg rounded-full" disabled={isPending}>
                             {isPending ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Placing Order...
                                </>
                            ) : (
                                <>
                                Place Order <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                        <Button asChild variant="outline" size="lg" className="w-full font-bold text-lg rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500/5 hover:text-green-600">
                             <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=I'd like to place an order!`} target="_blank" rel="noopener noreferrer">
                                <MessageSquare className="mr-2 h-5 w-5" />
                                Order via WhatsApp
                            </a>
                        </Button>
                    </div>
                </div>
                 <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 flex items-start gap-3">
                    <Verified className="text-primary mt-1" />
                    <div>
                        <p className="text-xs font-bold text-primary mb-0.5">Secure Order</p>
                        <p className="text-xs text-primary/80">Your order details are confirmed instantly via SMS & Email.</p>
                    </div>
                </div>
            </div>
        </div>
    </form>
  );
}
