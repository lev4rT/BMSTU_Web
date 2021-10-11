import express from "express";
import {ForumController} from "../Controllers/ForumController";

export function createForumRouter (forumController : ForumController) {
    const router = express();
    router.post('/create', async (req, res) => forumController.create(req, res));
    router.get('/:slug/details', async (req, res) => forumController.get(req, res));
    router.post('/:slug/create', async (req, res) => forumController.createThread(req, res));
    router.get('/:slug/threads', async (req, res) => forumController.getThreads(req, res));

    return router;
}