DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

DO
$$BEGIN
    EXECUTE (
        SELECT 'DROP INDEX ' || string_agg(indexrelid::regclass::text, ', ')
        FROM   pg_index  i
                   LEFT   JOIN pg_depend d ON d.objid = i.indexrelid
            AND d.deptype = 'i'
        WHERE  i.indrelid = 'post'::regclass  -- possibly schema-qualified
          AND    d.objid IS NULL                                -- no internal dependency
    );
END$$;

CREATE EXTENSION IF NOT EXISTS citext;

DROP TABLE IF EXISTS "user" CASCADE;
CREATE UNLOGGED TABLE "user" (
                                nickname CITEXT UNIQUE PRIMARY KEY,  -- Имя пользователя (уникальное поле). Данное поле допускает только латиницу, цифры и знак подчеркивания. Сравнение имени регистронезависимо.
                                password CITEXT,
                                fullname TEXT NOT NULL,  -- Полное имя пользователя.
                                about TEXT,  -- Описание пользователя.
                                email CITEXT NOT NULL UNIQUE -- Почтовый адрес пользователя (уникальное поле).
);
DROP INDEX IF EXISTS userEmail;
CREATE INDEX userEmail ON "user" USING HASH (email);

DROP TABLE IF EXISTS forum CASCADE;
CREATE UNLOGGED TABLE forum (
                                 title TEXT NOT NULL,  -- Название форума.
                                 "user" CITEXT NOT NULL REFERENCES "user"(nickname) ,  -- Nickname пользователя, который отвечает за форум.
                                 slug CITEXT NOT NULL UNIQUE PRIMARY KEY,  -- Человекопонятный URL. Уникальное поле.
                                 posts BIGINT DEFAULT 0,  -- Общее кол-во сообщений в данном форуме.
                                 threads BIGINT DEFAULT 0  -- Общее кол-во ветвей обсуждения в данном форуме.
);

DROP TABLE IF EXISTS thread CASCADE;
CREATE UNLOGGED TABLE thread (
                                  id SERIAL NOT NULL PRIMARY KEY,  -- Идентификатор ветки обсуждения.
                                  title TEXT NOT NULL UNIQUE,  -- Заголовок ветки обсуждения.
                                  author CITEXT NOT NULL REFERENCES "user"(nickname),  -- Пользователь, создавший данную тему.
                                  forum CITEXT NOT NULL REFERENCES forum(slug),  -- Форум, в котором расположена данная ветка обсуждения.
                                  message TEXT NOT NULL,  -- Описание ветки обсуждения.
                                  votes INTEGER DEFAULT 0,  -- Кол-во голосов непосредственно за данное сообщение форума.
                                  slug CITEXT,  -- Человекопонятный URL. В данной структуре slug опционален и не может быть числом.
                                  created TIMESTAMP WITH TIME ZONE DEFAULT NOW()  -- Дата создания ветки на форуме.
);
DROP INDEX IF EXISTS threadForum;
CREATE INDEX threadForum ON thread USING HASH (forum);

DROP INDEX IF EXISTS threadSlug;
CREATE INDEX threadSlug ON thread USING HASH (slug) WHERE slug IS NOT NULL;


------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION appendthreadCounterForum() RETURNS TRIGGER AS
$$
DECLARE
    nicknameUser CITEXT;
    fullnameUser TEXT;
    aboutUser TEXT;
    emailUser CITEXT;
BEGIN
    UPDATE forum SET threads = threads + 1 WHERE slug = NEW.forum;
    SELECT nickname, fullname, about, email INTO nicknameUser, fullnameUser, aboutUser, emailUser FROM "user" WHERE nickname = NEW.author;
    RETURN NEW;
END;
$$
    LANGUAGE 'plpgsql';

CREATE TRIGGER appendthreadCounterForumTrigger AFTER INSERT ON "thread"
    FOR EACH ROW
EXECUTE PROCEDURE appendthreadCounterForum();

------------------------------------------------------------------------

DROP TABLE IF EXISTS post CASCADE;
CREATE UNLOGGED TABLE post (
                                id BIGSERIAL NOT NULL PRIMARY KEY,  -- Идентификатор данного сообщения.
                                parent BIGINT DEFAULT 0,  -- Идентификатор родительского сообщения (0 - корневое сообщение обсуждения).
                                author CITEXT NOT NULL REFERENCES "user"(nickname),  -- Автор, написавший данное сообщение.
                                message TEXT NOT NULL,  -- Собственно сообщение форума.
                                isEdited BOOLEAN DEFAULT false,  -- Истина, если данное сообщение было изменено.
                                forum CITEXT, -- NOT NULL REFERENCES forum(slug),  -- Идентификатор форума (slug) данного сообещния.
                                thread INTEGER REFERENCES thread(id),  -- Идентификатор ветви (id) обсуждения данного сообещния.
                                created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- Дата создания сообщения на форуме.
                                path BIGINT[] DEFAULT ARRAY []::INTEGER[] -- Materialized Path. Используется для вложенных постов

--                        CONSTRAINT unique_post UNIQUE (author, message, forum, thread)
);
DROP INDEX IF EXISTS postPath1;
CREATE INDEX IF NOT EXISTS postPath1 ON post ((path[1]));

DROP INDEX IF EXISTS postIDPath1;
CREATE INDEX IF NOT EXISTS postIDPath1 ON post (id, (path[1]));

DROP INDEX IF EXISTS postThreadPathID;
CREATE INDEX IF NOT EXISTS postThreadPathID ON post (thread, path, id);

DROP INDEX IF EXISTS postThreadIDPath1Parent;
CREATE INDEX IF NOT EXISTS postThreadIDPath1Parent ON post (thread, id, (path[1]), parent);



------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION appendpostCounterForum() RETURNS TRIGGER AS
$$
DECLARE
    nicknameUser CITEXT;
    fullnameUser TEXT;
    aboutUser TEXT;
    emailUser CITEXT;
BEGIN
    UPDATE forum SET posts = posts + 1 WHERE slug = NEW.forum;
    SELECT nickname, fullname, about, email INTO nicknameUser, fullnameUser, aboutUser, emailUser FROM "user" WHERE nickname = NEW.author;
    RETURN NEW;
END;
$$
    LANGUAGE 'plpgsql';

CREATE TRIGGER appendpostCounterForumTrigger AFTER INSERT ON "post"
    FOR EACH ROW
EXECUTE PROCEDURE appendpostCounterForum();

------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION setPathForPost() RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.parent = 0 THEN
        NEW.path = ARRAY [NEW.id];
    ELSE
        SELECT path INTO NEW.PATH FROM post WHERE id = NEW.parent;
        NEW.path = array_append(NEW.path, NEW.id);
    END IF;
    RETURN NEW;
END;
$$
    LANGUAGE 'plpgsql';

CREATE TRIGGER setPathForPostTrigger BEFORE INSERT ON "post"
    FOR EACH ROW
EXECUTE PROCEDURE setPathForPost();

------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION setPostIsEdited() RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.message = '' OR NEW.message = OLD.message THEN
        RETURN NEW;
    ELSE
        NEW.isedited=true;
        RETURN NEW;
    END IF;
END;
$$
    LANGUAGE 'plpgsql';

CREATE TRIGGER setPostIsEditedTrigger BEFORE UPDATE ON "post"
    FOR EACH ROW
EXECUTE PROCEDURE setPostIsEdited();

DROP TABLE IF EXISTS vote CASCADE;
CREATE UNLOGGED TABLE vote(
                               nickname CITEXT NOT NULL REFERENCES "user"(nickname),  -- Идентификатор пользователя.
                               voice SMALLINT,  -- Отданный голос.
                               threadID INT REFERENCES thread(id)  -- ID  треда
);
DROP INDEX IF EXISTS voteNicknameThreadID;
CREATE UNIQUE INDEX voteNicknameThreadID ON vote(nickname, threadID);

CREATE OR REPLACE FUNCTION addVoteForThread() RETURNS TRIGGER AS
$$
BEGIN
    UPDATE thread SET votes = votes + NEW."voice" WHERE id = NEW."threadid";
    RETURN NEW;
END;
$$
    LANGUAGE 'plpgsql';

CREATE TRIGGER addVoteForThreadTrigger AFTER INSERT ON "vote"
    FOR EACH ROW
EXECUTE PROCEDURE addVoteForThread();

------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION changeVoteForThread() RETURNS TRIGGER AS
$$
BEGIN
    IF OLD.voice = NEW.voice THEN
        RETURN OLD;
    ELSE
        UPDATE thread SET votes = votes + 2 * NEW."voice" WHERE id = NEW."threadid";
        RETURN NEW;
    END IF;
END;
$$
    LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS changeVoteForThreadTrigger ON "vote" CASCADE;
CREATE TRIGGER changeVoteForThreadTrigger AFTER UPDATE ON "vote"
    FOR EACH ROW
EXECUTE PROCEDURE changeVoteForThread();


------------------------------------------------------------------------

ANALYZE "user";
ANALYZE forum;
ANALYZE thread;
ANALYZE post;
ANALYZE vote;

-- sudo /Applications/Postgres.app/Contents/Versions/14/bin/psql -h localhost -d postgres -U postgres -p 5432 -a -q -f ./init.sql