import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminAbout() {
    const [page, setPage] = useState({ slug: 'sobre', title: 'Quem Somos', meta_description: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchPage() {
            const { data } = await supabase.from('pages').select('*').eq('slug', 'sobre').single();
            if (data) setPage(data);
        }
        fetchPage();
    }, []);

    async function handleSave(e) {
        e.preventDefault();
        setLoading(true);
        if (page.id) {
            await supabase.from('pages').update({ title: page.title, meta_description: page.meta_description }).eq('id', page.id);
        } else {
            await supabase.from('pages').insert([page]);
        }
        setLoading(false);
        alert('História atualizada com sucesso!');
    }

    return (
        <div className="admin-form-container">
            <h2>Editar "Quem Somos"</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Altere a história principal da produtora e números de destaque.</p>

            <form onSubmit={handleSave} className="admin-form">
                <div className="form-group">
                    <label>Título da Seção (Ex: História e Tradição)</label>
                    <input type="text" value={page.title || ''} onChange={e => setPage({ ...page, title: e.target.value })} required />
                </div>

                <div className="form-group">
                    <label>Texto da História Completa</label>
                    <textarea rows="6" value={page.meta_description || ''} onChange={e => setPage({ ...page, meta_description: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} required></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar História'}
                </button>
            </form>
        </div>
    );
}
