import { NextFunction, Request, Response } from 'express';
import { positionService } from './position.service';

const getPositions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const positions = await positionService.getPositions(req.query);
    res.status(200).json({
      success: true,
      message: 'Positions retrieved successfully',
      data: positions,
    });
  } catch (error) {
    next(error);
  }
};

const insertPosition = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const position = await positionService.insertPosition(req.body);

    return res.status(201).json({
      success: true,
      message: 'Position created successfully',
      data: position,
    });
  } catch (error) {
    next(error);
  }
};

const updatePosition = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const position = await positionService.updatePosition(Number(id), req.body);

    return res.status(200).json({
      success: true,
      message: 'Position updated successfully',
      data: position,
    });
  } catch (error) {
    next(error);
  }
};

const deletePosition = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await positionService.deletePosition(Number(id));
    return res.status(200).json({
      success: true,
      message: 'Position deleted successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const positionController = {
  getPositions,
  insertPosition,
  updatePosition,
  deletePosition,
};
