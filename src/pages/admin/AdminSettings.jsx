import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        const { data } = await supabase.from('site_settings').select('*').single();
        if (data) setSettings(data);
    }

    async function handleSave(e) {
        e.preventDefault();
        setLoading(true);
        if (settings) {
            await supabase.from('site_settings').update(settings).eq('id', settings.id);
        }
        setLoading(false);
        alert('Configurações salvas!');
    }

    if (!settings) return <p>Carregando...</p>;

    return (
        <div className="admin-form-container">
            <h2>Configurações Globais do Site</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Altere textos básicos e o WhatsApp oficial da produtora.</p>

            <form onSubmit={handleSave} className="admin-form">
                <div className="form-group">
                    <label>Título / Slogan Principal</label>
                    <input type="text" value={settings.slogan || ''} onChange={e => setSettings({ ...settings, slogan: e.target.value })} />
                </div>

                <div className="form-group">
                    <label>Subtítulo (Descrição breve da página inicial)</label>
                    <textarea rows="3" value={settings.description || ''} onChange={e => setSettings({ ...settings, description: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}></textarea>
                </div>

                <div className="form-group">
                    <label>Número do WhatsApp (Apenas números + DDI)</label>
                    <input type="text" placeholder="Ex: 5522999858893" value={settings.whatsapp || ''} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} />
                </div>

                <div className="form-group">
                    <label>Mensagem padrão do WhatsApp (Ao clicar no botão)</label>
                    <input type="text" value={settings.whatsapp_message || ''} onChange={e => setSettings({ ...settings, whatsapp_message: e.target.value })} />
                </div>

                <div className="form-group">
                    <label>Link do Instagram</label>
                    <input type="url" value={settings.instagram_url || ''} onChange={e => setSettings({ ...settings, instagram_url: e.target.value })} />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações Globais'}
                </button>
            </form>
        </div>
    );
}
