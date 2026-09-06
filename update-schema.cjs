const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://uxakxhkqqdojugkwfrrq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YWt4aGtxcWRvanVna3dmcnJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg5MjQ1OSwiZXhwIjoyMDgxNDY4NDU5fQ.UsMw4y6HARQbfPT3DCtyAUx70oiHO7FSGNAZaQqfNWw';
async function run() {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseServiceKey, 'Authorization': `Bearer ${supabaseServiceKey}` },
        body: JSON.stringify({
            query: `
            ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_title TEXT DEFAULT 'História e Tradição';
            ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_text TEXT DEFAULT 'A Inove Produtora construiu, ao longo de 20 anos...';
            ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat_years INTEGER DEFAULT 20;
            ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat_projects INTEGER DEFAULT 1000;
        `})
    });
    console.log(await res.text());
}
run();
