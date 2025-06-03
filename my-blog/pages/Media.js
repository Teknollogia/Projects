import aiImage from "../images/ai.jpg";
import healthyImage from "../images/healthy.jpeg";
import programmingImage from "../images/programming.png";
import Header from "@/components/Header";


export default function Media() {
    return (
        <>
            <Header />
            <main className="media">
                <h2>Gallery</h2>
                <div className="gallery">
                    <img src={aiImage} alt="Kep 1" />
                    <img src={healthyImage} alt="Kep 2" />
                    <img src={programmingImage} alt="Kep 3" />
                    <iframe id="video"
                        width="560" 
                        height="315" 
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