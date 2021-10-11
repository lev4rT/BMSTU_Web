import express from "express";
import {ThreadController} from "../Controllers/ThreadController";

export function createThreadRouter (threadController : ThreadController) {
    const router = express();
    router.post('/:id/create', async (req, res) => threadController.createPost(req, res));
    router.get('/:id/details', async (req, res) => threadController.getInfo(req, res));
    router.post('/:id/details', async (req, res) => threadController.updateThread(req, res));
    router.get('/:id/posts', async (req, res) => threadController.getPosts(req, res));
    router.post('/:id/vote', async (req, res) => threadController.vote(req, res));

    return router;
}