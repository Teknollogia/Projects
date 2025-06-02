import Link from 'next/link';

export default function Header() {
    return (
        <header className="myHeader">
            <h1>My First Blog</h1>
            <nav>
                <ul>
                    <li><Link href="/Home">Home</Link></li>
                    <li><Link href="/Media">Media</Link></li>
                    <li><Link href="/Contact">Contact</Link></li>
                </ul>
            </nav>
        </header>
    );
}