import { useState } from "react";

export default function BlogPost({ id, title, date, content, fullContent, toggleFavorite, isFavorite, userId, currentUserId, onDelete}) {
    const [showFullContent, setShowFullContent] = useState(false);

    function toggleContent() {
        setShowFullContent(!showFullContent);
    }

    const handleDelete = () => {
        if(window.confirm("Biztosan szeretned torolmi a bejegyzest?")) {
            onDelete(id);
        }
    }

    return (
        <article id={id}>
            <h2>{title}</h2>
            <time>{date}</time>
            <div>{showFullContent ? fullContent : content}</div>
            <button onClick={toggleContent}>
                {showFullContent ? "Kevesebb" : "Tovabb olvasom"}
            </button>
            <button onClick={() => toggleFavorite(id, title)}>
                {isFavorite ? " 💔Eltavolitas a kedvencekbol" : " ❤️ Kedvencekhez adas"}
            </button>
            {currentUserId && userId === currentUserId && (
                <button className = "delete-button" onClick = {handleDelete}>
                    Delete Post
                </button>
            )}
        </article>
    );
}