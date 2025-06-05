CREATE TABLE users (
    id VARCHAR2(50) PRIMARY KEY,
    username VARCHAR2(50) NOT NULL UNIQUE,
    email VARCHAR2(255) NOT NULL UNIQUE,
    password VARCHAR2(255) NOT NULL,
    created_at DATE DEFAULT SYSDATE
);

/*
ALTER TABLE users
ADD role VARCHAR2(10) DEFAULT 'user';
*/

SELECT * FROM COMMENTS;


DESCRIBE comments;
DESCRIBE posts;

/*
ALTER TABLE comments
MODIFY ID VARCHAR2(50);
*/

UPDATE users set role = 'admin' WHERE email = 'admin@blogging.com';
COMMIT;

select * from users;

