import { NextFunction, Request, Response } from 'express';
import { employeeService } from './employee.service';
import { ApiError } from '@/utils/ApiError';

const getEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await employeeService.getEmployees(req.query);
    res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(Number(id));
    return res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

const insertEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.file) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new ApiError(400, 'Photo must be JPEG or PNG format');
      }
      if (req.file.size > 2 * 1024 * 1024) {
        throw new ApiError(400, 'Photo size must not exceed 2MB');
      }
    }

    const employee = await employeeService.insertEmployee(req.body, req.file);

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (req.file) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new ApiError(400, 'Photo must be JPEG or PNG format');
      }
      if (req.file.size > 2 * 1024 * 1024) {
        throw new ApiError(400, 'Photo size must not exceed 2MB');
      }
    }

    const employee = await employeeService.updateEmployee(
      Number(id),
      req.body,
      req.file,
    );

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.deleteEmployee(Number(id));
    return res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const employeeController = {
  getEmployees,
  getEmployeeById,
  insertEmployee,
  updateEmployee,
  deleteEmployee,
};
