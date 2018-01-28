import React from 'react';
import ReactDOM from 'react-dom';
import {STCWidget} from './components/STCWidget';
import {log} from './log';

/*
example usage:

stc(document.getElementById("app"), {
  seconds: 60,
  actions: [
    {
      time: 50,
      message: "Child has not read 5 words in 10 seconds, please conclude the task.",
      code: "conclude_task",
      wordsCondition: {
        status: 'CORRECT',
        operator: "<",
        value: 5,
      },
    },
    {
      time: 55,
      message: "Please select the current word.", //This sets the value of the milestone word
      code: "select_current_word",
      // type: "FLASH",
      wordsCondition: null,
    },
    {
      time: 0,
      message: "Task Done!",
      code: "time_out",
      wordsCondition: null,
    },
  ],
  words: new WordList(testwords),
}).then(function (params) {
  console.log("Widget completed with params: ");
  console.log(params);
});
*/

export default function (element, params) {
  return new Promise(function(complete, fail){
    ReactDOM.render(
      <div>
        <STCWidget {...Object.assign(params, {
          onComplete: complete,
          onFail: fail,
        })} />
      </div>,
      element,
    )
  });
}
