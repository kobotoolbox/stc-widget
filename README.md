STC Widget
=========================

 * nvm use v8.1.2
 * npm i
 * npm start
  
Enketo Integration
=========================

A [Flowdock discussion](https://www.flowdock.com/app/kobotoolbox/kobo/threads/xxOZdG82LfC32hhPJl08Bc_70Ay) from September 11, 2017 follows below.

* Emily: Hey @Alex - @Yahya is working on the STC widget with martijn, who told him on a call last week that Enketo doesn't support the react component of his prototype. Do you have a way to integrate a React-based widget into Enketo?

* Alex: It depends on react being included / imported. This is not going to go into enketo's master branch, but we need to decide on a way to include it.

  I chose react so that we could go through quick iterations
  
  Goal is to have something like `npm install path/to/enketo-stc-widget` install the plug in and all dependencies (including react or a more lightweight substitute, e.g. vue) and then a config change in enketo-main which imports the widget.
  
  The difficult bit will be coming up with a way to not load the extra libraries for all users.
  
  https://github.com/kobotoolbox/stc-widt/blob/develop/src/index.js#L47-L78
  This is the function that needs to get executed by enketo.
  
  The `stc` function itself is library agnostic. It receives configuration parameters and returns a `Promise`.
  Does that help, @Yahya?
  https://github.com/kobotoolbox/stc-widget/compare/develop...export-default-fn?quick_pull=1
  
* Yahya: @Alex, one thing that's still not clear to me is whether that npm install would need to happen on the stc widget root or on the repo level (Moving the dependencies to Enketo?) ? Otherwise is it just a matter of wiring the imported stc function into a widget prototype to allow Enketo to use it?

* Alex: We would not hard-code the stc-widget dependency into enketo-main's `package.json`. Perhaps it could go in the enketo setup of our `kobo-docker` repo, where we:

  `npm install https://github.com/kobotoolbox/stc-widget`

  and then that would recursively install all dependencies on that server (including react, vue, etc).
  
  And yes, the imported function would be wired into a widget. However that is done, it would need to
  
  * (ideally) notice the STC widget question type exists in the survey and preload the js dependencies.
  * when the enumerator gets to that question, it runs the function with configurations which are defined in the XForm. (How they are expressed is still TBD. But a JSON string is the ugly way.)
  * when the promise returns successfully, it stores the result in a JSON string that gets submitted along with the XML instance.

* Yahya: Sounds good! Thanks @Alex
