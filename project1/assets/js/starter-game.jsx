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
    this.channel
      .join()
      .receive("ok", resp => {this.setState(resp.game);})
      .receive("error", resp => { console.log("Unable to join", resp); });
  }

  render() {
    return <div></div>;
  }
}
