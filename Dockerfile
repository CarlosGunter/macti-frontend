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

    ENV NEXT_TELEMETRY_DISABLED=0
    ENV NODE_ENV=production

    # Variables de entorno internas necesarias para la construcción.
    ENV NEXT_PUBLIC_EXTERNAL_API_URL=https://macti-api.onrender.com
    ENV NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
    ENV NEXT_PUBLIC_PROXY_API_URL=http://127.0.0.1:3000/api/proxy
    ENV NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=test-next-login
    ENV NEXT_PUBLIC_PRINCIPAL_KEYCLOAK_ISSUER=https://sso.lamod.unam.mx/auth/realms/macti3dev

    RUN pnpm run build

# Stage 2: Imagen final de producción (Runner)
FROM node:lts-alpine AS runner
    WORKDIR /app

    ENV NODE_ENV=production
    ENV NEXT_TELEMETRY_DISABLED=0
    ENV NODE_FLUSH_LOGS=1

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