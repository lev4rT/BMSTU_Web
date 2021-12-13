import {Database, User} from "../DB/Database";
import httpStatus from "http-status";

export class UserRepository {
    constructor(private readonly db: Database) {
    }

    async create(user: User): Promise<number> {
        try {
            await this.db.createUser(user);
            // await this.pool.query('INSERT INTO "user"(nickname, password, fullname, about, email) VALUES ($1, $2, $3, $4, $5)', [user.nickname, user.password, user.fullname, user.about, user.email]);
            return httpStatus.OK;
        } catch (e) {
            return httpStatus.CONFLICT;
        }
        // return this.db.createUser(user);
    }

    async update(user: User) : Promise<[number, User]> {
        return this.db.updateUser(user);
    }

    async get(nickname: string) : Promise<[number, User]> {
        return this.db.getUser(nickname);
    }
}