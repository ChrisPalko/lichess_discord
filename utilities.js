const fetch = require('isomorphic-fetch');
const Chess = require('chess.js').Chess
const fs = require('fs');
const {
	createCanvas,
	Image
} = require("canvas")
const GIFEncoder = require('gifencoder');
const encoder = new GIFEncoder(400, 400);


async function getGame(gameID) {
	if (gameID.length < 8) return
	let response = await fetch(`https://lichess.org/game/export/${gameID}`, {
		headers: {
			"Accept": "application/json"
		}
	})
	let data = await response.json()
	let moves = data.moves.split(" ")
	return moves
}

function getPosition(move, moves) {
	move = Math.floor(move / 2)
	let chess = new Chess()
	for (let i = 0; i <= move; i++) {
		chess.move(moves[i])
	}
	let fen = chess.fen()
	return fen
}


 function fenToImage(moves, move, i) {
	let fen = getPosition(move, moves)
	fen = fen.split("/").map(row => row.split(""))

	const canvas = createCanvas(400, 400);
	const ctx = canvas.getContext('2d');
	const board = new Image()
	board.onload = () => ctx.drawImage(board, 0, 0, 400, 400)
	board.onerror = err => {
		throw err
	}
	board.src = './images/chessboard.png'

	for (let i = 0; i < 8; i++) {
		let s = -1
		for (let z = 0; z < 8; z++) {
			if (fen[i][z] === undefined || fen[i][z]===" ") break
			if (/[0-9]/.test(fen[i][z])) {
				s += Number(fen[i][z])
			} else {
				s += 1
				let move = new Image()
				move.onload = () => ctx.drawImage(move, -2 + 50 * s, 0 + 50 * i, 50, 50)
				move.onerror = err => {
					throw err
				}
				move.src = fen[i][z] === fen[i][z].toLowerCase() ? `./images/${fen[i][z]}.png` : `./images/w${fen[i][z].toLowerCase()}.png`
			}
		}
	}
	// const out = fs.createWriteStream(__dirname + `/test${i}.png`)
	// const stream = canvas.pngStream()
	// stream.pipe(out)
	// out.on('finish', () => console.log('The PNG file was created.'))
	return ctx
}

async function gif(game) {

	encoder.start();
	encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
	encoder.setDelay(500); // frame delay in ms
	encoder.setQuality(10); // image quality. 10 is default.

	let moves = await getGame(game)

	for (let i = 0; i < moves.length*2; i++) {
		encoder.addFrame(fenToImage(moves, i,i))
	}
	encoder.finish()
	//console.log(JSON.stringify(encoder.out.getData()))
	return(encoder.out.getData())
}

//gif("inbuPkXp")

module.exports = gif