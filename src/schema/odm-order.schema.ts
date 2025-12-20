import { z } from 'zod'

export const OrderItemSchema = z.object({
  product_sku_id: z.union([
    z.literal(2409),
    z.literal(2408),
    z.literal(2407),
    z.literal(2406),
  ]),
  code: z.string(),
  title: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().min(0),
})

export const OrderCreateSchema = z.object({
  customer_id: z.union([
    z.literal(318),
    z.literal(317),
    z.literal(316),
    z.literal(315),
  ]),
  owner_id: z.union([
    z.literal(1405),
    z.literal(1404),
    z.literal(186),
    z.literal(184),
  ]),
  items: z.array(OrderItemSchema).min(1),
})

export type OrderCreateRequest = z.infer<typeof OrderCreateSchema>
