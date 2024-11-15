 ### Installation 

 Cloner le repo dans un dossier de votre choix. 

### Utilisation

Dans docker desktop ou dans un terminal de commande lancer wsl et créer l'image docker avec la commande suivante : 

```bash
docker-compose up --build
```


### Fonctionnalités

- API 

L'api est accessible à l'adresse suivante : http://localhost:3000/ et il suffit de recharger la page pour voir les changements en temps réel.

- Base de données

La base de données est accessible à l'adresse suivante : http://localhost:5432/. La base de données est approvisionné avec le fichier init si vous faites des changements à ce niveau la il faudra relancer l'image docker pour que les changements soient pris en compte.


### Dossiers

- src : contient le code source de l'api
    - routes : contient les routes de l'api
    - app.js : contient le code de l'api
    - db.js : contient la configuration de la base de données
- db : contient le fichier init.sql pour la base de données
- docker-compose.yml : contient la configuration de l'image docker
- Dockerfile : contient la configuration de l'image docker
- package.json : contient les dépendances du projet
- public : contient le fichier index.html


### Commandes utiles

- Pour supprimer avec les volumes (pratique quand les choses ne marchent pas correctement sans raison) : 

```bash
docker-compose down -v
```

- Pour lancer l'image docker : 

```bash
docker-compose up --build
```

- Pour arrêter l'image docker : 

```bash
docker-compose down
```

- Pour voir les images docker : 

```bash
docker images
```

- Pour voir les containers docker : 

```bash
docker ps
```

- Pour voir les logs d'un container : 

```bash
docker logs <container_id>
```

- Pour entrer dans un container : 

```bash
docker exec -it <container_id> /bin/bash
```

- Pour supprimer un container : 

```bash
docker rm <container_id>
```

- Pour supprimer une image : 

```bash
docker rmi <image_id>
```




