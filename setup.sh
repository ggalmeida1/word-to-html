#!/bin/bash

echo "🚀 Setting up Word-to-HTML SaaS Project..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g @supabase/cli
fi

# Initialize Supabase (if not already initialized)
if [ ! -f "supabase/config.toml" ]; then
    echo "📦 Initializing Supabase project..."
    supabase init
fi

# Start Supabase services
echo "🔄 Starting Supabase services..."
supabase start

# Apply migrations
echo "📊 Applying database migrations..."
supabase db reset

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend

# Install dependencies
npm install

# Copy environment file
if [ ! -f ".env.local" ]; then
    cp .env.local.example .env.local
    echo "⚠️  Please edit frontend/.env.local with your Supabase credentials"
fi

cd ..

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit frontend/.env.local with your Supabase credentials"
echo "2. Run 'cd frontend && npm run dev' to start the frontend"
echo "3. Visit http://localhost:3000 to see your app"
echo ""
echo "🔗 Useful URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Supabase Studio: http://localhost:54323"
echo "- API Functions: http://localhost:54321/functions/v1"
echo ""
echo "🚀 Happy coding!" 