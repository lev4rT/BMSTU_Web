import express from "express";
import {PostController} from "../Controllers/PostController";

export function createPostRouter (postController : PostController) {
    const router = express();
    router.get('/:id/details', async (req, res) => postController.get(req, res));
    router.post('/:id/details', async (req, res) => postController.update(req, res));

    return router;
}