import { RowDataPacket } from 'mysql2';

export interface IAdmin {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export type AdminQuery = IAdmin & RowDataPacket;
