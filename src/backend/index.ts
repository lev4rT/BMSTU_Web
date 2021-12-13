import express from "express";
import bodyParser from "body-parser";
import swaggerUIExpress from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import {UserRepository} from "./Repositories/UserRepository";
import {UserService} from "./Services/UserService";
import {UserController} from "./Controllers/UserController";
import {Postgres} from "./DB/Postgres/Postgres";
import {AdminRepository} from "./Repositories/AdminRepository";
import {AdminService} from "./Services/AdminService";
import {AdminController} from "./Controllers/AdminController";
import {createAdminRouter} from "./Routers/AdminRouter";
import {createUserRouter} from "./Routers/UserRouter";
import {ForumController} from "./Controllers/ForumController";
import {ForumService} from "./Services/ForumService";
import {ForumRepository} from "./Repositories/ForumRepository";
import {createForumRouter} from "./Routers/ForumRouter";
import {createPostRouter} from "./Routers/PostRouter";
import {PostController} from "./Controllers/PostController";
import {PostService} from "./Services/PostService";
import {PostRepository} from "./Repositories/PostRepository";
import {createThreadRouter} from "./Routers/ThreadRouter";
import {ThreadRepository} from "./Repositories/ThreadRepository";
import {ThreadService} from "./Services/ThreadService";
import {ThreadController} from "./Controllers/ThreadController";
import options from "./options/options";

const specs = options
const app = express();
app.use(bodyParser.json());

let db = null
switch (process.argv[2]) {
    case 'MAIN':
        db = new Postgres('postgres', 'api-db', 'postgres', 5432, 'postgres');
        break
    case 'READONLY':
        db = new Postgres('postgres', 'api-db', 'nginx', 5432, 'nginx_read_only');
        break
}


const APIVersion = 'v1';
app.use(`/api/${APIVersion}/service`, createAdminRouter(new AdminController(new AdminService(new AdminRepository(db)))));
app.use(`/api/${APIVersion}/user`, createUserRouter(new UserController(new UserService(new UserRepository(db)))));
app.use(`/api/${APIVersion}/forum`, createForumRouter(new ForumController(new ForumService(new ForumRepository(db)))));
app.use(`/api/${APIVersion}/thread`, createThreadRouter(new ThreadController(new ThreadService(new ThreadRepository(db)))));
app.use(`/api/${APIVersion}/post`, createPostRouter(new PostController(new PostService(new PostRepository(db)))));
app.use(`/api/${APIVersion}`, swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

const port = process.env.PORT || process.argv[3];
app.listen(port, () => {
    console.log(`API server listening on port: ${port}`);
})