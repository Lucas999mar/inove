-- =====================================================================================
-- SCHEMA DE BANCO DE DADOS: INOVE PRODUTORA
-- PLATAFORMA: SUPABASE / POSTGRESQL
-- DESCRIÇÃO: Estrutura relacional com foco em CMS puro, editabilidade total e segurança.
-- =====================================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. CONFIGURAÇÕES GERAIS (SITE SETTINGS)
-- ==========================================
CREATE TABLE site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    company_name TEXT DEFAULT 'Inove Produtora',
    slogan TEXT DEFAULT '20 anos transformando ideias em histórias que merecem ser vistas.',
    description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    colors JSONB DEFAULT '{"primary": "#ffffff", "secondary": "#1a1a1a", "accent": "#4a4a4a"}',
    whatsapp TEXT DEFAULT '5522999858893',
    whatsapp_display TEXT DEFAULT '(22) 99985-8893',
    whatsapp_message TEXT DEFAULT 'Olá! Conheci o trabalho da Inove Produtora pelo site e gostaria de solicitar um orçamento.',
    instagram_url TEXT DEFAULT 'https://www.instagram.com/inove_produtoraoficial/',
    address TEXT DEFAULT 'Macaé – Rio de Janeiro',
    analytics_script TEXT,
    pixel_script TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. NAVEGAÇÃO E PÁGINAS
-- ==========================================
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    meta_description TEXT,
    share_image TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE page_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    section_id TEXT NOT NULL, -- Ex: 'hero', 'about', 'services'
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    video_url TEXT,
    buttons JSONB DEFAULT '[]'::jsonb, -- Botoes tipo [{text: '', link: ''}]
    "order" INT DEFAULT 0,
    active BOOLEAN DEFAULT true
);

-- ==========================================
-- 3. SERVIÇOS
-- ==========================================
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    video_url TEXT,
    "order" INT DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. PORTFÓLIO E PROJETOS
-- ==========================================
CREATE TABLE project_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    "order" INT DEFAULT 0,
    active BOOLEAN DEFAULT true
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category_id UUID REFERENCES project_categories(id) ON DELETE SET NULL,
    client_name TEXT,
    year TEXT,
    description TEXT,
    youtube_url TEXT,
    cover_image TEXT,
    technical_info TEXT, -- Ficha técnica
    services_performed TEXT,
    is_featured BOOLEAN DEFAULT false,
    status TEXT CHECK(status IN ('draft', 'published')) DEFAULT 'draft',
    "order" INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    "order" INT DEFAULT 0
);

-- ==========================================
-- 5. CASES DE SUCESSO
-- ==========================================
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    challenge TEXT,
    objective TEXT,
    creative_idea TEXT,
    solution TEXT,
    steps TEXT,
    results TEXT,
    testimonial_text TEXT,
    testimonial_author TEXT,
    active BOOLEAN DEFAULT true
);

-- ==========================================
-- 6. CLIENTES E PROVA SOCIAL
-- ==========================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    segment TEXT,
    link TEXT,
    "order" INT DEFAULT 0,
    active BOOLEAN DEFAULT true
);

CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    company_role TEXT,
    photo_url TEXT,
    content TEXT NOT NULL,
    rating INT CHECK(rating BETWEEN 1 AND 5) DEFAULT 5,
    youtube_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    "order" INT DEFAULT 0,
    active BOOLEAN DEFAULT true
);

-- ==========================================
-- 7. LINHA DO TEMPO (HISTÓRIA) E EQUIPE
-- ==========================================
CREATE TABLE timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    "order" INT DEFAULT 0,
    active BOOLEAN DEFAULT true
);

CREATE TABLE team (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT,
    photo_url TEXT,
    bio TEXT,
    "order" INT DEFAULT 0,
    active BOOLEAN DEFAULT true
);

-- ==========================================
-- 8. LEADS (CONTATO E ORÇAMENTO)
-- ==========================================
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    company TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    project_type TEXT,
    city TEXT,
    deadline TEXT,
    message TEXT,
    privacy_consent BOOLEAN DEFAULT true,
    status TEXT CHECK(status IN ('new', 'contacted', 'closed', 'archived')) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) RIGOROSO
-- ==========================================

-- Habilita RLS em todas as tabelas
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- REGRA DE LEITURA PÚBLICA:
-- Visitantes podem selecionar apenas registros ativos/publicados
-- -------------------------------------------------------------
CREATE POLICY "Leitura pública settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Leitura pública pages" ON pages FOR SELECT USING (active = true);
CREATE POLICY "Leitura pública page_sections" ON page_sections FOR SELECT USING (active = true);
CREATE POLICY "Leitura pública services" ON services FOR SELECT USING (active = true);
CREATE POLICY "Leitura pública project_categories" ON project_categories FOR SELECT USING (active = true);
CREATE POLICY "Leitura pública projects" ON projects FOR SELECT USING (status = 'published');
CREATE POLICY "Leitura pública project_gallery" ON project_gallery FOR SELECT USING (true);
CREATE POLICY "Leitura pública cases" ON cases FOR SELECT USING (active = true);
CREATE POLICY "Leitura pública clients" ON clients FOR SELECT USING (active = true);
CREATE POLICY "Leitura pública testimonials" ON testimonials FOR SELECT USING (active = true);
CREATE POLICY "Leitura pública timeline" ON timeline FOR SELECT USING (active = true);
CREATE POLICY "Leitura pública team" ON team FOR SELECT USING (active = true);

-- -------------------------------------------------------------
-- REGRA DE INSERÇÃO PÚBLICA PARA LEADS (Formulário)
-- Visitantes podem INSERIR (criar) leads, mas nunca LER ou EDITAR.
-- -------------------------------------------------------------
CREATE POLICY "Visitante insere lead" ON leads FOR INSERT WITH CHECK (true);

-- -------------------------------------------------------------
-- REGRAS DO PROPRIETÁRIO (ADMIN):
-- O usuário autenticado (proprietário) pode fazer TUDO.
-- -------------------------------------------------------------
CREATE POLICY "Admin total settings" ON site_settings USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin total pages" ON pages USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin total page_sections" ON page_sections USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin total services" ON services USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin total project_categories" ON project_categories USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin total projects" ON projects USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin total project_gallery" ON project_gallery USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin total cases" ON cases USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin total clients" ON clients USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin total testimonials" ON testimonials USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin total timeline" ON timeline USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin total team" ON team USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin total leads" ON leads USING (auth.uid() IS NOT NULL);

-- ==========================================
-- SEMENTE INICIAL OBRIGATÓRIA (SEED)
-- ==========================================
INSERT INTO site_settings (id) VALUES ('global') ON CONFLICT DO NOTHING;
