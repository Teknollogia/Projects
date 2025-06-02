export default function Sidebar({ favorites = [] }) {
    const popularPosts = [
        { id: "post1", title: "Elso blogbejegyzes" },
        { id: "post2", title: "Masodik blogbejegyzes" },
        { id: "post3", title: "Harmadik blogbejegyzes" },
        { id: "post4", title: "Negyedik blogbejegyzes" },
        { id: "post5", title: "Otodik blogbejegyzes" },
        { id: "post6", title: "Hatodik blogbejegyzes" }
    ];

    return (
        <aside id="aside">
            <h3 id="nepszeru">Legnepszerubb bejegyzesek</h3>
            <ul>
                {popularPosts.map(post => (
                    <li key={post.id}>
                        <a href={`#${post.id}`}>{post.title}</a>
                    </li>
                ))}
            </ul>

            {favorites.length > 0 && (
                <div>
                    <h3>Kedvenc bejegyzeseid</h3>
                    <ul>
                        {favorites.map(fav => (
                            <li key={fav.id}>
                                <a href={`#${fav.id}`}>{fav.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </aside>
    );
}
