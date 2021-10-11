import {Database, Forum, Thread} from "../DB/Database";

export class ForumRepository {
    constructor(private readonly db: Database) {
    }

    async create(forum: Forum): Promise<[number, Forum]>{
        return this.db.createForum(forum);
    }

    async get(slug: string): Promise<[number, Forum]>{
        return this.db.getForum(slug);
    }

    async createThread(slug: string, thread: Thread): Promise<[number, Thread]> {
        return this.db.createThread(slug, thread);
    }

    async getThreads(slug: string): Promise<[number, Thread[]]> {
        return this.db.getThreads(slug);
    }
}