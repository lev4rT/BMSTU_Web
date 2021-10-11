import {AdminRepository} from "../Repositories/AdminRepository";
import {ForumInfo} from "../DB/Database";

export class AdminService {
    constructor(private readonly repo: AdminRepository) {}

    async dropAll() {
        return this.repo.dropAll();
    }

    async status(): Promise<ForumInfo>{
        return this.repo.status();
    }
}