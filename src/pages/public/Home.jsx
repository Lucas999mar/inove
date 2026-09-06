import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Home() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContent() {
            const { data } = await supabase.from('site_settings').select('*').single();
            setSettings(data);
            setLoading(false);
        }
        fetchContent();
    }, []);

    if (loading) return <div className="loader">Carregando conteúdo...</div>;

    return (
        <div className="home-page">
            <section className="hero">
                <div className="container">
                    <h1>{settings?.slogan || '20 anos transformando ideias em histórias que merecem ser vistas.'}</h1>
                    <p>{settings?.description || 'Produção audiovisual completa para empresas, artistas, eventos e projetos que desejam comunicar, emocionar e permanecer na memória.'}</p>
                    <div className="actions">
                        <button className="btn btn-primary">Conheça nosso portfólio</button>
                        <button className="btn btn-outline">Solicite um orçamento</button>
                    </div>
                </div>
            </section>

            <section id="sobre" className="section">
                <div className="container">
                    <h2>Quem Somos</h2>
                    <p>A Inove Produtora construiu, ao longo de 20 anos, uma história dedicada a transformar ideias em imagens, sons e experiências...</p>
                    {/* Linha do tempo virá do banco depois */}
                </div>
            </section>

            <div className="whatsapp-float">
                <a href={`https://wa.me/${settings?.whatsapp || '5522999858893'}?text=${encodeURIComponent(settings?.whatsapp_message || 'Olá!')}`} target="_blank" rel="noopener noreferrer">
                    <span className="sr-only">Falar no WhatsApp</span>
                    💬
                </a>
            </div>
        </div>
    );
}
