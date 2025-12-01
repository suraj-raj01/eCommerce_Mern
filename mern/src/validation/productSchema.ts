import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().min(0),
  discount: z.number().min(0).max(100).optional(),
  stock: z.number().min(0),

  images: z.array(z.instanceof(File)).min(1),

  variants: z
    .array(
      z.object({
        color: z.string().optional(),
        size: z.string().optional(),
        price: z.number().optional(),
        stock: z.number().optional(),
      })
    )
    .optional(),

  specifications: z.object({
    material: z.string().optional(),
    weight: z.string().optional(),
    dimensions: z.string().optional(),
    warranty: z.string().optional(),
    modelNumber: z.string().optional(),
    originCountry: z.string().optional(),
  }),

  shipping: z.object({
    weight: z.number().optional(),
    dimensions: z
      .object({
        length: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      })
      .optional(),
    freeShipping: z.boolean().optional(),
  }),

  isFeatured: z.boolean(),
  status: z.enum(["active", "inactive", "archived"]),
});

export type ProductSchemaType = z.infer<typeof productSchema>;
