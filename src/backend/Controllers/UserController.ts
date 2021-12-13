import {UserService} from "../Services/UserService";
import {Request, Response} from "express";
import {User} from "../DB/Database";
import httpStatus from "http-status";

export class UserController {
    constructor(private readonly service: UserService) {}

    async create(req: Request, res: Response) {
        const user: User = req.body;
        user['nickname'] = req.params['nickname'];
        const status = await this.service.create(user)
        res.status(status)
        status === httpStatus.OK ? res.json(user) : res.end();
    }

    async patch(req: Request, res: Response) {
        const updatedUser: User = req.body;
        updatedUser['nickname'] = req.params['nickname'];
        const [status, user] = await this.service.update(updatedUser)
        res.status(status);
        switch (status) {
            case httpStatus.OK:
                res.json(user);
                break;
            case httpStatus.NOT_FOUND:
                res.json({message: "User not found!"});
                break;
            case httpStatus.CONFLICT:
                res.json({message: "Conflict with another user!"});
                break;
            default:
                res.json({message: "Undefined error!"});
                break;
        }
    }

    async get(req: Request, res: Response) {
        const nickname = req.params['nickname'];
        const [status, user] = await this.service.get(nickname)
        res.status(status);
        switch (status) {
            case httpStatus.OK:
                res.json(user);
                break;
            case httpStatus.NOT_FOUND:
                res.json({message: "User not found!"});
                break;
            default:
                res.json({message: "Undefined error!"});
                break;
        }
    }
}