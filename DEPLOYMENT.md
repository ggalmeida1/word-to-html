# Deployment Guide

Este guia irá te ajudar a fazer o deploy do Word-to-HTML SaaS em produção.

## 🚀 Deploy do Backend (Supabase)

### 1. Criar Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova organização e projeto
3. Anote a URL do projeto e as API keys

### 2. Deploy das Edge Functions

```bash
# Login no Supabase
supabase login

# Link com seu projeto remoto
supabase link --project-ref YOUR_PROJECT_REF

# Deploy das functions
supabase functions deploy convert-word
supabase functions deploy generate-api-key

# Deploy das migrações
supabase db push
```

### 3. Configurar Variáveis de Ambiente

No dashboard do Supabase, configure as variáveis:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🌐 Deploy do Frontend (Vercel)

### 1. Conectar Repositório

1. Acesse [vercel.com](https://vercel.com)
2. Importe seu repositório GitHub
3. Configure o diretório raiz como `frontend`

### 2. Configurar Variáveis de Ambiente

No dashboard da Vercel, adicione:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_BASE_URL=https://your-project.supabase.co/functions/v1
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 3. Deploy

```bash
# Build e deploy automático
git push origin main
```

## 🔧 Configurações Pós-Deploy

### 1. Atualizar CORS

No dashboard do Supabase, em Settings > API:
- Adicione seu domínio Vercel nos CORS origins

### 2. Configurar Domínio Customizado (Opcional)

Na Vercel:
1. Vá em Settings > Domains
2. Adicione seu domínio personalizado
3. Configure os DNS records

### 3. Monitoramento

- Configure alertas no Supabase Dashboard
- Monitore logs das Edge Functions
- Configure Vercel Analytics

## 📊 Variáveis de Ambiente Completas

### Supabase Functions
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_BASE_URL=https://your-project.supabase.co/functions/v1
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🚨 Checklist de Deploy

- [ ] Projeto Supabase criado
- [ ] Edge Functions deployadas
- [ ] Migrações aplicadas
- [ ] Variáveis de ambiente configuradas
- [ ] Frontend deployado na Vercel
- [ ] CORS configurado
- [ ] Teste da API em produção
- [ ] Monitoramento configurado

## 🔍 Troubleshooting

### Erro de CORS
- Verifique se o domínio está nas configurações de CORS do Supabase

### Edge Functions não funcionam
- Verifique se as variáveis de ambiente estão configuradas
- Confira os logs no dashboard do Supabase

### Frontend não carrega
- Verifique se todas as env vars estão configuradas na Vercel
- Confirme se o build passou sem erros

## 📈 Scaling

Para aplicações de alto volume:

1. **Supabase Pro**: Upgrade para plano Pro
2. **Edge Functions**: Configure auto-scaling
3. **Database**: Otimize queries e indexes
4. **CDN**: Configure Vercel Edge Network
5. **Monitoring**: Configure Sentry ou similar

## 🛡️ Segurança

- Mantenha as service role keys seguras
- Configure RLS policies apropriadas
- Use HTTPS em produção
- Monitore uso das API keys
- Configure rate limiting adequado

## 📞 Suporte

Se encontrar problemas:
1. Confira a documentação do Supabase
2. Verifique os logs das aplicações
3. Consulte a documentação da Vercel
4. Abra uma issue no repositório 