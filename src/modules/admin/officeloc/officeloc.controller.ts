import { NextFunction, Request, Response } from 'express';
import { officeLocationService } from './officeloc.service';

const getOfficeLocations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const locations = await officeLocationService.getOfficeLocation(req.query);
    res.status(200).json({
      success: true,
      message: 'Office locations retrieved successfully',
      data: locations,
    });
  } catch (error) {
    next(error);
  }
};

const insertOfficeLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const location = await officeLocationService.insertOfficeLocation(req.body);

    return res.status(201).json({
      success: true,
      message: 'Office location created successfully',
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

const updateOfficeLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const location = await officeLocationService.updateOfficeLocation(
      Number(id),
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: 'Office location updated successfully',
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

const deleteOfficeLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const location = await officeLocationService.deleteOfficeLocation(
      Number(id),
    );
    return res.status(200).json({
      success: true,
      message: 'Office location deleted successfully',
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

export const officeLocationController = {
  getOfficeLocations,
  insertOfficeLocation,
  updateOfficeLocation,
  deleteOfficeLocation,
};
