import { useEffect, useState } from "react";

export default function Footer() {
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const today = new Date();
        setCurrentDate(today);
    }, []);

    return (
        <footer className="myFooter">
            <h4>Copyright 2025</h4>
        </footer>
    );
}
