import express from "express";
import {ThreadController} from "../Controllers/ThreadController";

export function createThreadRouter (threadController : ThreadController) {
    const router = express();

    /**
     * @openapi
     * /thread/{id}:
     *   post:
     *     summary: Создание новых постов
     *     description: Добавление новых постов в ветку обсуждения на форум. Все посты, созданные в рамках одного вызова данного метода должны иметь одинаковую дату создания (Post.Created).
     *     operationId: postsCreate
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Идентификатор ветки обсуждения.
     *         required: true
     *         type: number
     *         format: int64
     *       - name: post
     *         in: body
     *         description: создаваемый пост
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/Post'
     *     responses:
     *       201:
     *         description: Пост успешно создан. Возвращает созданный пост
     *         schema:
     *           $ref: '#/components/schemas/Post'
     *       404:
     *         description: Ветка обсуждения отсутствует в базе данных.
     *         schema:
     *           $ref: '#/components/schemas/Error'
     *       409:
     *         description: Хотя бы один родительский пост отсутсвует в текущей ветке обсуждения.
     *         schema:
     *           $ref: '#/components/schemas/Error'
     */
    router.post('/:id', async (req, res) => threadController.createPost(req, res));

    /**
     * @openapi
     * /thread/{id}:
     *   get:
     *     summary: Получение информации о ветке обсуждения
     *     description: Получение информации о ветке обсуждения по его id.
     *     operationId: threadGetOne
     *     consumes: []
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Идентификатор ветки обсуждения.
     *         required: true
     *         type: number
     *         format: int64
     *     responses:
     *       200:
     *         description: Информация о ветке обсуждения.
     *         schema:
     *           $ref: '#/components/schemas/Thread'
     *       404:
     *         description: Ветка обсуждения отсутсвует в форуме.
     *         schema:
     *           $ref: '#/components/schemas/Error'
     */
    router.get('/:id', async (req, res) => threadController.getInfo(req, res));

    /**
     * @openapi
     * /thread/{id}:
     *   post:
     *     summary: Обновление ветки
     *     description: Обновление ветки обсуждения на форуме.
     *     operationId: threadUpdate
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Идентификатор ветки обсуждения.
     *         required: true
     *         type: number
     *         format: int64
     *       - name: thread
     *         in: body
     *         description: Данные ветки обсуждения.
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ThreadUpdate'
     *     responses:
     *       200:
     *         description: Информация о ветке обсуждения.
     *         schema:
     *           $ref: '#/components/schemas/Thread'
     *       404:
     *         description: Ветка обсуждения отсутсвует в форуме.
     *         schema:
     *           $ref: '#/components/schemas/Error'
     */
    router.post('/:id', async (req, res) => threadController.updateThread(req, res));

    /**
     * @openapi
     * /thread/{id}/posts:
     *   get:
     *     summary: Сообщения данной ветви обсуждения
     *     description: Получение списка сообщений в данной ветке форуме.
     *     operationId: threadGetPosts
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Идентификатор ветки обсуждения.
     *         required: true
     *         type: number
     *         format: int64
     *     responses:
     *       200:
     *         description: Информация о сообщениях форума.
     *         schema:
     *           $ref: '#/components/schemas/Posts'
     *       404:
     *         description: Ветка обсуждения отсутсвует в форуме.
     *         schema:
     *           $ref: '#/components/schemas/Error'
     */
    router.get('/:id/posts', async (req, res) => threadController.getPosts(req, res));

    /**
     * @openapi
     * /thread/{id}/vote:
     *   post:
     *     summary: Проголосовать за ветвь обсуждения
     *     description: Изменение голоса за ветвь обсуждения. Один пользователь учитывается только один раз.
     *     operationId: threadVote
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Идентификатор ветки обсуждения.
     *         required: true
     *         type: number
     *         format: int64
     *       - name: vote
     *         in: body
     *         description: Информация о голосовании пользователя.
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/Vote'
     *     responses:
     *       200:
     *         description: Успешное применение голоса
     *       404:
     *         description: Ветка обсуждения отсутсвует в форуме.
     *         schema:
     *           $ref: '#/components/schemas/Error'
     */
    router.post('/:id/vote', async (req, res) => threadController.vote(req, res));

    return router;
}


/**
 * @openapi
 * components:
 *   schemas:
 *     Thread:
 *       description: Ветка обсуждения на форуме.
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int32
 *           description: Идентификатор ветки обсуждения.
 *           example: 42
 *         title:
 *           type: string
 *           description: Заголовок ветки обсуждения.
 *           example: Davy Jones cache
 *           x-isnullable: false
 *         author:
 *           type: string
 *           format: identity
 *           description: Пользователь, создавший данную тему.
 *           example: j.sparrow
 *           x-isnullable: false
 *         forum:
 *           type: string
 *           format: identity
 *           description: Форум, в котором расположена данная ветка обсуждения.
 *           example: pirate-stories
 *         message:
 *           type: string
 *           format: text
 *           description: Описание ветки обсуждения.
 *           example: An urgent need to reveal the hiding place of Davy Jones. Who is willing to help in this matter?
 *           x-isnullable: false
 *         votes:
 *           type: number
 *           format: int32
 *           description: Кол-во голосов непосредственно за данное сообщение форума.
 *         slug:
 *           type: string
 *           format: identity
 *           description: Человекопонятный URL (https://ru.wikipedia.org/wiki/%D0%A1%D0%B5%D0%BC%D0%B0%D0%BD%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9_URL). В данной структуре slug опционален и не может быть числом.
 *           pattern: ^(\d|\w|-|_)*(\w|-|_)(\d|\w|-|_)*$
 *           example: jones-cache
 *         created:
 *           type: string
 *           format: date-time
 *           description: Дата создания ветки на форуме.
 *           example: 2017-01-01T00:00:00.000Z
 *           x-isnullable: true
 *       required:
 *         - title
 *         - author
 *         - message
 */


/**
 * @openapi
 * components:
 *   schemas:
 *     Threads:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Thread'
 */


/**
 * @openapi
 * components:
 *   schemas:
 *     ThreadUpdate:
 *       description: Сообщение для обновления ветки обсуждения на форуме. Пустые параметры остаются без изменений.
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Заголовок ветки обсуждения.
 *           example: Davy Jones cache
 *         message:
 *           type: string
 *           format: text
 *           description: Описание ветки обсуждения.
 *           example: An urgent need to reveal the hiding place of Davy Jones. Who is willing to help in this matter?
 */