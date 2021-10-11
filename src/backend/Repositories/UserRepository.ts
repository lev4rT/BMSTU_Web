import {Database, User} from "../DB/Database";

export class UserRepository {
    constructor(private readonly db: Database) {
    }

    async create(user: User): Promise<number> {
        return this.db.createUser(user);
    }

    async update(user: User) : Promise<[number, User]> {
        return this.db.updateUser(user);
    }

    async get(nickname: string) : Promise<[number, User]> {
        return this.db.getUser(nickname);
    }
}