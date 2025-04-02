function Sidebar({favorites}) {
    return (
        <aside id="aside">
            <h3 id = "nepszeru">Legnepszerubb bejegyzesek</h3>
            <ul>
                <li><a href="#post1">Elso blogbejegyzes</a></li>
                <li><a href="#post2">Masodik blogbejegyzes</a></li>
                <li><a href="#post3">Harmadik blogbejegyzes</a></li>
                <li><a href="#post4">Negyedik blogbejegyzes</a></li>
                <li><a href="#post5">Otodik blogbejegyzes</a></li>
                <li><a href="#post6">Hatodik blogbejegyzes</a></li>

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

export default Sidebar;
