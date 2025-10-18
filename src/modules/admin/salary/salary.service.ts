import axios from 'axios';
import pool from '@/config/db.config';
import { sanitizePagination } from '@/utils/helpers';
import { IGetAllResult } from '@/types/general';
import {
  GetSalaryRecommendationDetailParams,
  GetSalaryRecommendationsParams,
} from './salary.schema';
import {
  ISalaryRecommendation,
  SalaryRecommendationQuery,
} from '@/types/modules/salary';
import envConfig from '@/config/env.config';
import { ApiError } from '@/utils/ApiError';

const getSalaryRecommendations = async (
  params: GetSalaryRecommendationsParams,
): Promise<IGetAllResult<Partial<ISalaryRecommendation>>> => {
  const { limit, offset } = sanitizePagination(params.limit, params.page);

  const now = new Date();
  const month = params.month ?? now.getMonth() + 1;
  const year = params.year ?? now.getFullYear();

  // get list of employee IDs who have attendance, tasks, or performance in the specified month/year
  const [employeeIds] = await pool.query<SalaryRecommendationQuery[]>(
    `
    SELECT DISTINCT e.id AS employee_id
    FROM employees e
    LEFT JOIN attendance_sessions a 
      ON e.id = a.employee_id 
      AND MONTH(a.work_date) = ? AND YEAR(a.work_date) = ?
    LEFT JOIN task_summaries t 
      ON e.id = t.employee_id 
      AND MONTH(t.period_start) <= ? AND MONTH(t.period_end) >= ?
      AND YEAR(t.period_start) <= ? AND YEAR(t.period_end) >= ?
    LEFT JOIN performance_reviews pr 
      ON e.id = pr.employee_id 
      AND MONTH(pr.period_start) <= ? AND MONTH(pr.period_end) >= ?
      AND YEAR(pr.period_start) <= ? AND YEAR(pr.period_end) >= ?
    WHERE e.status = 'active'
      AND (a.id IS NOT NULL OR t.id IS NOT NULL OR pr.id IS NOT NULL)
    `,
    [
      // attendance
      month,
      year,
      // task overlap
      month,
      month,
      year,
      year,
      // performance overlap
      month,
      month,
      year,
      year,
    ],
  );

  const total = employeeIds.length;

  const paginationResponse = {
    total,
    limit,
    page: params.page ? Number(params.page) : 1,
  };

  if (total === 0) {
    return {
      data: [],
      pagination: paginationResponse,
    };
  }

  // get paginated subset of employee IDs
  const employeeIdSubset = employeeIds
    .slice(offset, offset + limit)
    .map((r) => r.employee_id);

  if (employeeIdSubset.length === 0) {
    return {
      data: [],
      pagination: paginationResponse,
    };
  }

  const idPlaceholders = employeeIdSubset.map(() => '?').join(',');

  const [rows] = await pool.query<SalaryRecommendationQuery[]>(
    `
  SELECT 
    e.id AS employee_id,
    e.name AS employee_name,
    p.name AS job_position,
    e.email,
    CAST(e.salary AS FLOAT) AS actual_salary,
    COALESCE(FLOOR(DATEDIFF(CURDATE(), e.date_joined) / 365), 0) AS years_of_service,
    COUNT(DISTINCT a.id) AS attendance_count,
    CASE 
      WHEN (SUM(a.work_mode = 'remote') / NULLIF(COUNT(a.id), 0)) >= 0.9 THEN 'Remote'
      WHEN (SUM(a.work_mode = 'remote') / NULLIF(COUNT(a.id), 0)) <= 0.1 THEN 'WFO'
      ELSE 'Hybrid'
    END AS work_mode,
    CAST(
      COALESCE(SUM(
        CASE 
          WHEN MONTH(t.period_start) <= ? AND MONTH(t.period_end) >= ? 
            AND YEAR(t.period_start) <= ? AND YEAR(t.period_end) >= ? 
          THEN t.completed_tasks ELSE 0 
        END
      ), 0) AS SIGNED
    ) AS project_completed,
    CAST(
      COALESCE(AVG(
        CASE 
          WHEN MONTH(pr.period_start) <= ? AND MONTH(pr.period_end) >= ? 
            AND YEAR(pr.period_start) <= ? AND YEAR(pr.period_end) >= ? 
          THEN pr.overall_score ELSE NULL 
        END
      ) * 10, 0) AS SIGNED
    ) AS performance_score
  FROM employees e
  LEFT JOIN positions p ON e.position_id = p.id
  LEFT JOIN attendance_sessions a 
    ON e.id = a.employee_id 
    AND MONTH(a.work_date) = ? AND YEAR(a.work_date) = ?
  LEFT JOIN task_summaries t 
    ON e.id = t.employee_id 
    AND MONTH(t.period_start) <= ? AND MONTH(t.period_end) >= ?
    AND YEAR(t.period_start) <= ? AND YEAR(t.period_end) >= ?
  LEFT JOIN performance_reviews pr 
    ON e.id = pr.employee_id 
    AND MONTH(pr.period_start) <= ? AND MONTH(pr.period_end) >= ?
    AND YEAR(pr.period_start) <= ? AND YEAR(pr.period_end) >= ?
  WHERE e.id IN (${idPlaceholders})
  GROUP BY e.id
  ORDER BY e.name ASC
  `,
    [
      // for CASE project_completed
      month,
      month,
      year,
      year,
      // for CASE performance_score
      month,
      month,
      year,
      year,
      // for attendance
      month,
      year,
      // for task join
      month,
      month,
      year,
      year,
      // for performance join
      month,
      month,
      year,
      year,
      // expand id array
      ...employeeIdSubset,
    ],
  );

  if (!rows || rows.length === 0) {
    return {
      data: [],
      pagination: paginationResponse,
    };
  }

  try {
    const mlPayload = rows.map((emp) => ({
      attendance_count: emp.attendance_count ?? 0,
      project_completed: emp.project_completed ?? 0,
      work_mode: emp.work_mode ?? 'Hybrid',
      years_of_service: emp.years_of_service ?? 0,
      job_position: emp.job_position ?? 'Technician',
      performance_score: emp.performance_score ? emp.performance_score * 10 : 0,
    }));

    const mlResponse = await axios.post(
      `${envConfig.mlApiUrl}/predict`,
      mlPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': envConfig.mlApiKey,
        },
        timeout: 10000,
      },
    );

    const predictions = mlResponse?.data?.predicted_salary || [];

    const mergedData = rows.map((emp, idx) => ({
      employee_id: emp.employee_id,
      employee_name: emp.employee_name,
      job_position: emp.job_position,
      email: emp.email,
      actual_salary: emp.actual_salary,
      predicted_salary: Math.floor(predictions[idx] ?? 0),
      salary_difference:
        predictions[idx] && emp.actual_salary
          ? Math.floor(predictions[idx] - emp.actual_salary)
          : null,
    }));

    return {
      data: mergedData,
      pagination: paginationResponse,
    };
  } catch (err) {
    console.error('Error calling ML API:', err);
    return {
      data: rows.map((emp) => ({
        employee_id: emp.employee_id,
        employee_name: emp.employee_name,
        job_position: emp.job_position,
        email: emp.email,
        actual_salary: emp.actual_salary,
        predicted_salary: null,
        salary_difference: null,
      })),
      pagination: {
        total,
        limit,
        page: params.page ? Number(params.page) : 1,
      },
    };
  }
};

const getSalaryRecommendationDetail = async (
  employeeId: number,
  params: GetSalaryRecommendationDetailParams,
): Promise<any> => {
  const now = new Date();
  const month = params.month ?? now.getMonth() + 1;
  const year = params.year ?? now.getFullYear();

  const [rows] = await pool.query<any[]>(
    `
    SELECT 
      e.id AS employee_id,
      e.name AS employee_name,
      p.name AS job_position,
      e.email,
      CAST(e.salary AS FLOAT) AS actual_salary,
      COALESCE(FLOOR(DATEDIFF(CURDATE(), e.date_joined) / 365), 0) AS years_of_service,
      COUNT(DISTINCT a.id) AS attendance_count,
      CASE 
        WHEN (SUM(a.work_mode = 'remote') / NULLIF(COUNT(a.id), 0)) >= 0.9 THEN 'Remote'
        WHEN (SUM(a.work_mode = 'remote') / NULLIF(COUNT(a.id), 0)) <= 0.1 THEN 'WFO'
        ELSE 'Hybrid'
      END AS work_mode,
      CAST(
        COALESCE(SUM(
          CASE 
            WHEN t.period_start <= LAST_DAY(CONCAT(?, '-', ?, '-01')) 
            AND t.period_end >= CONCAT(?, '-', ?, '-01')
            THEN t.completed_tasks ELSE 0 
          END
        ), 0) AS SIGNED
      ) AS project_completed,
      CAST(
        COALESCE(AVG(
          CASE 
            WHEN pr.period_start <= LAST_DAY(CONCAT(?, '-', ?, '-01')) 
            AND pr.period_end >= CONCAT(?, '-', ?, '-01')
            THEN pr.overall_score ELSE NULL
          END
        ) * 10, 0) AS SIGNED
      ) AS performance_score
    FROM employees e
    LEFT JOIN positions p ON e.position_id = p.id
    LEFT JOIN attendance_sessions a 
      ON e.id = a.employee_id 
      AND MONTH(a.work_date) = ? 
      AND YEAR(a.work_date) = ?
    LEFT JOIN task_summaries t ON e.id = t.employee_id
    LEFT JOIN performance_reviews pr ON e.id = pr.employee_id
    WHERE e.id = ?
    GROUP BY e.id
    `,
    [
      year,
      month,
      year,
      month,
      year,
      month,
      year,
      month,
      month,
      year,
      employeeId,
    ],
  );

  if (!rows || rows.length === 0) {
    throw new ApiError(
      404,
      'Employee not found or no activity in selected period',
    );
  }

  const emp = rows[0];

  const mlInput = {
    attendance_count: emp.attendance_count ?? 0,
    project_completed: emp.project_completed ?? 0,
    work_mode: emp.work_mode ?? 'Hybrid',
    years_of_service: emp.years_of_service ?? 0,
    job_position: emp.job_position ?? 'Technician',
    performance_score: emp.performance_score ? emp.performance_score * 10 : 0,
  };

  const insightRes = await axios.post(
    `${envConfig.mlApiUrl}/insight`,
    mlInput,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': envConfig.mlApiKey,
      },
      timeout: 10000,
    },
  );

  const insightData = insightRes?.data;

  return {
    employee_id: emp.employee_id,
    employee_name: emp.employee_name,
    job_position: emp.job_position,
    email: emp.email,
    actual_salary: emp.actual_salary,
    predicted_salary: Math.floor(insightData?.predicted_salary ?? 0),
    salary_difference:
      insightData?.predicted_salary && emp.actual_salary
        ? Math.floor(insightData?.predicted_salary - emp.actual_salary)
        : null,
    details: mlInput,
    insights: insightData?.feature_influence || [],
  };
};

export const salaryService = {
  getSalaryRecommendations,
  getSalaryRecommendationDetail,
};
