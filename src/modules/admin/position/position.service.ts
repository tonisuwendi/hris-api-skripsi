import pool from '@/config/db.config';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { sanitizePagination } from '@/utils/helpers';
import { ApiError } from '@/utils/ApiError';
import { IPosition } from './position.types';
import {
  GetPositionsParams,
  InsertUpdatePositionBody,
} from './position.schema';

type IPositionQuery = IPosition & RowDataPacket;

const getPositions = async (
  params: GetPositionsParams,
): Promise<Partial<IPosition>[]> => {
  const { limit, offset } = sanitizePagination(params.limit, params.page);

  const sql = `
    SELECT
      p.id,
      p.name,
      p.description,
      p.created_at,
      COUNT(e.id) AS employee_count
    FROM positions p
    LEFT JOIN employees e ON e.position_id = p.id
    GROUP BY p.id
    ORDER BY p.id DESC
    LIMIT ${offset}, ${limit}
  `;

  const [rows] = await pool.query<IPositionQuery[]>(sql);
  return rows;
};

const insertPosition = async (
  input: InsertUpdatePositionBody,
): Promise<Partial<IPosition>> => {
  const [existing] = await pool.query<IPositionQuery[]>(
    'SELECT id FROM positions WHERE name = ?',
    [input.name],
  );

  if (existing.length > 0) {
    throw new ApiError(400, 'Position already exists');
  }

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO positions (name, description)
    VALUES (?, ?)`,
    [input.name, input.description],
  );

  const [rows] = await pool.query<IPositionQuery[]>(
    'SELECT id, name, description, created_at FROM positions WHERE id = ?',
    [result.insertId],
  );

  return rows[0];
};

const updatePosition = async (
  id: number,
  input: InsertUpdatePositionBody,
): Promise<Partial<IPosition>> => {
  const [existing] = await pool.query<IPositionQuery[]>(
    'SELECT id, name, description FROM positions WHERE id = ?',
    [id],
  );

  if (existing.length === 0) {
    throw new ApiError(404, 'Position not found');
  }

  if (input.name !== existing[0].name) {
    const [nameCheck] = await pool.query<IPositionQuery[]>(
      'SELECT id FROM positions WHERE name = ? AND id != ?',
      [input.name, id],
    );

    if (nameCheck.length > 0) {
      throw new ApiError(400, 'Position name already in use');
    }
  }

  await pool.query(
    `UPDATE positions
    SET name = ?, description = ?
    WHERE id = ?`,
    [input.name, input.description, id],
  );

  const [rows] = await pool.query<IPositionQuery[]>(
    'SELECT id, name, description, created_at FROM positions WHERE id = ?',
    [id],
  );

  return rows[0];
};

const deletePosition = async (id: number): Promise<Partial<IPosition>> => {
  const [existing] = await pool.query<IPositionQuery[]>(
    'SELECT id, name, description FROM positions WHERE id = ?',
    [id],
  );

  if (existing.length === 0) {
    throw new ApiError(404, 'Position not found');
  }

  const [employeeCheck] = await pool.query<IPositionQuery[]>(
    'SELECT id FROM employees WHERE position_id = ?',
    [id],
  );

  if (employeeCheck.length > 0) {
    throw new ApiError(
      400,
      'Cannot delete position with assigned employees. Reassign or remove employees first.',
    );
  }

  await pool.query('DELETE FROM positions WHERE id = ?', [id]);

  return existing[0];
};

export const positionService = {
  getPositions,
  insertPosition,
  updatePosition,
  deletePosition,
};
