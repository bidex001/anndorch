import z from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().positive("Price must be a positive number"),
})

export const priceSchema = z.object({
    price: z.number().positive()
})