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
                <aside className="admin-sidebar">
                    <h2>Inove Admin</h2>
                    <nav>
                        <a href="/admin">Dashboard</a>
                        {/* Outros links no futuro */}
                    </nav>
                    <button onClick={() => supabase.auth.signOut()}>Sair</button>
                </aside>
            )}
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}
