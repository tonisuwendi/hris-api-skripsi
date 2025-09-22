import { sanitizePagination } from '@/utils/helpers';
import { GetAttendanceParams, UpdateAttendanceBody } from './attendance.schema';
import pool from '@/config/db.config';
import { AttendanceSessionQuery } from '@/types/modules';
import { IGetAllResult } from '@/types/general';
import { ApiError } from '@/utils/ApiError';

const getAttendances = async (
  params: GetAttendanceParams,
): Promise<IGetAllResult<AttendanceSessionQuery>> => {
  const { limit, offset } = sanitizePagination(params.limit, params.page);

  const filters: string[] = [];
  const values: any[] = [];

  if (params.date) {
    filters.push('a.work_date = ?');
    values.push(params.date);
  }
  if (params.employee_id) {
    filters.push('a.employee_id = ?');
    values.push(params.employee_id);
  }
  if (params.work_mode) {
    filters.push('a.work_mode = ?');
    values.push(params.work_mode);
  }

  const whereClause =
    filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  const [countRows] = await pool.query<AttendanceSessionQuery[]>(
    `SELECT COUNT(*) as total 
     FROM attendance_sessions a
     ${whereClause}`,
    values,
  );
  const total = countRows[0].total as number;

  const [rows] = await pool.query<AttendanceSessionQuery[]>(
    `SELECT 
      a.id,
      a.employee_id,
      e.name AS employee_name,
      a.work_date,
      a.start_time,
      a.end_time,
      a.work_mode,
      a.office_name,
      a.ci_latitude,
      a.ci_longitude,
      a.co_latitude,
      a.co_longitude
     FROM attendance_sessions a
     JOIN employees e ON e.id = a.employee_id
     ${whereClause}
     ORDER BY a.work_date DESC, a.start_time DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset],
  );

  return {
    data: rows,
    pagination: { total, limit, page: params.page ? Number(params.page) : 1 },
  };
};

const updateAttendance = async (
  id: number,
  body: UpdateAttendanceBody,
): Promise<AttendanceSessionQuery> => {
  const [result] = await pool.query(
    `UPDATE attendance_sessions 
     SET start_time = ?, end_time = ?, work_mode = ?
     WHERE id = ?`,
    [body.start_time, body.end_time, body.work_mode, id],
  );

  if ((result as any).affectedRows === 0) {
    throw new ApiError(404, 'Attendance session not found');
  }

  const [rows] = await pool.query<AttendanceSessionQuery[]>(
    `SELECT 
      a.id,
      a.employee_id,
      e.name AS employee_name,
      a.work_date,
      a.start_time,
      a.end_time,
      a.work_mode,
      a.office_name
     FROM attendance_sessions a
     JOIN employees e ON e.id = a.employee_id
     WHERE a.id = ?`,
    [id],
  );

  if (rows.length === 0) {
    throw new ApiError(404, 'Attendance session not found');
  }

  return rows[0];
};

export const attendanceService = {
  getAttendances,
  updateAttendance,
};
