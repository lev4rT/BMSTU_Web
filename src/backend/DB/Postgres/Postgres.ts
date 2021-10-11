import {Database, Forum, ForumInfo, Post, Thread, User, Vote} from "../Database"
import {Pool} from "pg";
import httpStatus from "http-status"

export class Postgres implements Database {
    readonly database: string;
    readonly host: string;
    readonly password: string;
    readonly port: number;
    readonly user: string;

    private pool: Pool;

    constructor(database: string, host: string, password: string, port: number, user: string) {
        this.database = database;
        this.host = host;
        this.password = password;
        this.port = port;
        this.user = user;

        this.pool = new Pool({
            database,
            host,
            password,
            port,
            user,
        });
    }

    async createUser(user: User): Promise<number> {
        try {
            await this.pool.query('INSERT INTO "user"(nickname, password, fullname, about, email) VALUES ($1, $2, $3, $4, $5)', [user.nickname, user.password, user.fullname, user.about, user.email]);
            return httpStatus.OK;
        } catch (e) {
            return httpStatus.CONFLICT;
        }
    }

    async updateUser(user: User): Promise<[number, User]> {
        try {
            console.log(user);
            let setQuery = '';
            if (user.fullname) {
                setQuery += `fullname='${user.fullname}',`;
            }
            if (user.about) {
                setQuery += `about='${user.about}',`;
            }
            if (user.email) {
                setQuery += `email='${user.email}',`;
            }
            setQuery = setQuery.slice(0, -1) + ' ';

            const result = await this.pool.query(`UPDATE "user" SET ${setQuery} WHERE nickname=$1 RETURNING nickname, fullname, about, email`, [user.nickname]);

            if (!result.rowCount) {
                return [httpStatus.NOT_FOUND, null];
            }
            return [httpStatus.OK, result.rows[0]];
        } catch (e) {
            return [httpStatus.CONFLICT, null];
        }
    }

    async getUser(nickname: string): Promise<[number, User]> {
        try {
            const result = await this.pool.query(`SELECT nickname, fullname, about, email FROM "user" WHERE nickname=$1`, [nickname])
            if (!result.rowCount) {
                return [httpStatus.NOT_FOUND, null];
            }
            return [httpStatus.CREATED, result.rows[0]];
        } catch (e) {
            return [httpStatus.CONFLICT, null];
        }
    }

    async createForum(forum: Forum): Promise<[number, Forum]> {
        try {
            const result = await this.pool.query('INSERT INTO forum(title, "user", slug) VALUES ($1, $2, $3) RETURNING *', [forum.title, forum.user, forum.slug])
            return [httpStatus.OK, result.rows[0]];
        } catch (e) {
            switch (e.code) {
                case '23503':
                    return [httpStatus.NOT_FOUND, null];
                default:
                    return [httpStatus.CONFLICT, null];
            }
        }
    }

    async getForum(slug: string): Promise<[number, Forum]> {
        try {
            const result = await this.pool.query('SELECT title, "user", slug, posts, threads FROM forum WHERE slug=$1', [slug]);
            if (!result.rowCount) {
                return [httpStatus.NOT_FOUND, null];
            }
            return [httpStatus.OK, result.rows[0]];
        } catch (e) {
            return [httpStatus.INTERNAL_SERVER_ERROR, null];
        }
    }

    async createThread(slug: string, thread: Thread): Promise<[number, Thread]> {
        try {
            const result = await this.pool.query('INSERT INTO thread(title, author, forum, message, votes, slug) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [thread.title, thread.author, slug, thread.message, thread.votes, thread.slug]);
            return [httpStatus.CREATED, result.rows[0]];
        } catch (e) {
            console.log(e);
            switch (e.code) {
                case '23503':
                    return [httpStatus.NOT_FOUND, null];
                default:
                    return [httpStatus.CONFLICT, null];
            }
        }
    }

    async getThreads(slug: string): Promise<[number, Thread[]]> {
        try {
            const result = await this.pool.query('SELECT id, title, author, forum, message, votes, slug, created FROM thread WHERE forum=$1 ', [slug]);
            return [httpStatus.OK, result.rows];
        } catch (e) {
            console.log(e);
            switch (e.code) {
                case '23503':
                    return [httpStatus.NOT_FOUND, null];
                default:
                    return [httpStatus.INTERNAL_SERVER_ERROR, null];
            }
        }
    }

    async createPost(id:number, post: Post): Promise<[number, Post]> {
        try {
            post.forum = (await this.pool.query('SELECT forum FROM thread WHERE id=$1', [id])).rows[0].forum;
            await this.pool.query('INSERT INTO post(parent, author, message, thread, forum) VALUES ($1, $2, $3, $4, $5) RETURNING *', [post.parent, post.author, post.message, id, post.forum]);
            return [httpStatus.CREATED, post];
        } catch (e) {
            console.log(e);
            switch (e.code) {
                case '23503':
                    return [httpStatus.NOT_FOUND, null];
                default:
                    return [httpStatus.INTERNAL_SERVER_ERROR, null];
            }
        }
    }

    async getThreadInfo(id: number): Promise<[number, Thread]> {
        try {
            const thread = (await this.pool.query('SELECT * FROM thread WHERE id=$1' , [id])).rows[0];
            return [httpStatus.OK, thread];
        } catch (e) {
            console.log(e);
            switch (e.code) {
                case '23503':
                    return [httpStatus.NOT_FOUND, null];
                default:
                    return [httpStatus.INTERNAL_SERVER_ERROR, null];
            }
        }
    }

    async updateThread(id: number, thread: Thread): Promise<[number, Thread]> {
        try {
            let setter = '';
            if (thread?.title !== '') {
                setter += `title='${thread.title}',`;
            }
            if (thread?.message !== '') {
                setter += `message='${thread.message}',`;
            }
            setter = setter.slice(0, -1) + ' ';

            const updatedThread = (await this.pool.query(`UPDATE thread SET ${setter} WHERE id=$1 RETURNING * `, [id])).rows[0];
            return [httpStatus.OK, updatedThread];
        } catch (e) {
            console.log(e);
            switch (e.code) {
                case '23503':
                    return [httpStatus.NOT_FOUND, null];
                default:
                    return [httpStatus.INTERNAL_SERVER_ERROR, null];
            }
        }
    }

    async getPosts(threadID: number): Promise<[number, Post[]]> {
        try {
            const posts = (await this.pool.query('SELECT * FROM post WHERE thread=$1', [threadID])).rows;
            return [httpStatus.OK, posts];
        } catch (e) {
            return [httpStatus.NOT_FOUND, null];
        }
    }

    async vote(threadID: number, vote: Vote): Promise<number> {
        try {
            await this.pool.query('INSERT INTO vote(nickname, voice, threadID) VALUES ($1, $2, $3)', [vote.nickname, vote.voice, threadID]);
            return httpStatus.OK;
        } catch (e) {
            console.log(e);
            return httpStatus.NOT_FOUND;
        }
    }

    async getPostInfo(id: number): Promise<[number, [User, Thread, Forum]]> {
        try {
            const post = (await this.pool.query(`SELECT * FROM post WHERE id=$1`, [id])).rows[0];
            console.log(post);
            const user = (await this.pool.query(`SELECT * FROM "user" WHERE nickname=$1`, [post.author])).rows[0];
            const thread = (await this.pool.query(`SELECT * FROM thread WHERE id=$1`, [post.thread])).rows[0];
            const forum = (await this.pool.query(`SELECT * FROM forum WHERE slug=$1`, [post.forum])).rows[0];

            return [httpStatus.OK, [user, thread, forum]];
        } catch (e) {
            return [httpStatus.NOT_FOUND, [null, null, null]];
        }
    }

    async updatePost(id: number, post: Post): Promise<[number, Post]> {
        try {
            const updatedPost = (await this.pool.query(`UPDATE post SET message=$1 WHERE id=$2 RETURNING *`, [post.message, id])).rows[0];
            return [httpStatus.OK, updatedPost];
        } catch (e) {
            return [httpStatus.NOT_FOUND, null];
        }
    }

    async dropAll() {
        await Promise.all([
            this.pool.query('TRUNCATE "user" CASCADE;'),
            this.pool.query('TRUNCATE forum CASCADE;'),
            this.pool.query('TRUNCATE thread CASCADE;'),
            this.pool.query('TRUNCATE vote CASCADE;'),
            this.pool.query('TRUNCATE post CASCADE;')
        ]);
    }

    async status(): Promise<ForumInfo> {
        let info: ForumInfo = {
            forums: 0,
            threads: 0,
            users: 0,
            posts: 0,
        };
        return Promise.all([
            this.pool.query('SELECT COUNT(*) FROM forum').then((result) => info['forums'] = result.rows[0].count),
            this.pool.query('SELECT COUNT(*) FROM thread').then((result) => info['threads'] = result.rows[0].count),
            this.pool.query('SELECT COUNT(*) FROM "user"').then((result) => info['users'] = result.rows[0].count),
            this.pool.query('SELECT COUNT(*) FROM post').then((result) => info['posts'] = result.rows[0].count),
        ]).then(() => info);
    }
}