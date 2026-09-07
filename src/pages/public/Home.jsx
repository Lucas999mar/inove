import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Play, ChevronRight, MessageCircle, ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const [settings, setSettings] = useState(null);
    const [services, setServices] = useState([]);
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [pages, setPages] = useState({});
    const [aboutMedia, setAboutMedia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState(null);
    const [slideIndex, setSlideIndex] = useState(0);

    const textContentRef = useRef(null);
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    // Form states
    const [leadData, setLeadData] = useState({ name: '', phone: '', email: '', message: '' });
    const [leadStatus, setLeadStatus] = useState('idle');

    useEffect(() => {
        async function fetchContent() {
            try {
                // O supabase.from().select() vai automaticamente respeitar as regras RLS (só puxa publicos)
                const [
                    { data: setts },
                    { data: servs },
                    { data: projs },
                    { data: clis },
                    { data: tests },
                    { data: pgs },
                    { data: aboutMediaData }
                ] = await Promise.all([
                    supabase.from('site_settings').select('*').single(),
                    supabase.from('services').select('*').order('order', { ascending: true }),
                    supabase.from('projects').select('*').eq('is_featured', true).order('order', { ascending: true }).limit(6),
                    supabase.from('clients').select('*').order('order', { ascending: true }),
                    supabase.from('testimonials').select('*').eq('is_featured', true).order('order', { ascending: true }),
                    supabase.from('pages').select('*'),
                    supabase.from('page_sections').select('*').eq('section_id', 'about_media').single()
                ]);

                setSettings(setts);
                setServices(servs || []);
                setProjects(projs || []);
                setClients(clis || []);
                setTestimonials(tests || []);

                const pagesMap = {};
                if (pgs) pgs.forEach(p => pagesMap[p.slug] = p);
                setPages(pagesMap);
                if (aboutMediaData) setAboutMedia(aboutMediaData);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, []);

    // Auto-rotate gallery images
    useEffect(() => {
        const gallery = aboutMedia?.buttons;
        if (!Array.isArray(gallery) || gallery.length <= 1) return;
        const timer = setInterval(() => {
            setSlideIndex(prev => (prev + 1) % gallery.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [aboutMedia]);

    // Animação da Apresentação de Texto
    useEffect(() => {
        if (loading || !textContentRef.current) return;

        let ctx = gsap.context(() => {
            gsap.fromTo(textContentRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: textContentRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        return () => ctx.revert();
    }, [loading]);

    const handleSubmitLead = async (e) => {
        e.preventDefault();
        setLeadStatus('loading');
        try {
            const { error } = await supabase.from('leads').insert([leadData]);
            if (error) throw error;
            setLeadStatus('success');
            setLeadData({ name: '', phone: '', email: '', message: '' });
            setTimeout(() => setLeadStatus('idle'), 5000);
        } catch (error) {
            console.error('Erro ao enviar lead', error);
            setLeadStatus('error');
        }
    };

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
            {/* HERO SECTION - VIDEO NATURAL BACKGROUND */}
            <div className="hero-scroll-container">
                <section className="hero-section">
                    {/* VIDEO DESKTOP (Oculto no CSS via mobile) */}
                    <video className="hero-video-bg video-desktop" autoPlay loop muted playsInline preload="auto">
                        <source src="/assets/video-riverson-desktop.mp4" type="video/mp4" />
                    </video>

                    {/* VIDEO MOBILE (Oculto no CSS via desktop) */}
                    <video className="hero-video-bg video-mobile" autoPlay loop muted playsInline preload="auto">
                        <source src="/assets/video-riverson.mp4" type="video/mp4" />
                    </video>

                    {/* Degradê levíssimo só no pé para o preto se misturar perfeitamente com a seção textual abaixo */}
                    <div className="hero-overlay-fade"></div>
                </section>
            </div>

            {/* HERO TEXT APRESENTATION (Aparece suavemente após o vídeo) */}
            <section className="hero-presentation-section" ref={textContentRef}>
                <div className="container hero-content-centered">
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
                            <h2>{pages['sobre']?.title || 'História e Tradição'}</h2>
                            <p style={{ whiteSpace: 'pre-line' }}>{pages['sobre']?.meta_description || 'A Inove Produtora construiu, ao longo de 20 anos, uma história dedicada a transformar ideias em imagens, sons e experiências.\n\nCom criatividade, planejamento e conhecimento técnico, desenvolvemos produções audiovisuais para empresas, artistas, instituições, eventos e projetos especiais em Macaé e região.'}</p>

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
                            {aboutMedia && aboutMedia.active !== false ? (
                                aboutMedia.video_url ? (
                                    <div className="about-media-video" style={{ aspectRatio: '4/5', borderRadius: 'var(--border-radius)', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5)', position: 'relative', background: '#000' }}>
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${aboutMedia.video_url.includes('v=') ? aboutMedia.video_url.split('v=')[1].split('&')[0] : aboutMedia.video_url.includes('youtu.be/') ? aboutMedia.video_url.split('youtu.be/')[1].split('?')[0] : aboutMedia.video_url}?rel=0`}
                                            title="Vídeo Institucional"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            style={{ border: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                                        />
                                    </div>
                                ) : Array.isArray(aboutMedia.buttons) && aboutMedia.buttons.length > 0 ? (
                                    <div className="about-carousel" style={{ aspectRatio: '4/5', borderRadius: 'var(--border-radius)', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5)', position: 'relative' }}>
                                        {aboutMedia.buttons.map((img, idx) => (
                                            <div key={img.url || idx} className="carousel-slide" style={{
                                                position: 'absolute', inset: 0,
                                                backgroundImage: `url(${img.url})`,
                                                backgroundSize: 'cover', backgroundPosition: 'center',
                                                opacity: idx === slideIndex ? 1 : 0,
                                                transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                zIndex: idx === slideIndex ? 2 : 1
                                            }} />
                                        ))}
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', zIndex: 3, pointerEvents: 'none' }} />
                                        {aboutMedia.buttons.length > 1 && (
                                            <div className="carousel-dots" style={{
                                                position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
                                                display: 'flex', gap: '8px', zIndex: 4
                                            }}>
                                                {aboutMedia.buttons.map((_, idx) => (
                                                    <button key={idx} onClick={() => setSlideIndex(idx)} style={{
                                                        width: idx === slideIndex ? '24px' : '8px', height: '8px',
                                                        borderRadius: '4px', border: 'none',
                                                        background: idx === slideIndex ? 'var(--accent, #85c226)' : 'rgba(255,255,255,0.4)',
                                                        cursor: 'pointer', transition: 'all 0.4s ease', padding: 0
                                                    }} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : aboutMedia.image_url ? (
                                    <div className="image-placeholder" style={{ backgroundImage: `url(${aboutMedia.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                    </div>
                                ) : (
                                    <div className="image-placeholder">
                                        <Play size={64} opacity={0.5} />
                                    </div>
                                )
                            ) : (
                                <div className="image-placeholder">
                                    <Play size={64} opacity={0.5} />
                                </div>
                            )}
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
                                    <div className="service-icon">
                                        {service.image_url ? (
                                            <img src={service.image_url} alt={service.title} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                                        ) : (
                                            service.icon || '🎬'
                                        )}
                                    </div>
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
                                <div key={proj.id} className="portfolio-card video-card" onClick={() => setActiveVideo(proj.youtube_url)}>
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

            {/* CALL TO ACTION / CONTATO */}
            <section id="contato" className="section cta-section" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="container">
                    <div className="cta-grid">
                        <div className="cta-info">
                            <h2>Pronto para tirar seu projeto do papel?</h2>
                            <p>Descreva brevemente o que você precisa e nossa equipe de direção criativa entrará em contato para um orçamento especial.</p>

                            <div className="contact-methods" style={{ marginTop: '40px' }}>
                                <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '20px' }}>
                                    <MessageCircle style={{ marginRight: '8px' }} /> Falar Agora no WhatsApp
                                </a>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    Ou através do formulário ao lado.
                                </p>
                            </div>
                        </div>

                        <div className="cta-form-wrapper">
                            <form className="lead-form" onSubmit={handleSubmitLead}>
                                <div className="form-group">
                                    <input type="text" placeholder="Seu Nome / Empresa" value={leadData.name} onChange={e => setLeadData({ ...leadData, name: e.target.value })} required />
                                </div>
                                <div className="form-group split-group">
                                    <input type="tel" placeholder="WhatsApp (DDD)" value={leadData.phone} onChange={e => setLeadData({ ...leadData, phone: e.target.value })} required />
                                    <input type="email" placeholder="E-mail principal" value={leadData.email} onChange={e => setLeadData({ ...leadData, email: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <textarea rows="4" placeholder="Detalhes do projeto, referências, necessidade..." value={leadData.message} onChange={e => setLeadData({ ...leadData, message: e.target.value })} required></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '8px' }} disabled={leadStatus === 'loading'}>
                                    {leadStatus === 'loading' ? 'Enviando...' : 'Solicitar Orçamento Oficial'}
                                </button>

                                {leadStatus === 'success' && <div className="form-success">Obrigado! Recebemos sua solicitação.</div>}
                                {leadStatus === 'error' && <div className="form-error">Ocorreu um erro. Tente via WhatsApp diretamente.</div>}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Botão flutuante WhatsApp */}
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="whatsapp-float" aria-label="Falar pelo WhatsApp">
                <MessageCircle size={32} color="white" />
            </a>

            {/* Modal de Vídeo */}
            {activeVideo && (
                <div className="video-modal-overlay" onClick={() => setActiveVideo(null)}>
                    {/* Botão Fechar — sempre visível */}
                    <button
                        className="close-modal"
                        onClick={(e) => { e.stopPropagation(); setActiveVideo(null); }}
                        aria-label="Fechar vídeo"
                    >
                        ✕
                    </button>
                    <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${activeVideo.includes('v=') ? activeVideo.split('v=')[1].split('&')[0] :
                                activeVideo.includes('youtu.be/') ? activeVideo.split('youtu.be/')[1].split('?')[0] :
                                    activeVideo
                                }?autoplay=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                        </iframe>
                    </div>
                </div>
            )}
        </div>
    );
}
