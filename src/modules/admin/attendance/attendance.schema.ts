import { z } from 'zod';

const getAttendances = z.object({
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
  date: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        /^\d{4}-\d{2}-\d{2}$/.test(val) ||
        /^\d{4}-\d{2}$/.test(val) ||
        /^\d{4}$/.test(val),
      {
        message:
          'Date must be in YYYY-MM-DD, YYYY-MM, or YYYY format if provided',
      },
    ),
  employee_id: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (Number.isInteger(val) && val > 0), {
      message: 'Employee ID must be a positive integer',
    }),
  work_mode: z
    .enum(['onsite', 'remote'])
    .optional()
    .refine((val) => val === undefined || ['onsite', 'remote'].includes(val), {
      message: 'Work mode must be either "onsite" or "remote"',
    }),
});

const updateAttendance = z.object({
  start_time: z
    .string({ required_error: 'Start time is required' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Start time must be a valid date string',
    }),
  end_time: z
    .string({ required_error: 'End time is required' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'End time must be a valid date string',
    }),
  work_mode: z.enum(['onsite', 'remote'], {
    required_error: 'Work mode is required',
  }),
});

export const attendanceSchema = {
  getAttendances,
  updateAttendance,
};

export type GetAttendanceParams = z.infer<typeof getAttendances>;
export type UpdateAttendanceBody = z.infer<typeof updateAttendance>;
