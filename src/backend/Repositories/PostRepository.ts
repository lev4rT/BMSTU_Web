import {Database, Forum, Post, Thread, User} from "../DB/Database";

export class PostRepository {
    constructor(private readonly db: Database) {}

    async get(id: number): Promise<[number, [User, Thread, Forum]]> {
        return this.db.getPostInfo(id);
    }

    async update(id: number, post: Post): Promise<[number, Post]> {
        return this.db.updatePost(id, post);
    }


}