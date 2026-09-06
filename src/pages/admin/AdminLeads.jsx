import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadLeads();
    }, []);

    async function loadLeads() {
        setLoading(true);
        const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        setLeads(data || []);
        setLoading(false);
    }

    async function updateStatus(id, newStatus) {
        await supabase.from('leads').update({ status: newStatus }).eq('id', id);
        await loadLeads();
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Orçamentos (Leads)</h1>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Solicitações de orçamento enviadas pelo site.</p>

            {loading ? <p>Carregando...</p> : (
                <div className="data-table-container">
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #333' }}>
                                <th style={{ padding: '16px 8px' }}>Data</th>
                                <th style={{ padding: '16px 8px' }}>Nome/Empresa</th>
                                <th style={{ padding: '16px 8px' }}>Contato</th>
                                <th style={{ padding: '16px 8px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map(lead => (
                                <tr key={lead.id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '16px 8px' }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <strong>{lead.name}</strong><br />
                                        <span style={{ fontSize: '0.85rem', color: '#999' }}>{lead.company || '-'}</span>
                                    </td>
                                    <td style={{ padding: '16px 8px' }}>
                                        {lead.phone}<br />
                                        <span style={{ fontSize: '0.85rem', color: '#999' }}>{lead.email}</span>
                                    </td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)} style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '6px', borderRadius: '4px' }}>
                                            <option value="new">Novo</option>
                                            <option value="contacted">Em Contato</option>
                                            <option value="closed">Fechado</option>
                                            <option value="archived">Arquivado</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Nenhuma solicitação recebida ainda.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
