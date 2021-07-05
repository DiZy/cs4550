import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import background from './background.jpg';

export default function game_init(root, channel) {
  ReactDOM.render(<Starter channel={channel}/>, root);
}

export const GRID_SIZE = 5;
export const SHIP_SIZE = 3;
export const SHIP_BOUNDARY = Math.floor(SHIP_SIZE / 2);
export const DEFAULT_STATE = {
  gameIsFull: true,
  x: 1,
  y: 1,
  ship1: [],
  ship2: [],
  isShipVertical: false,
  selfPlayerReady: false,
  hitsOnOtherPlayer: [],
  logs: [],
  yourTurn: undefined,
  showConsoleTip: false
};

export const ACTIONS = {
  PLACE_SHIP: "placeShip",
  ATTACK: "attack",
  RESET: "reset"
};

class Starter extends Component {
  constructor(props) {
    super(props);

    this.state = DEFAULT_STATE;
    
    this.channel = props.channel;
    this.channel.on("update", this.updateView.bind(this))
    this.channel.join()
      .receive("ok", resp => {this.setState(resp.game);})
      .receive("error", resp => { console.warn("Unable to join", resp); });
  }

  componentDidUpdate() {
    if (this.state.failed) {
      setTimeout(() => this.setState({failed: false}), 2000)
    }

    if (this.state.showConsoleTip) {
      setTimeout(() => this.setState({showConsoleTip: false}), 2000)
    }
  }

  updateView(view) {
    this.setState(view.game);
  }

  dispatchAction = (action, payload = {}) => {
    this.setState({
      logs: [
        { action, payload },
        ...this.state.logs,
      ]
    });

    return this.channel.push(action, payload)
  }

  showLogs = () => {
    this.setState({showConsoleTip: true});

    const time = new Date();
    console.group(`Logs -- ${time.getDate()} ` );
    this.state.logs.forEach(logEntry => {
      console.group(`Action dispatched: ${logEntry.action}`)
      console.table(logEntry)
      console.groupEnd();
    });
    console.groupEnd();
  }

  createShipPayload = (x, y, shipNumber, rotateShip = false) => ({
      shipNumber: shipNumber,
      points: [...Array(SHIP_SIZE).keys()].map((entry, idx) => {
        let position = {}

        if (rotateShip) {
          position.y = x - SHIP_BOUNDARY + idx;
          position.x = y;
        } else {
          position.x = x - SHIP_BOUNDARY + idx;
          position.y = y;
        }
        
        return position;
      })
  });

  placeShip = (e) => {
    const { ship1, ship2, x, y , isShipVertical } = this.state;

    if (ship1.length == 0) { //place the first ship
      if (!isShipVertical && x >= SHIP_BOUNDARY && x < GRID_SIZE - SHIP_BOUNDARY) {
        return this.dispatchAction(ACTIONS.PLACE_SHIP, this.createShipPayload(x, y, 1));
      } else if (isShipVertical && y >= SHIP_BOUNDARY && y < GRID_SIZE - SHIP_BOUNDARY) {
        return this.dispatchAction(ACTIONS.PLACE_SHIP, this.createShipPayload(y, x, 1, true));
      }
    } else if (ship1.length > 0) { //place the second ship
        if (!isShipVertical && x >= SHIP_BOUNDARY && x < GRID_SIZE - SHIP_BOUNDARY) {
          const ship2Payload = this.createShipPayload(x, y, 2);

          if (!ship1.some(point => ship2Payload.points.some(point2 => point.x == point2.x && point.y == point2.y))) {
            return this.dispatchAction(ACTIONS.PLACE_SHIP, ship2Payload);
          }
        } else if (isShipVertical && y >= SHIP_BOUNDARY && y < GRID_SIZE - SHIP_BOUNDARY) {
          const ship2Payload = this.createShipPayload(y, x, 2, true)

          if (!ship1.some(point => ship2Payload.points.some(point2 => point.x == point2.x && point.y == point2.y))) {
            return this.dispatchAction(ACTIONS.PLACE_SHIP, ship2Payload);
          } 
        }
    }

    this.setState({failed: true});
  }

  attack = () => {
    this.dispatchAction(ACTIONS.ATTACK, {
      x: this.state.x,
      y: this.state.y
    })
  }

  resetGame = () => {
    this.dispatchAction(ACTIONS.RESET)
    window.location.reload()
  }

  renderGrid = () => {
    const { x, y , ship1, ship2, isShipVertical, gameReady} = this.state;

    return [...Array(GRID_SIZE).keys()].map(yCoord => {
      let row = [...Array(GRID_SIZE).keys()].map(xCoord => {


        const ship1Index = ship1.findIndex(entry => entry.x == xCoord && entry.y == yCoord)
        const ship2Index = ship2.findIndex(entry => entry.x == xCoord && entry.y == yCoord);

        const hasShip = ship1Index != -1 || ship2Index != -1;
        var hit = false;

        if (hasShip && (
          (ship1[ship1Index] && ship1[ship1Index].x == xCoord && ship1[ship1Index].y == yCoord && ship1[ship1Index].hit)
          || (ship2[ship2Index] && ship2[ship2Index].x == xCoord && ship2[ship2Index].y == yCoord && ship2[ship2Index].hit))) {
            hit = true;
        }

        let highlight = false;

        if (!gameReady && !hasShip && !hit) {
          if (!isShipVertical) {
            highlight = (yCoord == y) && (xCoord <= x + SHIP_BOUNDARY && xCoord >= x - SHIP_BOUNDARY);
          } else {
            highlight = (xCoord == x) && (yCoord <= y + SHIP_BOUNDARY && yCoord >= y - SHIP_BOUNDARY);
          }
        }

        return <Tile key={xCoord * 10 + yCoord} hit={hit} hasShip={hasShip} highlight={highlight}>x<sub>{xCoord}</sub> y<sub>{yCoord}</sub></Tile>;
      });
      return row.concat([<br />]);
    });
  }

  renderEnemyGrid = () => {
    const { x, y , hitsOnOtherPlayer, gameReady, isShipVertical} = this.state;

    let enemyBoard = [...Array(GRID_SIZE).keys()].map(yCoord => {
      let row = [...Array(GRID_SIZE).keys()].map(xCoord => {
        let hit = hitsOnOtherPlayer.find(entry => entry.x == xCoord && entry.y == yCoord)
        let highlight = gameReady && xCoord == x && yCoord == y;

        return <Tile key={xCoord * 10 + yCoord} hit={hit} highlight={highlight}>x<sub>{xCoord}</sub> y<sub>{yCoord}</sub></Tile>;
      });
      return row.concat([<br />]);
    });

    return enemyBoard;
  }

  renderTitle = () => {
    const {gameIsFull, winner, ship1, ship2, gameReady, yourTurn} = this.state;
    let gameStatus = "Game is full";

    if (!gameIsFull) {
      if (winner) {
        gameStatus = winner;
      }
      else if (ship1.length == 0) {
        gameStatus = "Place your first ship";
      }
      else if (ship2.length == 0) {
        gameStatus = "Place your second ship";
      }
      else if (gameReady) {
        if (yourTurn) {
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

    return (
      <h1 className="game__header">{gameStatus}</h1>
    );
  }
  
  renderControls = () => {
    const { x, y, selfPlayerReady, gameReady, yourTurn, isShipVertical} = this.state;

    return (
      <div className="game__controls">
        <div className="game__header2 f--b">Coordinates of action:</div>
        <div className="game__input">
          <label>x</label>
          <input value={x} onChange={e => this.setState({'x': parseInt(e.target.value || 0)})} />
        </div>
        <div className="game__input">
          <label>y</label>
          <input value={y} onChange={e => this.setState({'y': parseInt(e.target.value || 0)})}/>
        </div>
        {selfPlayerReady ? '' : <button onClick={e => this.setState({isShipVertical: !isShipVertical})}> Rotate </button>}
        <button disabled={selfPlayerReady && (!gameReady || !yourTurn)}
          onClick={selfPlayerReady ? this.attack : this.placeShip}> 
            {selfPlayerReady ? 'ATACK' : 'PLACE'} 
        </button>
        <br />
      </div>
    )
  }

  render() {
    return (
      <Fragment>
        <img className="background" src={background}/>
        <div className="game">
          {this.renderTitle()}
          {!this.state.gameIsFull &&
          <div className="game__board">
            <div className="game__side">
              <div className="game__header2">Battleground</div>
              <div>{this.renderGrid()}</div>
              {this.renderControls()}
            </div>
            <div className="game__side">
              <div className="game__header2">Enemy Waters</div>
              <div>{this.renderEnemyGrid()}</div>
            </div>
            {this.state.failed ? <div className="game__warning">Your choice was out of bounds or conflicted with an existing ship</div>: ''}
          </div>}
          <div className="game__settings">
            {this.state.showConsoleTip ? <div className="game__tip">Open your console 👻 !</div>: ''}
            <button onClick={this.resetGame}>
              RESET GAME
            </button>
            <button className="game__logs" onClick={this.showLogs}>
              LOGS
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

class Tile extends Component {
  render() {
    const { children, onClick, hasShip, hit, highlight} = this.props;

    const style = classNames(
      'grid-space',
      {'red': hit},
      {'teal': highlight},
      {'blue': hasShip},
    );

    return (
      <div className={style} onClick={onClick}>{children}</div>
    );
  }
}