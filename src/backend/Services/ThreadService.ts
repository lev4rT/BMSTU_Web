import {ThreadRepository} from "../Repositories/ThreadRepository";
import {Post, Thread, Vote} from "../DB/Database";

export class ThreadService {
    constructor(private readonly repo: ThreadRepository) {}

    async createPost(id: number, post: Post): Promise<[number, Post]> {
        return this.repo.createPost(id, post);
    }

    async getInfo(id: number): Promise<[number, Thread]> {
        return this.repo.getInfo(id);
    }

    async updateThread(id: number, thread: Thread): Promise<[number, Thread]> {
        return this.repo.updateThread(id, thread);
    }

    async getPosts(threadID: number): Promise<[number, Post[]]> {
        return this.repo.getPosts(threadID);
    }

    async vote(threadID: number, vote: Vote): Promise<number> {
        return this.repo.vote(threadID, vote);
    }
}