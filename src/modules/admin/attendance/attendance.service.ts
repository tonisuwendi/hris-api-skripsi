import { sanitizePagination } from '@/utils/helpers';
import pool from '@/config/db.config';
import { AttendanceSessionQuery } from '@/types/modules';
import { IGetAllResult } from '@/types/general';
import { ApiError } from '@/utils/ApiError';
import {
  AttendanceRequestQuery,
  IAttendanceRequest,
} from '@/types/modules/attendance-request';
import {
  GetAttendanceParams,
  GetAttendanceRequestParams,
  UpdateAttendanceBody,
  UpdateStatusRequestInput,
} from './attendance.schema';
import { ResultSetHeader } from 'mysql2';

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

const getAttendanceById = async (
  id: number,
): Promise<AttendanceSessionQuery> => {
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
     WHERE a.id = ?`,
    [id],
  );

  if (rows.length === 0) {
    throw new ApiError(404, 'Attendance session not found');
  }

  return rows[0];
};

const getAttendanceRequest = async (
  params: GetAttendanceRequestParams,
): Promise<IGetAllResult<AttendanceRequestQuery>> => {
  const { limit, offset } = sanitizePagination(params.limit, params.page);

  const filters: string[] = [];
  const values: any[] = [];

  if (params.employee_id) {
    filters.push('a.employee_id = ?');
    values.push(params.employee_id);
  }

  const whereClause =
    filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  const [countRows] = await pool.query<AttendanceRequestQuery[]>(
    `SELECT COUNT(*) as total 
     FROM attendance_requests a
     ${whereClause}`,
    values,
  );
  const total = countRows[0].total as number;

  const [rows] = await pool.query<AttendanceRequestQuery[]>(
    `SELECT 
      a.id,
      a.employee_id,
      e.name AS employee_name,
      a.request_type,
      a.description,
      a.start_date,
      a.end_date,
      a.latitude,
      a.longitude,
      a.status
     FROM attendance_requests a
     JOIN employees e ON e.id = a.employee_id
     ${whereClause}
     ORDER BY a.start_date DESC, a.id DESC
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

const updateStatusRequest = async (
  input: UpdateStatusRequestInput,
): Promise<IAttendanceRequest> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE attendance_requests 
     SET status = ?, updated_at = NOW() 
     WHERE id = ?`,
    [input.status, input.id],
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, 'Attendance request not found');
  }

  const [rows] = await pool.query<AttendanceRequestQuery[]>(
    'SELECT * FROM attendance_requests WHERE id = ?',
    [input.id],
  );

  return rows[0];
};

export const attendanceService = {
  getAttendances,
  getAttendanceById,
  getAttendanceRequest,
  updateAttendance,
  updateStatusRequest,
};
