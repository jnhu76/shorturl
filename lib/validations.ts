import * as z from 'zod';

export const urlSchema = z.object({
  url: z.string().url(),
});

export const userAuthSchema = z.object({
  email: z.string().email({
    message: '请输入有效的邮箱地址',
  }),
  password: z
    .string()
    .min(8, {
      message: '密码至少需要8个字符',
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
      message: '密码必须包含大小写字母和数字',
    }),
});

export type UrlInput = z.infer<typeof urlSchema>;
export type UserAuthInput = z.infer<typeof userAuthSchema>;
