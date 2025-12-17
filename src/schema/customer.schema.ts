import { z } from 'zod'

export const CustomerCreateSchema = z.object({
  name: z.string(),
  company_name: z.string(),

  customer_type: z.enum(['domestic', 'overseas']),

  phone: z.string(),
  email: z.string().email(),

  source: z.enum([
    'online',
    'expo',
    'shopify',
    'ali1688',
    'email',
    'ad',
    'promotion',
  ]),

  owner_id: z.number().int(),

  address: z.string(),

  country_code: z.string().length(2),
  state_code: z.string(),
  city_code: z.string(),
  district_code: z.string(),

  remark: z.string().optional(),
})

export type CustomerCreateRequest = z.infer<
  typeof CustomerCreateSchema
>
