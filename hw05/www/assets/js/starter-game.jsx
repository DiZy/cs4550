import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<Starter channel={channel}/>, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.allowClicks = true;
    this.cardClick = this.cardClick.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.channel
      .join()
      .receive("ok", state => {this.setState(state);})
      .receive("error", resp => { console.log("Unable to join", resp); });
  }
  
  componentDidMount() {
    document.addEventListener("keydown", this.resetGame);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.resetGame);
  }

  resetGame(event) {
  }

  cardClick(index) {
    // Don't allow clicking more cards during timeout
    if(this.allowClicks) {
      this.channel.push("select", {index: index})
            .receive("ok", resp => {
              this.setState(resp.game);
              if(resp.askForDeselect) {
                setTimeout(() => {
                  this.channel.push("deselect").receive("deselected", resp.game  => {
			              this.setState(resp.game);
		  	            this.allowClicks = true;
		               });
                }, 500);
              }
            });
    }
  }

  render() {
    let cards = this.state.cards.map((card, index) => {
      if(card === null) {
        return <EmptyCard key={index}/>;
      } else {
        let isShown = (index === this.state.selected || index === this.state.secondSelected);
        return <Card key={index} letter={card} click={this.cardClick} index={index}/>;
      }
    });

    return (<div>
      <h1>Total clicks: {this.state.totalClicks}</h1>
      <div className="cardContainer">{cards}</div>
      <h6>Press "r" to restart the game</h6>
    </div>);
  }
}

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.cardClick = this.cardClick.bind(this);
  }

  cardClick() {
    this.props.click(this.props.index);
  }

  render() {
    return (<div className="card" onClick={this.cardClick}>
      <div className="letter">
        {this.props.letter}
      </div>
    </div>);
  }
}

class EmptyCard extends React.Component {
  render() {
    return (<div className="card emptyCard">

    </div>);
  }
}
