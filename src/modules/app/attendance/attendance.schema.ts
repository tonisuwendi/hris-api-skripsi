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

const getAttendanceRequest = z.object({
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

const requestAttendanceSchema = z.object({
  request_type: z.enum(['annual_leave', 'sick', 'other'], {
    required_error: 'Request type is required',
    invalid_type_error:
      'Request type must be one of: annual_leave, sick, other',
  }),
  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    })
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description must be at most 500 characters long'),
  start_date: z
    .string({
      required_error: 'Start date is required',
      invalid_type_error: 'Start date must be a string',
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Start date must be a valid date string',
    }),
  end_date: z
    .string({
      required_error: 'End date is required',
      invalid_type_error: 'End date must be a string',
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'End date must be a valid date string',
    }),
  latitude: z
    .string({
      invalid_type_error: 'Latitude must be a string',
    })
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        (!isNaN(Number(val)) && Number(val) >= -90 && Number(val) <= 90),
      {
        message: 'Latitude must be a number between -90 and 90',
      },
    ),
  longitude: z
    .string({
      invalid_type_error: 'Longitude must be a string',
    })
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        (!isNaN(Number(val)) && Number(val) >= -180 && Number(val) <= 180),
      {
        message: 'Longitude must be a number between -180 and 180',
      },
    ),
});

export const attendanceSchema = {
  getAttendanceHistory,
  getAttendanceRequest,
  clockInOutSchema,
  requestAttendanceSchema,
};

export type GetAttendanceHistoryInput = z.infer<
  typeof attendanceSchema.getAttendanceHistory
>;
export type GetAttendanceRequestInput = z.infer<
  typeof attendanceSchema.getAttendanceRequest
>;
export type ClockInOutInput = z.infer<typeof attendanceSchema.clockInOutSchema>;
export type RequestAttendanceInput = z.infer<
  typeof attendanceSchema.requestAttendanceSchema
>;
