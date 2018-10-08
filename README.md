# The Dungeon

## Background / Overview
The Dungeon is an online, maze-traversing video game that requires users to find their way through a randomly generated map with a limited field of view.  

Our team sought to develop a challenging, arcade-style video game built upon the fundamental concepts of software development. This game runs via the integration of HTML 5 markup, DOM manipulation, event listeners, form submissions, object-oriented programming, and an inventive use of arrays.

While we have created a functional maze-traversing video game, we acknowledge that a seemingly endless quanta of updates and new features exist to augment game play. We invite users to add to our code base to make this a game for the ages. 


## Usage
All of the game play functionality exists in our *app.js* file. This script is responsible for randomly generating a map, constructing a player object that users control during gameplay, randomly assigning a starting place for the player, constructing and randomly placing an exit, constructing and randomly placing invisible pits, and drawing a viewing window around the player by which the user sees a small fraction of the game’s map. The *app.js* file also houses the logic that sorts the objects containing high score data saved to local storage. This file also handles the event listeners triggered by users when interacting with our website and using their keyboard to move their avatar through the game. 


These features are tightly integrated with the clickable inputs on the front end of the website (developed in the *index.html* files and *levels.html* files). On the front end, users can navigate through the site and click on buttons that showcase gameplay instructions and a leaderboard that retains high score data via local storage. The front end also features a section in which players can specify their desired gameplay difficulty. The easy, medium, and hard difficulty sections, when selected, simultaneously transport players to the game’s login section while transmitting data to the backend. These data submitted by our clickable difficulty inputs are used to generate a map, starting score, and exit placement according to the difficulty of the game. 

After users input their name, our *app.js* file creates a new key / value pair that ties the username of the player (key) to the final score (value) garnered after finishing a new level. Our sorting function outlined in the *app.js* file sorts these key / value pairs in the leaderboard from highest to lowest, higher scores being placed at the top of the list. If a user plays the game multiple times, our script will overwrite their score if a new high score is attained.


## Installation and gameplay
To run this game, clone a copy of our repository, open the terminal within the local repo, and either use the “open *index.html*” command or run the “*live-server*” command to launch this web app in one’s browser. 


## Running our code in developer mode
To run this code in developer mode, checkout the "demo" branch stored in our app’s repo. This demo branch turns off the shadow obscuring the majority of the map and allows developers to see the whole map with all of its features (Features by color and name: *white tile* (moved with input from arrow keys) = player / avatar; *stationary white tile* = exit; *teal tiles* = pits; *yellow tile* = gem; *gray tiles* = walkable area; *black tiles* = boundaries.) 
