import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setError('Acesso negado. Apenas o proprietário pode acessar.');
        }
        setLoading(false);
    }

    return (
        <div className="admin-login-container">
            <form onSubmit={handleLogin} className="admin-login-form">
                <h1>Acesso Restrito</h1>
                <p>Insira suas credenciais de administrador</p>

                {error && <div className="error-message">{error}</div>}

                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Autenticando...' : 'Entrar no Painel'}
                </button>
            </form>
        </div>
    );
}
