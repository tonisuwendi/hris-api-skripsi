export interface IEmployee {
  id: number;
  employee_code: string;
  photo_url: string;
  name: string;
  email: string;
  position: string;
  status: 'active' | 'inactive';
  joined_at: Date;
  created_at: Date;
}
