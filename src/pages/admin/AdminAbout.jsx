import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Image, Video, Eye, EyeOff, Save, Loader2, Upload, Trash2, GripVertical, Plus, X } from 'lucide-react';

export default function AdminAbout() {
    const [page, setPage] = useState({ slug: 'sobre', title: 'Quem Somos', meta_description: '' });
    const [media, setMedia] = useState({ video_url: '', active: true });
    const [galleryImages, setGalleryImages] = useState([]);
    const [mediaId, setMediaId] = useState(null);
    const [pageId, setPageId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMedia, setLoadingMedia] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const fileInputRef = useRef(null);
    const [dragIndex, setDragIndex] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: pageData } = await supabase
                    .from('pages')
                    .select('*')
                    .eq('slug', 'sobre')
                    .single();

                if (pageData) {
                    setPage(pageData);
                    setPageId(pageData.id);

                    const { data: sectionData } = await supabase
                        .from('page_sections')
                        .select('*')
                        .eq('page_id', pageData.id)
                        .eq('section_id', 'about_media')
                        .single();

                    if (sectionData) {
                        setMedia({
                            video_url: sectionData.video_url || '',
                            active: sectionData.active !== false
                        });
                        // Gallery images stored in the 'buttons' JSONB field (repurposed)
                        const imgs = sectionData.buttons || [];
                        setGalleryImages(Array.isArray(imgs) ? imgs : []);
                        setMediaId(sectionData.id);
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setInitialLoading(false);
            }
        }
        fetchData();
    }, []);

    async function handleSavePage(e) {
        e.preventDefault();
        setLoading(true);
        try {
            if (page.id) {
                await supabase.from('pages').update({
                    title: page.title,
                    meta_description: page.meta_description
                }).eq('id', page.id);
            } else {
                const { data } = await supabase.from('pages').insert([page]).select().single();
                if (data) { setPage(data); setPageId(data.id); }
            }
            alert('História atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar página:', error);
            alert('Erro ao salvar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    async function handleUploadImages(e) {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);

        try {
            const newImages = [];
            for (const file of files) {
                const ext = file.name.split('.').pop();
                const fileName = `about/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

                const { error: uploadError } = await supabase.storage
                    .from('media')
                    .upload(fileName, file, { cacheControl: '3600', upsert: false });

                if (uploadError) {
                    console.error('Erro no upload:', uploadError);
                    continue;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('media')
                    .getPublicUrl(fileName);

                newImages.push({ url: publicUrl, path: fileName });
            }

            setGalleryImages(prev => [...prev, ...newImages]);
        } catch (error) {
            console.error('Erro no upload:', error);
            alert('Erro ao fazer upload. Verifique se o bucket "media" existe no Supabase Storage.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }

    async function handleRemoveImage(index) {
        const img = galleryImages[index];
        if (!window.confirm('Remover esta imagem?')) return;

        // Try to delete from storage if we have the path
        if (img.path) {
            await supabase.storage.from('media').remove([img.path]);
        }

        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    }

    function handleDragStart(index) {
        setDragIndex(index);
    }

    function handleDragOver(e, index) {
        e.preventDefault();
        if (dragIndex === null || dragIndex === index) return;
        const newList = [...galleryImages];
        const dragged = newList.splice(dragIndex, 1)[0];
        newList.splice(index, 0, dragged);
        setGalleryImages(newList);
        setDragIndex(index);
    }

    function handleDragEnd() {
        setDragIndex(null);
    }

    async function handleSaveMedia(e) {
        e.preventDefault();
        setLoadingMedia(true);
        try {
            const payload = {
                page_id: pageId,
                section_id: 'about_media',
                title: 'Mídia Quem Somos',
                image_url: galleryImages.length > 0 ? galleryImages[0].url : null,
                video_url: media.video_url || null,
                buttons: galleryImages, // Store full gallery as JSON
                active: media.active
            };

            if (mediaId) {
                await supabase.from('page_sections').update(payload).eq('id', mediaId);
            } else {
                const { data } = await supabase.from('page_sections').insert([payload]).select().single();
                if (data) setMediaId(data.id);
            }
            alert('Mídia atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar mídia:', error);
            alert('Erro ao salvar mídia. Tente novamente.');
        } finally {
            setLoadingMedia(false);
        }
    }

    function getYouTubeId(url) {
        if (!url) return null;
        const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    }

    if (initialLoading) {
        return (
            <div className="admin-form-container" style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent)' }} />
            </div>
        );
    }

    const ytId = getYouTubeId(media.video_url);

    return (
        <div className="admin-form-container">
            <h2>Editar "Quem Somos"</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                Altere a história principal da produtora, números de destaque e mídia da seção.
            </p>

            {/* ===== SEÇÃO 1: TEXTO E TÍTULO ===== */}
            <form onSubmit={handleSavePage} className="admin-form" style={{ marginBottom: '50px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    marginBottom: '20px', paddingBottom: '15px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <span style={{ fontSize: '1.3rem' }}>📝</span>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Texto e Título</h3>
                </div>

                <div className="form-group">
                    <label>Título da Seção (Ex: História e Tradição)</label>
                    <input type="text" value={page.title || ''} onChange={e => setPage({ ...page, title: e.target.value })} required />
                </div>

                <div className="form-group">
                    <label>Texto da História Completa</label>
                    <textarea rows="6" value={page.meta_description || ''} onChange={e => setPage({ ...page, meta_description: e.target.value })}
                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} required />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    <Save size={16} style={{ marginRight: '6px' }} />
                    {loading ? 'Salvando...' : 'Salvar História'}
                </button>
            </form>

            {/* ===== SEÇÃO 2: MÍDIA ===== */}
            <form onSubmit={handleSaveMedia} className="admin-form">
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '20px', paddingBottom: '15px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    flexWrap: 'wrap', gap: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.3rem' }}>🎬</span>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Mídia da Seção</h3>
                    </div>

                    <button type="button" onClick={() => setMedia({ ...media, active: !media.active })}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 16px', borderRadius: '8px',
                            border: `1px solid ${media.active ? 'rgba(133,194,38,0.4)' : 'rgba(239,68,68,0.4)'}`,
                            background: media.active ? 'rgba(133,194,38,0.1)' : 'rgba(239,68,68,0.1)',
                            color: media.active ? '#85c226' : '#ef4444',
                            cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.3s ease'
                        }}>
                        {media.active ? <Eye size={16} /> : <EyeOff size={16} />}
                        {media.active ? 'Visível no Site' : 'Oculto no Site'}
                    </button>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.6 }}>
                    Faça <strong style={{ color: '#fff' }}>upload de imagens</strong> para criar um carrossel rotativo, e/ou adicione um <strong style={{ color: '#fff' }}>vídeo do YouTube</strong>.
                    Se o vídeo estiver preenchido, ele aparecerá como destaque principal.
                    Arraste as imagens para reordenar.
                </p>

                {/* ----- GALERIA DE IMAGENS ----- */}
                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontWeight: 600, fontSize: '0.95rem' }}>
                        <Image size={16} style={{ color: 'var(--accent)' }} />
                        Galeria de Imagens ({galleryImages.length})
                    </label>

                    {/* Upload button */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <input type="file" ref={fileInputRef} multiple accept="image/*"
                            onChange={handleUploadImages} style={{ display: 'none' }} />

                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '14px 24px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, rgba(133,194,38,0.15), rgba(133,194,38,0.05))',
                                border: '1px dashed rgba(133,194,38,0.5)',
                                color: '#85c226', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600,
                                transition: 'all 0.3s ease', minWidth: '200px', justifyContent: 'center'
                            }}>
                            {uploading ? (
                                <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Enviando...</>
                            ) : (
                                <><Upload size={18} /> Fazer Upload de Imagens</>
                            )}
                        </button>
                    </div>

                    {/* Thumbnails grid */}
                    {galleryImages.length > 0 ? (
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                            gap: '16px'
                        }}>
                            {galleryImages.map((img, index) => (
                                <div key={img.url + index}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    style={{
                                        position: 'relative', borderRadius: '10px', overflow: 'hidden',
                                        border: dragIndex === index ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)',
                                        background: '#111', cursor: 'grab', transition: 'border-color 0.2s',
                                        aspectRatio: '1/1'
                                    }}>
                                    <img src={img.url} alt={`Imagem ${index + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

                                    {/* Order badge */}
                                    <div style={{
                                        position: 'absolute', top: '8px', left: '8px',
                                        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                                        color: '#fff', padding: '4px 10px', borderRadius: '6px',
                                        fontSize: '0.75rem', fontWeight: 700, display: 'flex',
                                        alignItems: 'center', gap: '4px'
                                    }}>
                                        <GripVertical size={12} /> {index + 1}
                                    </div>

                                    {/* Delete button */}
                                    <button type="button" onClick={() => handleRemoveImage(index)}
                                        style={{
                                            position: 'absolute', top: '8px', right: '8px',
                                            background: 'rgba(239,68,68,0.8)', backdropFilter: 'blur(8px)',
                                            border: 'none', borderRadius: '6px', padding: '6px',
                                            cursor: 'pointer', color: '#fff', transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            padding: '40px', textAlign: 'center', borderRadius: '10px',
                            border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)'
                        }}>
                            <Image size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                            <p style={{ margin: 0 }}>Nenhuma imagem adicionada. Clique em "Fazer Upload" para começar.</p>
                        </div>
                    )}
                </div>

                {/* ----- VÍDEO YOUTUBE ----- */}
                <div className="form-group" style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Video size={16} style={{ color: 'var(--accent)' }} />
                        URL do Vídeo (YouTube) — Opcional
                    </label>
                    <input type="url" placeholder="https://www.youtube.com/watch?v=XXXX ou https://youtu.be/XXXX"
                        value={media.video_url || ''} onChange={e => setMedia({ ...media, video_url: e.target.value })} />
                    {ytId && (
                        <div style={{
                            marginTop: '12px', borderRadius: '8px', overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)', maxWidth: '400px', aspectRatio: '16/9'
                        }}>
                            <iframe width="100%" height="100%"
                                src={`https://www.youtube.com/embed/${ytId}`}
                                title="Preview do vídeo" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen style={{ border: 'none' }} />
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loadingMedia}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Save size={16} />
                    {loadingMedia ? 'Salvando...' : 'Salvar Mídia'}
                </button>
            </form>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
