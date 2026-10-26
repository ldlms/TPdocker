FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci 
# on utilise le cache pour npm

FROM deps AS lint
COPY . .
CMD ["npm", "run", "lint"]
# linter front

FROM deps AS build
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf