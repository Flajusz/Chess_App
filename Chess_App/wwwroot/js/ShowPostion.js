
var setBoard = Chessboard('posBoard', {
    pieceTheme: '/img/chesspieces/wikipedia/{piece}.png',
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: true
})

$('#startBtn').on('click', setBoard.start)
$('#clearBtn').on('click', setBoard.clear)

var value;

function PlayPosition()
{   
    var playingBoardElement = document.getElementById("playBoard")
    var buttonsElement = document.getElementById("buttons")
    var gameDataElement = document.getElementById("gameData")
    var gameOptionsElement = document.getElementById("gameOptions")

    value = setBoard.fen()
    var setFEN = value.concat(" w - - 0 1");
    game = new Chess(setFEN)   
    playBoard.position(game.fen())
    updateStatus()         

    gameOptionsElement.remove()
    buttonsElement.remove()
    setBoard.destroy();   

    playingBoardElement.style.visibility = "visible"
    gameDataElement.style.visibility = "visible"
    
   // var pieces = playBoard.position();
   // console.log(pieces["g8"])
}



var playBoard = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

function onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
}

function onDrop(source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'

    updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
    playBoard.position(game.fen())
}

function updateStatus() {
    var status = ''

    var moveColor = 'White'
    if (game.turn() === 'b') {
        moveColor = 'Black'
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position'
    }

    // game still on
    else {
        status = moveColor + ' to move'

        // check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check'
        }
    }

    $status.html(status)
    $fen.html(game.fen())
    $pgn.html(game.pgn())
}


var playConfig = {
    pieceTheme: '/img/chesspieces/wikipedia/{piece}.png',
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}

playBoard = Chessboard('playBoard', playConfig)

updateStatus()

