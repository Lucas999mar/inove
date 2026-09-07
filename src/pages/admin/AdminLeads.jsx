import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MessageCircle, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [draggedLeadId, setDraggedLeadId] = useState(null);

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
        // Atualização Otimista na UI (instantânea para quem arrastou)
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
        // Salva silenciosamente no banco
        await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    }

    const handleDragStart = (e, id) => {
        setDraggedLeadId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, newStatus) => {
        e.preventDefault();
        if (draggedLeadId) {
            updateStatus(draggedLeadId, newStatus);
            setDraggedLeadId(null);
        }
    };

    const formatWhatsAppLink = (phone, name) => {
        if (!phone) return '#';
        const numbers = phone.replace(/\D/g, ''); // Extrai só os números
        const finalNumber = numbers.startsWith('55') ? numbers : `55${numbers}`;
        const message = encodeURIComponent(`Olá ${name}, rebemos sua solicitação de orçamento através do site da Inove Produtora. Como podemos te ajudar?`);
        return `https://wa.me/${finalNumber}?text=${message}`;
    };

    // Definição das colunas do Kanban
    const columns = [
        { id: 'new', title: '☀️ Novos (Caixa de Entrada)', borderColor: '#3b82f6' },
        { id: 'contacted', title: '💬 Em Atendimento', borderColor: '#f59e0b' },
        { id: 'closed', title: '✅ Win (Fechados)', borderColor: '#10b981' },
        { id: 'archived', title: '📦 Arquivados', borderColor: '#ef4444' }
    ];

    return (
        <div className="admin-leads-page">
            <style>{`
                .kanban-board {
                    display: flex;
                    gap: 20px;
                    overflow-x: auto;
                    padding-bottom: 20px;
                    min-height: 65vh;
                    align-items: flex-start;
                }
                .kanban-column {
                    flex: 1;
                    min-width: 320px;
                    background: #0a0a0a;
                    border-radius: 8px;
                    padding: 15px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    border-top: 4px solid transparent;
                    height: 100%;
                }
                .kanban-column-header {
                    font-weight: 600;
                    font-size: 1.05rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #222;
                    color: #eee;
                }
                .lead-card {
                    background: #161616;
                    border-radius: 8px;
                    padding: 18px;
                    border: 1px solid #262626;
                    cursor: grab;
                    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
                }
                .lead-card:hover {
                    border-color: #333;
                }
                .lead-card:active {
                    cursor: grabbing;
                    transform: scale(0.98);
                }
                .lead-card-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                }
                .lead-name {
                    font-weight: bold;
                    font-size: 1.15rem;
                    color: #fff;
                    flex: 1;
                    word-wrap: break-word;
                }
                .lead-date {
                    font-size: 0.75rem;
                    color: #666;
                    display: flex;
                    align-items: flex-start;
                    gap: 4px;
                    white-space: nowrap;
                }
                .lead-detail {
                    font-size: 0.85rem;
                    color: #aaa;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                .lead-message {
                    margin-top: 15px;
                    padding: 12px;
                    background: #111;
                    border-left: 2px solid #3b82f6;
                    border-radius: 4px;
                    font-size: 0.85rem;
                    color: #ccc;
                    position: relative;
                }
                .lead-message span {
                    display: block;
                    color: #666;
                    font-size: 0.75rem;
                    margin-bottom: 6px;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .btn-whatsapp {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    background: #1b8c42; /* Verde WhatsApp mas Dark-mode compativel */
                    color: #fff;
                    text-decoration: none;
                    padding: 12px;
                    border-radius: 6px;
                    margin-top: 15px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    transition: background 0.3s, transform 0.1s;
                }
                .btn-whatsapp:hover {
                    background: #25D366;
                }
                .btn-whatsapp:active {
                    transform: scale(0.97);
                }
                
                /* Barra de scroll bonita pra rolagem horizontal do painel e vertical */
                .kanban-board::-webkit-scrollbar {
                    height: 8px;
                }
                .kanban-board::-webkit-scrollbar-track {
                    background: #111;
                    border-radius: 4px;
                }
                .kanban-board::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 4px;
                }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h1>Quadro de Orçamentos 🚀</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                Arraste os cartões entre as colunas. Para iniciar uma negociação, clique no botão do WhatsApp nos detalhes do cliente.
            </p>

            {loading ? <p>Carregando pipeline de vendas...</p> : (
                <div className="kanban-board">
                    {columns.map(column => {
                        const columnLeads = leads.filter(l => (l.status || 'new') === column.id);
                        return (
                            <div
                                key={column.id}
                                className="kanban-column"
                                style={{ borderTopColor: column.borderColor }}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, column.id)}
                            >
                                <div className="kanban-column-header">
                                    {column.title}
                                    <span style={{ fontSize: '0.8rem', background: '#222', padding: '4px 10px', borderRadius: '20px' }}>
                                        {columnLeads.length}
                                    </span>
                                </div>

                                {columnLeads.map(lead => (
                                    <div
                                        key={lead.id}
                                        className="lead-card"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, lead.id)}
                                    >
                                        <div className="lead-card-header">
                                            <div className="lead-name">{lead.name}</div>
                                            <div className="lead-date">
                                                <Calendar size={12} style={{ marginTop: '2px' }} />
                                                {new Date(lead.created_at).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {lead.company && (
                                            <div className="lead-detail">🏢 {lead.company}</div>
                                        )}

                                        <div className="lead-detail">
                                            <Phone size={14} color="#888" /> {lead.phone}
                                        </div>
                                        <div className="lead-detail">
                                            <Mail size={14} color="#888" /> {lead.email}
                                        </div>

                                        {lead.message && (
                                            <div className="lead-message">
                                                <span>📝 Solicitação / Mensagem:</span>
                                                {lead.message}
                                            </div>
                                        )}

                                        <a
                                            href={formatWhatsAppLink(lead.phone, lead.name)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn-whatsapp"
                                        >
                                            <MessageCircle size={18} />
                                            Chamar no WhatsApp
                                        </a>
                                    </div>
                                ))}

                                {columnLeads.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#444', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                        Nenhum orçamento nesta fase.
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
