import {PostRepository} from "../Repositories/PostRepository";
import {Forum, Post, Thread, User} from "../DB/Database";

export class PostService {
    constructor(private readonly repo: PostRepository) {}

    async get(id: number): Promise<[number, [User, Thread, Forum]]> {
        return this.repo.get(id);
    }

    async update(id: number, post: Post): Promise<[number, Post]> {
        return this.repo.update(id, post);
    }
}