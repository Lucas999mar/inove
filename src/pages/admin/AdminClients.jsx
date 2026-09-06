import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit2, Trash2, Plus, GripVertical } from 'lucide-react';

export default function AdminClients() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        const { data } = await supabase.from('clients').select('*').order('order', { ascending: true });
        setItems(data || []);
        setLoading(false);
    }

    function handleEdit(item = null) {
        if (item) {
            setCurrentItem(item);
        } else {
            setCurrentItem({
                name: '', logo_url: '', active: true, order: 0
            });
        }
        setIsEditing(true);
    }

    async function handleSave(e) {
        e.preventDefault();
        setLoading(true);

        if (currentItem.id) {
            await supabase.from('clients').update(currentItem).eq('id', currentItem.id);
        } else {
            await supabase.from('clients').insert([currentItem]);
        }

        setIsEditing(false);
        await loadData();
    }

    async function handleDelete(id) {
        if (window.confirm('Excluir este cliente?')) {
            await supabase.from('clients').delete().eq('id', id);
            await loadData();
        }
    }

    if (isEditing && currentItem) {
        return (
            <div className="admin-form-container">
                <h2>{currentItem.id ? 'Editar Cliente' : 'Novo Cliente'}</h2>
                <form onSubmit={handleSave} className="admin-form">

                    <div className="form-group">
                        <label>Nome da Empresa *</label>
                        <input type="text" value={currentItem.name} onChange={e => setCurrentItem({ ...currentItem, name: e.target.value })} required />
                    </div>

                    <div className="form-group">
                        <label>Link da Logomarca (URL da Imagem com fundo transparente) *</label>
                        <input type="url" placeholder="Ex: https://..." value={currentItem.logo_url} onChange={e => setCurrentItem({ ...currentItem, logo_url: e.target.value })} required />
                        {currentItem.logo_url && (
                            <div style={{ padding: '20px', background: '#333', marginTop: '10px', display: 'inline-block', borderRadius: '8px' }}>
                                <img src={currentItem.logo_url} alt="Preview" style={{ height: '40px', objectFit: 'contain' }} />
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Cliente'}</button>
                        <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancelar</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Marcas e Clientes</h1>
                <button className="btn btn-primary" onClick={() => handleEdit()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Cadastrar Cliente
                </button>
            </div>

            {loading ? <p>Carregando...</p> : (
                <div className="data-table-container">
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #333' }}>
                                <th style={{ padding: '16px 8px' }}>Cliente</th>
                                <th style={{ padding: '16px 8px' }}>Logomarca</th>
                                <th style={{ padding: '16px 8px' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '16px 8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <GripVertical size={16} color="#666" style={{ cursor: 'grab' }} />
                                        <strong>{item.name}</strong>
                                    </td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <div style={{ background: '#333', padding: '10px', borderRadius: '4px', display: 'inline-block' }}>
                                            <img src={item.logo_url} alt="" style={{ height: '24px', objectFit: 'contain' }} />
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <button onClick={() => handleEdit(item)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginRight: '16px' }}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Nenhum cliente cadastrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
