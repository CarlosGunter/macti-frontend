# Stage 1: Construcción del proyecto (Builder)
FROM node:lts-alpine AS builder
    RUN apk add --no-cache libc6-compat
    WORKDIR /app

    # Habilitar corepack e instalar pnpm de forma global en esta capa
    RUN corepack enable && corepack prepare pnpm@latest --activate

    COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

    # Optimizador: Se monta el almacén virtual de pnpm de forma nativa en la caché de Docker.
    RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
        pnpm install --frozen-lockfile

    COPY . .

    ENV NEXT_TELEMETRY_DISABLED=1
    ENV NODE_ENV=production

    # Variables de entorno internas necesarias para la construcción.
    # Las variables privadas están mockeadas para evitar exponer información sensible.
    # En un entorno real, estas variables deberían ser proporcionadas de forma segura.
    ARG DATABASE_PROVIDER=supabase
    ENV DATABASE_PROVIDER=${DATABASE_PROVIDER}

    ARG SUPABASE_CONNECTION_STRING=supabase://user:password@host:port/database
    ENV SUPABASE_CONNECTION_STRING=${SUPABASE_CONNECTION_STRING}

    ARG BETTER_AUTH_SECRET=hRIEaCCX6qfeHBCAMvgMrdgaPKDzC1FE
    ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}

    ARG BETTER_AUTH_URL=http://localhost:3000
    ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}

    ENV NEXT_PUBLIC_EXTERNAL_API_URL=http://localhost:8000
    ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
    ENV NEXT_PUBLIC_PROXY_API_URL=http://localhost:3000/api/proxy
    ENV NEXT_PUBLIC_EXTERNAL_API_URL=https://macti-api.onrender.com
    ENV NEXT_PUBLIC_NODE_ENV=production
    ENV NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=local-next-login
    ENV NEXT_PUBLIC_PRINCIPAL_KEYCLOAK_ISSUER=https://sso.lamod.unam.mx/auth/realms/macti3dev

    RUN pnpm run build

# Stage 2: Imagen final de producción (Runner)
FROM node:lts-alpine AS runner
    WORKDIR /app

    # Solo para pruebas locales, esto no se ejecutará en GitHub Actions
    COPY .env.production.local* /app/

    ENV NODE_ENV=production
    ENV NEXT_TELEMETRY_DISABLED=1

    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs

    # Recuperamos exclusivamente el output standalone y los assets públicos.
    COPY --from=builder /app/public ./public
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

    USER nextjs
    EXPOSE 3000
    ENV PORT=3000
    ENV HOSTNAME="0.0.0.0"

    CMD ["node", "server.js"]