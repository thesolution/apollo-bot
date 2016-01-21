
var Promise = require("bluebird");
var BotkitAsync = Promise.promisifyAll(require('Botkit'));
var os = require('os');
var bluebirdOptions = { 
  multiArgs: true, 
  promisifier: (originalMethod, defaultPromisifer) => {
   return () => {
        var args = [].slice.call(arguments);
        var self = this;
        return new Promise( (resolve, reject) => {
          args.push( () => {
            //console.log(Object.values(arguments));
            resolve(Object.keys(arguments).map(key => arguments[key]));
          });
          var emitter = originalMethod.apply(self, args);
          return emitter;
        });
    };
  }
};


var controller = Promise.promisifyAll(BotkitAsync.slackbot({
    debug: false,
    json_file_store: "./store"
}), bluebirdOptions);
var users = Promise.promisifyAll(controller.storage.users);
var channels = Promise.promisifyAll(controller.storage.channels);
// console.log('hello');
var botAsync = Promise.promisifyAll(controller.spawn({
    token: process.env.SLACK_TOKEN
}).startRTM(), bluebirdOptions);


// This version of hears wraps botkit hears and storage
// the resolved promise returns {bot, message, user, channel}
// user and channel are {} if not found in the data store;
exports.hears = ( keywords, events) => {

	return controller.hearsAsync(keywords, events)
    .spread( (bots, message) => {
      return Promise.props({bots, message})
    })
    .then( (botsMessage) => {
     return users.getAsync(botsMessage.message.user)
      .catchReturn({})
      .then( (userObject) => {
        botsMessage.user = userObject
        return Promise.props(botsMessage);  
      })
    })
    .then( (objPlusUser) => {
      // console.log(Object.keys(objPlusUser));
      return channels.getAsync(objPlusUser.message.channel)
      .catchReturn({})
      .then( (channelObject) => {
        objPlusUser.channel = channelObject;
        return Promise.props(objPlusUser);  
      })
    });
};