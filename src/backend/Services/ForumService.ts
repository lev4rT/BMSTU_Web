import {ForumRepository} from "../Repositories/ForumRepository";
import {Forum, Thread} from "../DB/Database";

export class ForumService {
    constructor(private readonly repo: ForumRepository) {}

    async create(forum: Forum): Promise<[number, Forum]> {
        return this.repo.create(forum);
    }

    async get(slug: string): Promise<[number, Forum]> {
        return this.repo.get(slug);
    }

    async createThread(slug: string, thread: Thread): Promise<[number, Thread]> {
        return this.repo.createThread(slug, thread);
    }

    async getThreads(slug: string): Promise<[number, Thread[]]> {
        return this.repo.getThreads(slug);
    }
}