import { RowDataPacket } from 'mysql2';

export interface ITaskSummary {
  id: number;
  employee_id: number;
  period_start: string;
  period_end: string;
  completed_tasks: number;
  created_at: string;
}

export type TaskSummaryQuery = ITaskSummary & RowDataPacket;
