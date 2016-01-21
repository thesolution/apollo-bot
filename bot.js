
if (!process.env.TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var manageUsers = require('./manageUsers.js');
var aws = require('./aws.js');
var Promise = require("bluebird");
var BotkitAsync = Promise.promisifyAll(require('Botkit'));
var os = require('os');
var bluebirdOptions = { 
  multiArgs: true, 
  promisifier: function(originalMethod, defaultPromisifer) {
    // var promisified = defaultPromisifer(originalMethod);
    //console.log(originalMethod.toString());
   return function() {
        var args = [].slice.call(arguments);
        var self = this;
        return new Promise(function(resolve, reject) {
          args.push(function(){
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

var botAsync = Promise.promisifyAll(controller.spawn({
    token: process.env.TOKEN
}).startRTM(), bluebirdOptions);

var usersAsync = Promise.promisifyAll(controller.storage.users);
console.log('hello');

// register modules
manageUsers.init(controller);
controller.hearsAsync(['hey'],'direct_message')
.spread(function(bots, message){
  //  console.log(bots);
  //  console.log(message);
  // console.log("it worked")
  return Promise.all([Promise.props({bots:bots, message:message, user:usersAsync.getAsync(message.user)})]);
})
.spread(function(bots) {
  console.log(Object.keys(bots));
  console.log(bots.user);
})
.catch(function(err){
  console.log(err);
  console.log("there was a problem");
});
controller.hears(['hello','hi'],'direct_message,direct_mention,mention',function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'rocket',
    },function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(',err);
        }
    });
    controller.storage.channels.save({id: message.channel, region:"us-east-1"}, function(err, id){
      console.log("saved id " +id);
    });

    controller.storage.users.get(message.user,function(err, user) {
        if (user && user.name) {
            bot.reply(message,'Hello ' + user.name + '!!');
        } else {
            bot.reply(message,'Hello.');
        }
    });
});

controller.hears(['call me (.*)'],'direct_message,direct_mention,mention',function(bot, message) {
    var matches = message.text.match(/call me (.*)/i);
    var name = matches[1];
    controller.storage.users.get(message.user,function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user,function(err, id) {
            bot.reply(message,'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is my name','who am i'],'direct_message,direct_mention,mention',function(bot, message) {

    controller.storage.users.get(message.user,function(err, user) {
        if (user && user.name) {
            bot.reply(message,'Your name is ' + user.name);
        } else {
            bot.reply(message,'I don\'t know yet!');
        }
    });
});


controller.hears(['shutdown'],'direct_message,direct_mention,mention',function(bot, message) {

    bot.startConversation(message,function(err, convo) {
        convo.ask('Are you sure you want me to shutdown?',[
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    },3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['uptime','identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {

    var hostname = os.hostname();
    var uptime = formatUptime(process.uptime());

    bot.reply(message,':robot_face: I am a bot named <@' + bot.identity.name + '>. I have been running for ' + uptime + ' on ' + hostname + '.');

});

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}