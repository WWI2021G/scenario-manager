import { dbService } from "../services/dbService";
import { Request, Response } from "express";

class DBController {
  setupDB(_req: Request, res: Response) {
  }

  async getCurTime(_req: Request, res: Response) {
    try {
      const currentTime = await dbService.getCurTime();
      console.log("Success");
      res.status(200).json({currentTime: currentTime});
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}

export const dbController = new DBController();
