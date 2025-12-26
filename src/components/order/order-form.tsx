'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CAKE_CATEGORIES, CAKE_SIZES, CAKE_FLAVORS } from '@/lib/constants';
import { createOrder } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import AiSuggestion from './ai-suggestion';

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
  const [totalPrice, setTotalPrice] = useState(0);

  const categoryFromUrl = searchParams.get('category');

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer_name: '',
      phone_number: '',
      cake_category: categoryFromUrl || '',
      cake_size: '',
      flavor: '',
      message_on_cake: '',
      delivery_location: '',
    },
  });

  const watchSize = form.watch('cake_size');

  useEffect(() => {
    const selectedSize = CAKE_SIZES.find(s => s.size === watchSize);
    setTotalPrice(selectedSize ? selectedSize.price : 0);
  }, [watchSize]);

  const onSubmit = (data: OrderFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
            if (key === 'delivery_date') {
                formData.append(key, (value as Date).toISOString());
            } else {
                formData.append(key, value as string | Blob);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="customer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Nimali Perera" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 0771234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="border p-4 rounded-lg space-y-6 bg-secondary/30 relative">
            <div className="absolute -top-3 right-4">
                <AiSuggestion getValues={() => ({
                    occasion: "celebration", // This could be another form field
                    category: form.getValues("cake_category")
                })} />
            </div>
            <h3 className="font-headline text-lg font-semibold border-b pb-2">Cake Details</h3>
             <div className="grid md:grid-cols-2 gap-8">
                 <FormField
                    control={form.control}
                    name="cake_category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cake Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {CAKE_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cake_size"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cake Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a size" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {CAKE_SIZES.map(s => <SelectItem key={s.size} value={s.size}>{s.size}</SelectItem>)}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="flavor"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Flavor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a flavor" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {CAKE_FLAVORS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="message_on_cake"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Message on Cake</FormLabel>
                    <FormControl>
                    <Textarea placeholder="e.g., Happy Birthday Amma!" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        
        <div className="border p-4 rounded-lg space-y-6 bg-secondary/30">
            <h3 className="font-headline text-lg font-semibold border-b pb-2">Delivery Details</h3>
            <div className="grid md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="delivery_date"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Delivery Date</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant={'outline'}
                            className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                            )}
                        >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="delivery_location"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Delivery Location</FormLabel>
                    <FormControl>
                    <Textarea placeholder="Full address including city" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
        </div>

        <FormField
            control={form.control}
            name="reference_image"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Reference Image (Optional)</FormLabel>
                    <FormControl>
                    <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
                    </FormControl>
                    <FormDescription>
                        Have a specific design in mind? Upload an image.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />

        <div className="p-6 bg-primary/10 rounded-lg flex items-center justify-between">
            <span className="text-xl font-headline font-bold">Total Price:</span>
            <span className="text-2xl font-bold font-mono">
                {totalPrice > 0 ? `LKR ${totalPrice.toLocaleString()}` : 'Select size'}
            </span>
        </div>

        <Button type="submit" size="lg" className="w-full font-bold text-lg" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Order
        </Button>
      </form>
    </Form>
  );
}
