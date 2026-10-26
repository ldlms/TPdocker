FROM node:22-alpine
WORKDIR /app
COPY databases.json setup.mjs ./
CMD ["node", "setup.mjs"]
# on copie juste les fichiers qui nous interessent