'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"

const FormSchema = z.object({
  orderId: z.string().regex(/^\d+$/, "Order ID must be a number."),
})

export function TrackOrderForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            orderId: searchParams.get('id') || "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        router.push(`/track?id=${data.orderId}`)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm mx-auto mt-8 flex items-start gap-2">
                <FormField
                control={form.control}
                name="orderId"
                render={({ field }) => (
                    <FormItem className="flex-grow">
                        <FormControl>
                            <Input placeholder="Enter your Order ID" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit">Track Order</Button>
            </form>
        </Form>
    )
}
