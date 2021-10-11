import {Database, Post, Thread, Vote} from "../DB/Database";

export class ThreadRepository {
    constructor(private readonly db: Database) {}

    async createPost(id: number, post: Post): Promise<[number, Post]> {
        return this.db.createPost(id, post);
    }

    async getInfo(id: number): Promise<[number, Thread]> {
        return this.db.getThreadInfo(id);
    }

    async updateThread(id: number, thread: Thread): Promise<[number, Thread]> {
        return this.db.updateThread(id, thread);
    }

    async getPosts(threadID: number): Promise<[number, Post[]]> {
        return this.db.getPosts(threadID);
    }

    async vote(threadID: number, vote: Vote): Promise<number> {
        return this.db.vote(threadID, vote);
    }
}