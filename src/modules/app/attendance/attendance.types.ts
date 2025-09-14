export interface IAttendanceSession {
  id: number;
  employee_id: number;
  work_date: string;
  start_time: string;
  end_time: string | null;
  work_mode: 'onsite' | 'remote';
  office_id: number | null;
  office_name: string | null;
  ci_latitude: string;
  ci_longitude: string;
  co_latitude: string | null;
  co_longitude: string | null;
  created_at: string;
  updated_at: string;
}
