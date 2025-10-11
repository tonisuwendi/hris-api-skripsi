import pool from '@/config/db.config';
import { IGetAllResult } from '@/types/general';
import { GetPerformanceParams } from './performance.schema';
import { IPerformance, PerformanceQuery } from '@/types/modules/performance';
import { sanitizePagination } from '@/utils/helpers';
import { EmployeeQuery } from '@/types/modules';
import { ResultSetHeader } from 'mysql2';
import { ApiError } from '@/utils/ApiError';

const getPerformance = async (
  params: GetPerformanceParams,
): Promise<IGetAllResult<IPerformance>> => {
  const { limit, offset } = sanitizePagination(params.limit, params.page);

  let whereClause = 'WHERE 1=1';
  if (params.employee_id) {
    whereClause += ` AND employee_id = ${params.employee_id}`;
  }

  const [countRows] = await pool.query<PerformanceQuery[]>(
    `SELECT COUNT(*) as total FROM performance_reviews ${whereClause}`,
  );

  const total = countRows[0].total as number;

  const sql = `
    SELECT
      p.id,
      p.employee_id,
      e.name AS employee_name,
      period_start,
      period_end,
      CAST(productivity_score AS FLOAT) AS productivity_score,
      CAST(quality_score AS FLOAT) AS quality_score,
      CAST(discipline_score AS FLOAT) AS discipline_score,
      CAST(softskill_score AS FLOAT) AS softskill_score,
      CAST(overall_score AS FLOAT) AS overall_score,
      notes,
      p.created_at
    FROM performance_reviews p
    LEFT JOIN employees e ON e.id = p.employee_id
    ${whereClause}
    GROUP BY p.id
    ORDER BY p.id DESC
    LIMIT ${offset}, ${limit}
  `;

  const [rows] = await pool.query<PerformanceQuery[]>(sql);

  return {
    data: rows,
    pagination: { total, limit, page: params.page ? Number(params.page) : 1 },
  };
};

const getPerformanceById = async (id: number): Promise<IPerformance> => {
  const sql = `
    SELECT
      p.id,
      p.employee_id,
      e.name AS employee_name,
      period_start,
      period_end,
      CAST(productivity_score AS FLOAT) AS productivity_score,
      CAST(quality_score AS FLOAT) AS quality_score,
      CAST(discipline_score AS FLOAT) AS discipline_score,
      CAST(softskill_score AS FLOAT) AS softskill_score,
      CAST(overall_score AS FLOAT) AS overall_score,
      notes,
      p.created_at
    FROM performance_reviews p
    LEFT JOIN employees e ON e.id = p.employee_id
    WHERE p.id = ?
    GROUP BY p.id
    LIMIT 1
  `;

  const [rows] = await pool.query<PerformanceQuery[]>(sql, [id]);

  if (rows.length === 0) {
    throw new ApiError(404, 'Performance review not found');
  }

  return rows[0];
};

const insertPerformance = async (data: IPerformance): Promise<IPerformance> => {
  const [existingEmployee] = await pool.query<EmployeeQuery[]>(
    'SELECT id FROM employees WHERE id = ?',
    [data.employee_id],
  );

  if (existingEmployee.length === 0) {
    throw new ApiError(404, 'Employee not found');
  }

  const [existingRange] = await pool.query<PerformanceQuery[]>(
    `
    SELECT id FROM performance_reviews
    WHERE employee_id = ?
      AND (
        (period_start <= ? AND period_end >= ?)
        OR (period_start <= ? AND period_end >= ?)
        OR (period_start >= ? AND period_end <= ?)
      )
  `,
    [
      data.employee_id,
      data.period_start,
      data.period_start,
      data.period_end,
      data.period_end,
      data.period_start,
      data.period_end,
    ],
  );

  if (existingRange.length > 0) {
    throw new ApiError(
      400,
      'A performance review for this employee already exists in the specified date range',
    );
  }

  const sql = `
    INSERT INTO performance_reviews
    (employee_id, period_start, period_end, productivity_score, quality_score, discipline_score, softskill_score, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query<ResultSetHeader>(sql, [
    data.employee_id,
    data.period_start,
    data.period_end,
    data.productivity_score,
    data.quality_score,
    data.discipline_score,
    data.softskill_score,
    data.notes,
  ]);

  const [rows] = await pool.query<PerformanceQuery[]>(
    'SELECT * FROM performance_reviews WHERE id = ?',
    [result.insertId],
  );

  return rows[0];
};

const updatePerformance = async (
  id: number,
  data: IPerformance,
): Promise<IPerformance> => {
  const [existing] = await pool.query<PerformanceQuery[]>(
    'SELECT id FROM performance_reviews WHERE id = ?',
    [id],
  );

  if (existing.length === 0) {
    throw new ApiError(404, 'Performance review not found');
  }

  const [existingEmployee] = await pool.query<EmployeeQuery[]>(
    'SELECT id FROM employees WHERE id = ?',
    [data.employee_id],
  );

  if (existingEmployee.length === 0) {
    throw new ApiError(404, 'Employee not found');
  }

  const [existingRange] = await pool.query<PerformanceQuery[]>(
    `
    SELECT id FROM performance_reviews
    WHERE employee_id = ?
      AND id != ?
      AND (
        (period_start <= ? AND period_end >= ?)
        OR (period_start <= ? AND period_end >= ?)
        OR (period_start >= ? AND period_end <= ?)
      )
  `,
    [
      data.employee_id,
      id,
      data.period_start,
      data.period_start,
      data.period_end,
      data.period_end,
      data.period_start,
      data.period_end,
    ],
  );

  if (existingRange.length > 0) {
    throw new ApiError(
      400,
      'A performance review for this employee already exists in the specified date range',
    );
  }

  const sql = `
    UPDATE performance_reviews
    SET employee_id = ?, period_start = ?, period_end = ?, productivity_score = ?, quality_score = ?, discipline_score = ?, softskill_score = ?, notes = ?
    WHERE id = ?
  `;

  await pool.query(sql, [
    data.employee_id,
    data.period_start,
    data.period_end,
    data.productivity_score,
    data.quality_score,
    data.discipline_score,
    data.softskill_score,
    data.notes,
    id,
  ]);

  const [rows] = await pool.query<PerformanceQuery[]>(
    'SELECT * FROM performance_reviews WHERE id = ?',
    [id],
  );

  return rows[0];
};

const deletePerformance = async (
  id: number,
): Promise<Partial<IPerformance>> => {
  const [existing] = await pool.query<PerformanceQuery[]>(
    'SELECT id, employee_id FROM performance_reviews WHERE id = ?',
    [id],
  );

  if (existing.length === 0) {
    throw new ApiError(404, 'Performance not found');
  }

  await pool.query('DELETE FROM performance_reviews WHERE id = ?', [id]);

  return existing[0];
};

export const performanceService = {
  getPerformance,
  getPerformanceById,
  insertPerformance,
  updatePerformance,
  deletePerformance,
};
