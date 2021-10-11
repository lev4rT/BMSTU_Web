import express from "express";
import {AdminController} from "../Controllers/AdminController";

export function createAdminRouter (adminController : AdminController) {
    const router = express();
    router.post('/clear', async (req, res) => adminController.dropAll(req, res));
    router.get('/status', async (req, res) => adminController.status(req, res));

    return router;
}