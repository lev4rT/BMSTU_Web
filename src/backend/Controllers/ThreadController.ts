import {ThreadService} from "../Services/ThreadService";
import {Request, Response} from "express";
import httpStatus from "http-status";
import {Post, Thread, Vote} from "../DB/Database";


export class ThreadController {
    constructor(private readonly service: ThreadService) {}

    async createPost(req: Request, res: Response) {
        const id = Number.parseInt(req.params['id']);

        const post: Post = req.body;
        const [status, newPost] = await this.service.createPost(id, post);
        res.status(status);

        switch (status) {
            case httpStatus.CREATED:
                res.json(newPost);
                break;
            case httpStatus.NOT_FOUND:
                res.json({message: "Thread not found!"});
                break;
            default:
                res.json({message: "Undefined error!"});
                break;
        }
    }

    async getInfo(req: Request, res: Response) {
        const id = Number.parseInt(req.params['id']);

        const [status, thread] = await this.service.getInfo(id);
        res.status(status);
        switch (status) {
            case httpStatus.OK:
                res.json(thread);
                break;
            case httpStatus.NOT_FOUND:
                res.json({message: "Thread not found!"});
                break;
            default:
                res.json({message: "Undefined error!"});
                break;
        }
    }

    async updateThread(req: Request, res: Response) {
        const id = Number.parseInt(req.params['id']);

        const thread: Thread = req.body;
        const [status, newThread] = await this.service.updateThread(id, thread);
        res.status(status);

        switch (status) {
            case httpStatus.OK:
                res.json(newThread);
                break;
            case httpStatus.NOT_FOUND:
                res.json({message: "Thread not found!"});
                break;
            default:
                res.json({message: "Undefined error!"});
                break;
        }
    }

    async getPosts(req: Request, res: Response) {
        const threadID = Number.parseInt(req.params['id']);

        const [status, posts] = await this.service.getPosts(threadID);
        res.status(status);

        switch (status) {
            case httpStatus.OK:
                res.json(posts);
                break;
            case httpStatus.NOT_FOUND:
                res.json({message: "Thread not found!"});
                break;
            default:
                res.json({message: "Undefined error!"});
                break;
        }
    }
    async vote(req: Request, res: Response) {
        const threadID = Number.parseInt(req.params['id']);
        const vote: Vote = req.body;

        const status = await this.service.vote(threadID, vote);
        res.status(status);

        switch (status) {
            case httpStatus.OK:
                res.json({message: "Successfully voted!"});
                break;
            case httpStatus.NOT_FOUND:
                res.json({message: "Thread not found!"});
                break;
            default:
                res.json({message: "Undefined error!"});
                break;
        }
    }
}