import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import css from "../css/starter-game.css";

export default function game_init(root, channel) {
  ReactDOM.render(<Starter channel={channel}/>, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    console.log(this.channel.topic);
    this.state = {
      openTiles: [],
      currentTileState: {},
      waiting: false,
      score: 0,
      isGameOver: false
    };
    this.channel
        .join()
        .receive("ok", this.server_response.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp); });

  }


  server_response(view) {
    console.log("new view", view.game);
    var cur = view.game.currentTileState;
    this.setState(view.game);
  }


  restartGame() {
    console.log("restart");
    this.channel.push("restart-game")
    .receive("ok", this.server_response.bind(this));
  }


  openTile(event) {
    this.channel.push("tile-click", {id: event.target.id})
    .receive("ok", this.server_response.bind(this));
  }

  closeUnmatchedTiles() {

  }

  render() {

    let items = [];
    let item = [];
    let currentState = this.state.currentTileState;
    let self = this;
    Object.keys(currentState).forEach(function (key){
      item = [];
      let tile = currentState[key];
      Object.keys(tile).forEach(function(element) {
        if (tile[element].open) {
          item.push(<div key={(element * 21) + key} className="column-10 padding">
            <button key={"btnkey" + key + "" + element} id={key + " " + element}
              className={tile[element].class}
              onClick={self.openTile.bind(self)}>
              {tile[element].value}
            </button>
          </div>);
        } else {
          item.push(<div key={(element * 21) + key} className="column-10 padding">
            <button key={"btnkey" + key + "" + element} id={key + " " + element}
              className={tile[element].class}
              onClick={self.openTile.bind(self)}></button>
          </div>);
        }
      });
      items.push(<div className="row" key={key}>
        {item}
      </div>);
    });


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
