export interface Database {
    readonly user: string;
    readonly password: string;
    readonly host: string;
    readonly port: number;
    readonly database: string;


    dropAll(): void;
    createUser(user: User): Promise<number>;
    status(): Promise<ForumInfo>;

    updateUser(user: User): Promise<[number, User]>;
    getUser(nickname: string): Promise<[number, User]>;

    createForum(forum: Forum): Promise<[number, Forum]>;
    getForum(slug: string): Promise<[number, Forum]>;

    createThread(slug: string, thread: Thread): Promise<[number, Thread]>
    getThreads(slug: string): Promise<[number, Thread[]]>;
    getThreadInfo(id: number): Promise<[number, Thread]>;
    updateThread(id: number, thread: Thread): Promise<[number, Thread]>;

    createPost(id:number, post: Post): Promise<[number, Post]>;
    getPosts(threadID: number): Promise<[number, Post[]]>;
    vote(threadID: number, vote: Vote): Promise<number>;

    getPostInfo(id: number): Promise<[number, [User, Thread, Forum]]>;
    updatePost(id: number, post: Post): Promise<[number, Post]>;
}

export interface Forum {
    title: string,
    user: string,
    slug: string,
}

export interface Thread {
    ID: number,
    title: string,
    author: string,
    forum: string,
    message: string,
    votes: number,
    slug: string,
    created: Date,
}

export interface Post {
    ID: number,
    parent: number,
    author: string,
    message: string,
    isEdited: boolean,
    forum: string,
    thread: number,
    created: Date,
}


export interface Vote {
    nickname: string,
    voice: number,
}


export interface ForumInfo {
    forums: number,
    threads: number,
    users: number,
    posts: number,
}

export interface User {
    nickname: string,
    password: string,
    fullname: string,
    about: string,
    email: string,
}