import { z } from 'zod';

const getEmployees = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (Number.isInteger(val) && val > 0), {
      message: 'Limit must be a positive integer',
    }),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (Number.isInteger(val) && val >= 0), {
      message: 'Page must be a non-negative integer',
    }),
});

const insertEmployee = z.object({
  employee_code: z
    .string({ required_error: 'Employee code is required' })
    .min(3)
    .max(50),
  name: z.string({ required_error: 'Name is required' }).min(3).max(100),
  email: z.string({ required_error: 'Email is required' }).email().max(100),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6)
    .max(100),
  birth_place: z.string().max(100).optional().nullable(),
  birth_date: z.string().date().optional().nullable(),
  gender: z.enum(['male', 'female']).optional().nullable(),
  marital_status: z
    .enum(['single', 'married', 'divorced', 'widowed'])
    .optional()
    .nullable(),
  religion: z
    .enum(['islam', 'kristen', 'katolik', 'hindu', 'budha', 'konghucu'])
    .optional()
    .nullable(),
  address: z.string().optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  province: z.string().max(100).optional().nullable(),
  position_id: z.coerce
    .number({ required_error: 'Position ID is required' })
    .int()
    .positive(),
  salary: z.coerce.number().min(0).optional().nullable(),
  date_joined: z.string({ required_error: 'Date joined is required' }).date(),
  status: z.enum(['active', 'inactive']).default('active'),
  education_level: z
    .enum(['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3'])
    .optional()
    .nullable(),
  major: z.string().max(100).optional().nullable(),
  institution: z.string().max(100).optional().nullable(),
  graduation_year: z.coerce
    .number()
    .min(1900)
    .max(new Date().getFullYear())
    .optional()
    .nullable(),
});

const updateEmployee = insertEmployee.extend({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters')
    .optional()
    .nullable()
    .or(z.literal('')),
});

export const employeeSchema = {
  getEmployees,
  insertEmployee,
  updateEmployee,
};

export type GetEmployeesParams = z.infer<typeof employeeSchema.getEmployees>;
export type InsertEmployeeBody = z.infer<typeof employeeSchema.insertEmployee>;
export type UpdateEmployeeBody = z.infer<typeof employeeSchema.updateEmployee>;
