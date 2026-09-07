import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function PublicLayout() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <div className="public-site">
            <header className="site-header">
                <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100px' }}>
                    <div className="logo" style={{ flexShrink: 0, zIndex: 110 }}>
                        <img src="/assets/logo-inove-transparent.png" alt="Inove Produtora" style={{ height: '70px', objectFit: 'contain', display: 'block' }} />
                    </div>

                    <button className="mobile-menu-btn" onClick={toggleMenu}>
                        {menuOpen ? <X size={32} color="#fff" /> : <Menu size={32} color="#fff" />}
                    </button>

                    <nav className={`desktop-nav ${menuOpen ? 'nav-open' : ''}`} translate="no">
                        <a href="/" onClick={() => setMenuOpen(false)}>Início</a>
                        <a href="#sobre" onClick={() => setMenuOpen(false)}>Quem Somos</a>
                        <a href="#servicos" onClick={() => setMenuOpen(false)}>Serviços</a>
                        <a href="#portfolio" onClick={() => setMenuOpen(false)}>Portfólio</a>
                        <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>
                    </nav>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
            <footer className="site-footer">
                <div className="container">
                    <p>© {new Date().getFullYear()} Inove Produtora. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
