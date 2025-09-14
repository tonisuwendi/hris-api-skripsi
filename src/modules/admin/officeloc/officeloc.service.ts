import pool from '@/config/db.config';
import { ResultSetHeader } from 'mysql2';
import { sanitizePagination } from '@/utils/helpers';
import { ApiError } from '@/utils/ApiError';
import { IOfficeLocation, OfficeLocationQuery } from '@/types/modules';
import {
  GetOfficeLocationParams,
  InsertUpdateOfficeLocationBody,
} from './officeloc.schema';

const getOfficeLocation = async (
  params: GetOfficeLocationParams,
): Promise<Partial<IOfficeLocation>[]> => {
  const { limit, offset } = sanitizePagination(params.limit, params.page);

  const sql = `
    SELECT
      id, name, latitude, longitude, radius_meters, created_at
    FROM office_locations
    ORDER BY id DESC
    LIMIT ${offset}, ${limit}
  `;

  const [rows] = await pool.query<OfficeLocationQuery[]>(sql);
  return rows;
};

const insertOfficeLocation = async (
  input: InsertUpdateOfficeLocationBody,
): Promise<Partial<IOfficeLocation>> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO office_locations (name, latitude, longitude, radius_meters)
    VALUES (?, ?, ?, ?)`,
    [input.name, input.latitude, input.longitude, input.radius_meters],
  );

  const [rows] = await pool.query<OfficeLocationQuery[]>(
    'SELECT id, name, latitude, longitude, radius_meters, created_at FROM office_locations WHERE id = ?',
    [result.insertId],
  );

  return rows[0];
};

const updateOfficeLocation = async (
  id: number,
  input: InsertUpdateOfficeLocationBody,
): Promise<Partial<IOfficeLocation>> => {
  const [existing] = await pool.query<OfficeLocationQuery[]>(
    'SELECT id FROM office_locations WHERE id = ?',
    [id],
  );

  if (existing.length === 0) {
    throw new ApiError(404, 'Office location not found');
  }

  await pool.query(
    `UPDATE office_locations
    SET name = ?, latitude = ?, longitude = ?, radius_meters = ?
    WHERE id = ?`,
    [input.name, input.latitude, input.longitude, input.radius_meters, id],
  );

  const [rows] = await pool.query<OfficeLocationQuery[]>(
    'SELECT id, name, latitude, longitude, radius_meters, created_at FROM office_locations WHERE id = ?',
    [id],
  );

  return rows[0];
};

const deleteOfficeLocation = async (
  id: number,
): Promise<Partial<IOfficeLocation>> => {
  const [existing] = await pool.query<OfficeLocationQuery[]>(
    'SELECT id, name, latitude, longitude, radius_meters FROM office_locations WHERE id = ?',
    [id],
  );

  if (existing.length === 0) {
    throw new ApiError(404, 'Office location not found');
  }

  await pool.query('DELETE FROM office_locations WHERE id = ?', [id]);

  return existing[0];
};

export const officeLocationService = {
  getOfficeLocation,
  insertOfficeLocation,
  updateOfficeLocation,
  deleteOfficeLocation,
};
