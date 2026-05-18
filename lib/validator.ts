import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})

export const registerSchema = z.object({
  name: z.string(), 
  email: z.email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message:'Password tidak sama',
    path: ['confirmPassword'],
  },
)

export const productSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  price: z.coerce.number().min(1, "Harga harus lebih dari 0"),
});
