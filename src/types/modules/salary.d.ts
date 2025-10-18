import { RowDataPacket } from 'mysql2';

export interface ISalaryRecommendation {
  employee_id: number;
  employee_name: string;
  job_position: string;
  date_joined: string;
  email: string;
  actual_salary: number;
  years_of_service: number;
  attendance_count: number;
  work_mode: 'Remote' | 'WFO' | 'Hybrid';
  project_completed: number;
  performance_score: number;
  predicted_salary: number | null;
  difference: number | null;
}

export type SalaryRecommendationQuery = ISalaryRecommendation & RowDataPacket;
