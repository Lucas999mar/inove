import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
    // Header e Footer baseados no Supabase settings serão carregados aqui futuramente
    return (
        <div className="public-site">
            <header className="site-header">
                <div className="container">
                    <div className="logo">
                        <img src="/assets/logo-inove.png" alt="Inove Produtora" style={{ height: '40px', display: 'block' }} />
                    </div>
                    <nav>
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
