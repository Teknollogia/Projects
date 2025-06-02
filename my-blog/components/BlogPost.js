import { useState } from "react";

export default function BlogPost({ id, title, date, content, fullContent, toggleFavorite, isFavorite}) {
    const [showFullContent, setShowFullContent] = useState(false);

    function toggleContent() {
        setShowFullContent(!showFullContent);
    }

    return (
        <article id={id}>
            <h2>{title}</h2>
            <time>{date}</time>
            <div>{showFullContent ? fullContent : content}</div>
            <button onClick={toggleContent}>
                {showFullContent ? "Kevesebb" : "Tovább olvasom"}
            </button>
            <button onClick={() => toggleFavorite(id, title)}>
                {isFavorite ? " 💔Eltávolítás a kedvencekből" : " ❤️ Kedvencekhez adás"}
            </button>
        </article>
    );
}