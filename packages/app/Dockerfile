FROM node:22-slim AS build
RUN apt-get update && apt-get install -y python3 make g++
WORKDIR /app

# Copy config files to install dependencies
COPY .npmrc .npmrc
COPY lerna.json .
COPY package.json .
COPY packages/app/package.json ./packages/app/package.json
COPY yarn.lock .

# Install all dependencies and build
RUN yarn install --production=false
COPY packages/app/ ./packages/app/

ARG VITE_API_URL
ARG VITE_BRIDGE_URL
ARG VITE_HOSTNAMES
ARG VITE_ICON
ARG VITE_L2_CHAIN_ID
ARG VITE_L2_NETWORK_NAME
ARG VITE_MAINTENANCE
ARG VITE_NAME
ARG VITE_PUBLISHED
ARG VITE_RPC_URL
ARG VITE_BASE_TOKEN_ADDRESS
ARG VITE_VERIFICATION_API_URL

RUN VITE_API_URL=$VITE_API_URL \
    VITE_BRIDGE_URL=$VITE_BRIDGE_URL \
    VITE_HOSTNAMES=$VITE_HOSTNAMES \
    VITE_ICON=$VITE_ICON \
    VITE_L2_CHAIN_ID=$VITE_L2_CHAIN_ID \
    VITE_L2_NETWORK_NAME=$VITE_L2_NETWORK_NAME \
    VITE_MAINTENANCE=$VITE_MAINTENANCE \
    VITE_NAME=$VITE_NAME \
    VITE_PUBLISHED=$VITE_PUBLISHED \
    VITE_RPC_URL=$VITE_RPC_URL \
    VITE_BASE_TOKEN_ADDRESS=$VITE_BASE_TOKEN_ADDRESS \
    VITE_VERIFICATION_API_URL=$VITE_VERIFICATION_API_URL \
    yarn build

FROM node:22-slim

WORKDIR /app

# Copy all files. Package is copied entire from build phase
COPY .npmrc .npmrc
COPY lerna.json .
COPY package.json .
COPY packages/app ./packages/app
COPY --from=build /app/packages/app/dist ./packages/app/dist
COPY yarn.lock .

# Install only prod dependencies
RUN yarn install --production=true

RUN yarn global add http-server

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

ARG PORT=3010
ENV PORT=$PORT

WORKDIR /app/packages/app/dist

CMD http-server -p $PORT -c-1 --proxy http://127.0.0.1:$PORT?
