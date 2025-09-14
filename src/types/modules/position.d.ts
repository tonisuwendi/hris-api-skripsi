import { RowDataPacket } from 'mysql2';

export interface IPosition {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export type PositionQuery = IPosition & RowDataPacket;
