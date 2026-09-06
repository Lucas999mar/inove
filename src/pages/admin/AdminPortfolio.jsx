import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit2, Trash2, Plus, GripVertical } from 'lucide-react';

export default function AdminPortfolio() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);

    useEffect(() => {
        loadProjects();
    }, []);

    async function loadProjects() {
        setLoading(true);
        const { data } = await supabase.from('projects').select('*').order('order', { ascending: true });
        setProjects(data || []);
        setLoading(false);
    }

    function generateYoutubeThumb(url) {
        if (!url) return '';
        try {
            let videoId = '';
            if (url.includes('youtube.com/watch?v=')) {
                videoId = url.split('v=')[1].split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.includes('youtube.com/shorts/')) {
                videoId = url.split('shorts/')[1].split('?')[0];
            }
            if (videoId) return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            return '';
        } catch {
            return '';
        }
    }

    function handleEdit(proj = null) {
        if (proj) {
            setCurrentProject(proj);
        } else {
            setCurrentProject({
                title: '', client_name: '', youtube_url: '', cover_image: '',
                description: '', status: 'draft', is_featured: false
            });
        }
        setIsEditing(true);
    }

    async function handleSave(e) {
        e.preventDefault();
        setLoading(true);

        let cover = currentProject.cover_image;
        if (!cover && currentProject.youtube_url) {
            cover = generateYoutubeThumb(currentProject.youtube_url);
        }

        const projectData = {
            ...currentProject,
            cover_image: cover
        };

        if (projectData.id) {
            await supabase.from('projects').update(projectData).eq('id', projectData.id);
        } else {
            await supabase.from('projects').insert([projectData]);
        }

        setIsEditing(false);
        await loadProjects();
    }

    async function handleDelete(id) {
        if (window.confirm('Excluir este projeto permanentemente?')) {
            await supabase.from('projects').delete().eq('id', id);
            await loadProjects();
        }
    }

    if (isEditing && currentProject) {
        return (
            <div className="admin-form-container">
                <h2>{currentProject.id ? 'Editar Projeto' : 'Novo Projeto'}</h2>
                <form onSubmit={handleSave} className="admin-form">

                    <div className="form-group">
                        <label>Título do Projeto *</label>
                        <input type="text" value={currentProject.title} onChange={e => setCurrentProject({ ...currentProject, title: e.target.value })} required />
                    </div>

                    <div className="form-group">
                        <label>Cliente</label>
                        <input type="text" value={currentProject.client_name || ''} onChange={e => setCurrentProject({ ...currentProject, client_name: e.target.value })} />
                    </div>

                    <div className="form-group">
                        <label>Link do YouTube (Obrigatório para vídeos)</label>
                        <input
                            type="url"
                            placeholder="Ex: https://youtube.com/watch?v=..."
                            value={currentProject.youtube_url || ''}
                            onChange={e => setCurrentProject({ ...currentProject, youtube_url: e.target.value })}
                        />
                        <small style={{ color: 'var(--text-secondary)' }}>A miniatura será extraída automaticamente se deixar a capa em branco.</small>
                    </div>

                    <div className="form-group">
                        <label>Status de Publicação</label>
                        <select value={currentProject.status} onChange={e => setCurrentProject({ ...currentProject, status: e.target.value })}>
                            <option value="draft">Rascunho (Oculto)</option>
                            <option value="published">Publicado (Visível no site)</option>
                        </select>
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input type="checkbox" checked={currentProject.is_featured} onChange={e => setCurrentProject({ ...currentProject, is_featured: e.target.checked })} />
                            Destacar na Página Inicial
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Projeto'}</button>
                        <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancelar</button>
                    </div>
                </form>

                {currentProject.youtube_url && (
                    <div style={{ marginTop: '40px' }}>
                        <h3>Prévia do Vídeo</h3>
                        <img src={generateYoutubeThumb(currentProject.youtube_url)} alt="Thumbnail Preview" style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', marginTop: '10px' }} />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Portfólio de Vídeos</h1>
                <button className="btn btn-primary" onClick={() => handleEdit()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Adicionar Vídeo
                </button>
            </div>

            {loading ? <p>Carregando...</p> : (
                <div className="data-table-container">
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #333' }}>
                                <th style={{ padding: '16px 8px' }}>Projeto</th>
                                <th style={{ padding: '16px 8px' }}>Cliente</th>
                                <th style={{ padding: '16px 8px' }}>Status</th>
                                <th style={{ padding: '16px 8px' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(proj => (
                                <tr key={proj.id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '16px 8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <GripVertical size={16} color="#666" style={{ cursor: 'grab' }} />
                                        <img src={proj.cover_image || 'https://via.placeholder.com/64?text=Vídeo'} alt="" style={{ width: '64px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <span>
                                            {proj.title}
                                            {proj.is_featured && <span style={{ fontSize: '0.75rem', background: 'var(--accent)', color: '#000', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>Destaque</span>}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 8px' }}>{proj.client_name || '-'}</td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <span style={{ color: proj.status === 'published' ? '#25D366' : '#a1a1aa' }}>
                                            {proj.status === 'published' ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <button onClick={() => handleEdit(proj)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginRight: '16px' }} title="Editar">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(proj.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Excluir">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Nenhum vídeo cadastrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
