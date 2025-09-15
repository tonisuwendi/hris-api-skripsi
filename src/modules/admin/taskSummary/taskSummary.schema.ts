import { z } from 'zod';

const getTaskSummary = z.object({
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

const insertUpdateTaskSummary = z.object({
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
  completed_tasks: z
    .number({
      required_error: 'Completed tasks is required',
      invalid_type_error: 'Completed tasks must be a number',
    })
    .int('Completed tasks must be an integer')
    .min(0, 'Completed tasks cannot be negative'),
});

export const taskSummarySchema = {
  getTaskSummary,
  insertUpdateTaskSummary,
};

export type GetTaskSummaryParams = z.infer<
  typeof taskSummarySchema.getTaskSummary
>;
export type InsertUpdateTaskSummaryBody = z.infer<
  typeof taskSummarySchema.insertUpdateTaskSummary
>;
