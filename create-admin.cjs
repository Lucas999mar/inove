const supabaseUrl = 'https://uxakxhkqqdojugkwfrrq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YWt4aGtxcWRvanVna3dmcnJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg5MjQ1OSwiZXhwIjoyMDgxNDY4NDU5fQ.UsMw4y6HARQbfPT3DCtyAUx70oiHO7FSGNAZaQqfNWw';

async function createAdmin() {
    const email = 'contato@inoveprodutora.com.br';
    const password = '@InoveAdmin2024';

    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({
            email,
            password,
            email_confirm: true
        })
    });
    const json = await res.json();
    console.log(json);
}
createAdmin();
