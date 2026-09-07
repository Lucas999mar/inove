const supabaseUrl = 'https://uxakxhkqqdojugkwfrrq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YWt4aGtxcWRvanVna3dmcnJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg5MjQ1OSwiZXhwIjoyMDgxNDY4NDU5fQ.UsMw4y6HARQbfPT3DCtyAUx70oiHO7FSGNAZaQqfNWw';

const services = [
  { title: 'Vídeos Institucionais', description: 'Fortaleça a imagem da sua empresa com vídeos e documentários que contam a sua essência corporativa.', icon: '📽️', order: 1, active: true },
  { title: 'Projetos Musicais', description: 'Gravação de videoclipes, DVDs e registros de shows ao vivo com máxima qualidade visual e sonora.', icon: '🎵', order: 2, active: true },
  { title: 'Conteúdo Digital', description: 'Comerciais e campanhas dinâmicas otimizadas para gerar engajamento nas redes sociais e mídias modernas.', icon: '📱', order: 3, active: true }
];

async function run() {
  const res = await fetch(\\/rest/v1/services\, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': \Bearer \\,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(services)
  });
  const data = await res.json();
  console.log('Inserted:', data);
}
run();
