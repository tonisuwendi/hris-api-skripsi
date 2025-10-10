import { z } from 'zod';

const getPerformance = z.object({
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
  employee_id: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (Number.isInteger(val) && val > 0), {
      message: 'Employee ID must be a positive integer',
    }),
});

const insertUpdatePerformance = z.object({
  employee_id: z
    .number({
      required_error: 'Employee ID is required',
      invalid_type_error: 'Employee ID must be a number',
    })
    .int('Employee ID must be an integer')
    .positive('Employee ID must be a positive number'),
  period_start: z
    .string({
      required_error: 'Period start date is required',
      invalid_type_error: 'Period start date must be a string',
    })
    .refine(
      (val) => !isNaN(Date.parse(val)),
      'Period start date must be a valid date string',
    ),
  period_end: z
    .string({
      required_error: 'Period end date is required',
      invalid_type_error: 'Period end date must be a string',
    })
    .refine(
      (val) => !isNaN(Date.parse(val)),
      'Period end date must be a valid date string',
    ),
  productivity_score: z
    .number({
      required_error: 'Productivity score is required',
      invalid_type_error: 'Productivity score must be a number',
    })
    .min(0, 'Productivity score cannot be less than 0')
    .max(10, 'Productivity score cannot be more than 10'),
  quality_score: z
    .number({
      required_error: 'Quality score is required',
      invalid_type_error: 'Quality score must be a number',
    })
    .min(0, 'Quality score cannot be less than 0')
    .max(10, 'Quality score cannot be more than 10'),
  discipline_score: z
    .number({
      required_error: 'Discipline score is required',
      invalid_type_error: 'Discipline score must be a number',
    })
    .min(0, 'Discipline score cannot be less than 0')
    .max(10, 'Discipline score cannot be more than 10'),
  softskill_score: z
    .number({
      required_error: 'Softskill score is required',
      invalid_type_error: 'Softskill score must be a number',
    })
    .min(0, 'Softskill score cannot be less than 0')
    .max(10, 'Softskill score cannot be more than 10'),
  notes: z
    .string({
      required_error: 'Notes is required',
      invalid_type_error: 'Notes must be a string',
    })
    .max(100, 'Notes cannot be more than 100 characters')
    .optional()
    .or(z.literal('')),
});

export const performanceSchema = {
  getPerformance,
  insertUpdatePerformance,
};

export type GetPerformanceParams = z.infer<typeof getPerformance>;
export type InsertUpdatePerformanceBody = z.infer<
  typeof insertUpdatePerformance
>;
