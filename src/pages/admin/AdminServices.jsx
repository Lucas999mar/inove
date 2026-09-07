import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit2, Trash2, Plus, GripVertical } from 'lucide-react';

export default function AdminServices() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        const { data } = await supabase.from('services').select('*').order('order', { ascending: true });
        setItems(data || []);
        setLoading(false);
    }

    function handleEdit(item = null) {
        if (item) {
            setCurrentItem(item);
        } else {
            setCurrentItem({
                title: '', description: '', icon: '🎬', active: true
            });
        }
        setIsEditing(true);
    }

    async function handleSave(e) {
        e.preventDefault();
        setLoading(true);

        if (currentItem.id) {
            await supabase.from('services').update(currentItem).eq('id', currentItem.id);
        } else {
            await supabase.from('services').insert([currentItem]);
        }

        setIsEditing(false);
        await loadData();
    }

    async function handleDelete(id) {
        if (window.confirm('Excluir este serviço permanentemente?')) {
            await supabase.from('services').delete().eq('id', id);
            await loadData();
        }
    }

    if (isEditing && currentItem) {
        return (
            <div className="admin-form-container">
                <h2>{currentItem.id ? 'Editar Serviço' : 'Novo Serviço'}</h2>
                <form onSubmit={handleSave} className="admin-form">

                    <div className="form-group">
                        <label>Ícone Personalizado (Upload)</label>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            {currentItem.image_url ? (
                                <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                                    <img src={currentItem.image_url} alt="Ícone" style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
                                    <button type="button" onClick={() => setCurrentItem({ ...currentItem, image_url: null })} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', border: 'none', color: '#fff', borderRadius: '50%', cursor: 'pointer', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                                </div>
                            ) : (
                                <div style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '1.5rem' }}>
                                    {currentItem.icon}
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <input type="file" accept="image/*" onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setLoading(true);
                                    const fileExt = file.name.split('.').pop();
                                    const fileName = `services/${Math.random()}.${fileExt}`;
                                    const { error } = await supabase.storage.from('media').upload(fileName, file);
                                    if (!error) {
                                        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
                                        setCurrentItem({ ...currentItem, image_url: publicUrl, icon: '' });
                                    }
                                    setLoading(false);
                                }} style={{ width: '100%', padding: '10px', background: '#333', color: '#fff', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer' }} />
                                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '6px' }}>Ou você pode usar um Emoji simples texto abaixo:</p>
                                <input type="text" placeholder="Ex: 📱" value={currentItem.icon || ''} onChange={e => !currentItem.image_url && setCurrentItem({ ...currentItem, icon: e.target.value })} maxLength={5} style={{ width: '80px', textAlign: 'center', fontSize: '1.2rem', padding: '5px', marginTop: '5px' }} disabled={!!currentItem.image_url} />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Título do Serviço *</label>
                        <input type="text" value={currentItem.title} onChange={e => setCurrentItem({ ...currentItem, title: e.target.value })} required />
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea rows="4" value={currentItem.description || ''} onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} required></textarea>
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input type="checkbox" checked={currentItem.active} onChange={e => setCurrentItem({ ...currentItem, active: e.target.checked })} />
                            Serviço Ativo
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Serviço'}</button>
                        <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancelar</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Gerenciar Serviços</h1>
                <button className="btn btn-primary" onClick={() => handleEdit()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Novo Serviço
                </button>
            </div>

            {loading ? <p>Carregando...</p> : (
                <div className="data-table-container">
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #333' }}>
                                <th style={{ padding: '16px 8px' }}>Serviço</th>
                                <th style={{ padding: '16px 8px' }}>Status</th>
                                <th style={{ padding: '16px 8px' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '16px 8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <GripVertical size={16} color="#666" style={{ cursor: 'grab' }} />
                                        <span style={{ fontSize: '1.5rem', width: '40px', textAlign: 'center', display: 'inline-block' }}>
                                            {item.image_url ? (
                                                <img src={item.image_url} alt="icon" style={{ width: '32px', height: '32px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }} />
                                            ) : (
                                                item.icon
                                            )}
                                        </span>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <strong>{item.title}</strong>
                                            <span style={{ fontSize: '0.85rem', color: '#999' }}>{item.description?.substring(0, 50)}...</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <span style={{ color: item.active ? '#25D366' : '#a1a1aa' }}>
                                            {item.active ? 'Ativo' : 'Oculto'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <button onClick={() => handleEdit(item)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginRight: '16px' }} title="Editar">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Excluir">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Nenhum serviço cadastrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
