import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
    // Header e Footer baseados no Supabase settings serão carregados aqui futuramente
    return (
        <div className="public-site">
            <header className="site-header">
                <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100px' }}>
                    <div className="logo" style={{ flexShrink: 0 }}>
                        <img src="/assets/logo-inove-transparent.png" alt="Inove Produtora" style={{ height: '70px', objectFit: 'contain', display: 'block' }} />
                    </div>
                    <nav style={{ marginLeft: 'auto' }}>
                        <a href="/">Home</a>
                        <a href="#sobre">Quem Somos</a>
                        <a href="#servicos">Serviços</a>
                        <a href="#portfolio">Portfólio</a>
                        <a href="#contato">Contato</a>
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
