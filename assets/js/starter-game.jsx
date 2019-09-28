import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import css from "../css/starter-game.css";

export default function game_init(root) {
  ReactDOM.render(<Starter/>, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    let currentTileState = this.initGameTiles();
    this.state = {
      openTiles: [],
      currentTileState: currentTileState,
      waiting: false,
      score: 0,
      isGameOver: false
    };
  }

  restartGame() {
    let currentTileState = this.initGameTiles();
    let stateCopy = {
      openTiles: [],
      currentTileState: currentTileState,
      waiting: false,
      score: 0,
      isGameOver: false
    };
    this.updateState(stateCopy);
  }

  initGameTiles() {
    let currentTileState = [];
    let alpha = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H'
    ]
    alpha = alpha.concat(alpha);
    alpha.sort(() => Math.random() - 0.2);
    let f = 0;
    for (var i = 0; i < 4; i++) {
      let k = [];
      for (var j = 0; j < 4; j++) {
        k.push({
          class: "tile",
          value: alpha[f++],
          open: false,
          done: false
        });
      }

      currentTileState.push(k);
    }
    return currentTileState;
  }

  checkIfGameOver(currentTileState) {
    for (var i = 0; i < currentTileState.length; i++) {
      for (var j = 0; j < currentTileState[i].length; j++) {
        if (currentTileState[i][j].done === false) {
          return false;
        }
      }
    }
    return true;
  }

  updateState(stateCopy) {
    this.setState(stateCopy);
  }

  openTile(event) {
    let id = event.target.id;
    let stateCopy = _.cloneDeep(this.state);
    if (stateCopy.waiting == true) {
      return;
    }
    let i = id.split(" ")[0];
    let j = id.split(" ")[1];

    let modcurrentTileState = stateCopy.currentTileState;
    let openTiles = stateCopy.openTiles;

    if (modcurrentTileState[i][j].done === true || modcurrentTileState[i][j].open === true) {
      return;
    }

    stateCopy.score -= 2;

    if (openTiles.length == 1) {
      let one = openTiles[0];
      let iOne = one.split(" ")[0];
      let jOne = one.split(" ")[1];

      if (modcurrentTileState[i][j].value == modcurrentTileState[iOne][jOne].value) {
        modcurrentTileState[i][j].class = "done-tile"
        modcurrentTileState[i][j].done = true;
        modcurrentTileState[i][j].open = false;
        modcurrentTileState[iOne][jOne].class = "done-tile"
        modcurrentTileState[iOne][jOne].done = true;
        modcurrentTileState[iOne][jOne].open = false;
        stateCopy.openTiles = [];
        stateCopy.score += 40

        let gameover = this.checkIfGameOver(stateCopy.currentTileState);
        if (gameover) {
          stateCopy.isGameOver = true;
        }
        this.updateState(stateCopy);
      } else {
        stateCopy.waiting = true;
        stateCopy.openTiles.push(id);
        modcurrentTileState[i][j].class = "open-tile"
        modcurrentTileState[i][j].open = true;
        this.updateState(stateCopy);
        var self = this;
        window.setTimeout(() => {
          this.closeUnmatchedTiles();
        }, 1000);
      }
    } else {
      stateCopy.openTiles.push(id);
      modcurrentTileState[i][j].class = "open-tile"
      modcurrentTileState[i][j].open = true;
      this.updateState(stateCopy);
    }
  }

  closeUnmatchedTiles() {
    let stateCopy = _.cloneDeep(this.state);
    let modcurrentTileState = stateCopy.currentTileState;
    let openTiles = stateCopy.openTiles;
    for (var k = 0; k < openTiles.length; k++) {
      let i = openTiles[k].split(" ")[0];
      let j = openTiles[k].split(" ")[1];
      modcurrentTileState[i][j].class = "tile"
      modcurrentTileState[i][j].open = false;
    }
    stateCopy.openTiles = [];
    stateCopy.waiting = false;
    this.updateState(stateCopy);
  }

  render() {

    let items = [];
    let item = [];

    for (var i = 0; i < 4; i++) {
      item = [];
      for (var j = 0; j < 4; j++) {
        if (this.state.currentTileState[i][j].open) {
          item.push(<div key={(j * 21) + i} className="column-10 padding">
            <button key={"btnkey" + i + "" + j} id={i + " " + j} className={this.state.currentTileState[i][j].class} onClick={(e) => this.openTile(e)}>
              {this.state.currentTileState[i][j].value}
            </button>
          </div>);
        } else {
          item.push(<div key={(j * 21) + i} className="column-10 padding">
            <button key={"btnkey" + i + "" + j} id={i + " " + j} className={this.state.currentTileState[i][j].class} onClick={(e) => this.openTile(e)}></button>
          </div>);
        }

      }
      items.push(<div className="row" key={i}>
        {item}
      </div>);
    }
    if (!this.state.isGameOver) {
      return (<div>
        <h1>
          Memory Test Game
        </h1>
        <h3>
          <button className="replay" onClick={this.restartGame.bind(this)}>Restart</button>
        </h3>
        <h3>

          Current Score: {this.state.score}
        </h3>
        <div>
          {items}
        </div>
      </div>)
    } else {
      return (<div>
        <h1>
          Game Over!! Your score is {this.state.score}.
        </h1>
        <button className="replay" onClick={this.restartGame.bind(this)}>
          Play Again
        </button>
      </div>)
    }
  }
}
