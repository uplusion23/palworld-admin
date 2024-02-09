# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1-alpine as base
WORKDIR /usr/src/app
ENV HUSKY=0
ENV NODE_ENV=production

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install-dev
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile --ignore-scripts

# install with --production (exclude devDependencies)
FROM base AS install-prod
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production --ignore-scripts

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS build-client

COPY . .
COPY --from=install-dev /temp/dev/node_modules node_modules
RUN bun next telemetry disable && \
    apk add npm && \
    npm run build:client

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install-prod /temp/prod/node_modules node_modules
COPY --from=build-client /usr/src/app/server server
COPY --from=build-client /usr/src/app/.next .next
COPY --from=build-client /usr/src/app/public public
COPY --from=build-client /usr/src/app/next.config.mjs /usr/src/app/next-env.d.ts /usr/src/app/tailwind.config.ts /usr/src/app/postcss.config.js ./
COPY --from=build-client /usr/src/app/*.json .

# run the app
USER bun
EXPOSE 2093/tcp
ENTRYPOINT [ "bun", "run", "start" ]
