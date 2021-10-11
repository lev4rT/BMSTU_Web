import {Database, ForumInfo} from "../DB/Database";

export class AdminRepository {
    constructor(private readonly db: Database) {
    }

    async dropAll() {
        return this.db.dropAll();
    }

    async status(): Promise<ForumInfo>{
        return this.db.status();
    }
}