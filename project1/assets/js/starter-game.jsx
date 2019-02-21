import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import background from './background.jpg';

export default function game_init(root, channel) {
  ReactDOM.render(<Starter channel={channel}/>, root);
}

export const GRID_SIZE = 5;
export const SHIP_SIZE = 3;
export const SHIP_BOUNDARY = Math.floor(SHIP_SIZE / 2);

class Starter extends Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      gameIsFull: true,
      x: 1,
      y: 1,
      ship1: [],
      ship2: [],
      isShipVertical: false,
      selfPlayerReady: false,
      hitsOnOtherPlayer: [],
      yourTurn: undefined
    };
    this.channel
      .join()
      .receive("ok", resp => {console.log(resp); this.setState(resp.game);})
      .receive("error", resp => { console.log("Unable to join", resp); });

    this.channel.on("update", this.gotView.bind(this))
  }

  componentDidUpdate() {
    if (this.state.failed) {
      console.log('muie')
      setTimeout(() => this.setState({failed: false}), 2000)
    }
  }

  gotView(view) {
    this.setState(view.game);
  }

  placeShip = (e) => {
    const { ship1, ship2, x, y , isShipVertical } = this.state;

    if (ship1.length == 0) {
      if (!isShipVertical && x >= SHIP_BOUNDARY && x < GRID_SIZE - SHIP_BOUNDARY) {
        return this.channel.push("placeShip", {
          shipNumber: 1,
          points: [...Array(SHIP_SIZE).keys()].map((entry, idx) => ({
            'x': x - SHIP_BOUNDARY + idx,
            'y': y
          }))
        });
      } else if (isShipVertical && y >= SHIP_BOUNDARY && y < GRID_SIZE - SHIP_BOUNDARY) {
        return this.channel.push("placeShip", {
          shipNumber: 1,
          points: [...Array(SHIP_SIZE).keys()].map((entry, idx) => ({
            'y': y - SHIP_BOUNDARY + idx,
            'x': x
          }))
        });
      }
    } else { //place ship 2
        if (!isShipVertical && x >= SHIP_BOUNDARY && x < GRID_SIZE - SHIP_BOUNDARY) {
          const ship2Points = [...Array(SHIP_SIZE).keys()].map((entry, idx) => ({
            'x': x - SHIP_BOUNDARY + idx,
            'y': y
          }));

          if (!ship1.some(point => ship2Points.some(point2 => point.x == point2.x && point.y == point2.y))) {
            return this.channel.push("placeShip", {
              shipNumber: 2,
              points: ship2Points
            });
          }

        } else if (isShipVertical && y >= SHIP_BOUNDARY && y < GRID_SIZE - SHIP_BOUNDARY) {
          const ship2Points = [...Array(SHIP_SIZE).keys()].map((entry, idx) => ({
            'y': y - SHIP_BOUNDARY + idx,
            'x': x
          }));

          if (!ship1.some(point => ship2Points.some(point2 => point.x == point2.x && point.y == point2.y))) {
            return this.channel.push("placeShip", {
              shipNumber: 2,
              points: ship2Points
            });
          } 
        }
    }

    this.setState({failed: true});
    console.log('failed')
  }

  attack = () => {
    this.channel.push("attack", {
      x: this.state.x,
      y: this.state.y
    });
  }

  renderGrid = () => {
    console.log(this.state);
    const { x, y , ship1, ship2, isShipVertical, gameReady} = this.state;

    return [...Array(GRID_SIZE).keys()].map(yCoord => {
      let row = [...Array(GRID_SIZE).keys()].map(xCoord => {

        let hasShip = ship1.some(entry => entry.x == xCoord && entry.y == yCoord)
          || ship2.some(entry => entry.x == xCoord && entry.y == yCoord);

        let highlight = false;

        if (!gameReady && !hasShip) {
          if (!isShipVertical) {
            highlight = (yCoord == y) && (xCoord <= x + SHIP_BOUNDARY && xCoord >= x - SHIP_BOUNDARY);
          } else {
            highlight = (xCoord == x) && (yCoord <= y + SHIP_BOUNDARY && yCoord >= y - SHIP_BOUNDARY);
          }
        }

        return <Tile hasShip={hasShip} highlight={highlight}>x<sub>{xCoord}</sub> y<sub>{yCoord}</sub></Tile>;
      });
      return row.concat([<br />]);
    });
  }

  renderEnemyGrid = () => {
    const { x, y , hitsOnOtherPlayer, gameReady, isShipVertical} = this.state;

    let enemyBoard = [...Array(GRID_SIZE).keys()].map(yCoord => {
      let row = [...Array(GRID_SIZE).keys()].map(xCoord => {

        let hit = '0';
        let tileHit = hitsOnOtherPlayer.find(entry => entry.x == xCoord && entry.y == yCoord)

        if (tileHit) {
          hit = tileHit.hit;
        }

        let highlight = gameReady && xCoord == x && yCoord == y;

        return <Tile hit={hit} highlight={highlight}>x<sub>{xCoord}</sub> y<sub>{yCoord}</sub></Tile>;
      });
      return row.concat([<br />]);
    });

    return enemyBoard;
  }

  getGameStatus = () => {
    let gameStatus = "Game is full";

    if (!this.state.gameIsFull) {
      if (this.state.winner) {
        gameStatus = "Winner is " + this.state.winner;
      }
      else if (this.state.ship1.length == 0) {
        gameStatus = "Place your first ship";
      }
      else if (this.state.ship2.length == 0) {
        gameStatus = "Place your second ship";
      }
      else if (this.state.gameReady) {
        //TODO: code to generate boards
        if (this.state.yourTurn) {
          gameStatus = "Place your attack";
        }
        else {
          gameStatus = "Waiting for enemy move";
        }
      }
      else {
        gameStatus = "Wait for other player";
      }
    }

    return gameStatus;
  }
  
  render() {
    return (
      <Fragment>
        <img className="background" src={background}/>
        <div className="game">
          <h1 className="game__header">{this.getGameStatus()}</h1>
          {!this.state.gameIsFull &&
          <div className="game__board">
            <div className="game__side">
              <div className="game__header2">Battleground</div>
              <div>{this.renderGrid()}</div>
              <div className="game__controls">
                <div className="game__header2">Coordinates of action:</div>
                <div className="game__input">
                  <label>x</label>
                  <input value={this.state.x} onChange={e => this.setState({'x': parseInt(e.target.value || 0)})} />
                </div>
                <div className="game__input">
                  <label>y</label>
                  <input value={this.state.y} onChange={e => this.setState({'y': parseInt(e.target.value || 0)})}/>
                </div>
                {this.state.selfPlayerReady ? '' : <button onClick={e => this.setState({isShipVertical: !this.state.isShipVertical})}> Rotate </button>}
                <button disabled={this.state.selfPlayerReady && (!this.state.gameReady || !this.state.yourTurn)} onClick={this.state.selfPlayerReady ? this.attack : this.placeShip}> {this.state.selfPlayerReady ? 'ATACK' : 'PLACE'} </button> <br />
                {this.state.failed ? 'Your choice was out of bounds or conflicted with an existing ship' : ''}
              </div>
            </div>
            <div className="game__side">
              <div className="game__header2">Enemy Waters</div>
              <div>{this.renderEnemyGrid()}</div>
            </div>
          </div>}
         
        </div>
      </Fragment>
    );
  }
}

class Tile extends Component {
  render() {
    const { children, onClick, hasShip, hit, highlight} = this.props;

    const classNamez = '';

    return (
      <div className={`grid-space ${hit === true ? 'red' : hit === false ? 'orange' : ''} ${ highlight ? 'teal' : ''} ${ hasShip ? 'blue': ''}`} onClick={onClick}>{children}</div>
    );
  }
}