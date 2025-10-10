import { RowDataPacket } from 'mysql2';

export interface IPerformance {
  id: number;
  employee_id: number;
  period_start: string;
  period_end: string;
  productivity_score: number;
  quality_score: number;
  discipline_score: number;
  softskill_score: number;
  overall_score: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type PerformanceQuery = IPerformance & RowDataPacket;
