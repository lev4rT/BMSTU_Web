import express from "express";
import {UserController} from "../Controllers/UserController";


export function createUserRouter (userController : UserController) {
    const router = express();

    /**
     * @openapi
     * /user/{nickname}:
     *   post:
     *     summary: Создание нового пользователя
     *     description: Создание нового пользователя в базе данных.
     *     operationId: userCreate
     *     parameters:
     *       - name: nickname
     *         in: path
     *         description: Идентификатор пользователя.
     *         required: true
     *         type: string
     *       - name: profile
     *         in: body
     *         description: Данные пользовательского профиля.
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/User'
     *     responses:
     *       201:
     *         description: Пользователь успешно создан. Возвращает данные созданного пользователя.
     *         schema:
     *           $ref: '#/components/schemas/User'
     *       409:
     *         description: Пользователь уже присутсвует в базе данных.
     */
    router.post('/:nickname', async (req, res) => userController.create(req, res));

    /**
     * @openapi
     * /user/{nickname}:
     *   get:
     *     summary: Получение информации о пользователе
     *     description: Получение информации о пользователе форума по его имени.
     *     consumes: []
     *     operationId: userGetOne
     *     parameters:
     *       - name: nickname
     *         in: path
     *         description: Идентификатор пользователя.
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Информация о пользователе.
     *         schema:
     *           $ref: '#/components/schemas/User'
     *       404:
     *         description: Пользователь отсутсвует в системе.
     *         schema:
     *           $ref: '#/components/schemas/Error'
     */
    router.get('/:nickname', async (req, res) => userController.get(req, res));

    /**
     * @openapi
     * /user/{nickname}:
     *   patch:
     *     summary: Изменение данных о пользователе
     *     description: Создание нового пользователя в базе данных.
     *     operationId: userUpdate
     *     parameters:
     *       - name: nickname
     *         in: path
     *         description: Идентификатор пользователя.
     *         required: true
     *         type: string
     *       - name: profile
     *         in: body
     *         description: Данные пользовательского профиля.
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/User'
     *     responses:
     *       200:
     *         description: Актуальная информация о пользователе после изменения профиля.
     *         schema:
     *           $ref: '#/components/schemas/User'
     *       404:
     *         description: Пользователь отсутсвует в системе.
     *         schema:
     *           $ref: '#/components/schemas/Error'
     *       409:
     *         description: Новые данные профиля пользователя конфликтуют с имеющимися пользователями.
     *         schema:
     *           $ref: '#/components/schemas/Error'
     */
    router.patch('/:nickname', async (req, res) => userController.patch(req, res));

    return router;
}


/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       description: Информация о пользователе.
 *       type: object
 *       properties:
 *         nickname:
 *           type: string
 *           format: identity
 *           description: Имя пользователя (уникальное поле).Данное поле допускает только латиницу, цифры и знак подчеркивания. Сравнение имени регистронезависимо.
 *           example: j.sparrow
 *         fullname:
 *           type: string
 *           description: Полное имя пользователя.
 *           example: Captain Jack Sparrow
 *           x-isnullable: false
 *         about:
 *           type: string
 *           format: text
 *           description: Описание пользователя.
 *           example: This is the day you will always remember as the day that you almost caught Captain Jack Sparrow!
 *         email:
 *           type: string
 *           format: email
 *           description: Почтовый адрес пользователя (уникальное поле).
 *           example: captaina@blackpearl.sea
 *           x-isnullable: false
 *       required:
 *         - fullname
 *         - email
 */


/**
 * @openapi
 * components:
 *   schemas:
 *     Users:
 *       description: Информация о пользователе.
 *       type: array
 *       items:
 *         $ref: '#components/schemas/User'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     UserUpdate:
 *       description: Информация о пользователе.
 *       type: object
 *       properties:
 *         fullname:
 *           type: string
 *           description: Полное имя пользователя.
 *           example: Captain Jack Sparrow
 *           x-isnullable: false
 *         about:
 *           type: string
 *           format: text
 *           description: Описание пользователя.
 *           example: This is the day you will always remember as the day that you almost caught Captain Jack Sparrow!
 *         email:
 *           type: string
 *           format: email
 *           description: Почтовый адрес пользователя (уникальное поле).
 *           example: captaina@blackpearl.sea
 *           x-isnullable: false
 */