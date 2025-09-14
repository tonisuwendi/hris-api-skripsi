import { RowDataPacket } from 'mysql2';

export interface IAttendanceSession {
  id: number;
  employee_id: number;
  work_date: string;
  start_time: string;
  end_time: string;
  work_mode: 'remote' | 'office';
  office_id: number | null;
  office_name: string | null;
  ci_latitude: string | null;
  ci_longitude: string | null;
  co_latitude: string | null;
  co_longitude: string | null;
  created_at: string;
  updated_at: string;
}

export type AttendanceSessionQuery = IAttendanceSession & RowDataPacket;
