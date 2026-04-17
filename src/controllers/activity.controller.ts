import { Request, Response } from "express";
import { ActivityService } from "../services/activity.service";
import { User } from "../models/user.model";

const service = new ActivityService();

export class ActivityController {

  /**
   * Create Activity
   * POST /activities
   */
 async createActivity(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    // ✅ Fetch full user from DB
    const user = await User.findByPk(userId);

    const fullName = user 
      ? `${user.firstName} ${user.lastName}` 
      : 'Unknown';
    const activity = await service.createActivity({
      ...req.body, // ✅ now frontend sends everything
      createdBy: fullName,
      companyId: (req as any).user?.companyId || 0
    });

    res.status(201).json(activity);

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

  /**
   * Get Activities (Universal)
   * GET /activities/:entityType/:entityId?type=note
   */
 async getActivities(req: Request, res: Response) {
  try {
    const { entityType, entityId, type } = req.query;
    const companyId = (req as any).user?.companyId;

    const activities = await service.getActivities(
      entityType as any,
      entityId as string,
      type as string,
      companyId
    );

    res.json(activities);

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

  /**
   * Get Single Activity
   * GET /activities/detail/:id
   */
  async getActivityById(req: Request, res: Response) {
  try {
    const activity = await service.getActivityById(req.params.id as string);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json(activity);

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
  /**
   * Update Activity
   * PUT /activities/:id
   */
  async updateActivity(req: Request, res: Response) {
    try {
      const updated = await service.updateActivity(
        ( req as any).params.id,
        req.body
      );

      res.json(updated);

    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Delete Activity
   * DELETE /activities/:id
   */
  async deleteActivity(req: Request, res: Response) {
    try {
      await service.deleteActivity(( req as any).params.id);
      res.json({ message: "Activity deleted successfully" });

    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}