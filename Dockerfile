# Utilise une image Node.js officielle
FROM node:16

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier uniquement package.json et package-lock.json pour optimiser le cache Docker
COPY package*.json ./

# Installer uniquement les dépendances en mode production
RUN npm install --only=production

# Copier le reste du projet
COPY . .

# Définir les variables d'environnement pour PostgreSQL
ENV NODE_ENV=production
ENV DATABASE_URL=${DATABASE_URL}

# Exposer le port utilisé par l'application
EXPOSE 3000

# Lancer l'application
CMD ["node", "app.js"]
