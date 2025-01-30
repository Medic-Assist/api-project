# Utilise une image Node.js récente pour éviter les problèmes de compatibilité
FROM node:18

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier uniquement package.json et package-lock.json pour optimiser le cache Docker
COPY package*.json ./

# Installer uniquement les dépendances en mode production
RUN npm install --omit=dev

# Copier le reste du projet
COPY . .

# Vérifier si app.js est bien copié
RUN ls -al /usr/src/app

# Définir les variables d'environnement pour PostgreSQL
ENV NODE_ENV=production
ENV DATABASE_URL=${DATABASE_URL}

# Exposer le port utilisé par l'application
EXPOSE 3000

# Lancer l'application
CMD ["node", "src/app.js"]