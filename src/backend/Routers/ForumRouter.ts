import express from "express";
import {ForumController} from "../Controllers/ForumController";

export function createForumRouter (forumController : ForumController) {
    const router = express();

    /**
     * @openapi
     * /forum:
     *   post:
     *     summary: Создание форума
     *     description: Создание нового форума
     *     operationId: forumCreate
     *     parameters:
     *       - name: forum
     *         in: body
     *         description: Данные форума
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/Forum'
     *     responses:
     *       201:
     *         description: Форум успешно создан. Возвращает данные созданного форума.
     *       404:
     *         description: Владелец форума не найден.
     *       409:
     *         description: Форум уже присутсвует в базе данных.
     */
    router.post('/', async (req, res) => forumController.create(req, res));

    /**
     * @openapi
     * /forum/{slug}:
     *   get:
     *     summary: Получение информации о форуме
     *     description: Получение информации о форуме по его идентификатору
     *     operationId: forumGetOne
     *     consumes: []
     *     parameters:
     *       - name: slug
     *         in: path
     *         description: Идентификатор форума
     *         required: true
     *         type: string
     *         format: identity
     *     responses:
     *       200:
     *         description: Информация о форуме.
     *         schema:
     *           $ref: '#/components/schemas/Forum'
     *       404:
     *         description: Форум отсутсвует в системе.
     *         schema:
     *           $ref: '#/components/schemas/Error'
     */
    router.get('/:slug', async (req, res) => forumController.get(req, res));

    /**
     * @openapi
     * /forum/{slug}:
     *   post:
     *     summary: Создание ветки
     *     description: Добавление новой ветки обсуждения на форум
     *     operationId: threadCreate
     *     parameters:
     *       - name: slug
     *         in: path
     *         description: Идентификатор форума
     *         required: true
     *         type: string
     *         format: identity
     *       - name: thread
     *         in: body
     *         description: Данные ветки обсуждения.
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/Thread'
     *     responses:
     *       201:
     *         description: Ветка обсуждения успешно создана. Возвращает данные созданной ветки обсуждения.
     *         schema:
     *           $ref: '#/components/schemas/Thread'
     *       404:
     *         description: Автор ветки или форум не найдены
     *         schema:
     *           $ref: '#/components/schemas/Error'
     *       409:
     *         description: Ветка обсуждения уже присутсвует в базе данных
     *         schema:
     *           $ref: '#/components/schemas/Error'
     */
    router.post('/:slug', async (req, res) => forumController.createThread(req, res));

    /**
     * @openapi
     * /forum/{slug}/threads:
     *   get:
     *     summary: Список ветвей обсужления форума
     *     description: Получение списка ветвей обсужления данного форума. Ветви обсуждения выводятся отсортированные по дате создания.
     *     operationId: forumGetThreads
     *     consumes: []
     *     parameters:
     *       - name: slug
     *         in: path
     *         description: Идентификатор форума
     *         required: true
     *         type: string
     *         format: identity
     *     responses:
     *       200:
     *         description: Информация о ветках обсуждения на форуме.
     *         schema:
     *           $ref: '#/components/schemas/Thread'
     *       404:
     *         description: Автор ветки или форум не найдены
     *         schema:
     *           $ref: '#/components/schemas/Error'
     */
    router.get('/:slug/threads', async (req, res) => forumController.getThreads(req, res));

    return router;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Forum:
 *       description: Информация о форуме
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Название форума
 *           example: Pirate stories
 *           x-isnullable: false
 *         user:
 *           type: string
 *           format: identity
 *           description: Nickname пользователя, который отвечает за форум.
 *           example: j.sparrow
 *           x-isnullable: false
 *         slug:
 *           type: string
 *           format: identity
 *           description: Человекопонятный URL (https://ru.wikipedia.org/wiki/%D0%A1%D0%B5%D0%BC%D0%B0%D0%BD%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9_URL), уникальное поле.
 *           pattern: ^(\d|\w|-|_)*(\w|-|_)(\d|\w|-|_)*$
 *           example: https://pirate-stories.org
 *           x-isnullable: false
 *         posts:
 *           type: number
 *           format: int64
 *           description: Общее кол-во сообщений в данном форуме
 *           example: 200000
 *         threads:
 *           type: number
 *           format: int32
 *           description: Общее кол-во ветвей обсуждения в данном форуме.
 *           example: 200
 *       required:
 *         - title
 *         - user
 *         - slug
 */