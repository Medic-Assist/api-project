 ### Installation 

 Cloner le repo dans un dossier de votre choix. 

### Utilisation

Dans docker desktop ou dans un terminal de commande créer l'image docker avec la commande suivante : 

```bash
docker-compose up --build
```


### Fonctionnalités

- API 

L'api est accessible à l'adresse suivante : http://localhost:3000/ et il suffit de recharger la page pour voir les changements en temps réel.

- Base de données

La base de données est accessible à l'adresse suivante : http://localhost:5353/. La base de données est approvisionné avec le fichier init si vous faites des changements à ce niveau la il faudra relancer l'image docker pour que les changements soient pris en compte.