import {ForumService} from "../Services/ForumService";
import {Request, Response} from "express";
import httpStatus from "http-status";
import {Forum, Thread} from "../DB/Database";


export class ForumController {
    constructor(private readonly service: ForumService) {}

    async create(req: Request, res: Response) {
        const forum: Forum = req.body;
        const [status, createdForum] = await this.service.create(forum);
        res.status(status);
        switch (status) {
            case httpStatus.OK:
                res.json(createdForum);
                break;
            case httpStatus.NOT_FOUND:
                res.json({message: "User not found!"});
                break;
            case httpStatus.CONFLICT:
                res.json({message: "Conflict with another forum!"});
                break;
            default:
                res.json({message: "Undefined error!"});
                break;
        }
    }

    async get(req: Request, res: Response) {
        const slug = req.params['slug'];
        const [status, forum] = await this.service.get(slug);
        res.status(status);
        switch (status) {
            case httpStatus.OK:
                res.json(forum);
                break;
            case httpStatus.NOT_FOUND:
                res.json({message: "Forum not found!"});
                break;
            default:
                res.json({message: "Undefined error!"});
                break;
        }
    }

    async createThread(req: Request, res: Response) {
        const slug = req.params['slug'];
        const thread: Thread = req.body;

        const [status, forum] = await this.service.createThread(slug, thread);
        res.status(status);
        switch (status) {
            case httpStatus.CREATED:
                res.json(forum);
                break;
            case httpStatus.NOT_FOUND:
                res.json({message: "Forum not found!"});
                break;
            case httpStatus.CONFLICT:
                res.json({message: "Conflict with another thread!"});
                break;
            default:
                res.json({message: "Undefined error!"});
                break;
        }
    }

    async getThreads(req: Request, res: Response) {
        const slug = req.params['slug'];

        const [status, threads] = await this.service.getThreads(slug);
        res.status(status);
        switch (status) {
            case httpStatus.OK:
                res.json(threads);
                break;
            case httpStatus.NOT_FOUND:
                res.json({message: "Forum not found!"});
                break;
            default:
                res.json({message: "Undefined error!"});
                break;
        }
    }
}