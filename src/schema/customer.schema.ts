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
    '1688',
    'email',
    'ad',
    'promotion',
  ]),

  // owner_id: z.number().int(),
  owner_id: z.enum(['184']),

  address: z.string(),

  country_code: z.string().length(2),
  state_code: z.enum(['31']),
  city_code: z.enum(['3101']),
  district_code: z.enum(['310151']),

  remark: z
  .string()
  .describe('faker:lorem.sentence?0.4')
})

export type CustomerCreateRequest = z.infer<
  typeof CustomerCreateSchema
>
