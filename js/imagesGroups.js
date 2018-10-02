/**
* @file     imagesGroups.js
* @author   OD1KN0B - Oudayan Dutta
* @version  1.0
* @date     24-10-2017
* @brief    Textes et images pour chaque groupe d'images et niveaux:
* @details  Ajout d'un groupe d'image :
                Ajouter une nouvelle entrée dans imagesGroups (dupliquer { "id": ... à "level5" }, ).
                Modifier tout le texte de ce groupe d'images : titre du header, texte du menu drop-down et texte des boutons de chaque niveau.
                Assurez-vous d'avoir un "id" numérique unique et consécutif (ex: ne pas sauter de id=1 à id=4).
            Ajout d'images :
                Les groupes d'images et niveaux sont basés sur le tableau d'objet litéral imagesGroups dans ce fichier.
                On peut facilement rajouter des images et niveaux en ajoutant les données d'un nouveau groupe d'images dans cet objet litéral. 
                Il faut créer un dossier pour chaque groupe d'images dans le dossier /images/.
                Les images doivent être carrées, d'une dimention entre 400px et 800px et un multiple de 100px : 
                    Niveau 1 = 400px X 400px
                    Niveau 2 = 500px X 500px
                    Niveau 3 = 600px X 600px
                    Niveau 4 = 700px X 700px
                    Niveau 5 = 800px X 800px
                Le nom des images dans un même groupe doivent être identiques et finir par un chiffre de 1 à 5 (niveau) suivi de l'extension ".jpg". (ex: img1.jpg, img2.jpg, ...)
                Modifier le "imagePath" avec le chemin d'emplacement de l'image suivi du nom de l'image sans le niveau et extension (ex: dossier 1 : /images, dossier 2 : /Enki_Bilal, nom de fichier sans niveau et extension : /Enki_Bilal_).
*/

var imagesGroups = [
    {
        "id": "0",
        "headerTitle": "Puzzles Enki Bilal", 
        "menuItemName": "Enki Bilal - 5 niveaux/images", 
        "imagePath": "images/Enki_Bilal/Enki_Bilal_", 
        "level1": "Débutant (4 X 4) - Futuropolis", 
        "level2": "Novice (5 X 5) - Die Mauer Berlin", 
        "level3": "Intermédiaire (6 X 6) - Foire Aux Immortels", 
        "level4": "Avancé (7 X 7) - Exterminateur 17", 
        "level5": "Expert (8 X 8) - 32 Décembre"   
    },
    {
        "id": "1",
        "headerTitle": "Puzzles M. C. Escher", 
        "menuItemName": "M. C. Escher - 5 niveaux/images", 
        "imagePath": "images/MC_Escher/MC_Escher_", 
        "level1": "Débutant (4 X 4) - Waterfall", 
        "level2": "Novice (5 X 5) - Belvedere", 
        "level3": "Intermédiaire (6 X 6) - Concave Convex", 
        "level4": "Avancé (7 X 7) - Gallery", 
        "level5": "Expert (8 X 8) - Chameleon"
    },
    {
        "id": "2",
        "headerTitle": "Puzzles Star Wars", 
        "menuItemName": "Star Wars - 5 niveaux/images", 
        "imagePath": "images/Star_Wars/Star_Wars_", 
        "level1": "Débutant (4 X 4) - Darth Vader", 
        "level2": "Novice (5 X 5) - C3P0", 
        "level3": "Intermédiaire (6 X 6) - Boba Fett", 
        "level4": "Avancé (7 X 7) - Yoda", 
        "level5": "Expert (8 X 8) - Amidala"   
    },
    {
        "id": "3",
        "headerTitle": "Puzzles Génériques", 
        "menuItemName": "Générique - 5 niveaux", 
        "imagePath": "", 
        "level1": "Débutant (4 X 4)", 
        "level2": "Novice (5 X 5)", 
        "level3": "Intermédiaire (6 X 6)", 
        "level4": "Avancé (7 X 7)", 
        "level5": "Expert (8 X 8)"   
    },
];
