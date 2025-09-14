import pool from '@/config/db.config';
import { ApiError } from '@/utils/ApiError';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { IAttendanceSession } from './attendance.types';
import { ClockInOutInput } from './attendance.schema';
import { haversineDistance } from '@/utils/haversine';

type IAttendanceSessionQuery = IAttendanceSession & RowDataPacket;

type ILocationQuery = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
} & RowDataPacket;

const clockIn = async (
  input: ClockInOutInput,
  employeeId: number,
): Promise<IAttendanceSession> => {
  const [offices] = await pool.query<ILocationQuery[]>(
    'SELECT id, name, latitude, longitude, radius_meters FROM office_locations',
  );

  const [activeSessions] = await pool.query<IAttendanceSessionQuery[]>(
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

  const [rows] = await pool.query<IAttendanceSessionQuery[]>(
    'SELECT * FROM attendance_sessions WHERE id = ?',
    [result.insertId],
  );

  return rows[0];
};

const clockOut = async (
  input: ClockInOutInput,
  employeeId: number,
): Promise<IAttendanceSession> => {
  const [activeSessions] = await pool.query<IAttendanceSessionQuery[]>(
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

  const [updatedRows] = await pool.query<IAttendanceSessionQuery[]>(
    'SELECT * FROM attendance_sessions WHERE id = ?',
    [activeSession.id],
  );

  return updatedRows[0];
};

export const attendanceService = {
  clockIn,
  clockOut,
};
