import React from 'react';
import ReactDOM from 'react-dom';
import {STCWidget} from './components/STCWidget';
import {log} from './log';

const testwords = ["It", "was", "the", "best", "of", "times,", "it",
"was", "the", "worst", "of", "times,", "it", "was",
"the", "age", "of", "wisdom,", "it", "was", "the",
"age", "of", "foolishness,", "it", "was", "the",
"epoch", "of", "belief,", "it", "was", "the", "epoch",
"of", "incredulity,", "it", "was", "the", "season",
"of", "Light,", "it", "was", "the", "season", "of",
"Darkness,", "it", "was", "the", "spring", "of",
"hope,", "it", "was", "the", "winter", "of", "despair,",
"we", "had", "everything", "before", "us,", "we", "had",
"nothing", "before", "us,", "we", "were", "all", "going",
"direct", "to", "Heaven,", "we", "were", "all", "going",
"direct", "the", "other", "way", "–", "in", "short,",
"the", "period", "was", "so", "far", "like", "the",
"present", "period,", "that", "some", "of", "its",
"noisiest", "authorities", "insisted", "on", "its",
"being", "received,", "for", "good", "or", "for",
"evil,", "in", "the", "superlative", "degree", "of",
"comparison", "only."].map((word)=>{
  return {
    text: word,
  }
});

import {WordList} from './WordList';


function stc (element, params) {
  return new Promise(function(complete, fail){
    ReactDOM.render(
      <div>
        <STCWidget {...Object.assign(params, {
          onComplete: complete,
          onFail: fail,
        })} />
      </div>,
      document.getElementById("app")
    )
  });
}

stc(document.getElementById("app"), {
  seconds: 60,
  flashes: [
    {
      seconds: 30,
      message: "please select the current word",
      code: "30s_current_word",
    },
  ],
  words: new WordList(testwords),
}).then(function (params) {
  console.log("Widget completed with params", params);
});
