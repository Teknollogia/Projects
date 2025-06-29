// import aiImage from "../images/ai.jpg";
// import healthyImage from "../images/healthy.jpeg";
// import programmingImage from "../images/programming.png";
// import Header from "../components/Header"
import aiImage from "../public/ai.jpg"
import healthyImage from "../public/healthy.jpeg";
import programmingImage from "../public/programming.png";

import Header from '../components/Header'


export default function Media() {
    return (
        <>
            <Header />
            <main className="media">
                <h2>Media</h2>
                <div className="gallery">
                    <img src="/ai.jpg" alt="Kep1" />
                    <img src="/healthy.jpeg" alt="Kep2" />
                    <img src="/programming.png" alt="Kep3" />
                    <iframe id="video"
                        width="560" height="315"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="YouTube video player" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                    </iframe>
                </div>
            </main>
        </>
    );
}