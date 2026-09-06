import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        async function loadSettings() {
            const { data } = await supabase.from('site_settings').select('*').single();
            if (data) setSettings(data);
        }
        loadSettings();
    }, []);

    return (
        <div>
            <h1>Dashboard Administrativo</h1>
            <p>Bem-vindo ao painel da produtora.</p>

            {settings ? (
                <div className="card">
                    <h3>Configurações Globais (Prévia)</h3>
                    <p>Slogan: {settings.slogan}</p>
                    <p>WhatsApp: {settings.whatsapp_display}</p>
                </div>
            ) : (
                <p>Nenhuma configuração localizada, verifique sua conexão com Supabase e as políticas RLS.</p>
            )}
        </div>
    );
}
