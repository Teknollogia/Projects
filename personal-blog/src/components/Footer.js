import { useEffect, useState } from "react";

function Footer() {
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const today = new Date();
        setCurrentDate(today);
    }, []);

    return (
        <footer className="myFooter">
            <h4>Copyright {currentDate}</h4>
        </footer>
    );
}

export default Footer;
