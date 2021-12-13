import {PostService} from "../Services/PostService";
import {Request, Response} from "express";
import httpStatus from "http-status";
import {Post} from "../DB/Database";


export class PostController {
    constructor(private readonly service: PostService) {}

    async get(req: Request, res: Response) {
        const id = Number.parseInt(req.params['id']);

        const [status, [user, thread, forum]] = await this.service.get(id);
        res.status(status);
        switch (status) {
            case httpStatus.OK:
                res.json([user, thread, forum]);
                break;
            case httpStatus.NOT_FOUND:
                res.json({message: "Post not found!"});
                break;
            default:
                res.json({message: "Undefined error!"});
                break;
        }
    }

    async update(req: Request, res: Response) {
        const id = Number.parseInt(req.params['id']);
        const post: Post = req.body;

        const [status, updatedPost] = await this.service.update(id, post);
        res.status(status);
        switch (status) {
            case httpStatus.OK:
                res.json(updatedPost);
                break;
            case httpStatus.NOT_FOUND:
                res.json({message: "Post not found!"});
                break;
            default:
                res.json({message: "Undefined error!"});
                break;
        }
    }
}