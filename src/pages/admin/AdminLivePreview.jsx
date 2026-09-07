import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Monitor, Smartphone, RefreshCw, Save } from 'lucide-react';

export default function AdminLivePreview() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState('desktop');
    const iframeRef = useRef(null);

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
        alert('As alterações foram salvas!');

        // Recarrega o iframe de visualização para mostrar as mudanças reais
        if (iframeRef.current) {
            iframeRef.current.src = iframeRef.current.src;
        }
    }

    if (!settings) return <div style={{ padding: '40px', color: '#fff' }}>Carregando visualizador...</div>;

    const iframeWidth = previewMode === 'desktop' ? '100%' : '375px';

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 80px)', gap: '20px', overflow: 'hidden' }}>

            {/* PAINEL ESQUERDO: LIVE PREVIEW IFRAME */}
            <div style={{
                flex: 2,
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {/* Cabeçalho do Preview */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 20px',
                    background: '#161616',
                    borderBottom: '1px solid #333'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa', fontSize: '0.9rem' }}>
                        <span style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
                        <span style={{ width: '10px', height: '10px', background: '#f59e0b', borderRadius: '50%', display: 'inline-block' }}></span>
                        <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                        <span style={{ marginLeft: '10px' }}>Site Oficial (Visualização em Tempo Real)</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setPreviewMode('mobile')}
                            style={{ background: previewMode === 'mobile' ? '#333' : 'transparent', color: '#fff', border: '1px solid #444', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="Ver no Celular"
                        >
                            <Smartphone size={18} />
                        </button>
                        <button
                            onClick={() => setPreviewMode('desktop')}
                            style={{ background: previewMode === 'desktop' ? '#333' : 'transparent', color: '#fff', border: '1px solid #444', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="Ver no PC"
                        >
                            <Monitor size={18} />
                        </button>
                        <button
                            onClick={() => { if (iframeRef.current) iframeRef.current.src = iframeRef.current.src; }}
                            style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="Recarregar"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                {/* Container responsivo do Iframe */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', overflow: 'hidden' }}>
                    <div style={{ width: iframeWidth, height: '100%', transition: 'width 0.3s ease', borderLeft: '1px solid #222', borderRight: '1px solid #222' }}>
                        <iframe
                            ref={iframeRef}
                            src="/"
                            style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
                            title="Live Preview"
                        />
                    </div>
                </div>
            </div>


            {/* PAINEL DIREITO: EDITOR VISUAL */}
            <div style={{
                flex: 1,
                minWidth: '400px',
                maxWidth: '600px',
                background: '#111',
                border: '1px solid #333',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #222', background: '#161616' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Editor Lovable-Mode</h2>
                    <p style={{ color: '#888', fontSize: '0.85rem', margin: '5px 0 0 0' }}>Altere os dados, salve, e veja o site mudando ao vivo ao lado.</p>
                </div>

                <form onSubmit={handleSave} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', margin: 0, fontSize: '1rem', color: '#85c226' }}>Hero (Seção Inicial)</h3>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Título Principal da Tela</label>
                        <input
                            type="text"
                            style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
                            value={settings.slogan || ''}
                            onChange={e => setSettings({ ...settings, slogan: e.target.value })}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Texto Descritivo de Suporte</label>
                        <textarea
                            rows="4"
                            style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px', resize: 'vertical' }}
                            value={settings.description || ''}
                            onChange={e => setSettings({ ...settings, description: e.target.value })}
                        ></textarea>
                    </div>

                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', margin: '15px 0 0 0', fontSize: '1rem', color: '#85c226' }}>Atendimento e Botões Globais</h3>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Número do WhatsApp Comercial</label>
                        <input
                            type="text"
                            style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
                            value={settings.whatsapp || ''}
                            onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Mensagem Inicial (Para os clientes)</label>
                        <input
                            type="text"
                            style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
                            value={settings.whatsapp_message || ''}
                            onChange={e => setSettings({ ...settings, whatsapp_message: e.target.value })}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Perfil Oficial Instagram</label>
                        <input
                            type="text"
                            style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
                            value={settings.instagram_url || ''}
                            onChange={e => setSettings({ ...settings, instagram_url: e.target.value })}
                        />
                    </div>

                    <div style={{ marginTop: '10px' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                background: '#85c226',
                                color: '#000',
                                border: 'none',
                                padding: '14px',
                                borderRadius: '6px',
                                fontSize: '1.05rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <Save size={20} />
                            {loading ? 'Compilando...' : 'Atualizar e Visualizar Modificações'}
                        </button>
                    </div>

                    <div style={{ marginTop: '20px', padding: '15px', background: '#1a1814', border: '1px solid #ffd70030', borderRadius: '6px', color: '#eab308' }}>
                        <strong>Dica Lovable:</strong> Alterou os textos e os ícones aqui? Clique em "Atualizar e Visualizar Modificações". O site à esquerda irá piscar instantaneamente mostrando suas novas alterações incorporadas visualmente!
                    </div>

                </form>
            </div>
        </div>
    );
}
