import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: this.genCards(),
      selected: null,
      secondSelected: null,
      totalClicks: 0
    };

    this.allowClicks = true;
    this.cardClick = this.cardClick.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  genCards() {
    let cards = ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F", "G", "G", "H", "H"];
    
    // Shuffle cards
    for(var i = 0; i < 16; i++) {
      let rand = Math.floor(Math.random() * cards.length);
      let rand2 = Math.floor(Math.random() * cards.length);
      let temp = cards[rand];
      cards[rand] = cards[rand2];
      cards[rand2] = temp;
    }

    return cards;
  }

  componentDidMount() {
    document.addEventListener("keydown", this.resetGame);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.resetGame);
  }

  resetGame(event) {
    if(event.keyCode == 82) {
      this.setState({
        cards: this.genCards(),
        selected: null,
        secondSelected: null,
        totalClicks: 0
      });
    }
  }

  cardClick(index) {
    // Don't allow clicking more cards during timeout
    if(this.allowClicks) {
      if(this.state.selected === null) {
        let newState = _.assign({}, this.state, {
          selected: index,
          totalClicks: this.state.totalClicks + 1,
        });
        this.setState(newState);
      } else if(index !== this.state.selected){
        this.allowClicks = false;
        let newState = _.assign({}, this.state, {
          totalClicks: this.state.totalClicks + 1,
          secondSelected: index,
        });
        this.setState(newState);
        setTimeout(() => {
          if(this.state.cards[index] === this.state.cards[this.state.selected]) {
            // Match found, remove cards
            let newCards = this.state.cards;
            newCards[index] = null;
            newCards[this.state.selected] = null;
            let newState = _.assign({}, this.state, {
              selected: null,
              secondSelected: null,
              cards: newCards,
            });
            this.setState(newState);
          } else {
            // No match found, clear selected cards
            let newState = _.assign({}, this.state, {
              selected: null,
              secondSelected: null,
            });
            this.setState(newState);
          }
          this.allowClicks = true;
        }, 500);
      }

    }
  }

  render() {
    let cards = this.state.cards.map((card, index) => {
      if(card === null) {
        return <EmptyCard key={index}/>;
      } else {
        let isShown = (index === this.state.selected || index === this.state.secondSelected);
        return <Card key={index} letter={card} shown={isShown} click={this.cardClick} index={index}/>;
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
      <div hidden={!this.props.shown} className="letter">
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