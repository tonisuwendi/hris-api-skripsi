export const sanitizePagination = (
  limit?: number | string,
  page?: number | string,
) => {
  let safeLimit = parseInt(String(limit), 10);
  if (isNaN(safeLimit) || safeLimit <= 0) safeLimit = 10;
  if (safeLimit > 100) safeLimit = 100;

  let safePage = parseInt(String(page), 10);
  if (isNaN(safePage) || safePage <= 0) safePage = 1;

  const offset = (safePage - 1) * safeLimit;
  return { limit: safeLimit, offset };
};
