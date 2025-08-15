# Basé sur la documentation officielle Next.js
# https://github.com/vercel/next.js/tree/canary/examples/with-docker

FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Dans un monorepo, on doit copier tout le contexte
COPY . .

# Installer uniquement les dépendances d'OmniTask
RUN corepack enable pnpm && pnpm install --filter=@omnirealm/omni-task...

# Rebuild
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app ./

# Variables d'environnement pour le build
ENV NEXT_TELEMETRY_DISABLED=1

# IMPORTANT: Déclarer les ARG pour recevoir les variables de Coolify
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_URL
ARG SUPABASE_SERVICE_ROLE_KEY
ARG OPENAI_API_KEY

# IMPORTANT: Exposer les variables pour le build Next.js
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

# Build depuis le dossier omni-task
WORKDIR /app/dev/apps/omni-task

# Debug: Vérifier les variables d'environnement avant le build
RUN node scripts/debug-env.js || true

# Build l'application
RUN corepack enable pnpm && pnpm run build

# Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier les fichiers nécessaires
COPY --from=builder /app/dev/apps/omni-task/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/dev/apps/omni-task/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/dev/apps/omni-task/.next/static ./.next/static

USER nextjs

EXPOSE 3002

ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]