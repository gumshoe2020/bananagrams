// Connected to the redux store, owns Squares and Tiles
// Knows all the tiles, their values, and their coordinates

import React, { Component } from "react";
import { connect } from "react-redux";
// import { DragDropContext } from "react-dnd";
// import HTML5Backend from "react-dnd-html5-backend";
import { setTilePosition } from "../store/squareToSquareMove";
import { getAllPlayerTiles } from "../store/playersPouch";
import PlayerTilePouch from "./PlayerTilePouch";
import GlobalPotDisplay from "./GlobalPotDisplay";
import OtherPlayersBoardView from "./OtherPlayersBoardView";
import SelectedTileDisplay from "./SelectedTileDisplay";
import Square from "./Square";
import GameHeader from "./GameHeader";
import WinnersPage from "./WinnersPage";
import { challenge } from './WordChallenge';
import store, {
  updatePot,
  addTileToPouch,
  peelTile,
  dumpTile,
  removeTileFromPouch,
  removeSelectedTile,
  getPlayerTilesThunk,
  globalPotListenerThunk,
  submitWordsForChallengeThunk,
  updatePlayerPotThunk,
  playerPotListenerThunk,
  listenTo1TilesThunk,
  listenTo2TilesThunk,
  listenTo3TilesThunk,
  listenTo4TilesThunk
} from "../store";

export class Board extends Component {
  constructor() {
    super();
    this.dumpTiles = this.dumpTiles.bind(this);
    this.peel = this.peel.bind(this);
    this.handleSubmitGame = this.handleSubmitGame.bind(this);
    this.renderWinPage = this.renderWinPage.bind(this);
  }

  async componentDidMount() {
    if (this.props.createGame) {
      const playerNumber = await this.props.user.playerNumber;
      let gameId = await this.props.match.params.currentGame;
      if (playerNumber === 1) {
        this.props.listenTo1TilesThunk(gameId)
      } else if (playerNumber === 2) {
        this.props.listenTo2TilesThunk(gameId)
      } else if (playerNumber === 3) {
        this.props.listenTo3TilesThunk(gameId)
      } else if (playerNumber === 4) {
        this.props.listenTo4TilesThunk(gameId)
      }
    }
  }


  async handleSubmitGame(evt) {
    evt.preventDefault();
    const gameId = this.props.createGame.currentGame;
    const playerNumber = this.props.user.playerNumber;
    const wordArray = await this.props.submitWordsForChallengeThunk(gameId, playerNumber);
    this.renderWinPage();
  }

  renderWinPage() {
    const winnerDiv = document.getElementById('winner-div');
    winnerDiv.style.display = 'block';
  }

  renderSquare(i, j) {
    const playerNumber = this.props.user.playerNumber;
    const x = i;
    const y = j;
    return (
      <div
        key={i + "-" + j}
        style={{
          width: "6.66%",
          height: "6.66%"
        }}
      >
        <Square position={{ x, y }} playersBoard={true} playerToListenTo={playerNumber} />
      </div>
    );
  }

  // movePiece = (x, y) => {
  //   this.props.setTilePosition(x, y);
  // };

  // renderPiece(x, y) {
  //   const { tileX, tileY } = this.props.squareToSquareMove.position;
  //   if (x === tileX && y === tileY) {
  //     return <Tile />;
  //   }
  // }


  async peel(evt) {
    evt.preventDefault();
    var globalPot = this.props.createGame.pot;
    let playersArr = Object.keys(this.props.createGame.players);
    let letterArray = [];
    for (var i = 0; i < playersArr.length; i++) {
      var randomLetter = await globalPot[0];
      letterArray.push(randomLetter);
      var pos = await globalPot.indexOf(randomLetter);
      globalPot.splice(pos, 1);
    }
    let gameId = this.props.createGame.currentGame;
    let getPeeledPot = peelTile(gameId, globalPot, playersArr, letterArray);
    store.dispatch(getPeeledPot);
  }

  async dumpTiles(evt) {
    evt.preventDefault();

    let player = 'Player ' + this.props.user.playerNumber
    let selectedTile = this.props.selectedTile;
    let playerPot = this.props.createGame.players[player].playerPot
    let index = playerPot.indexOf(selectedTile)
    playerPot.splice(index, 1)
    let globalPot = this.props.createGame.pot;
    let numberOfPlayers = Object.keys(this.props.createGame.players).length;
    if (globalPot.length > numberOfPlayers) {
      globalPot.push(selectedTile);
      this.props.removeSelectedTile();
      let count = 0;
      while (count < 3) {
        let randomLetter = await globalPot[0]
        let pos = await globalPot.indexOf(randomLetter);
        playerPot.push(randomLetter)
        globalPot.splice(pos, 1);
        count++;
      }
    }
    let gameId = this.props.createGame.currentGame;
    let swapTile = dumpTile(gameId, globalPot, player, playerPot);
    store.dispatch(swapTile);
  }

  render() {
    const player = 'Player ' + this.props.user.playerNumber
    //Creates board
    const squares = [];
    for (let i = 1; i <= 15; i++) {
      for (let j = 1; j <= 15; j++) {
        squares.push(this.renderSquare(i, j));
      }
    }
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: '#E3B772',
          width: '100vw',
          top: '0',
          left: '0',
          position: 'fixed',
          overflow: 'hidden'
        }}
      >
        <WinnersPage style={{
          display: 'none'
        }
        } />
        <GameHeader gameId={this.props.createGame.currentGame} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "95vh"
          }}
        >
          <div style={{ width: "25vw", height: "100%" }}>
            <OtherPlayersBoardView gameId={this.props.createGame.currentGame} />
            <GlobalPotDisplay />
          </div>
          <div
            style={{
              backgroundImage: `url('/lightwood.jpg')`,
              backgroundSize: 'cover',
              backgroundPositionX: '85%',
              width: "50vw",
              height: "100%",
              margin: "0 auto",
              flexDirection: 'column',
              border: "2px solid black",
              display: "flex",
              flexWrap: "wrap",
              borderRadius: '10px'
            }}
          >
            {squares}
          </div>
          <div style={{ width: "25vw", height: "100%" }}>
            <PlayerTilePouch />
            <SelectedTileDisplay />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "0px 3px 0px 5px"
              }}
            >
              <button
                id="dump-tiles"
                refs="btn"
                onClick={evt => this.dumpTiles(evt)}
                disabled={this.props.selectedTile ? false : true}
              >
                Dump Tile
              </button>

              <button
                id="peel-tiles"
                refs="btn"
                onClick={evt => this.peel(evt)}
                disabled={this.props.createGame.players[player].playerPot && this.props.createGame.pot.length > 3 && !this.props.createGame.players[player].playerPot.some(tile => !tile.x) ? false : true}
              >
                PEEL
              </button>
              <button href={`/game/${this.props.createGame.currentGame}/winner`}
                id="submit-tiles"
                refs="btn"
                onClick={evt => this.handleSubmitGame(evt)}
                disabled={this.props.createGame.pot.length < 3 && !this.props.createGame.players[player].playerPot.some(tile => !tile.x) ? false : true}
              >
                Submit Game
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/******** CONTAINER **********/

const mapDispatchToProps = {
  updatePot,
  setTilePosition,
  getAllPlayerTiles,
  addTileToPouch,
  peelTile,
  removeTileFromPouch,
  removeSelectedTile,
  getPlayerTilesThunk,
  globalPotListenerThunk,
  playerPotListenerThunk,
  submitWordsForChallengeThunk,
  listenTo1TilesThunk,
  listenTo2TilesThunk,
  listenTo3TilesThunk,
  listenTo4TilesThunk
};

const mapStateToProps = ({
  squareToSquareMove,
  createGame,
  selectedTile,
  playersPouch,
  user
}) => ({
    squareToSquareMove,
    createGame,
    selectedTile,
    dumpTile,
    playersPouch,
    user,
    updatePlayerPotThunk
  });

// Board = DragDropContext(HTML5Backend)(Board);
// Board = connect(mapStateToProps, mapDispatchToProps)(Board);

export default connect(mapStateToProps, mapDispatchToProps)(Board);
