import pool from '@/config/db.config';
import bcryptjs from 'bcryptjs';
import { ResultSetHeader } from 'mysql2';
import { sanitizePagination } from '@/utils/helpers';
import { ApiError } from '@/utils/ApiError';
import { randomUUID } from 'crypto';
import { uploadFile } from '@/utils/s3';
import { EmployeeQuery, IEmployee } from '@/types/modules';
import {
  GetEmployeesParams,
  InsertEmployeeBody,
  UpdateEmployeeBody,
} from './employee.schema';
import { IGetAllResult } from '@/types/general';

const getEmployees = async (
  params: GetEmployeesParams,
): Promise<IGetAllResult<IEmployee>> => {
  const { limit, offset } = sanitizePagination(params.limit, params.page);

  const [countRows] = await pool.query<EmployeeQuery[]>(
    'SELECT COUNT(*) as total FROM employees',
  );

  const total = countRows[0].total as number;

  const sql = `
    SELECT 
      e.id,
      e.employee_code,
      IFNULL(e.photo_url, '') AS photo_url,
      e.name,
      e.email,
      p.name AS position,
      e.status,
      e.date_joined,
      e.created_at
    FROM employees e
    LEFT JOIN positions p ON e.position_id = p.id
    ORDER BY e.id DESC
    LIMIT ${offset}, ${limit}
  `;

  const [rows] = await pool.query<EmployeeQuery[]>(sql);

  return {
    data: rows,
    pagination: { total, limit, page: params.page ? Number(params.page) : 1 },
  };
};

const getEmployeeById = async (id: number): Promise<Partial<IEmployee>> => {
  const [rows] = await pool.query<EmployeeQuery[]>(
    'SELECT * FROM employees WHERE id = ?',
    [id],
  );

  if (rows.length === 0) {
    throw new ApiError(404, 'Employee not found');
  }

  const withoutPassword = rows.map((row) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = row;
    return rest;
  });

  return withoutPassword[0];
};

const insertEmployee = async (
  input: InsertEmployeeBody,
  file: Express.Multer.File | undefined,
): Promise<Partial<IEmployee>> => {
  const [existingCode] = await pool.query<EmployeeQuery[]>(
    'SELECT id FROM employees WHERE employee_code = ?',
    [input.employee_code],
  );

  if (existingCode.length > 0) {
    throw new ApiError(400, 'Employee code already exists');
  }

  const [existingEmail] = await pool.query<EmployeeQuery[]>(
    'SELECT id FROM employees WHERE email = ?',
    [input.email],
  );

  if (existingEmail.length > 0) {
    throw new ApiError(400, 'Email already exists');
  }

  const [checkPosition] = await pool.query<EmployeeQuery[]>(
    'SELECT id FROM positions WHERE id = ?',
    [input.position_id],
  );

  if (checkPosition.length === 0) {
    throw new ApiError(400, 'Position not found');
  }

  const passwordHash = await bcryptjs.hash(input.password, 10);

  let photoUrl = '';

  if (file) {
    const ext = file.mimetype === 'image/png' ? 'png' : 'jpg';
    const key = `employee/${randomUUID()}.${ext}`;
    photoUrl = await uploadFile(file.buffer, key, file.mimetype);
  }

  await pool.query<ResultSetHeader>(
    `INSERT INTO employees (employee_code, name, email, password, photo_url, birth_place, birth_date, gender, marital_status, religion, address, city, province, position_id, salary, date_joined, status, education_level, major, institution, graduation_year)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.employee_code,
      input.name,
      input.email,
      passwordHash,
      photoUrl,
      input.birth_place,
      input.birth_date,
      input.gender,
      input.marital_status,
      input.religion,
      input.address,
      input.city,
      input.province,
      input.position_id,
      input.salary,
      input.date_joined,
      input.status,
      input.education_level,
      input.major,
      input.institution,
      input.graduation_year,
    ],
  );

  const [rows] = await pool.query<EmployeeQuery[]>(
    'SELECT id, employee_code, name, email, photo_url FROM employees WHERE employee_code = ?',
    [input.employee_code],
  );

  return rows[0];
};

const updateEmployee = async (
  id: number,
  input: UpdateEmployeeBody,
  file: Express.Multer.File | undefined,
): Promise<Partial<IEmployee>> => {
  const [existing] = await pool.query<EmployeeQuery[]>(
    'SELECT id, employee_code, email, photo_url, password FROM employees WHERE id = ?',
    [id],
  );

  if (existing.length === 0) {
    throw new ApiError(404, 'Employee not found');
  }

  if (input.employee_code !== existing[0].employee_code) {
    const [existingCode] = await pool.query<EmployeeQuery[]>(
      'SELECT id FROM employees WHERE employee_code = ?',
      [input.employee_code],
    );

    if (existingCode.length > 0) {
      throw new ApiError(400, 'Employee code already exists');
    }
  }

  if (input.email !== existing[0].email) {
    const [existingEmail] = await pool.query<EmployeeQuery[]>(
      'SELECT id FROM employees WHERE email = ?',
      [input.email],
    );

    if (existingEmail.length > 0) {
      throw new ApiError(400, 'Email already exists');
    }
  }

  const [checkPosition] = await pool.query<EmployeeQuery[]>(
    'SELECT id FROM positions WHERE id = ?',
    [input.position_id],
  );

  if (checkPosition.length === 0) {
    throw new ApiError(400, 'Position not found');
  }

  let passwordHash = existing[0].password;
  if (input.password && input.password.trim() !== '') {
    passwordHash = await bcryptjs.hash(input.password, 10);
  }

  let photoUrl = existing[0].photo_url;
  if (file) {
    const ext = file.mimetype === 'image/png' ? 'png' : 'jpg';
    const key = `employee/${randomUUID()}.${ext}`;
    photoUrl = await uploadFile(file.buffer, key, file.mimetype);
  }

  await pool.query(
    `UPDATE employees SET 
      employee_code = ?, 
      name = ?, 
      email = ?, 
      password = ?, 
      photo_url = ?, 
      birth_place = ?, 
      birth_date = ?,
      gender = ?, 
      marital_status = ?, 
      religion = ?, 
      address = ?, 
      city = ?, 
      province = ?, 
      position_id = ?, 
      salary = ?, 
      date_joined = ?, 
      status = ?, 
      education_level = ?, 
      major = ?, 
      institution = ?, 
      graduation_year = ?
    WHERE id = ?`,
    [
      input.employee_code,
      input.name,
      input.email,
      passwordHash,
      photoUrl,
      input.birth_place,
      input.birth_date,
      input.gender,
      input.marital_status,
      input.religion,
      input.address,
      input.city,
      input.province,
      input.position_id,
      input.salary,
      input.date_joined,
      input.status,
      input.education_level,
      input.major,
      input.institution,
      input.graduation_year,
      id,
    ],
  );

  const [rows] = await pool.query<EmployeeQuery[]>(
    'SELECT id, employee_code, name, email, photo_url FROM employees WHERE employee_code = ?',
    [input.employee_code],
  );

  return rows[0];
};

const deleteEmployee = async (id: number): Promise<Partial<IEmployee>> => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existing] = await connection.query<EmployeeQuery[]>(
      'SELECT id, employee_code, name, email FROM employees WHERE id = ?',
      [id],
    );

    if (existing.length === 0) {
      throw new ApiError(404, 'Employee not found');
    }

    await connection.query('DELETE FROM task_summaries WHERE employee_id = ?', [
      id,
    ]);

    await connection.query('DELETE FROM employees WHERE id = ?', [id]);

    await connection.commit();

    return existing[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const employeeService = {
  getEmployees,
  getEmployeeById,
  insertEmployee,
  updateEmployee,
  deleteEmployee,
};
