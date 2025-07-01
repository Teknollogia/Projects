CREATE TABLE deleted_posts (
    id VARCHAR2(50) PRIMARY KEY,
    title VARCHAR2(255),
    time DATE,
    content VARCHAR2(4000),
    image VARCHAR2(255),
    fullcontent CLOB,
    hasEditableTable NUMBER(1),
    user_id VARCHAR2(50),
    deleted_at DATE DEFAULT SYSDATE,
    CONSTRAINT fk_deleted_posts_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);

select * from deleted_posts;

select * from COMMENTS;
