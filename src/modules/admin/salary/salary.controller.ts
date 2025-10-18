import { NextFunction, Request, Response } from 'express';
import { salaryService } from './salary.service';

const getSalaryRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = req.query;
    const recommendations =
      await salaryService.getSalaryRecommendations(params);
    res.status(200).json({
      success: true,
      message: 'Salary recommendations retrieved successfully',
      ...recommendations,
    });
  } catch (error) {
    next(error);
  }
};

const getSalaryRecommendationDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { employeeId } = req.params;
    const params = req.query;
    const recommendationDetail =
      await salaryService.getSalaryRecommendationDetail(
        Number(employeeId),
        params,
      );
    res.status(200).json({
      success: true,
      message: 'Salary recommendation detail retrieved successfully',
      data: recommendationDetail,
    });
  } catch (error) {
    next(error);
  }
};

export const salaryController = {
  getSalaryRecommendations,
  getSalaryRecommendationDetail,
};
