import express from "express";
import {UserController} from "../Controllers/UserController";

export function createUserRouter (userController : UserController) {
    const router = express();
    router.post('/:nickname/create', async (req, res) => userController.create(req, res));
    router.patch('/:nickname/profile', async (req, res) => userController.patch(req, res));
    router.get('/:nickname/profile', async (req, res) => userController.get(req, res));
    // router.get('/status', adminController.status);

    return router;
}