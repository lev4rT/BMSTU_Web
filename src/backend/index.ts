import express from "express";
import bodyParser from "body-parser";


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


const app = express();
app.use(bodyParser.json());

const db = new Postgres('postgres', 'localhost', 'postgres', 5432, 'postgres');

const APIVersion = 'v1';
app.use(`/api/${APIVersion}/service`, createAdminRouter(new AdminController(new AdminService(new AdminRepository(db)))));
app.use(`/api/${APIVersion}/user`, createUserRouter(new UserController(new UserService(new UserRepository(db)))));
app.use(`/api/${APIVersion}/forum`, createForumRouter(new ForumController(new ForumService(new ForumRepository(db)))));
app.use(`/api/${APIVersion}/thread`, createThreadRouter(new ThreadController(new ThreadService(new ThreadRepository(db)))));
app.use(`/api/${APIVersion}/post`, createPostRouter(new PostController(new PostService(new PostRepository(db)))));

const port = 8080;
app.listen(port, () => {
    console.log(`API server listening on port: ${port}`);
})