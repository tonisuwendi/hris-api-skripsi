import pool from '@/config/db.config';
import { ApiError } from '@/utils/ApiError';
import { ResultSetHeader } from 'mysql2';
import { haversineDistance } from '@/utils/haversine';
import {
  ClockInOutInput,
  GetAttendanceHistoryInput,
} from './attendance.schema';
import {
  AttendanceSessionQuery,
  IAttendanceSession,
  OfficeLocationQuery,
} from '@/types/modules';
import { IGetAllResult } from '@/types/general';
import { sanitizePagination } from '@/utils/helpers';

const getAttendanceHistory = async (
  employeeId: number,
  params: GetAttendanceHistoryInput,
): Promise<IGetAllResult<IAttendanceSession>> => {
  const { limit, offset } = sanitizePagination(params.limit, params.page);

  let whereClauses = 'WHERE employee_id = ?';
  const queryParams: (number | string)[] = [employeeId];

  if (params.start_date) {
    whereClauses += ' AND work_date >= ?';
    queryParams.push(params.start_date);
  }
  if (params.end_date) {
    whereClauses += ' AND work_date <= ?';
    queryParams.push(params.end_date);
  }

  const [totalRows] = await pool.query<AttendanceSessionQuery[]>(
    `SELECT COUNT(*) as count FROM attendance_sessions ${whereClauses}`,
    queryParams,
  );
  const total = totalRows[0].count;

  const [rows] = await pool.query<AttendanceSessionQuery[]>(
    `SELECT * FROM attendance_sessions ${whereClauses} ORDER BY work_date DESC, start_time DESC LIMIT ? OFFSET ?`,
    [...queryParams, limit, offset],
  );

  return {
    data: rows,
    pagination: { total, limit, page: params.page ? Number(params.page) : 1 },
  };
};

const clockIn = async (
  input: ClockInOutInput,
  employeeId: number,
): Promise<IAttendanceSession> => {
  const [offices] = await pool.query<OfficeLocationQuery[]>(
    'SELECT id, name, latitude, longitude, radius_meters FROM office_locations',
  );

  const [activeSessions] = await pool.query<AttendanceSessionQuery[]>(
    'SELECT id FROM attendance_sessions WHERE employee_id = ? AND end_time IS NULL',
    [employeeId],
  );
  if (activeSessions.length > 0) {
    throw new ApiError(
      400,
      'You already have an active session. Please clock-out first.',
    );
  }

  let workMode: 'onsite' | 'remote' = 'remote';
  let officeId: number | null = null;
  let officeName: string | null = null;

  for (const office of offices) {
    const distance = haversineDistance(
      input.latitude,
      input.longitude,
      Number(office.latitude),
      Number(office.longitude),
    );
    if (distance <= Number(office.radius_meters)) {
      workMode = 'onsite';
      officeId = office.id;
      officeName = office.name;
      break;
    }
  }

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO attendance_sessions 
      (employee_id, work_date, start_time, work_mode, office_id, office_name, ci_latitude, ci_longitude)
     VALUES (?, CURDATE(), NOW(), ?, ?, ?, ?, ?)`,
    [
      employeeId,
      workMode,
      officeId,
      officeName,
      input.latitude,
      input.longitude,
    ],
  );

  const [rows] = await pool.query<AttendanceSessionQuery[]>(
    'SELECT * FROM attendance_sessions WHERE id = ?',
    [result.insertId],
  );

  return rows[0];
};

const clockOut = async (
  input: ClockInOutInput,
  employeeId: number,
): Promise<IAttendanceSession> => {
  const [activeSessions] = await pool.query<AttendanceSessionQuery[]>(
    `SELECT * FROM attendance_sessions 
     WHERE employee_id = ? AND end_time IS NULL 
     ORDER BY start_time DESC LIMIT 1`,
    [employeeId],
  );

  if (activeSessions.length === 0) {
    throw new ApiError(400, 'No active session found. Please clock-in first.');
  }

  const activeSession = activeSessions[0];

  await pool.query(
    `UPDATE attendance_sessions SET end_time = NOW(), co_latitude = ?, co_longitude = ? WHERE id = ?`,
    [input.latitude, input.longitude, activeSession.id],
  );

  const [updatedRows] = await pool.query<AttendanceSessionQuery[]>(
    'SELECT * FROM attendance_sessions WHERE id = ?',
    [activeSession.id],
  );

  return updatedRows[0];
};

export const attendanceService = {
  getAttendanceHistory,
  clockIn,
  clockOut,
};
