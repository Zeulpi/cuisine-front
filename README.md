<h1 align="center">Projet perso : App de cuisine</h1>
<h1 align="center">Front REACT</h1>
https://guillaume-besson.name/gb-cook/

<br />

Cette app React est un projet personnel. Il s'agit d'une app de cuisine pour la préparation et la planification de recettes hebdomadaires. Les features principales sont détaillées plus loin. Ce projet est entièrement réalisé en solo.
Il s'agit de la partie frontend de l'app seulement. Le back est réalisé en php avec symfony, et se trouve dans un autre repo (https://github.com/Zeulpi/cuisine)
L'objectif était de réaliser une app selon des critères pré-établis :
<ul>
<li> Back en php, avec symfony
<li> Front en React
<li> Front séparé du back, pour pouvoir plus tard expérimenter sur les parties back ou front selon d'autres technos (Node.js, VueJS, etc ...)
<li> Design et features établis avant le début du développement
<li> Mise en place et utilisation d'un environnement Docker
<li> Utilisation de React-redux pour la gestion du state global
<li> App responsive (desktop/mobile)
<li> Déploiement de l'app sur une plateforme d'hébergement
</ul>

<br />

## ⚡️ Features

```
Les features établies au début du projet étaient les suivantes
```
<ul>
<li> Listing de recettes et tri selon certaine critères (nom, tags, etc ...)
<li> Détail de chaque recette (prix, durée de préparation, ingrédients, étapes, etc ...)
<li> Déroulé des recettes pas à pas, affichage chronologique des etapes.
<li> Affichage responsive desktop/mobile
<li> Gestion de compte utilisateur sécurisé (login/logout, gestion des données perso, etc ...)
<li> Planning hebdomadaire par utilisateur
<li> Gestion d'inventaire par utilisateur
<li> Déterminer une liste de courses en fonction du planning hebdo
<li> Trouver les recettes réalisables en fonction de l'inventaire
</ul>

<br />

# 🚀 Libs externes (& autre) utilisées

<ul>
<li> Google grecaptcha v2
<li> React helmet
<li> Gestionnaire de state : React-redux
<li> Font-awesome
<li> Jwt Token manager
<li> Bootstrap
<li> Axios
</ul>

<br />

# 🧬 Project structure

This is the structure of the files in the project:

```sh
    │
    ├── public                  # public files (favicon, .htaccess, manifest, ...)
    ├── src                     # source files
    │   ├── components          # custom components
    │   ├── pages
    │   ├── resources           # images, constants and other static resources
    │   ├── store               # Redux store
    │   │   ├── actions         # store's actions
    │   │   └── reducers        # store's reducers
    │   ├── styles
    │   ├── tests               # all test files
    │   ├── types               # data interfaces
    │   ├── utility             # utilities functions
    │   ├── App.tsx
    │   ├── index.tsx
    │   ├── react-app-env.d.ts
    │   ├── RootComponent.tsx   # React component with all the routes
    │   ├── serviceWorker.ts
    │   └── setupTests.ts
    ├── .eslintrc.js
    ├── .gitignore
    ├── .prettierrc
    ├── package.json
    ├── README.md
    └── tsconfig.json
```