import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Play, ChevronRight, MessageCircle } from 'lucide-react';
import './Home.css';

export default function Home() {
    const [settings, setSettings] = useState(null);
    const [services, setServices] = useState([]);
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContent() {
            try {
                // O supabase.from().select() vai automaticamente respeitar as regras RLS (só puxa publicos)
                const [
                    { data: setts },
                    { data: servs },
                    { data: projs },
                    { data: clis },
                    { data: tests }
                ] = await Promise.all([
                    supabase.from('site_settings').select('*').single(),
                    supabase.from('services').select('*').order('order', { ascending: true }),
                    supabase.from('projects').select('*').eq('is_featured', true).order('order', { ascending: true }).limit(6),
                    supabase.from('clients').select('*').order('order', { ascending: true }),
                    supabase.from('testimonials').select('*').eq('is_featured', true).order('order', { ascending: true })
                ]);

                setSettings(setts);
                setServices(servs || []);
                setProjects(projs || []);
                setClients(clis || []);
                setTestimonials(tests || []);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, []);

    if (loading) {
        return (
            <div className="home-loader">
                <div className="loader-pulse"></div>
            </div>
        );
    }

    const whatsappLink = `https://wa.me/${settings?.whatsapp || '5522999858893'}?text=${encodeURIComponent(settings?.whatsapp_message || 'Olá! Conheci o trabalho da Inove Produtora pelo site e gostaria de solicitar um orçamento.')}`;

    return (
        <div className="home-page">
            {/* HERO SECTION CINEMÁTICA */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                {/* Opcional: Aqui poderíamos carregar um <video autoPlay loop muted> se configurado no painel */}
                <div className="container hero-content">
                    <span className="badge">Há 20 anos no mercado</span>
                    <h1>{settings?.slogan || '20 anos transformando ideias em histórias que merecem ser vistas.'}</h1>
                    <p className="hero-subtitle">
                        {settings?.description || 'Produção audiovisual completa para empresas, artistas, eventos e projetos que desejam comunicar, emocionar e permanecer na memória.'}
                    </p>
                    <div className="hero-actions">
                        <a href="#portfolio" className="btn btn-primary btn-lg">Conheça nosso portfólio <ChevronRight size={20} /></a>
                        <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn btn-outline btn-lg">Solicite um orçamento</a>
                    </div>
                </div>
            </section>

            {/* SEÇÃO SOBRE A PRODUTORA */}
            <section id="sobre" className="section-dark about-section">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-text">
                            <h2>História e Tradição</h2>
                            <p>A Inove Produtora construiu, ao longo de 20 anos, uma história dedicada a transformar ideias em imagens, sons e experiências.</p>
                            <p>Com criatividade, planejamento e conhecimento técnico, desenvolvemos produções audiovisuais para empresas, artistas, instituições, eventos e projetos especiais em Macaé e região.</p>

                            <div className="stats-row">
                                <div className="stat">
                                    <span className="stat-number">20</span>
                                    <span className="stat-label">Anos de Experiência</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">+1000</span>
                                    <span className="stat-label">Projetos Concluídos</span>
                                </div>
                            </div>
                        </div>
                        <div className="about-image">
                            {/* Placeholder para uma foto da equipe/bastidores. Editável via painel no futuro */}
                            <div className="image-placeholder">
                                <Play size={64} opacity={0.5} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO DE SERVIÇOS */}
            <section id="servicos" className="section services-section">
                <div className="container">
                    <div className="section-header center">
                        <h2>Nossa Expertise</h2>
                        <p>Soluções audiovisuais de alto padrão para cada necessidade.</p>
                    </div>

                    {services.length > 0 ? (
                        <div className="services-grid">
                            {services.map(service => (
                                <div key={service.id} className="service-card">
                                    <div className="service-icon">{service.icon || '🎬'}</div>
                                    <h3>{service.title}</h3>
                                    <p>{service.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="services-grid">
                            {/* Stub caso o banco esteja vazio */}
                            <div className="service-card">
                                <div className="service-icon">📽️</div>
                                <h3>Vídeos Institucionais</h3>
                                <p>Fortaleça a imagem da sua empresa com vídeos e documentários que contam a sua essência corporativa.</p>
                            </div>
                            <div className="service-card">
                                <div className="service-icon">🎵</div>
                                <h3>Projetos Musicais</h3>
                                <p>Gravação de videoclipes, DVDs e registros de shows ao vivo com máxima qualidade visual e sonora.</p>
                            </div>
                            <div className="service-card">
                                <div className="service-icon">📱</div>
                                <h3>Conteúdo Digital</h3>
                                <p>Comerciais e campanhas dinâmicas otimizadas para gerar engajamento nas redes sociais e mídias modernas.</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* PORTFOLIO DESTAQUES */}
            <section id="portfolio" className="section-dark portfolio-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Trabalhos em Destaque</h2>
                        <a href="/portfolio" className="link-arrow">Ver portfólio completo <ChevronRight size={16} /></a>
                    </div>

                    {projects.length > 0 ? (
                        <div className="portfolio-grid">
                            {projects.map(proj => (
                                <div key={proj.id} className="portfolio-card video-card">
                                    <div className="video-thumbnail" style={{ backgroundImage: `url(${proj.cover_image || 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=2071&auto=format&fit=crop'})` }}>
                                        <div className="play-button"><Play size={32} fill="white" /></div>
                                    </div>
                                    <div className="portfolio-info">
                                        <span className="portfolio-client">{proj.client_name}</span>
                                        <h3>{proj.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-content-box">
                            <p>O portfólio está sendo preparado e poderá ser gerenciado pelo Painel Admin.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* PROVA SOCIAL / CLIENTES */}
            <section className="section clients-section">
                <div className="container">
                    <h4 className="text-center">Marcas que confiam em nossa visão</h4>
                    {clients.length > 0 ? (
                        <div className="clients-logo-track">
                            {clients.map(cli => (
                                <img key={cli.id} src={cli.logo_url} alt={cli.name} className="client-logo" />
                            ))}
                        </div>
                    ) : (
                        <div className="clients-logo-track placeholder-track">
                            <div className="logo-placeholder"></div>
                            <div className="logo-placeholder"></div>
                            <div className="logo-placeholder"></div>
                            <div className="logo-placeholder"></div>
                        </div>
                    )}
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section id="contato" className="section-dark cta-section">
                <div className="container">
                    <div className="cta-box">
                        <h2>Pronto para tirar seu projeto do papel?</h2>
                        <p>Entre em contato e agende uma conversa com nossa equipe de direção criativa.</p>
                        <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">
                            <MessageCircle style={{ marginRight: '8px' }} /> Falar no WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* Botão flutuante WhatsApp */}
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="whatsapp-float" aria-label="Falar pelo WhatsApp">
                <MessageCircle size={32} color="white" />
            </a>
        </div>
    );
}
