Concours "Creative Developer" été 2022, BeTomorrow
"Lattice Boltzmann Fireball"

Techno : 
threejs + GLSL

Principe :
Implémentation de l'aglorithme de simulation de fluide Lattice Boltzmann Method (LBM)
Le système (l'ensemble des particules de gaz) est représenté à chaque noeud par un volume discret qui indique la quantité de mouvement (momentum = masse x vitesse) dans 8 directions possibles + 1 pour indiquer les particules qui ne se déplacent pas. 
Au niveau des shaders, 1 pixel = 1 noeud = 9 valeurs flottantes représentant le momentum.
Le rendu est effectué en 3 passes.

Passe 1 (collisions) : 
- frame 0 : initialisation du système
- sinon: calcul des collisions à partir de l'état en sortie de la passe 2 (diffusion)
L'étape de collision consiste à redistribuer les particules selon un modèle statistique satisfaisant les équations de Navier-Stokes (cf. BGK). 
On calcule le nouvel équilibre idéal, et on fait tendre le noeud plus ou moins vite (cf. Tau) vers cet équilibre. On met donc à jour les momentums.
- calcul des interactions (ex. souris) qui ajoutent ou retirent du momentum

Passe 2 (diffusion) : 
- chaque noeud reçoit le momentum en provenance des cellules voisines (source = passe 1)
- traitement des conditions limites (bord de l'écran) avec un rebond du momentum

Passe 3 (affichage) : 
- représentation visuelle du système
- masse totale par noeud -> palette de couleurs

Limitations connues : 
- l'encodage des noeuds (9 floats sur un pixel RGBA) doit être amélioré car le manque de précision des float nuit aux possibilités et à la stabilité du système



