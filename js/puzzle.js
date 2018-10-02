/**
* @file     puzzle.js
* @author   OD1KN0B - Oudayan Dutta
* @version  1.0
* @date     24-10-2017
* @brief    Puzzles 4x4 à 8x8 avec différentes images :
* @details  Mécanique générale : 
                Les variables globales déclarée en début du script sont des instance unique d'un paramètre tout au long de la partie (ex: emptyX et emptyY donnent la position courante de la case vide, et il n'y a jamais 2 cases vides en même temps). La plupart des fonctions ne retournent pas de données, mais ré-écrivent directement les variables globales.
                Les cases et id du puzzle ne bougent pas; c'est le contenu (chiffre) et style (image) de chaque case qui est interchangé avec la case vide.
                La case vide est repérée avant chaque mouvement. Des eventListners sont ajoutés sur toutes les case qui sont dans la même rangée ou colonne que la case vide.
                Lorsqu'une case voisine est cliquée, le contenu des case est interchangé.
                Lorsqu'une case non-voisine mais dans la même rangée ou colonne est cliquée, on boucle à travers la différence des cases pour les interchanger une à une et ainsi "pousser" le bloc vers la case vide.
            Highscores :
                Il y a 8 highscores par niveau : le temps, les clicks, les mouvements et les points, le tout avec les chiffres affichés ou cachés. Puisqu'il y a plusieurs groupes d'images et niveaux, un tableau est créé pour storer toutes ces informations. Ce dernier est sérialisé et sauvegardé en localStorage. La tableau des highscore est subdivisé en plusieurs niveaux : groupe d'images (selon le fichier /js/imagesGroups.js), 5 niveaux, 2 type d'affichages, 4 catégories de records et 6 champs de données.
            Ajout d'images :
                Les groupes d'images et niveaux sont basés sur le tableau d'objet litéral imagesGroups, dans le fichier /js/imagesGroups.js. Plus de détails sont inscrits dans les commentaires de ce fichier.
            
            Toutes les fonction nécessaire au fonctionnement du puzzle :
                - createPuzzle() : Déclenchée par un onLoad de la page puzzle.html
                - findEmpty()
                - checkCells() : Déclenchée par un mouseOver de l'item html id="puzzle"
                - moveCell()
                - switchCells()
                - startPuzzle()
                - stopPuzzle()
                - checkPuzzleSolved()
                - numbersSwitch()
                - toggleNumbersVisibility()
                - shufflePuzzle()
                - changeImageGroup()
                - changeLevel()
                - changeHints()
                - startTimer()
                - pad()
                - timer()
                - loadHighscores()
                - checkHighscores()
                - displayScore()
                - displayNewHighscore
                - saveName()
                - saveHighscores()
                - displayLevelHighscores()
                - resetLevelHighscores()
                - resetAllHighscores()
*/


// Initialisation des variables globales
var level = 1;
var size = level + 3; // Génère un puzzle de 4 x 4 au niveau 1, 5 x 5 au niveau 2, etc...
var emptyX = size;
var emptyY = size;
var solved = false;
var imagesGroup = 0;
var imagePath = imagesGroups[0].imagePath;
var randomGenerationMode = false;
var showNumbers = 1; // 0 = Off - numéros cachés / 1 = On - Numéros affichés
var nbClicks = 0;
var nbMoves = 0;
var timer;
var seconds = 0;
var time = "00:00:00";
var points = 1000;
var name = "-";
var allHighscores;
var highscoreTime = false;
var highscoreClicks = false;
var highscoreMoves = false;
var highscorePoints = false;
var hintImage = document.getElementById("hintImage");



/**
 * @brief   Création des cases du puzzle
 * @detail  Création et insertion des éléments html du puzzle (basé sur la variable size), insertion des numéros de cases (sauf pour la dernière) et style css.
            Appelée par le window.addEventListener "load".
 */
function createPuzzle() {
    var count = 1;
    var puzzle = document.getElementById("puzzle");
    puzzle.innerHTML = "";
    puzzle.style.width = 102.8 * size;
    puzzle.style.height = 103 * size;
    // Création des rangées du puzzle
    for (var i = 1; i <= size; i++) {
        var row = document.createElement("div");
        var rowClass = "row_" + i;
        row.classList.add("rowClass");
        puzzle.appendChild(row);
        // Création des colonnes du puzzle
        for (var j = 1; j <= size; j++) {
            var cell = document.createElement("div");
            var cellId = "cell_" + i + "_" + j;
            cell.setAttribute("id", cellId);
            cell.classList.add("cell");
            row.appendChild(cell);
            if (size >= 4 && size <= 8) {
                if (imagesGroups[imagesGroup].imagePath != "") {
                    // Ajout de l'image découpé en section de 100px X 100px
                    cell.style.background = "url(" + imagePath + level + ".jpg) -" + (j - 1) + "00px -" + (i - 1) + "00px";
                }
                // Affichage de chiffres selon la variable globale showNumbers
                if (showNumbers == 0 && imagesGroups[imagePath] != "") {
                    cell.style.color = "rgba(255, 255, 255, 0)";
                    cell.style.textShadow = "0 0 0 rgba(0, 0, 0, 0)";
                } 
                else {
                    cell.style.color = "rgba(255, 255, 255, 0.7)";
                    cell.style.textShadow = "0 0 0 rgba(0, 0, 0, 0.7)";
                }
            }
            // Si la case n'est pas la dernière, mettre le count comme valeur de la case et incrémenter count
            if (count < size * size) {
                cell.innerHTML = count;
                count++;
            }
            // Mettre l'image de la dernière case (la case vide) avec 40% d'opacité pour la noircir
            else {
                cell.classList.toggle("empty");
                cell.style.opacity = "0.4";
            }
        }
    }
    // Mettre le bouton start visible
    document.getElementById("start").classList.remove("invisible");
    // Vérifier les Highscores
    loadHighscores();
    // Cacher le pop-up modal de fin de partie
    $('#gameEnd').modal({ show: false});
    // Créer les options dans le menu id="ImagesGroupMenuItems"
    var menuItems = document.getElementById("ImagesGroupMenuItems");
    menuItems.innerHTML = "";
    for (var opt = 0; opt < imagesGroups.length; opt++) {
        menuItems.innerHTML += "<button id='image_group_" + imagesGroups[opt].id + "' class='dropdown-item btn btn-secondary btn-block text-truncate' onclick='changeImageGroup(" + imagesGroups[opt].id + ", 1)'>" + imagesGroups[opt].menuItemName + "</button>";
    }
}

window.addEventListener("load", createPuzzle);


/**
 * @brief   Trouve quelle case est vide.
 * @detail  Trouve quelle case est vide et set les variables emptyX & emptyY. Efface aussi tous les eventListeners
            Appelée par les fonctions createPuzzle() et switchCells().
 */
function findEmpty() {
    for (var i = 1; i <= size; i++) {
        for (var j = 1; j <= size; j++) {
            var id = "cell_" + i + "_" + j;
            var cell = document.getElementById(id);
            cell.removeEventListener("click", moveCell);
            if (!cell.innerHTML.length) {
                emptyX = i;
                emptyY = j;
            }
            if (i == size && j == size) {
                cell.style.opacity = "1";
            }
        }
    }
    if (!randomGenerationMode) {
        stopPuzzle();
    }
}


/**
 * @brief   Détermine quelles cases sont cliquables
 * @detail  Si le puzzle n'est pas résolu, ajoute un addEventLister click sur toutes les cases dans la même rangéee ou colonne que la case vide.
            Appelée par puzzle.onmouseover (hover au dessus du puzzle)
 */
var puzzle = document.getElementById("puzzle");
puzzle.onmouseover = function checkCells() {
    for (var i = 1; i <= size; i++) {
        for (var j = 1; j <= size; j++) {
            if (i == emptyX || j == emptyY) {
                var id = "cell_" + i + "_" + j;
                var cell = document.getElementById(id);
                if (!solved && seconds > 0) {
                    cell.addEventListener("click", moveCell);
                }
            }
        }
    }
};


/**
 * @brief   Bouger les cases du puzzle
 * @detail  Détermine le nombre de cases à bouger et la direction.
            Si une case voisine, change le contenu avec la case vide.
            Si une case non-voisine mais dans la même rangée ou colonne, détermine le nombre de cellules à bouger et la direction vers la case vide
            Appelée par le addEventListener dans la fonction checkCells()
            Appelée par le removeEventListener dans la fonction checkEmpty()
            Appelée par la fonction shufflePuzzle() 
 * @param   event   Évènement click si appelé par un EventListener (checkCells() & checkEmpty()) OU texte (id de la cellule) si appellé de shufflePuzzle() 
 */
var moveCell = function (event) {
    var empty = document.getElementById("cell_" + emptyX + "_" + emptyY);
    var target = "";
    var clicked = "";
    // Si la fonction MoveCell() est appelée par un addEventListner
    if (event.target) {
        target = event.target;
        clicked = event.target.id;
        if (!randomGenerationMode) {
            nbClicks++;
            points--;
        }
    }
    // Si la fonction MoveCell() est appelée (de la fonction shufflePuzzle()) avec "non-event" passé un paramètre (ex : "cell_3_2")
    else {
        target = document.getElementById(event);
        clicked = event;
    }
    // Prend le id (ex: cell_4_1) de clicked, le sépare en array avec _ comme séparateur [cell, 4, 1] et enlève la première itération [cell] pour garder les positions X [4] et Y [1]
    var clickedPos = clicked.split("_").splice(1);
    var diffX = clickedPos[0] - emptyX;
    var diffY = clickedPos[1] - emptyY;
    // Click d'une case voisine
    if (Math.abs(diffX) == 1 || Math.abs(diffY) == 1) {
        switchCells(empty, target);
    }
    // Click d'une case non-voisine dans la même rangé ou colonne
    else {
        // Multi move up
        if (diffX > 1) {
            for (var i = 1; i <= Math.abs(diffX); i++) {
                empty = document.getElementById("cell_" + emptyX + "_" + emptyY);
                var multiMoveCell = document.getElementById("cell_" + ++emptyX + "_" + clickedPos[1]);
                switchCells(empty, multiMoveCell);
            }
        }
        // Multi move down
        if (diffX < -1) {
            for (var i = 1; i <= Math.abs(diffX); i++) {
                empty = document.getElementById("cell_" + emptyX + "_" + emptyY);
                var multiMoveCell = document.getElementById("cell_" + --emptyX + "_" + clickedPos[1]);
                switchCells(empty, multiMoveCell);
            }
        }
        // Multi move left
        if (diffY > 1) {
            for (var i = 1; i <= Math.abs(diffY); i++) {
                empty = document.getElementById("cell_" + emptyX + "_" + emptyY);
                var multiMoveCell = document.getElementById("cell_" + clickedPos[0] + "_" + ++emptyY);
                switchCells(empty, multiMoveCell);
            }
        }
        // Multi move right
        if (diffY < -1) {
            for (var i = 1; i <= Math.abs(diffY); i++) {
                empty = document.getElementById("cell_" + emptyX + "_" + emptyY);
                var multiMoveCell = document.getElementById("cell_" + clickedPos[0] + "_" + --emptyY);
                switchCells(empty, multiMoveCell);
            }
        }
    }
    // Mettre à jour l'affichage des clicks et moves
    document.getElementById("clicks").innerHTML = nbClicks;
    document.getElementById("moves").innerHTML = nbMoves;
};


/**
 * @brief   Échange du contenu et style css entre deux cases du puzzle
 * @detail  Échange le contenu et style de la case cliquée à la case vide, incrémente le nombre de mouvements et recherche la nouvelle case vide.
            Appelée par la fonction moveCell().
 * @param   empty   getElementById de la case vide.
 * @param   cell    getElementById de la case à bouger (cliquée).
 */
function switchCells(empty, cell) {
    empty.innerHTML = cell.innerHTML;
    cell.innerHTML = "";
    empty.classList.toggle("empty");
    empty.style.background = cell.style.background;
    cell.classList.toggle("empty");
    cell.style.background = "rgba(0, 0, 0, 0)";
    if (!randomGenerationMode) {
        nbMoves++;
        points--;
    }
    findEmpty();
}


/**
 * @brief   Démarrage du puzzle.
 * @detail  Brasse aléatoirement les cases du puzzle, commence le compteur de temps, met le boutton start invisible et affiche le numéros de cases ou image du puzzle solutionné selon le paramètre entré (hintNumbers)
            Appelée par le bouton id="start" dans puzzle.html
 */
function startPuzzle() {
    // Brasser le puzzle - simuler size au carré X 100 clicks
    shufflePuzzle(size * size * 100);
    //shufflePuzzle(1);
    // Mettre le bouton des chiffres invisible
    document.getElementById("hintNumbers").classList.add("invisible");
    // Mettre le bouton Start invisible
    document.getElementById("start").classList.add("invisible");
    // Switch pour la visibilité des chiffres. Affiche ou cache les chiffres de chaque case selon la vriable globale "showNumbers"
    toggleNumbersVisibility();
    // Partir le chronomètre
    startTimer();
}


/**
 * @brief   Arrêt du puzzle
 * @detail  Vérifie si le puzzle est complété. Si oui, affiche l'image de la case vide, affiche le modal "id=endGame" pour les scores et appelle la fonction checkHighscores() pour vérifier s'il y a de nouveaux records et les afficher
            Appelée par la fonction findEmpty()
 */
function stopPuzzle() {
    CheckPuzzleSolved();
    if (solved && nbClicks > 0 && nbMoves > 0) {
        // Arrêter le timer
        clearInterval(timer);
        // Si l'image existe, afficher la pièce manquante du puzzle
        if (imagesGroups[imagesGroup].imagePath != "") {
            var emptyCell = document.getElementById("cell_" + size + "_" + size);
            emptyCell.style.background = "url(" + imagePath + level + ".jpg) -" + (size - 1) + "00px -" + (size - 1) + "00px";
        }
        document.getElementById("score").classList.remove("text-primary");
        document.getElementById("score").classList.add("text-success");
        
        // Afficher le modal id="gameEnd" avec les résultats de la partie
        $('#gameEnd').modal('show');
        // Mettre l'autofocus sur le text input
        $('#gameEnd').on('shown.bs.modal', function() {
            $(this).find('input:first').focus();
        });
        // Vérifier si un record est battu
        checkHighscores();
    }
    else {
        document.getElementById("score").classList.add("text-primary");
        document.getElementById("score").classList.remove("text-success");
    }
}


/**
 * @brief   Détermine si le puzzle est complété.
 * @detail  Met la variable global 'solved' à true, vérifie l'ordre de chaque case avec 'count' et met 'solved' à false si l'ordre séquenciel n'est pas respecté.
            Appelée par la fonction findEmpty().
  */
function CheckPuzzleSolved() {
    solved = true;
    var count = 1;
    for (var i = 1; i <= size; i++) {
        for (var j = 1; j <= size; j++) {
            var id = "cell_" + i + "_" + j;
            var cell = document.getElementById(id);
            if (cell.innerHTML != count && count < size * size) {
                solved = false;
            }
            count++;
        }
    }
    toggleNumbersVisibility();
}


/**
 * @brief   Switch pour afficher ou non la numérotation des cellules
 * @detail  Switch de la variable booléenne globale "showNumbers" basé sur le contenu du bouton id="hintNumbers"
            Appelée par le bouton id="hintNumbers" dans puzzle.html
 */
function NumbersSwitch() {
    var hintNumbers = document.getElementById("hintNumbers");
    if (hintNumbers.innerHTML == "Cachez les chiffres") {
        showNumbers = 0;
        toggleNumbersVisibility();
        hintNumbers.innerHTML = "Affichez les chiffres";
        // Doubler les points si les chiffres sont cachés
        points = 2000 * level;
        document.getElementById("points").innerHTML = points;
        displayLevelHighscores();
        return;
    }
    if (hintNumbers.innerHTML == "Affichez les chiffres") {
        showNumbers = 1;
        toggleNumbersVisibility();
        hintNumbers.innerHTML = "Cachez les chiffres";
        // Remettre les points normaux si les chiffres sont affichés
        points = 1000 * level;
        document.getElementById("points").innerHTML = points;
        // Mettre à jour l'affichage des highscores
        displayLevelHighscores();
    }
}


/**
 * @brief   Affiche ou efface la numérotation des cellules
 * @detail  Met la couleur du texte (numérotation) transparente pour toutes les cases du puzzle, s'il est solutionné ou si le bouton showNumbers est dé-cliqué
            Appelée par les fonction startPuzzle(), CheckPuzzleSolved() et NumbersSwitch()
 */
function toggleNumbersVisibility() {
    for (var i = 1; i <= size; i++) {
        for (var j = 1; j <= size; j++) {
            var id = "cell_" + i + "_" + j;
            var cell = document.getElementById(id);
            if (solved || (showNumbers == 0 && imagesGroups[imagePath] != "" && (size >= 4 && size <= 8))) {
                cell.style.color = "rgba(0, 0, 0, 0)";
                cell.style.textShadow = "0 0 0 rgba(0, 0, 0, 0)";
            }
            else {
                cell.style.color = "#fff";
                cell.style.textShadow = "0 0 3px #111";
            }
        }
    }
}


/**
 * @brief   Brasse aléatoirement les cases du puzzle.
 * @detail  À partir du tableau complété, brasse les cases selon le nombre de mouvements entré en paramètre.
            Appelée par les fonctions createPuzzle() et startPuzzle().
 * @param   int     clicks  Nombre de clicks à simuler
 */
function shufflePuzzle(clicks) {
    // Switch pour enlever les compteurs nbClicks & nbMoves et enlever l'appel de stopPuzzle() lors du processus de brassage
    randomGenerationMode = true;
    for (var h = 1; h <= clicks; h++) {
        var possibleMoves = [];
        for (var i = 1; i <= size; i++) {
            for (var j = 1; j <= size; j++) {
                if ((i == emptyX || j == emptyY) && !(i == emptyX && j == emptyY)) {
                    possibleMoves.push("cell_" + i + "_" + j);
                }
            }
        }
        // Brasser le tableau possibleMoves aléatoirement
        possibleMoves.sort(function (a, b) {
            return 0.5 - Math.random()
        });
        // Bouger la première cellule du tableau possibleMoves
        moveCell(possibleMoves[0]);
    }
    // Mettre la switch randomGenerationMode à off pour revenir au mode normal.
    randomGenerationMode = false;
    // Chercher la case vide.
    findEmpty();
}


/**
 * @brief   Changer de groupe d'images
 * @detail  Change la rérérence de l'emplacement des images et met à jour le texte des boutons id="level1" à id="level5" dans puzzle.html.
            Appelée par les boutons avec les du dropdown id=s"electImageGroup" dans puzzle.html.
 * @param   int     ig      Identifiant unique du groupe d'images
 * @param   int     lvl     Niveau de 1 à 5
 * @param   int     nums    Affichage des chiffres, 0 ou 1
 */
function changeImageGroup(ig, lvl, nums) {
    imagesGroup = imagesGroups[ig].id;
    imagePath = imagesGroups[ig].imagePath;
    document.getElementById("headerTitle").innerHTML = imagesGroups[ig].headerTitle;
    document.getElementById("level1").innerHTML = imagesGroups[ig].level1;
    document.getElementById("level2").innerHTML = imagesGroups[ig].level2;
    document.getElementById("level3").innerHTML = imagesGroups[ig].level3;
    document.getElementById("level4").innerHTML = imagesGroups[ig].level4;
    document.getElementById("level5").innerHTML = imagesGroups[ig].level5;
    // Appel de la fonction changeLevel() pour l'initialisation des variables globales
    changeLevel(lvl, nums);
    // Arrêter le timer
    clearInterval(timer);
}


/**
 * @brief   Changer de niveau
 * @detail  Ré-initialise les variables globales, créé un nouveau puzzle et ajoute une bordure au boutton actif.
            Appelée par les boutons avec les id=level1 à id=level5 dans puzzle.html et par la fonction changeImageGroup(), 
 * @param   int     lvl     Niveau de 1 à 5.
 * @param   int     nums    Affichage des chiffres 0 = off / 1 = on.
 */
function changeLevel(lvl, nums) {
    // Ré-initialiser les variables globales
    level = lvl;
    size = lvl + 3;
    emptyX = size;
    emptyY = size;
    solved = false;
    // Changer l'image id="hintImage" et bouton id="hintNumbers"
    changeHints();
    nbClicks = 0;
    document.getElementById("clicks").innerHTML = nbClicks;
    nbMoves = 0;
    document.getElementById("moves").innerHTML = nbMoves;
    // Arrêter le timer
    clearInterval(timer);
    seconds = 0;
    time = "00:00:00";
    document.getElementById("time").innerHTML = time;
    document.getElementById("score").classList.add("text-primary");
    document.getElementById("score").classList.remove("text-success");
    points = (showNumbers == 1 ? 1000 : 2000) * level;
    document.getElementById("points").innerHTML = points;
    highscoreTime = false;
    highscoreClicks = false;
    highscoreMoves = false;
    highscorePoints = false;
    displayLevelHighscores();
    // Effacer les messages de nouveaux records
    document.getElementById("newHighscores").innerHTML = "";
    name = "--";
    $('#gameEnd').modal({ show: false });
    document.getElementById("nameInput").classList.add("invisible");
    document.getElementById("gameEndClose").setAttribute("onclick","changeLevel(" + lvl + ")");
    // Créer un nouveau puzzle selon les nouveaux paramètres globaux
    createPuzzle();
    // Ajouter du style aux bordure de boutons de niveaux (2 px noir pour le bouton actif)
    for (var i = 1; i <= 5; i++) {
        var active = document.getElementById("level" + i);
        if (i == lvl) {
            active.style.border = "2px solid #2d314d";
        } else {
            active.style.border = "1px solid #bfbfbf";
        }
    }
}


/**
 * @brief   Changer l'image du id="hintImage" et bouton id="hintNumbers"
 * @detail  Si "imagePath" est défini dans le groupe d'image présent du tableau d'objet litéral imagesGroups (dans le fichier /js/imagesGroups.js), afficher l'image du id="hintImage" et mettre le bouton id="hintNumbers" visible, sinon les deux invisibles.
            Appelée par la fonction changeLevel()
 */
function changeHints() {
    var hintImage = document.getElementById("hintImage");
    var hintNumbers = document.getElementById("hintNumbers");
    if (imagesGroups[imagesGroup].imagePath != "") {
        hintImage.classList.remove("invisible");
        // Changer l'image du id="hintImage"
        document.getElementById("hintImage").src = imagePath + level + ".jpg";
        // Changer le texte du bouton id="hintNumbers"
        hintNumbers.classList.remove("invisible");
        hintNumbers.innerHTML = (showNumbers == 1 ? "Cachez les chiffres" : "Affichez les chiffres");
    }
    else {
        showNumbers = 1;
        hintImage.classList.add("invisible");
        hintNumbers.classList.add("invisible");
    }
}

    
/**
 * @brief   Chronomètre pour complété le puzzle
 * @detail  Regrouper les fonctions pad() et timer()
            Appelée par la fonction startPuzzle().
 * @source  Inspiré de : https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
 */
function startTimer() {
    /**
     * @brief   Ajoute un 0 devant le chiffres plus petits que 10.
     * @param   int     val     Valeur numérique  
     * @return  int     Un chiffre d'une longuer d'au moins 2 (ex: 09)
     */
    function pad(val) {
        return val > 9 ? val : "0" + val;
    }

    /**
     * @brief   Ajoute un 0 devant le chiffres plus petits que 10.
     * @detail  Incrémenter les secondes, calculer les minutes & heures et écrire les valeurs dans le document html.
                Un setInterval d'une seconde est assigné à la fonction timer() (clearInerval appelé de stopPuzzle et changeLevel).
     */
    timer = setInterval(function () {
        // Chronomètre
        var ss = pad(++seconds % 60);
        var mm = pad(parseInt(seconds / 60 % 60, 10));
        var hh = pad(parseInt(seconds / 60 / 60 % 24, 10));
        time = hh + ":" + mm + ":" + ss;
        document.getElementById("time").innerHTML = time;
        // Décrémentation des points
        points--;
        document.getElementById("points").innerHTML = points;
    }, 1000);
}


/**
 * @brief   Vérifier s'il existe des highscores dans le localStorage et créé un tableau de highscore si aucun est présent.
 * @detail  Créé un tableau à 5 niveaux : 2 groupe d'images (basé sur la longueur du tableau ImagesGroups qui contient les infos de chaque niveau), 5 niveaux, 2 types d'affichages (avec & sans chiffres) et 4 catégories de highscores.
            Si de nouveaux imagesGroups ont été rajoutés à imagesGroups dans /js/imagesGroups.js, créé et initialise les nouveaux imagesGroups et niveaux
            Appelée par les fonctions createPuzzle() et resetAllHighscores()
 */
function loadHighscores() {
    // Vérifie en localStorage si des highscore sont présents
    if (localStorage.Highscores) {
        // Dé-sérialise le tableau de highscores
        allHighscores = JSON.parse(localStorage.Highscores);
        // Vérifie si de nouveaux imagesGroups ont été rajouté
        if (allHighscores.length < imagesGroups.length) {
            // Initialise les tableaux de highscore des nouveaux imagesGroups
            for (var ig = allHighscores.length; ig < imagesGroups.length; ig++) {
                allHighscores[ig] = [];
                // Boucler à travers les 5 niveaux : Level 1 = 0 / ... / Level 5 = 4
                for (var lvl = 0; lvl < 5; lvl++) {
                    allHighscores[ig][lvl] = [];
                    // Boucler à travers les 2 affichages : Show numbers = 0 / Hide numbers = 1
                    for (var numbers = 0; numbers < 2; numbers++) {
                        allHighscores[ig][lvl][numbers] = [];
                        // Boucler à travers les catégories de Highscores
                        for (var hsCat = 0; hsCat < 4; hsCat++) {
                        allHighscores[ig][lvl][numbers][hsCat] = [];
                            // Boucler à travers les données du highscore
                            for (var data = 0; data < 6; data++) {
                              allHighscores[ig][lvl][numbers][hsCat][data] = [];
                              if (data == 2) {
                                    allHighscores[ig][lvl][numbers][hsCat][data] = "--:--:--";
                                }
                                else {
                                    allHighscores[ig][lvl][numbers][hsCat][data] = "-";
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // Si aucun localStorage, créé un nouveau tableau de highscore vide
    else {
        allHighscores = [];
        // Boucler à travers les 2 groupes d'images : M.C. Escher Image Group = 0 / Enki Bilal Image Group = 1
        for (var ig = 0; ig < imagesGroups.length; ig++) {
            allHighscores[ig] = [];
            // Boucler à travers les 5 niveaux : Level 1 = 0 / ... / Level 5 = 4
            for (var lvl = 0; lvl < 5; lvl++) {
                allHighscores[ig][lvl] = [];
                // Boucler à travers les 2 affichages : Show numbers = 0 / Hide numbers = 1
                for (var numbers = 0; numbers < 2; numbers++) {
                    allHighscores[ig][lvl][numbers] = [];
                    // Boucler à travers les catégories de Highscores
                    for (var hsCat = 0; hsCat < 4; hsCat++) {
                        allHighscores[ig][lvl][numbers][hsCat] = [];
                        // Boucler à travers les données du highscore
                        for (var data = 0; data < 6; data++) {
                            allHighscores[ig][lvl][numbers][hsCat][data] = [];
                            if (data == 2) {
                                allHighscores[ig][lvl][numbers][hsCat][data] = "--:--:--";
                            }
                            else {
                                allHighscores[ig][lvl][numbers][hsCat][data] = "-";
                            }
                        }
                    }
                }
            }
        }
    }
    // Afficher les Highscores pour le niveau courant
    displayLevelHighscores();
}


/**
 * @brief   Vérifier s'il y a de nouveaux meilleurs scores (meilleurs temps, nombre de clicks, nombre de mouvements et nom)
 * @detail  Vérifie chaque highscore et si au moins un est battu, demande le nom, sauvegarde les highscores et met à jour l'affichage
            Appelée par la fonction stopPuzzle()
 */
function checkHighscores() {
    // Boucler à travers les 2 groupes d'images
    for (var ig = 0; ig < imagesGroups.length; ig++) {
        // Boucler à travers les 5 niveaux
        for (var lvl = 0; lvl < 5; lvl++) {
            // Boucler à travers les 2 affichages : Show numbers = 0 / Hide numbers = 1
            for (var numbers = 0; numbers < 2; numbers++) {
                // Vérifier si des records on été battu
                if (ig == imagesGroup && lvl == level - 1 && showNumbers == numbers) {
                    // 1 = Time
                    if (seconds < allHighscores[ig][lvl][numbers][0][1] || allHighscores[ig][lvl][numbers][0][1] == "-") {
                        highscoreTime = true;
                    }
                    // 2 = Clicks
                    if (nbClicks < allHighscores[ig][lvl][numbers][1][3] || allHighscores[ig][lvl][numbers][1][3] == "-") {
                        highscoreClicks = true;
                    }
                    // 3 = Moves
                    if (nbMoves < allHighscores[ig][lvl][numbers][2][4] || allHighscores[ig][lvl][numbers][2][4] == "-") {
                        highscoreMoves = true;
                    }
                    // 4 = Points
                    if (points > allHighscores[ig][lvl][numbers][3][5] || allHighscores[ig][lvl][numbers][3][5] == "-") {
                        highscorePoints = true;
                    }
                }
            }
        }
    }
    // Afficher les score 
    displayScore();
    // S'il y a un nouveau highscore
    if (highscoreTime || highscoreClicks || highscoreMoves || highscorePoints) {
        // Ajouter le texte pour les nouveaux highscores dans le modal de fin de puzzle
        displayNewHighscore();
        document.getElementById("gameEndClose").classList.add("invisible");
        // Sauvegarder le nom
        saveName();
    }
}


/**
 * @brief   Afficher les scores
 * @detail  Afficher les résultats de la partie dans le modal id="gameEnd" (pop-up de fin de partie)
            Appelée par la fonction checkHighscores()
 */
function displayScore() {
    // Mettre à jour l'affichage des résultats de la partie
    var gameEnd = document.getElementById("gameEndPoints");
    gameEnd.innerHTML = "<div class='text-success h5 m-1'>Temps&nbsp;: " + time + "</div><div class='text-success h5 m-1'>Clicks&nbsp;: " + nbClicks + "</div><div class='text-success h5 m-1'>Mouvements&nbsp;: " + nbMoves + "</div><div class='text-success h5 m-1'>Points&nbsp;: " + points + "</div>";
};
        

/**
 * @brief   Afficher les nouveaux highscores
 * @detail  Afficher les nouveaux highscores de la partie (meilleurs temps / nombre de clicks / nombre de mouvements / nom) dans le modal id="gameEnd" (pop-up de fin de partie)
            Appelée par la fonction checkHighscores()
 */
function displayNewHighscore() {
    // Mettre à jour l'affichage des résultats de la partie
    var gameEnd = document.getElementById("gameEndPoints");
    gameEnd.innerHTML = "<div class='text-success h5 m-1'>Temps&nbsp;: " + time + "</div><div class='text-success h5 m-1'>Clicks&nbsp;: " + nbClicks + "</div><div class='text-success h5 m-1'>Mouvements&nbsp;: " + nbMoves + "</div><div class='text-success h5 m-1'>Points&nbsp;: " + points + "</div>";
    // Ajouter le texte pour chaque nouveau highscore
    var newHighscores = document.getElementById("newHighscores");
    if (highscoreTime) {
        newHighscores.innerHTML += "<h5 class='text-danger mx-1'>Record du meilleur temps battu !</h5>";
    }
    if (highscoreClicks) {
        newHighscores.innerHTML += "<h5 class='text-danger mx-1'>Record du moins de clicks battu !</h5>";
    }
    if (highscoreMoves) {
        newHighscores.innerHTML += "<h5 class='text-danger mx-1'>Record du moins de mouvements battu !</h5>";
    }
    if (highscorePoints) {
        newHighscores.innerHTML += "<h5 class='text-danger mx-1'>Record des meilleurs points battu !</h5>";
    }
}
        

/**
 * @brief   Saisir le nom pour les highscores
 * @detail  Affiche la div "id=nameInput" pour saisir le nom. Si le nom est vide, le bouton "id=gameEndClose" est caché, sinon, est affiché.
            Le nom et autre highscores sont enrégistrés lorsqu'on sort de l'input (blur) "id=hsName".
            Appelée par la fonction checkHighscores()
 */
function saveName() {
    var nameInput = document.getElementById("nameInput");
    var gameEndClose = document.getElementById("gameEndClose");
    var typedName = document.getElementById("hsName");
    nameInput.classList.remove("invisible");
    typedName.addEventListener("input", function() {
        if (typedName.value.trim() != "") {
            gameEndClose.classList.remove("invisible");
        }
        else {
            gameEndClose.classList.add("invisible");
        }
    });
    if (typedName.value.trim() != "") {
        gameEndClose.classList.remove("invisible");
    }
     typedName.addEventListener("blur", function() {
        name = typedName.value.trim();
        // Sauvegarder les highscores
        saveHighscores();
        // Mettre à jour l'affichage des highscores du niveau (drop-down)
        displayLevelHighscores();
    });
};


/**
 * @brief   Sauvegarder les meilleurs scores du niveau courant
 * @detail  Sauvegarder le nom, meilleur temps, nombre de clicks, nombre de mouvements et points pour chaque catégorie de highscores
            Appelée par les fonctions saveName() et resetLevelHighscores()
 */
function saveHighscores() {
    // Boucler à travers les 2 groupes d'images
    for (var ig = 0; ig < imagesGroups.length; ig++) {
        // Boucler à travers les 5 niveaux
        for (var lvl = 0; lvl < 5; lvl++) {
            // Boucler à travers les 2 affichages : Show numbers = 0 / Hide numbers = 1
            for (var numbers = 0; numbers < 2; numbers++) {
                // Sauvegarder les données de cet imageGroup / niveau / affichage des numéros
                if (ig == imagesGroup && lvl == level - 1 && showNumbers == numbers) {
                    // Temps
                    if (highscoreTime) {
                        allHighscores[ig][lvl][numbers][0][0] = name;
                        allHighscores[ig][lvl][numbers][0][1] = seconds;
                        allHighscores[ig][lvl][numbers][0][2] = time;
                        allHighscores[ig][lvl][numbers][0][3] = nbClicks;
                        allHighscores[ig][lvl][numbers][0][4] = nbMoves;
                        allHighscores[ig][lvl][numbers][0][5] = points;
                    }
                    // Nombre de clicks
                    if (highscoreClicks) {
                        allHighscores[ig][lvl][numbers][1][0] = name;
                        allHighscores[ig][lvl][numbers][1][1] = seconds;
                        allHighscores[ig][lvl][numbers][1][2] = time;
                        allHighscores[ig][lvl][numbers][1][3] = nbClicks;
                        allHighscores[ig][lvl][numbers][1][4] = nbMoves;
                        allHighscores[ig][lvl][numbers][1][5] = points;
                    }
                    // Nombre de mouvements
                    if (highscoreMoves) {
                        allHighscores[ig][lvl][numbers][2][0] = name;
                        allHighscores[ig][lvl][numbers][2][1] = seconds;
                        allHighscores[ig][lvl][numbers][2][2] = time;
                        allHighscores[ig][lvl][numbers][2][3] = nbClicks;
                        allHighscores[ig][lvl][numbers][2][4] = nbMoves;
                        allHighscores[ig][lvl][numbers][2][5] = points;
                    }
                    // Points
                    if (highscorePoints) {
                        allHighscores[ig][lvl][numbers][3][0] = name;
                        allHighscores[ig][lvl][numbers][3][1] = seconds;
                        allHighscores[ig][lvl][numbers][3][2] = time;
                        allHighscores[ig][lvl][numbers][3][3] = nbClicks;
                        allHighscores[ig][lvl][numbers][3][4] = nbMoves;
                        allHighscores[ig][lvl][numbers][3][5] = points;
                    }
                }
            }
        }
    }
    // Sérialisation du tableau allHighscores
    var serializedHighscores = JSON.stringify(allHighscores);
    console.log(serializedHighscores);
    // Sauvegarde du tableau sérialisé en localStorage
    localStorage.Highscores = serializedHighscores;
    console.log(allHighscores);
}


/**
 * @brief   Afficher les highscores du niveau courant
 * @detail  Met à jour le titre et le contenu de la boite des highscores (drop-down du bouton id="showHighscores")
            Appelée par les fonctions NumbersSwitch(), changeLevel(), loadHighscores(), saveName(), resetLevelHighscores() et resetAllHighscores()
 */
function displayLevelHighscores() {
    // Update de l'affichage du titre des highscores
    var hsTitle = document.getElementById("hsTitle");
    if (level == 1) { hsTitle.innerHTML = imagesGroups[imagesGroup].headerTitle + " : " + imagesGroups[imagesGroup].level1; }
    if (level == 2) { hsTitle.innerHTML = imagesGroups[imagesGroup].headerTitle + " : " + imagesGroups[imagesGroup].level2; }
    if (level == 3) { hsTitle.innerHTML = imagesGroups[imagesGroup].headerTitle + " : " + imagesGroups[imagesGroup].level3; }
    if (level == 4) { hsTitle.innerHTML = imagesGroups[imagesGroup].headerTitle + " : " + imagesGroups[imagesGroup].level4; }
    if (level == 5) { hsTitle.innerHTML = imagesGroups[imagesGroup].headerTitle + " : " + imagesGroups[imagesGroup].level5; }
    hsTitle.innerHTML += (showNumbers == 1 ? " - Chiffres affichés" : " - Chiffres cachés");
    // Afficher les données de l'imagesGroup, level et showNumbers courant
    document.getElementById("hsTime").innerHTML = "<td class='h5 text-danger text-left'>Meilleur temps&nbsp;:</td><td class='text-danger'>" + allHighscores[imagesGroup][level-1][showNumbers][0][0] + "</td><td class='text-danger'><strong>" + allHighscores[imagesGroup][level-1][showNumbers][0][2] + "</strong></td><td>" + allHighscores[imagesGroup][level-1][showNumbers][0][3] + "</td><td>" + allHighscores[imagesGroup][level-1][showNumbers][0][4] + "</td><td>" + allHighscores[imagesGroup][level-1][showNumbers][0][5] + "</td>";
    document.getElementById("hsClicks").innerHTML = "<td class='h5 text-danger text-left''>Meilleur nombre de clicks&nbsp;:</td><td class='text-danger'>" + allHighscores[imagesGroup][level-1][showNumbers][1][0] + "</td><td>" + allHighscores[imagesGroup][level-1][showNumbers][1][2] + "</td><td class='text-danger'><strong>" + allHighscores[imagesGroup][level-1][showNumbers][1][3] + "</strong></td><td>" + allHighscores[imagesGroup][level-1][showNumbers][1][4] + "</td><td>" + allHighscores[imagesGroup][level-1][showNumbers][1][5] + "</td>";
    document.getElementById("hsMoves").innerHTML = "<td class='h5 text-danger text-left''>Meilleur nombre de mouvements&nbsp;:</td><td class='text-danger'>" + allHighscores[imagesGroup][level-1][showNumbers][2][0] + "</td><td>" + allHighscores[imagesGroup][level-1][showNumbers][2][2] + "</td><td>" + allHighscores[imagesGroup][level-1][showNumbers][2][3] + "</td><td class='text-danger'><strong>" + allHighscores[imagesGroup][level-1][showNumbers][2][4] + "</strong></td><td>" + allHighscores[imagesGroup][level-1][showNumbers][2][5] + "</td>";
    document.getElementById("hsScore").innerHTML = "<td class='h5 text-danger text-left''>Meilleur nombre de points&nbsp;:</td><td class='text-danger'>" + allHighscores[imagesGroup][level-1][showNumbers][3][0] + "</td><td>" + allHighscores[imagesGroup][level-1][showNumbers][3][2] + "</td><td>" + allHighscores[imagesGroup][level-1][showNumbers][3][3] + "</td><td>" + allHighscores[imagesGroup][level-1][showNumbers][3][4] + "</td><td class='text-danger'><strong>" + allHighscores[imagesGroup][level-1][showNumbers][3][5] + "</strong></td>";
}


/**
 * @brief   Effacer les meilleurs scores du niveaau courant
 * @detail  Effacer les meilleurs scores (meilleurs temps, nombre de clicks, nombre de mouvements et nom) du niveaau courant
            Appelée par le bouton id="resetLevelHighscore"
 */
function resetLevelHighscores() {
    for (var hsCat = 0; hsCat < 4; hsCat++) {
        for (var data = 0; data < 6; data++) {
            if (data == 2) {
                allHighscores[imagesGroup][level-1][showNumbers][hsCat][data] = "--:--:--";
            }
            else {
                allHighscores[imagesGroup][level-1][showNumbers][hsCat][data] = "-";
            }
        }
    }
    saveHighscores();
    displayLevelHighscores();
}


/**
 * @brief   Effacer les meilleurs scores de TOUS le niveaux
 * @detail  Effacer les meilleurs scores (meilleurs temps, nombre de clicks, nombre de mouvements et nom) de TOUS le niveaux
            Appelée par le bouton id="resetAllHighscore"
 */
function resetAllHighscores() {
    localStorage.removeItem("Highscores");
    loadHighscores();
    displayLevelHighscores();
}
