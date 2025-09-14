import { RowDataPacket } from 'mysql2';

export interface IOfficeLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  created_at: string;
}

export type OfficeLocationQuery = IOfficeLocation & RowDataPacket;
