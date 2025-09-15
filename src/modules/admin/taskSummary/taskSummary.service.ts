import pool from '@/config/db.config';
import { sanitizePagination } from '@/utils/helpers';
import { IGetAllResult } from '@/types/general';
import { ITaskSummary, TaskSummaryQuery } from '@/types/modules/task-summary';
import {
  GetTaskSummaryParams,
  InsertUpdateTaskSummaryBody,
} from './taskSummary.schema';
import { EmployeeQuery } from '@/types/modules';
import { ResultSetHeader } from 'mysql2';

const getTaskSummary = async (
  params: GetTaskSummaryParams,
): Promise<IGetAllResult<ITaskSummary>> => {
  const { limit, offset } = sanitizePagination(params.limit, params.page);

  let whereClause = 'WHERE 1=1';
  if (params.employee_id) {
    whereClause += ` AND employee_id = ${params.employee_id}`;
  }

  const [countRows] = await pool.query<TaskSummaryQuery[]>(
    `SELECT COUNT(*) as total FROM task_summaries ${whereClause}`,
  );

  const total = countRows[0].total as number;

  const sql = `
    SELECT
      p.id,
      e.name AS employee_name,
      period_start,
      period_end,
      completed_tasks,
      p.created_at
    FROM task_summaries p
    LEFT JOIN employees e ON e.id = p.employee_id
    ${whereClause}
    GROUP BY p.id
    ORDER BY p.id DESC
    LIMIT ${offset}, ${limit}
  `;

  const [rows] = await pool.query<TaskSummaryQuery[]>(sql);

  return {
    data: rows,
    pagination: { total, limit, page: params.page ? Number(params.page) : 1 },
  };
};

const insertTaskSummary = async (
  data: InsertUpdateTaskSummaryBody,
): Promise<ITaskSummary> => {
  const [existingEmployee] = await pool.query<EmployeeQuery[]>(
    'SELECT id FROM employees WHERE id = ?',
    [data.employee_id],
  );

  if (existingEmployee.length === 0) {
    throw new Error('Employee not found');
  }

  const [result] = await pool.query<ResultSetHeader>(
    `
    INSERT INTO task_summaries (employee_id, period_start, period_end, completed_tasks)
    VALUES (?, ?, ?, ?)
  `,
    [
      data.employee_id,
      data.period_start,
      data.period_end,
      data.completed_tasks,
    ],
  );

  const [rows] = await pool.query<TaskSummaryQuery[]>(
    'SELECT * FROM task_summaries WHERE id = ?',
    [result.insertId],
  );

  return rows[0];
};

const updateTaskSummary = async (
  id: number,
  data: InsertUpdateTaskSummaryBody,
): Promise<ITaskSummary> => {
  const [existingEmployee] = await pool.query<EmployeeQuery[]>(
    'SELECT id FROM employees WHERE id = ?',
    [data.employee_id],
  );

  if (existingEmployee.length === 0) {
    throw new Error('Employee not found');
  }

  const [result] = await pool.query<ResultSetHeader>(
    `
    UPDATE task_summaries
    SET employee_id = ?, period_start = ?, period_end = ?, completed_tasks = ?
    WHERE id = ?
  `,
    [
      data.employee_id,
      data.period_start,
      data.period_end,
      data.completed_tasks,
      id,
    ],
  );

  if (result.affectedRows === 0) {
    throw new Error('Task summary not found or no changes made');
  }

  const [rows] = await pool.query<TaskSummaryQuery[]>(
    'SELECT * FROM task_summaries WHERE id = ?',
    [id],
  );

  return rows[0];
};

const deleteTaskSummary = async (id: number): Promise<ITaskSummary> => {
  const [existingRows] = await pool.query<TaskSummaryQuery[]>(
    'SELECT * FROM task_summaries WHERE id = ?',
    [id],
  );

  if (existingRows.length === 0) {
    throw new Error('Task summary not found');
  }

  await pool.query<ResultSetHeader>('DELETE FROM task_summaries WHERE id = ?', [
    id,
  ]);

  return existingRows[0];
};

export const taskSummaryService = {
  getTaskSummary,
  insertTaskSummary,
  updateTaskSummary,
  deleteTaskSummary,
};
