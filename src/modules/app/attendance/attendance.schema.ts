import { z } from 'zod';

const getAttendanceHistory = z.object({
  page: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || (!isNaN(Number(val)) && Number(val) > 0),
      {
        message: 'Page must be a positive integer',
      },
    )
    .transform((val) => (val ? Number(val) : 1)),
  limit: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || (!isNaN(Number(val)) && Number(val) > 0),
      {
        message: 'Limit must be a positive integer',
      },
    )
    .transform((val) => (val ? Number(val) : 100)),
  start_date: z
    .string({
      invalid_type_error: 'Start date must be a string',
    })
    .optional()
    .refine((date) => date === undefined || !isNaN(Date.parse(date)), {
      message: 'Start date must be a valid date string',
    }),
  end_date: z
    .string({
      invalid_type_error: 'End date must be a string',
    })
    .optional()
    .refine((date) => date === undefined || !isNaN(Date.parse(date)), {
      message: 'End date must be a valid date string',
    }),
});

const clockInOutSchema = z.object({
  latitude: z.coerce
    .number({
      required_error: 'Latitude is required',
      invalid_type_error: 'Latitude must be a number',
    })
    .min(-90, 'Latitude must be >= -90')
    .max(90, 'Latitude must be <= 90'),
  longitude: z.coerce
    .number({
      required_error: 'Longitude is required',
      invalid_type_error: 'Longitude must be a number',
    })
    .min(-180, 'Longitude must be >= -180')
    .max(180, 'Longitude must be <= 180'),
});

export const attendanceSchema = {
  getAttendanceHistory,
  clockInOutSchema,
};

export type GetAttendanceHistoryInput = z.infer<
  typeof attendanceSchema.getAttendanceHistory
>;
export type ClockInOutInput = z.infer<typeof attendanceSchema.clockInOutSchema>;
