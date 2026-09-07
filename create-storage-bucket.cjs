/**
 * Script para criar o bucket "media" no Supabase Storage
 * e configurar as políticas de acesso necessárias.
 * 
 * Uso: node create-storage-bucket.cjs
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://uxakxhkqqdojugkwfrrq.supabase.co';
// Precisamos do service_role key para operações admin de Storage
// Tente primeiro com a anon key (funciona se RLS permitir)
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[2];

if (!SUPABASE_KEY) {
    console.log('\n=== INSTRUÇÕES ===');
    console.log('');
    console.log('Este script precisa da SERVICE_ROLE KEY do Supabase.');
    console.log('Você encontra ela em:');
    console.log('  Supabase Dashboard → Settings → API → service_role (secret)');
    console.log('');
    console.log('Execute assim:');
    console.log('  node create-storage-bucket.cjs SUA_SERVICE_ROLE_KEY_AQUI');
    console.log('');
    console.log('=== OU CRIE MANUALMENTE ===');
    console.log('');
    console.log('1. Acesse: https://supabase.com/dashboard/project/uxakxhkqqdojugkwfrrq/storage/buckets');
    console.log('2. Clique em "New Bucket"');
    console.log('3. Nome: media');
    console.log('4. Marque "Public bucket"');
    console.log('5. Clique "Create bucket"');
    console.log('6. Depois vá em Policies e adicione:');
    console.log('   - "Allow authenticated uploads" para INSERT (authenticated)');
    console.log('   - "Allow public read" para SELECT (public)');
    console.log('   - "Allow authenticated delete" para DELETE (authenticated)');
    console.log('');
    console.log('=== OU USE O SQL EDITOR ===');
    console.log('');
    console.log('Cole este SQL no SQL Editor do Supabase:');
    console.log('');
    console.log(`INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media', 'media', true, 52428800, ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Leitura publica media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Upload autenticado media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "Update autenticado media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media');
CREATE POLICY "Delete autenticado media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media');`);
    console.log('');
    process.exit(0);
}

async function main() {
    console.log('🔄 Conectando ao Supabase...');

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false }
    });

    // 1. Criar bucket
    console.log('📦 Criando bucket "media"...');
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('media', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    });

    if (bucketError) {
        if (bucketError.message?.includes('already exists')) {
            console.log('✅ Bucket "media" já existe!');

            // Garantir que é público
            const { error: updateError } = await supabase.storage.updateBucket('media', {
                public: true,
                fileSizeLimit: 52428800,
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
            });

            if (updateError) {
                console.error('⚠️  Erro ao atualizar bucket:', updateError.message);
            } else {
                console.log('✅ Bucket atualizado para público!');
            }
        } else {
            console.error('❌ Erro ao criar bucket:', bucketError.message);
            console.log('\nTente criar manualmente pelo Dashboard do Supabase.');
            process.exit(1);
        }
    } else {
        console.log('✅ Bucket "media" criado com sucesso!');
    }

    // 2. Configurar políticas via SQL (usando rpc ou diretamente)
    console.log('🔐 Configurando políticas de acesso...');

    const policies = [
        {
            name: 'Leitura publica media',
            sql: `CREATE POLICY "Leitura publica media" ON storage.objects FOR SELECT USING (bucket_id = 'media');`
        },
        {
            name: 'Upload autenticado media',
            sql: `CREATE POLICY "Upload autenticado media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');`
        },
        {
            name: 'Update autenticado media',
            sql: `CREATE POLICY "Update autenticado media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media');`
        },
        {
            name: 'Delete autenticado media',
            sql: `CREATE POLICY "Delete autenticado media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media');`
        }
    ];

    for (const policy of policies) {
        const { error } = await supabase.rpc('exec_sql', { sql: policy.sql }).single();
        if (error) {
            if (error.message?.includes('already exists')) {
                console.log(`  ✅ Política "${policy.name}" já existe.`);
            } else {
                console.log(`  ⚠️  Política "${policy.name}": ${error.message} (configure manualmente se necessário)`);
            }
        } else {
            console.log(`  ✅ Política "${policy.name}" criada!`);
        }
    }

    console.log('\n🎉 Configuração concluída!');
    console.log('O upload de imagens no painel admin já deve funcionar.');
}

main().catch(console.error);
