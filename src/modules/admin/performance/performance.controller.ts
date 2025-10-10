import { NextFunction, Request, Response } from 'express';
import { performanceService } from './performance.service';

const getPerformance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = req.query;
    const result = await performanceService.getPerformance(params);
    res.status(200).json({
      success: true,
      message: 'Performance reviews retrieved successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getPerformanceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await performanceService.getPerformanceById(Number(id));
    res.status(200).json({
      success: true,
      message: 'Performance review retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const insertPerformance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    const result = await performanceService.insertPerformance(body);
    res.status(201).json({
      success: true,
      message: 'Performance review inserted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updatePerformance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const result = await performanceService.updatePerformance(Number(id), body);
    res.status(200).json({
      success: true,
      message: 'Performance review updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deletePerformance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const location = await performanceService.deletePerformance(Number(id));
    return res.status(200).json({
      success: true,
      message: 'Performance review deleted successfully',
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

export const performanceController = {
  getPerformance,
  getPerformanceById,
  insertPerformance,
  updatePerformance,
  deletePerformance,
};
