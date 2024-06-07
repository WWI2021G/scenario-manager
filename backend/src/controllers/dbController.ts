import { dbService } from "../services/dbService";
import { Request, Response } from "express";

class DBController {
  async setupDB(_req: Request, res: Response) {
    try {
      const message = await dbService.setupDB();
      res.status(200).send(message);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async getCurTime(_req: Request, res: Response) {
    try {
      const currentTime = await dbService.getCurTime();
      res.status(200).json({ currentTime: currentTime });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}

export const dbController = new DBController();
