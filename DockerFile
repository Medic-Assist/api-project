# Utilise une image de base officielle Node.js
FROM node:16

# Crée un répertoire de travail pour l'application
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json (si présent)
COPY package*.json ./

# Installer les dépendances de l'application (y compris nodemon localement)
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Exposer le port de l'application
EXPOSE 3000

# Utiliser nodemon pour démarrer l'application
ENTRYPOINT ["npx", "nodemon", "/usr/src/app/app.js"]
