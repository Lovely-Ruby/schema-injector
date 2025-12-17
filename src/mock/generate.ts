import { z } from 'zod'
import { faker } from '@faker-js/faker'

export function generateMock<T>(
  schema: z.ZodObject<any>,
  count: number,
): T[] {
  const list: T[] = []
  const shape = schema.shape

  for (let i = 0; i < count; i++) {
    const item: any = {}

    for (const key in shape) {
      const field = shape[key]

      if (field instanceof z.ZodString) {
        // ---- 特判区域 ----
        if (key === 'country_code') {
          item[key] = 'CN'
        } else if (key.endsWith('_code')) {
          item[key] = faker.number
            .int({ min: 1, max: 999999 })
            .toString()
        }
        // ---- 常规字符串 ----
        else if (key.includes('email')) {
          item[key] = faker.internet.email()
        } else if (key.includes('phone')) {
          item[key] =
            '1' +
            faker.number
              .int({ min: 3000000000, max: 9999999999 })
              .toString()
        } else if (key.includes('address')) {
          item[key] = faker.location.streetAddress()
        } else if (key.includes('name')) {
          item[key] = faker.company.name()
        } else {
          item[key] = faker.lorem.words(3)
        }
      }

      if (field instanceof z.ZodNumber) {
        item[key] = faker.number.int({ min: 1, max: 500 })
      }

      if (field instanceof z.ZodEnum) {
        item[key] = faker.helpers.arrayElement(field.options)
      }
    }

    // ✅ 最终兜底校验
    schema.parse(item)
    list.push(item)
  }

  return list
}
