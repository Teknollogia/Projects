CREATE TABLE posts (
    id VARCHAR2(50) PRIMARY KEY,
    title VARCHAR2(255) NOT NULL,
    time DATE,
    content VARCHAR2(4000),
    image VARCHAR2(255),
    fullContent CLOB,
    hasEditableTable NUMBER(1,0) DEFAULT 0
);

INSERT INTO posts (id, title, time, content, fullContent) VALUES (
  'post1',
  'A mesterséges intelligencia jövője',
  TO_DATE('2025-03-03', 'YYYY-MM-DD'),
  'A mesterséges intelligencia (AI) területe folyamatosan fejlődik, és számos új lehetőséget kínál a jövőben. Az AI alkalmazásai egyre szélesebb körben terjednek el, és hatással lehetnek az élet minden területére.',
  'A mesterséges intelligencia (AI) területe folyamatosan fejlődik, és számos új lehetőséget kínál a jövőben. Az AI alkalmazásai egyre szélesebb körben terjednek el, és hatással lehetnek az élet minden területére.<table>'
);

INSERT INTO posts (id, title, time, content, fullContent) VALUES (
  'post2',
  'Hogyan kezdj el programozni?',
  TO_DATE('2025-03-02', 'YYYY-MM-DD'),
  'A programozás megtanulása ma már sokkal könnyebb, mint valaha...',
  'A programozás megtanulása ma már sokkal könnyebb, mint valaha. Ingyenes online tanfolyamok, interaktív platformok és közösségi támogatás segít abban, hogy gyorsan fejlődhess ezen a területen.'
);

INSERT INTO posts (id, title, time, content, fullContent) VALUES (
  'post3',
  'A fenntartható életmód alapjai',
  TO_DATE('2025-03-01', 'YYYY-MM-DD'),
  'A környezetvédelem egyre fontosabb szerepet kap a modern társadalomban. Egyszerű változtatásokkal, mint például az újrahasznosítás és az energiatakarékosság, mindannyian hozzájárulhatunk egy fenntarthatóbb jövőhöz...',
  'A környezetvédelem egyre fontosabb szerepet kap a modern társadalomban. Egyszerű változtatásokkal, mint például az újrahasznosítás és az energiatakarékosság, mindannyian hozzájárulhatunk egy fenntarthatóbb jövőhöz. A tudatos vásárlás, a fenntartható energiák használata és a környezetbarát közlekedés mind olyan lépések, amelyekkel csökkenthetjük ökológiai lábnyomunkat.'
);

INSERT INTO posts (id, title, time, content, fullContent) VALUES (
  'post4',
  'A digitális nomád életstílus előnyei és kihívásai',
  TO_DATE('2025-03-09', 'YYYY-MM-DD'),
  'A távoli munkavégzés lehetőséget ad arra, hogy bárhonnan dolgozhassunk a világban. Azonban fontos a megfelelő időgazdálkodás és az egyensúly fenntartása a munka és a szabadidő között.',
  'A távoli munkavégzés lehetőséget ad arra, hogy bárhonnan dolgozhassunk a világban. Azonban fontos a megfelelő időgazdálkodás és az egyensúly fenntartása a munka és a szabadidő között.<ul>'
);

INSERT INTO posts (id, title, time, content, fullContent, image) VALUES (
  'post5',
  'Egészséges táplálkozás modern életvitel mellett',
  TO_DATE('2025-03-07', 'YYYY-MM-DD'),
  '',
  'Rohanó világunkban kihívás lehet az egészséges táplálkozás fenntartása. Fontos, hogy tudatosan válasszuk meg az ételeinket, és figyeljünk a megfelelő tápanyagbevitelre.',
  '/images/healthy.jpeg'
);

INSERT INTO posts (id, title, time, content, fullContent, hasEditableTable) VALUES (
  'post6',
  'A mesterséges intelligencia jövője',
  TO_DATE('2025-03-03', 'YYYY-MM-DD'),
  'A mesterséges intelligencia (AI) területe folyamatosan fejlődik, és számos új lehetőséget kínál a jövőben. Az AI alkalmazásai egyre szélesebb körben terjednek el, és hatással lehetnek az élet minden területére.',
  'A mesterséges intelligencia (AI) területe folyamatosan fejlődik, és számos új lehetőséget kínál a jövőben. Az AI alkalmazásai egyre szélesebb körben terjednek el, és hatással lehetnek az élet minden területére.',
  1
);


select * from posts;

/*
ALTER TABLE posts
ADD (
    user_id VARCHAR2(50),
    CONSTRAINT fk_posts_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);
*/

/*
UPDATE posts SET user_id = 'user_1748157195312' WHERE ID = 'post1';
UPDATE posts SET user_id = 'user_1748540336595' WHERE ID = 'post2';
UPDATE posts SET user_id = 'user_1748157326484' WHERE ID = 'post3';
UPDATE posts SET user_id = 'user_1748511490659' WHERE ID = 'post4';
UPDATE posts SET user_id = 'user_1748157195312' WHERE ID = 'post5';
UPDATE posts SET user_id = 'user_1748540336595' WHERE ID = 'post6';
UPDATE posts SET user_id = 'user_1748157326484' WHERE ID = 'post_1748967904613';
UPDATE posts SET user_id = 'user_1748540336595' WHERE ID = 'post_1748970306370';
*/




