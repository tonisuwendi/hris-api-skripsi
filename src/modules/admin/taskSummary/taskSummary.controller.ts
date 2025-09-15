import { NextFunction, Request, Response } from 'express';
import { taskSummaryService } from './taskSummary.service';

const getTaskSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = req.query;
    const result = await taskSummaryService.getTaskSummary(params);
    res.status(200).json({
      success: true,
      message: 'Task summary retrieved successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const insertTaskSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    const result = await taskSummaryService.insertTaskSummary(body);
    res.status(201).json({
      success: true,
      message: 'Task summary inserted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateTaskSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await taskSummaryService.updateTaskSummary(
      req.params.id ? Number(req.params.id) : 0,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: 'Task summary updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTaskSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await taskSummaryService.deleteTaskSummary(
      req.params.id ? Number(req.params.id) : 0,
    );
    res.status(200).json({
      success: true,
      message: 'Task summary deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const taskSummaryController = {
  getTaskSummary,
  insertTaskSummary,
  updateTaskSummary,
  deleteTaskSummary,
};
