import {AdminService} from "../Services/AdminService";
import {Request, Response} from "express";
import httpStatus from "http-status";


export class AdminController {
    constructor(private readonly service: AdminService) {}

    async dropAll(req: Request, res: Response) {
        await this.service.dropAll();
        res.status(httpStatus.OK).json({message: 'Completed'});
    }

    async status(req: Request, res: Response) {
        res.status(httpStatus.OK).json(await this.service.status());
    }
}