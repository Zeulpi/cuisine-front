# Étape 1 : utiliser une image Node.js officielle
FROM node:20

# Étape 2 : définir le dossier de travail dans le conteneur
WORKDIR /app

# Étape 3 : copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Étape 4 : installer les dépendances
RUN npm install

# Étape 5 : copier tout le reste du projet
COPY . .

# Étape 6 : exposer le port utilisé par React
EXPOSE 3000

# Étape 7 : lancer l'application
CMD ["npm", "start"]
