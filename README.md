# TinderDogs

**TinderDogs** est une application web qui permet de liker des chiens en fonction de leurs races. Le but de l'application est de trouver la race de chien que l'on souhaite adopter en fonction de ses goûts personnels, mais aussi grâce à quelques critères, dont voici la liste :
- Perte de poils
- Degré de vocalisation
- Énergie
- Protecteur
- Obéissant

## Fonctionnalités
- Générateur de chiens grâce à [Dogs API](https://api-ninjas.com/api/dogs) 
- Aimer ou ne pas aimer un chien via des boutons
- Aimer ou ne pas aimer un chien en le swipant avec les événements `mousedown`, `mousemove` et `mouseup`, ainsi que leurs équivalents pour les appareils mobiles avec `touch`
- Affichage des textes "NOPE" ou "LIKE" lorsqu'on commence à swiper vers la droite ou vers la gauche
- Stockage des chiens likés dans le `localStorage`
- Filtrer les chiens likés par nom
- Suppression des likes pour recommencer


## Installation
1. Clonez le dépôt :
`git clone https://github.com/Skitch49/tinder-dogs.git`

2. Ajouter un fichier environnement :
`ng generate environments`

3. Ajouter la clé API dans le nouveau fichier environment 
```typescript
export const environment = {
  apiKey: 'API_KEY_HERE',
};
```

4. Lancer l'application :
`ng serve`

## Lien vers le projet
Le projet est disponible en ligne à l'adresse suivante : https://tinder-dogs.alexis-delaunay.fr