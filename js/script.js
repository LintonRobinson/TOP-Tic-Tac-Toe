
/* 
// Pre-game questions
    → Form opens to enter player name, color, and choses "x" or "o"   
// Active game (round)
    → Player turn starts 
    → Up-to-date game board generates (Empty at start)
    → Player places "x" or "o" in available cell
    → Check for winner
    → Conclude/restart round (alternate)
*/


/* 
// Structure
    → State of the board
        → If a spot is empty, or taken by a player
    → Current player turn
    → When a winner is declared
*/

const GameBoard = (function() {
    const row = 3;
    const column = 3;
    let board = [];
    let cellIds = [];
    
    const CreateCellObject = function () {
        let cellState = 0;
        const cellId = crypto.randomUUID();
        cellIds.push(cellId)
        return { cellState, cellId };
    };


    // Generate board
    const generateBoard = () => {
        cellIds = [];
        for (let i = 0; i < row; i++) {
            board[i] = []
            for (let j = 0; j < column;j++) {
                // Each cell (element in array) has an object with properties to control turns, and player interation (selection)
                board[i].push(CreateCellObject());
            };      
        };
    }

    const clearBoard = () => {
        board = [];
    };
    
    // Initial Generation
    generateBoard();

    const CellController = (function() {
        // GameBoard.CellController.populateCell(GameBoard.getBoard()[1][2])
        const populateCell = function(playerChosenCell) {
            if (GameController.activeGame && !playerChosenCell.cellState) {
                GameController.playerTurn ? playerChosenCell.cellState = 1: playerChosenCell.cellState = 2;
                GameController.toggleRound()
            }; 
        };
        return { populateCell }
    })();
    const getBoard = () => board; 
    const getCellIds = () => cellIds;
    return { generateBoard, clearBoard , getBoard , getCellIds ,CellController };
})();

 
// Game controller
const GameController = (function() {
    let activeGame = true;
    let roundDraw 
    let playerTurn = true;
    const toggleRound = function () {
        this.playerTurn =  !this.playerTurn;
    };


    const checkForWin = () => {
        GamePlayers.players.forEach((element,currentIndex) => {
            // Check for win after pattern
            function checkWinPattern(wonRound,patternType) {
                if (wonRound) {
                    //document.querySelector("#winner-header").textContent = `${GamePlayers.players[currentIndex].name} Wins`;
                    GamePlayers.players[currentIndex].timesWon = GamePlayers.players[currentIndex].timesWon + 1;
                    GameBoard.clearBoard();
                    GameBoard.generateBoard();
                    GameUI.updateScoreUI(GamePlayers.players[0].timesWon,GamePlayers.players[1].timesWon)
                    GameUI.displayWin(patternType)
                    GameUI.enableUI.manageCellListeners.removeEventListeners()
                    setTimeout(() => {
                        GameUI.displayWinnerModal(currentIndex);
                    }, 2000)
                    resetWonRound();
                    
                };
                GamePlayers.players[currentIndex].wonRound = null;
            }

            // Vertical Patterns
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    // stays in column, but rotates through row
                    if (GameBoard.getBoard()[j][i].cellState === GamePlayers.players[currentIndex].playerNumber) {
                        GamePlayers.players[currentIndex].wonRound = true;
                    } else {
                        GamePlayers.players[currentIndex].wonRound = false; 
                        break
                    };

                };
                
                
                
                
                checkWinPattern(GamePlayers.players[currentIndex].wonRound,GameUI.getPatternType(i+3));
            };
             // Horizontal Patterns
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    // the first row, first slot
                    if (GameBoard.getBoard()[i][j].cellState === GamePlayers.players[currentIndex].playerNumber) {
                        GamePlayers.players[currentIndex].wonRound = true;
                        
                    } else {
                        GamePlayers.players[currentIndex].wonRound = false; 
                        
                        break
                    }
                };
                // Each run is a complete row
                checkWinPattern(GamePlayers.players[currentIndex].wonRound,GameUI.getPatternType(i));

            };

            // Diagonal Pattern - Left to right
            for (let i = 0; i <= 2; i++) {
                if (GameBoard.getBoard()[i][i].cellState === GamePlayers.players[currentIndex].playerNumber) {
                    GamePlayers.players[currentIndex].wonRound = true;
                } else {
                    GamePlayers.players[currentIndex].wonRound = false;
                    break
                };
                if (i === 2) {
                    checkWinPattern(GamePlayers.players[currentIndex].wonRound,GameUI.getPatternType(6));

                };
            };

                
            // Diagonal Pattern - Right to left 
            let reverseDiagonalCell = 2;
            for (let i = 0; i <= 2; i++) {
                if (GameBoard.getBoard()[i][reverseDiagonalCell].cellState === GamePlayers.players[currentIndex].playerNumber) {  
                    GamePlayers.players[currentIndex].wonRound = true;
                } else {
                    GamePlayers.players[currentIndex].wonRound = false;
                    break
                };
                reverseDiagonalCell--;
                if (i === 2) {
                    checkWinPattern(GamePlayers.players[currentIndex].wonRound,GameUI.getPatternType(7));
                    
                };
            };

        });
        checkForDraw();
    };

    const checkForDraw = () => {
        let numOfEmptyCells = 0
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                if (GameBoard.getBoard()[i][j].cellState === 0) {
                    numOfEmptyCells++
                } 
            };
        };
        if (numOfEmptyCells === 0) {
            roundDraw = true;
            setTimeout(() => {
                GameUI.displayWinnerModal();
            },2000)
            

        }
    
    }

    function resetWonRound() {
        GamePlayers.players.forEach((player) => {
            player.wonRound = null;
        })
    };
    

    return { activeGame , roundDraw , playerTurn , toggleRound , checkForWin , checkForDraw }
})();


const GamePlayers = (function() {
    
    let players = [];
    let playerNumberIterator = 1;
    const CreatePlayers = (name) => {
        this.name = name;
        this.numberPlayer;
        this.wonRound = null;
        this.timesWon = 0;
        this.playerNumber = GamePlayers.playerNumberIterator;
        GamePlayers.playerNumberIterator = GamePlayers.playerNumberIterator + 1;
        return { name , playerNumber , wonRound , timesWon  }
    };
    

    return { CreatePlayers , players , playerNumberIterator};
    
})();




// Screen updater 

const GameUI = (function() {
    document.querySelector('[open]').style.opacity = 1



    // Open Modal 
    const resetGamebtn = document.querySelector("#resetGame")
    resetGamebtn.addEventListener("click", () => {
        if (!document.querySelector("dialog").hasAttribute("open")) {
            GamePlayers.players = [];
            document.querySelector("dialog").showModal();
            document.querySelector("dialog").classList.remove("dialogFadeOut");
            document.querySelector("dialog").classList.add("dialogFadeIn");
        };
        
    });


    // Close modal Modal Button
    document.querySelector("form").addEventListener("submit", (event) => {
        event.preventDefault()   
        if (document.querySelector("dialog").hasAttribute("open")) {
            document.querySelector("dialog").classList.remove("dialogFadeIn");
            document.querySelector("dialog").classList.add("dialogFadeOut");
            setTimeout(() => {
            document.querySelector("dialog").close();
            }, 100)
            
        };
    });
   
    
    // Add Players From Form
    document.querySelector("form").addEventListener("submit", (event) => {
        let playerOneName = () => document.querySelector("#playerOneName").value;
        let playerTwoName = () => document.querySelector("#playerTwoName").value;
        event.preventDefault()
        GamePlayers.players.push(GamePlayers.CreatePlayers(playerOneName()))
        GamePlayers.players.push(GamePlayers.CreatePlayers(playerTwoName()))  
        
        document.querySelector("#playerOneHeading").textContent = `${playerOneName()}'s Total Wins`
        document.querySelector("#playerTwoHeading").textContent = `${playerTwoName()}'s Total Wins`
        updateScoreUI(GamePlayers.players[0].timesWon,GamePlayers.players[1].timesWon)
        document.querySelector("form").reset()
    });

    
    
    const gameBoardCells = document.querySelectorAll('.gameBoardCell')
    const addDataId = () => {
        const gameBoardCells = document.querySelectorAll('.gameBoardCell');
        gameBoardCells.forEach((element,index) => {
            element.setAttribute("data-id",GameBoard.getCellIds()[index])
        }) 
    }

    addDataId();



    
    
    const enableUI = (function() {
        
        // When a cell is clicked:
            // Get the data-id, 
            // loop through to find in the gameboard that has the same id
            // When the id is found, add the 
            // 
        function getIndexAndPopulateCell(currentDataId) {
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                if (GameBoard.getBoard()[i][j].cellId === currentDataId) {
                    GameBoard.CellController.populateCell(GameBoard.getBoard()[i][j]);
                };          
                };
            };
        };
        
        // For each square, add an event listener to add x and o's
        
        
        
        // Turn into module , turn add remove into anonomys funtion to turn into method  

        const manageCellListeners = (function(){
            const gameBoardCells = document.querySelectorAll('.gameBoardCell');
            

            function removeEventListeners() {
                gameBoardCells.forEach((element) => {
                    element.removeEventListener('click', handler);
                });
            }

            function createHandler() {
                return function(event) {
                    addXAndOs(event.target)
                }
            }
                
            const handler = createHandler()
                
            

            function addEventListeners() {
                gameBoardCells.forEach((element) => {
                    element.addEventListener('click', handler , {once:true});
                });
            }

            return { addEventListeners , removeEventListeners }
        })();
        function addXAndOs(element) {
            let gameBoardCellId = element.getAttribute("data-id");
            const xImg = document.createElement("img")
            if (GameController.playerTurn) {
                xImg.setAttribute("src","css/images/x-icon.png");
                element.appendChild(xImg)
                getIndexAndPopulateCell(gameBoardCellId)
                GameController.checkForWin()
            } else {
                xImg.setAttribute("src","css/images/o-icon.png");
                element.appendChild(xImg)
                getIndexAndPopulateCell(gameBoardCellId)
                GameController.checkForWin()
            };
            // GameBoard.CellController.populateCell(GameBoard.getBoard()[1][2])
            
        }
        
        return { manageCellListeners } 

    })();
    
    
    const displayWin = (patternType) => {
        switch (patternType) {
            case 1:
                const patternOne = [0,1,2]     
                patternOne.forEach((num) => {
                    document.querySelectorAll(".gameBoardCell")[num].style.backgroundColor = "#78b58366";
                });
                break;
                case 2:
                    const patternTwo = [3,4,5]     
                    patternTwo.forEach((num) => {
                        document.querySelectorAll(".gameBoardCell")[num].style.backgroundColor = "#78b58366";
                    });
                    break; 
                case 3:
                    const patternThree = [6,7,8]     
                    patternThree.forEach((num) => {
                        document.querySelectorAll(".gameBoardCell")[num].style.backgroundColor = "#78b58366";
                    });
                    break; 
                case 4:
                    const patternFour = [0,3,6]     
                    patternFour.forEach((num) => {
                        document.querySelectorAll(".gameBoardCell")[num].style.backgroundColor = "#78b58366";
                    });
                    break; 
                case 5:
                    const patternFive = [1,4,7]     
                    patternFive.forEach((num) => {
                        document.querySelectorAll(".gameBoardCell")[num].style.backgroundColor = "#78b58366";
                    });
                    break; 
                case 6:
                    const patternSix = [2,5,8]     
                    patternSix.forEach((num) => {
                        document.querySelectorAll(".gameBoardCell")[num].style.backgroundColor = "#78b58366";
                    });
                    break; 
                case 7:
                    const patternSeven = [0,4,8]     
                    patternSeven.forEach((num) => {
                        document.querySelectorAll(".gameBoardCell")[num].style.backgroundColor = "#78b58366";
                    });
                    break; 
                case 8:
                    const patternEight = [2,4,6]     
                    patternEight.forEach((num) => {
                        document.querySelectorAll(".gameBoardCell")[num].style.backgroundColor = "#78b58366";
                    });
                    break; 
        };
    
    };

    const displayWinnerModal = (playerIndex) => {
        document.querySelector(".winner-message").style.display = "flex";
        if (playerIndex != null) {
            document.querySelector("#winner-header").textContent = `${GamePlayers.players[playerIndex].name} Wins`;
        } else {
            document.querySelector("#winner-header").textContent = "Draw"
        }
    }

    function closeWinnerModal() {
        document.querySelector(".winner-message").style.display = "none";
    }

    const updateScoreUI = (playerOne,playerTwo) => {
        document.querySelector("#playerOneWins").textContent = playerOne;
        document.querySelector("#playerTwoWins").textContent = playerTwo;
    }

    function getPatternType(index) {
        let patternType
        let patternArray 
        switch (index) {
            case 0: 
                return patternType = 1;
                break;
            case 1: 
                return patternType = 2;
                break;
            case 2: 
                return patternType = 3;
                break;
            case 3: 
                return patternType = 4;
                break;
            case 4: 
                return patternType = 5;
                break;
            case 5: 
                return patternType = 6;
                break;
            case 6: 
                return patternType = 7;
                break;
            case 7: 
                return patternType = 8;
                break;
        }
    }
    
    const clearBoard = () => {
        const gameBoardCells = document.querySelectorAll(".gameBoardCell");
        const xAndOImg = document.querySelectorAll("img");
        xAndOImg.forEach((element,index) => {
            element.remove();
        })
        gameBoardCells.forEach((element,index) => {
            element.style.backgroundColor = "";
        })
    }



    document.querySelector("#newGameBtn").addEventListener('click', () => {
        closeWinnerModal();
        clearBoard();
        GameBoard.clearBoard()
        GameBoard.generateBoard()
        addDataId()
        GameController.playerTurn = true;
        
        enableUI.manageCellListeners.addEventListeners()
    })

    document.querySelector("#resetGame").addEventListener('click', () => {
        closeWinnerModal();
        clearBoard();
        GameBoard.clearBoard()
        GameBoard.generateBoard()
        addDataId()
        GameController.playerTurn = true;
        enableUI.manageCellListeners.removeEventListeners()
        enableUI.manageCellListeners.addEventListeners()
        GamePlayers.playerNumberIterator = 1;

    })
    

    return { getPatternType, enableUI ,displayWin , displayWinnerModal , updateScoreUI, clearBoard }
})();

GameUI.enableUI.manageCellListeners.addEventListeners();




// check if its open with argument and place




// winner 
// pattern check for player

// // match data-id with array location, send that data to  populateCell





// GameController.checkForWin()