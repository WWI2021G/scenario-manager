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

    try {
  async redoDB(_req: Request, res: Response) {
    try {
      const message = await dbService.redoDB();
      res.status(200).send(message);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}

export const dbController = new DBController();
