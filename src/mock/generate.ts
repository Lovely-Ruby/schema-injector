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
        if (key.includes('email')) {
          item[key] = faker.internet.email()
        } else if (key.includes('phone')) {
          item[key] =
            '1' +
            faker.number
              .int({ min: 3000000000, max: 9999999999 })
              .toString()
        } else if (key.includes('code')) {
          item[key] = faker.number
            .int({ min: 1, max: 999999 })
            .toString()
        } else {
          item[key] = faker.company.name()
        }
      }

      if (field instanceof z.ZodNumber) {
        item[key] = faker.number.int({ min: 1, max: 500 })
      }

      if (field instanceof z.ZodEnum) {
        item[key] = faker.helpers.arrayElement(field.options)
      }
    }

    // ✅ 再校验一次，确保绝对合法
    schema.parse(item)

    list.push(item)
  }

  return list
}
