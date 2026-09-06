import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminLayout() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) return <div className="admin-loader">Carregando painel...</div>;

    // Se estiver tentando acessar algo que não seja o login e não está logado, bloqueia
    if (!session && location.pathname !== '/admin/login') {
        return <Navigate to="/admin/login" replace />;
    }

    // Se já estiver logado e tentar acessar o login, redireciona pro dashboard
    if (session && location.pathname === '/admin/login') {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div className="admin-panel">
            {session && (
                <aside className="admin-sidebar" style={{ minWidth: '250px', background: '#111', padding: '20px' }}>
                    <h2 style={{ color: '#fff', marginBottom: '30px' }}>Inove Admin</h2>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <a href="/admin" style={{ color: '#ccc', textDecoration: 'none' }}>Dashboard</a>
                        <a href="/admin/settings" style={{ color: '#ccc', textDecoration: 'none' }}>Configurações Globais</a>
                        <a href="/admin/services" style={{ color: '#ccc', textDecoration: 'none' }}>Serviços</a>
                        <a href="/admin/portfolio" style={{ color: '#ccc', textDecoration: 'none' }}>Portfólio & Cases</a>
                        <a href="/admin/leads" style={{ color: '#ccc', textDecoration: 'none' }}>Orçamentos (Leads)</a>
                    </nav>
                    <button style={{ marginTop: 'auto', background: 'transparent', border: '1px solid #333', color: '#fff', padding: '10px', cursor: 'pointer', borderRadius: '4px' }} onClick={() => supabase.auth.signOut()}>Encerrar Sessão</button>
                </aside>
            )}
            <main className="admin-content" style={{ flex: 1, padding: '40px', background: '#0a0a0a', color: '#fff', minHeight: '100vh', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
}
