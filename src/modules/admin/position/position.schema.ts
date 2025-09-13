import { z } from 'zod';

const getPositions = z.object({
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

const insertUpdatePosition = z.object({
  name: z.string({ required_error: 'Name is required' }).min(3).max(100),
  description: z.string({ required_error: 'Description is required' }),
});

export const positionSchema = {
  getPositions,
  insertUpdatePosition,
};

export type GetPositionsParams = z.infer<typeof positionSchema.getPositions>;
export type InsertUpdatePositionBody = z.infer<
  typeof positionSchema.insertUpdatePosition
>;
