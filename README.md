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

## 📦 Instalação

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
curl -X POST http://localhost:54321/functions/v1/generate-api-key \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "plan": "free"
  }'
```

### Converter HTML

```bash
curl -X POST http://localhost:54321/functions/v1/convert-word \
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

## 🚀 Deploy

### Frontend (Vercel)

1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Backend (Supabase)

```bash
# Login no Supabase
supabase login

# Link com seu projeto
supabase link --project-ref your-project-ref

# Deploy das functions
supabase functions deploy

# Deploy das migrações
supabase db push
```

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

- Documentação: http://localhost:3000/docs
- Issues: GitHub Issues
- Email: support@wordtohtml.dev 