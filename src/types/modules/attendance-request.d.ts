import { RowDataPacket } from 'mysql2';

export interface IAttendanceRequest {
  id: number;
  employee_id: number;
  request_type: 'annual_leave' | 'sick' | 'other';
  description: string;
  start_date: Date;
  end_date: Date;
  latitude: string | null;
  longitude: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export type AttendanceRequestQuery = IAttendanceRequest & RowDataPacket;
