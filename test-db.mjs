import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://uxakxhkqqdojugkwfrrq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YWt4aGtxcWRvanVna3dmcnJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg5MjQ1OSwiZXhwIjoyMDgxNDY4NDU5fQ.UsMw4y6HARQbfPT3DCtyAUx70oiHO7FSGNAZaQqfNWw');

async function run() {
  const { data, error } = await supabase.from('services').select('*');
  console.log('Current DB Services:', data);
  
  if (!data || data.length === 0) {
      console.log('Inserting default services...');
      const { error: insertError } = await supabase.from('services').insert([
        { title: 'Vídeos Institucionais', description: 'Fortaleça a imagem da sua empresa com vídeos e documentários que contam a sua essência corporativa.', icon: '📽️', order: 1 },
        { title: 'Projetos Musicais', description: 'Gravação de videoclipes, DVDs e registros de shows ao vivo com máxima qualidade visual e sonora.', icon: '🎵', order: 2 },
        { title: 'Conteúdo Digital', description: 'Comerciais e campanhas dinâmicas otimizadas para gerar engajamento nas redes sociais e mídias modernas.', icon: '📱', order: 3 }
      ]);
      console.log('Insert Error:', insertError);
  }
}
run();
