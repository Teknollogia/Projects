import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="myHeader">
            <h1>My First Blog</h1>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/media">Media</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
