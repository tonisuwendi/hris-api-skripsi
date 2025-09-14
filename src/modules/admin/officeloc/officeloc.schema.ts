import { z } from 'zod';

const getOfficeLocation = z.object({
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

const insertUpdateOfficeLocation = z.object({
  name: z.string({ required_error: 'Name is required' }).min(3).max(100),
  latitude: z
    .number({ required_error: 'Latitude is required' })
    .min(-90)
    .max(90),
  longitude: z
    .number({ required_error: 'Longitude is required' })
    .min(-180)
    .max(180),
  radius_meters: z.number({ required_error: 'Radius is required' }).min(0),
});

export const officeLocationSchema = {
  getOfficeLocation,
  insertUpdateOfficeLocation,
};

export type GetOfficeLocationParams = z.infer<
  typeof officeLocationSchema.getOfficeLocation
>;
export type InsertUpdateOfficeLocationBody = z.infer<
  typeof officeLocationSchema.insertUpdateOfficeLocation
>;
