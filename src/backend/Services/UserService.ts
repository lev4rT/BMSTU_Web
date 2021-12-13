import {UserRepository} from "../Repositories/UserRepository";
import {User} from "../DB/Database";

export class UserService {
    constructor(private readonly repo: UserRepository) {}

    async create(user: User) : Promise<number> {
        return this.repo.create(user);
    }

    async update(user: User) : Promise<[number, User]> {
        return this.repo.update(user);
    }

    async get(nickname: string) : Promise<[number, User]> {
        return this.repo.get(nickname);
    }
}