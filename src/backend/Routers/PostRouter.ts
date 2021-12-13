import express from "express";
import {PostController} from "../Controllers/PostController";

export function createPostRouter (postController : PostController) {
    const router = express();

    /**
     * @openapi
     * /post/{id}:
     *   get:
     *     summary: Получение информации о ветке обсуждения
     *     description: Получение информации о ветке обсуждения по id поста.
     *     operationId: postGetOne
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Идентификатор сообщения.
     *         required: true
     *         type: number
     *         format: int64
     *     responses:
     *       200:
     *         description: Информация о ветке обсуждения.
     *         schema:
     *           $ref: '#/components/schemas/PostFull'
     *       404:
     *         description: Ветка обсуждения отсутсвует в форуме.
     *         schema:
     *           $ref: '#/components/schemas/Error'
     */
    router.get('/:id', async (req, res) => postController.get(req, res));

    /**
     * @openapi
     * /post/{id}:
     *   post:
     *     summary: Изменение сообщения
     *     description: Изменение сообщения на форуме. Если сообщение поменяло текст, то оно должно получить отметку `isEdited`.
     *     operationId: postUpdate
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Идентификатор сообщения.
     *         required: true
     *         type: number
     *         format: int64
     *       - name: post
     *         in: body
     *         description: Изменения сообщения.
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/PostUpdate'
     *     responses:
     *       200:
     *         description: Информация о сообщении.
     *         schema:
     *           $ref: '#/components/schemas/Post'
     *       404:
     *         description: Сообщение отсутсвует в форуме.
     *         schema:
     *           $ref: '#/components/schemas/Error'
     */
    router.post('/:id', async (req, res) => postController.update(req, res));

    return router;
}


/**
 * @openapi
 * components:
 *   schemas:
 *     Post:
 *       description: Сообщение внутри ветки обсуждения на форуме.
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           description: Идентификатор данного сообщения.
 *         parent:
 *           type: number
 *           format: int64
 *           description: Идентификатор родительского сообщения (0 - корневое сообщение обсуждения).
 *         author:
 *           type: string
 *           format: identity
 *           description: Автор, написавший данное сообщение.
 *           example: j.sparrow
 *           x-isnullable: false
 *         message:
 *           type: string
 *           format: text
 *           description: Собственно сообщение форума.
 *           example: We should be afraid of the Kraken.
 *           x-isnullable: false
 *         isEdited:
 *           type: boolean
 *           description: Истина, если данное сообщение было изменено.
 *           x-isnullable: false
 *         forum:
 *           type: string
 *           format: identity
 *           description: Идентификатор форума (slug) данного сообещния.
 *         thread:
 *           type: number
 *           format: int32
 *           description: Идентификатор ветви (id) обсуждения данного сообещния.
 *         created:
 *           type: string
 *           format: date-time
 *           description: Дата создания сообщения на форуме.
 *           x-isnullable: true
 *       required:
 *         - author
 *         - message
 */


/**
 * @openapi
 * components:
 *   schemas:
 *     Posts:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Post'
 */


/**
 * @openapi
 * components:
 *   schemas:
 *     PostUpdate:
 *       description: Сообщение для обновления сообщения внутри ветки на форуме. Пустые параметры остаются без изменений.
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           format: text
 *           description: Собственно сообщение форума.
 *           example: Pirate stories
 */


/**
 * @openapi
 * components:
 *   schemas:
 *     PostFull:
 *       description: Полная информация о сообщении, включая связанные объекты.
 *       type: object
 *       properties:
 *       post:
 *         $ref: '#/components/schemas/Post'
 *       author:
 *         $ref: '#/components/schemas/User'
 *       thread:
 *         $ref: '#/components/schemas/Thread'
 *       forum:
 *         $ref: '#/components/schemas/Forum'
 */


/**
 * @openapi
 * components:
 *   schemas:
 *     Vote:
 *       description: Информация о голосовании пользователя.
 *       type: object
 *       properties:
 *       nickname:
 *         type: string
 *         format: identity
 *         description: Идентификатор пользователя.
 *         x-isnullable: false
 *       voice:
 *         type: number
 *         format: int32
 *         description: Отданный голос.
 *       enum:
 *         - -1
 *         - 1
 *       x-isnullable: false
 *       required:
 *         - nickname
 *         - voice
 */