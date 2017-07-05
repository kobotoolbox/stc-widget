import React from 'react';


function t(str) {
  // a placeholder function
  return str;
}

class STCTimer {
  constructor ({seconds, flashes, words, oncomplete}) {
    this.seconds = seconds;
    this.flashes = flashes;
    this.words = words;
  }
}


class WordList extends React.Component {
  render () {
    return (
        <div>
          {this.props.words.map((word)=>{
            return <div>{word}</div>
          })}
        </div>
      );
  }
}


export class STCWidget extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      started: false,
      remaining: 60,
    }
  }
  start = ()=> {
    this.setState({
      started: true,
    });
  }
  finish = ()=> {
    this.props.onComplete({
      time: 0,
      words: [],
    })
  }
  render () {
    if (!this.state.started) {
      return (
        <div>
          <button onClick={this.start}>
            {t('Start')}
          </button>
        </div>
      );
    } else if (!this.state.completed) {
      return (
        <div>
          <p>{this.state.timeRemaining}</p>
          <div class="words">
          </div>
          <button onClick={this.start}>
            {t('Finish')}
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <p>{this.state.timeRemaining}</p>
          <div class="words">
          </div>
          <button onClick={this.finish}>
            {t('Finish')}
          </button>
        </div>
      );
    }
  }
}