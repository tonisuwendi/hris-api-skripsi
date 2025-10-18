import { z } from 'zod';

const getSalaryRecommendations = z.object({
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
  month: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine(
      (val) =>
        val === undefined || (Number.isInteger(val) && val >= 1 && val <= 12),
      {
        message: 'Month must be an integer between 1 and 12',
      },
    ),
  year: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine(
      (val) => val === undefined || (Number.isInteger(val) && val >= 1900),
      {
        message: 'Year must be a valid integer greater than or equal to 1900',
      },
    ),
});

const getSalaryRecommendationDetail = z.object({
  month: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine(
      (val) =>
        val === undefined || (Number.isInteger(val) && val >= 1 && val <= 12),
      {
        message: 'Month must be an integer between 1 and 12',
      },
    ),
  year: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine(
      (val) => val === undefined || (Number.isInteger(val) && val >= 1900),
      {
        message: 'Year must be a valid integer greater than or equal to 1900',
      },
    ),
});

export const salarySchema = {
  getSalaryRecommendations,
  getSalaryRecommendationDetail,
};

export type GetSalaryRecommendationsParams = z.infer<
  typeof salarySchema.getSalaryRecommendations
>;

export type GetSalaryRecommendationDetailParams = z.infer<
  typeof salarySchema.getSalaryRecommendationDetail
>;
