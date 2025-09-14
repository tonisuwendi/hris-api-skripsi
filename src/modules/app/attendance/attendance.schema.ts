import { z } from 'zod';

const clockInOutSchema = z.object({
  latitude: z
    .number({
      required_error: 'Latitude is required',
      invalid_type_error: 'Latitude must be a number',
    })
    .min(-90, 'Latitude must be >= -90')
    .max(90, 'Latitude must be <= 90'),
  longitude: z
    .number({
      required_error: 'Longitude is required',
      invalid_type_error: 'Longitude must be a number',
    })
    .min(-180, 'Longitude must be >= -180')
    .max(180, 'Longitude must be <= 180'),
});

export const attendanceSchema = {
  clockInOutSchema,
};

export type ClockInOutInput = z.infer<typeof attendanceSchema.clockInOutSchema>;
