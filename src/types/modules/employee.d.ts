import { RowDataPacket } from 'mysql2';

export interface IEmployee {
  id: number;
  employee_code: string;
  name: string;
  email: string;
  password: string;
  photo_url: string | null;
  birth_place: string | null;
  birth_date: string | null;
  gender: 'male' | 'female' | null;
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null;
  religion:
    | 'islam'
    | 'kristen'
    | 'katolik'
    | 'hindu'
    | 'buddha'
    | 'konghucu'
    | null;
  address: string | null;
  city: string | null;
  province: string | null;
  position_id: number;
  salary: number;
  date_joined: string;
  status: 'active' | 'inactive';
  education_level:
    | 'SD'
    | 'SMP'
    | 'SMA'
    | 'D1'
    | 'D2'
    | 'D3'
    | 'D4'
    | 'S1'
    | 'S2'
    | 'S3'
    | null;
  major: string | null;
  institution: string | null;
  graduation_year: number | null;
  created_at: string;
  updated_at: string;
}

export type EmployeeQuery = IEmployee & RowDataPacket;
