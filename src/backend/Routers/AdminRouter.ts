import express from "express";
import {AdminController} from "../Controllers/AdminController";

export function createAdminRouter (adminController : AdminController) {
    const router = express();

    /**
     * @openapi
     * /service/sss:
     *   post:
     *     summary: Очистка всех данных в базе
     *     description: Безвозвратное удаление всей пользовательской информации из базы данных.
     *     operationId: clear
     *     consumes:
     *       - application/json
     *       - application/octet-stream
     *     responses:
     *       200:
     *         description: Очистка базы успешно завершена
     */
    router.post('/clear', async (req, res) => adminController.dropAll(req, res));

    /**
     * @openapi
     * /service/status:
     *   get:
     *     summary: Получение информации о базе данных
     *     description: Получение информации о базе данных.
     *     operationId: status
     *     consumes:
     *       - application/json
     *       - application/octet-stream
     *     responses:
     *       200:
     *         description: Кол-во записей в базе данных, включая помеченные как "удалённые".
     *         schema:
     *           $ref: '#/components/schemas/Status'
     */
    router.get('/status', async (req, res) => adminController.status(req, res));

    return router;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Error:
 *       description: Информация об ошибке
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Текстовое описание ошибки. В процессе проверки API никаких проверок на содерижимое данного описание не делается.
 *           example: Can't find user with id #42
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Status:
 *       description: Информации о статусе всего форума
 *       type: object
 *       properties:
 *         user:
 *           type: number
 *           format: int32
 *           description: Кол-во пользователей в базе данных.
 *           example: 1000
 *           x-isnullable: false
 *         forum:
 *           type: number
 *           format: int32
 *           description: Кол-во разделов в базе данных.
 *           example: 100
 *           x-isnullable: false
 *         thread:
 *           type: number
 *           format: int32
 *           description: Кол-во веток обсуждения в базе данных.
 *           example: 1000
 *           x-isnullable: false
 *       required:
 *         - user
 *         - forum
 *         - thread
 *         - post
 */