# Word-to-HTML SaaS

Um microsaas para conversão de conteúdo do Microsoft Word para HTML limpo e otimizado.

## 🚀 Funcionalidades

- **Conversão Inteligente**: Remove formatação proprietária do Word mantendo estrutura essencial
- **Níveis de Limpeza**: Basic, Moderate e Aggressive
- **API REST**: Endpoint para integração com outras aplicações
- **Rate Limiting**: Controle de uso baseado em planos
- **Dashboard**: Interface para gestão de API keys e estatísticas
- **Documentação**: API reference completa com exemplos

## 🛠 Stack Tecnológica

- **Backend**: Supabase Edge Functions (Deno/TypeScript)
- **Frontend**: Next.js 14 com App Router
- **Database**: PostgreSQL (Supabase)
- **Styling**: Tailwind CSS
- **Deploy**: Vercel (Frontend) + Supabase (Backend)

## 🌐 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/word-to-html-saas&project-name=word-to-html-saas&repository-name=word-to-html-saas&root-directory=frontend&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_API_BASE_URL)

## 📦 Local Installation

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Supabase CLI
- Git

### 1. Clone o repositório

```bash
git clone <repository-url>
cd word-to-html-saas
```

### 2. Setup do Supabase

```bash
# Instalar Supabase CLI
npm install -g @supabase/cli

# Iniciar Supabase localmente
supabase start

# Executar migrações
supabase db reset
```

### 3. Configurar variáveis de ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar com suas credenciais do Supabase
# Obter as keys em: https://app.supabase.com/project/_/settings/api
```

### 4. Setup do Frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Deploy das Edge Functions

```bash
# Deploy das funções para Supabase
supabase functions deploy convert-word
supabase functions deploy generate-api-key
```

## 🚀 Vercel Deployment

### Method 1: One-Click Deploy

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `NEXT_PUBLIC_API_BASE_URL`: Your Supabase functions URL
4. Deploy!

### Method 2: Manual Deploy

1. **Fork this repository**

2. **Connect to Vercel:**
   ```bash
   npm i -g vercel
   vercel login
   vercel --cwd frontend
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_API_BASE_URL=https://your-project.supabase.co/functions/v1
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

4. **Deploy:**
   ```bash
   vercel --prod --cwd frontend
   ```

## 🔧 Configuração Local

### Supabase Local Development

```bash
# Iniciar todos os serviços
supabase start

# Ver logs das functions
supabase functions serve --debug

# Reset do banco (cuidado: apaga dados)
supabase db reset
```

### URLs Locais

- Frontend: http://localhost:3000
- Supabase Studio: http://localhost:54323
- API Functions: http://localhost:54321/functions/v1

## 📚 Uso da API

### Gerar API Key

```bash
curl -X POST https://your-project.supabase.co/functions/v1/generate-api-key \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "plan": "free"
  }'
```

### Converter HTML

```bash
curl -X POST https://your-project.supabase.co/functions/v1/convert-word \
  -H "Content-Type: application/json" \
  -d '{
    "content": "<p class=\"MsoNormal\">Texto do Word</p>",
    "options": {
      "cleanupLevel": "moderate",
      "preserveImages": true,
      "preserveTables": true,
      "removeComments": true
    },
    "apiKey": "wth_sua_api_key"
  }'
```

## 🎯 Planos de Preços

| Plano | Conversões/Mês | Preço |
|-------|----------------|-------|
| Free | 100 | Grátis |
| Starter | 2.000 | $9/mês |
| Pro | 10.000 | $29/mês |
| Enterprise | Custom | Custom |

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Vercel        │    │    Supabase      │    │   PostgreSQL    │
│   (Frontend)    │───▶│  (Edge Functions)│───▶│   (Database)    │
│   Next.js       │    │   Deno/TypeScript│    │   Users/Stats   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔥 Performance

- **Frontend**: Static generation + ISR
- **API**: Edge functions worldwide
- **Database**: Optimized queries with indexes
- **CDN**: Vercel Edge Network

## 📈 Scaling

- **Vercel Pro**: Para aplicações de alto tráfego
- **Supabase Pro**: Para mais recursos de banco
- **Custom domains**: Configure seu próprio domínio
- **Analytics**: Built-in Vercel Analytics

## 📖 Estrutura do Projeto

```
word-to-html-saas/
├── supabase/
│   ├── functions/
│   │   ├── convert-word/          # Função principal de conversão
│   │   ├── generate-api-key/      # Geração de API keys
│   │   └── _shared/               # Utilitários compartilhados
│   ├── migrations/                # Migrações do banco
│   └── config.toml               # Configuração do Supabase
├── frontend/                     # Aplicação Next.js
│   ├── app/                      # App Router (Next.js 14)
│   ├── components/               # Componentes React
│   └── lib/                      # Utilitários e configurações
├── vercel.json                   # Configuração Vercel
└── README.md
```

## 🧪 Testes

```bash
# Testes das Edge Functions
cd supabase/functions
deno test --allow-all

# Testes do Frontend
cd frontend
npm run test
```

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

- 📚 Documentação: [Deployment Guide](./DEPLOYMENT.md)
- 🐛 Issues: GitHub Issues
- 💬 Discord: [Join our community](#)
- 📧 Email: support@wordtohtml.dev

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/word-to-html-saas&type=Date)](https://star-history.com/#your-username/word-to-html-saas&Date) 