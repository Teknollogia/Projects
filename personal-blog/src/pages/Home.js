import BlogPost from "../components/BlogPost";
import Sidebar from "../components/Sidebar";
import Comment from "../components/Comment";
import Healthy from "../images/healthy.jpeg";
import { useState } from "react";
import EditableTable from "../components/EditableTable";

function Home() {
    const [favorites, setFavorites] = useState([]);

    function toggleFavorite(id, title) {
        setFavorites((prevFavorites) => {
            if (prevFavorites.some(fav => fav.id === id)) {
                return prevFavorites.filter(fav => fav.id !== id);
            } else {
                return [...prevFavorites, {id, title}];
            }
        });
    }

    return (
        <main className="home">
            <section className="blogPosts">
                <BlogPost 
                    id="post1" 
                    title="A mesterséges intelligencia jövője" 
                    date="2025-03-03" 
                    content={
                        <p>A mesterséges intelligencia (AI) területe folyamatosan fejlődik, és számos új lehetőséget kínál a jövőben. Az AI alkalmazásai egyre szélesebb körben terjednek el, és hatással lehetnek az élet minden területére. ...</p>
                    }
                    fullContent={(
                        <>
                            <p>A mesterséges intelligencia (AI) területe folyamatosan fejlődik, és számos új lehetőséget kínál a jövőben. Az AI alkalmazásai egyre szélesebb körben terjednek el, és hatással lehetnek az élet minden területére.</p>
                            <table border="1">
                                <tr>
                                    <th>Év</th>
                                    <th>Fejlődési mérföldkő</th>
                                </tr>
                                <tr>
                                    <td>2020</td>
                                    <td>GPT-3 megjelenése</td>
                                </tr>
                                <tr>
                                    <td>2023</td>
                                    <td>GPT-4 fejlesztése és elterjedése</td>
                                </tr>
                                <tr>
                                    <td>2025</td>
                                    <td>AI által generált teljes filmek</td>
                                </tr>
                            </table>
                        </>
                    )}
                    toggleFavorite={toggleFavorite}
                    isFavorite={favorites.some(fav => fav.id === "post1")}
                />
                <Comment />
                <BlogPost 
                    id="post2" 
                    title="Hogyan kezdj el programozni?" 
                    date="2025-03-02" 
                    content="A programozás megtanulása ma már sokkal könnyebb, mint valaha..." 
                    fullContent= "A programozás megtanulása ma már sokkal könnyebb, mint valaha. Ingyenes online tanfolyamok, interaktív platformok és közösségi támogatás segít abban, hogy gyorsan fejlődhess ezen a területen." 
                    toggleFavorite={toggleFavorite}
                    isFavorite={favorites.some(fav => fav.id === "post2")}
                />
                <Comment />
                <BlogPost 
                    id="post3" 
                    title="A fenntartható életmód alapjai" 
                    date="2025-03-01" 
                    content="A környezetvédelem egyre fontosabb szerepet kap a modern társadalomban. Egyszerű változtatásokkal, mint például az újrahasznosítás és az energiatakarékosság, mindannyian hozzájárulhatunk egy fenntarthatóbb jövőhöz..." 
                    fullContent="A környezetvédelem egyre fontosabb szerepet kap a modern társadalomban. Egyszerű változtatásokkal, mint például az újrahasznosítás és az energiatakarékosság, mindannyian hozzájárulhatunk egy fenntarthatóbb jövőhöz. A tudatos vásárlás, a fenntartható energiák használata és a környezetbarát közlekedés mind olyan lépések, amelyekkel csökkenthetjük ökológiai lábnyomunkat."
                    toggleFavorite={toggleFavorite}
                    isFavorite={favorites.some(fav => fav.id === "post3")}
                />
                <Comment />
                <BlogPost 
                    id="post4" 
                    title="A digitális nomád életstílus előnyei és kihívásai" 
                    date="2025-03-09" 
                    content= <p>A távoli munkavégzés lehetőséget ad arra, hogy bárhonnan dolgozhassunk a világban. Azonban fontos a megfelelő időgazdálkodás és az egyensúly fenntartása a munka és a szabadidő között. ...</p>
                    fullContent={(
                        <>
                            <p>A távoli munkavégzés lehetőséget ad arra, hogy bárhonnan dolgozhassunk a világban. Azonban fontos a megfelelő időgazdálkodás és az egyensúly fenntartása a munka és a szabadidő között.</p>
                            <ul>
                                <li>Előnyök: nagyobb rugalmasság, élménygazdag élet</li>
                                <li>Kihívások: a munka és a szabadidő közötti egyensúly megtalálása</li>
                            </ul>
                        </>
                    )}
                    toggleFavorite={toggleFavorite}
                    isFavorite={favorites.some(fav => fav.id === "post4")}
                />
                <Comment />
                <BlogPost 
                    id="post5" 
                    title="Egészséges táplálkozás modern életvitel mellett" 
                    date="2025-03-07" 
                    content=<img src={Healthy} alt="Egészséges táplálkozás" />
                    fullContent={(
                        <>
                            <img src={Healthy} alt="Egészséges táplálkozás" />
                            <p>Rohanó világunkban kihívás lehet az egészséges táplálkozás fenntartása. Fontos, hogy tudatosan válasszuk meg az ételeinket, és figyeljünk a megfelelő tápanyagbevitelre.</p>
                        </>
                    )}
                    toggleFavorite={toggleFavorite}
                    isFavorite={favorites.some(fav => fav.id === "post5")}
                />
                <Comment />
                <BlogPost 
                    id="post6" 
                    title="A mesterséges intelligencia jövője" 
                    date="2025-03-03" 
                    content={
                        <p>A mesterséges intelligencia (AI) területe folyamatosan fejlődik, és számos új lehetőséget kínál a jövőben. Az AI alkalmazásai egyre szélesebb körben terjednek el, és hatással lehetnek az élet minden területére.</p>
                    }
                    fullContent={(
                        <>
                            <p>A mesterséges intelligencia (AI) területe folyamatosan fejlődik, és számos új lehetőséget kínál a jövőben. Az AI alkalmazásai egyre szélesebb körben terjednek el, és hatással lehetnek az élet minden területére.</p>
                            <EditableTable />
                        </>
                    )}
                    toggleFavorite={toggleFavorite}
                    isFavorite={favorites.some(fav => fav.id === "post1")}
                />
            </section>
            <Sidebar favorites={favorites} />
        </main>
    );
}

export default Home;
