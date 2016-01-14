// Module for registering aws credentials
var controller;
exports.init = function(ctrl) {
	controller = ctrl;
	controller.hears(['configure'],'direct_message',function(bot, message) {

    	bot.startConversation(message, askAccessKey);
	});
};



var askAccessKey = function(response, convo) {
        convo.ask('What is your AWS Access Key?', function(message, convo) {
        	controller.storage.users.get(message.user,function(err, user) {
		        if (!user) {
		            user = {
		                id: message.user,
		            };
		        }
		        user.access_key = message.text;
		        controller.storage.users.save(user,function(err, id) {
		            askSecretKey(convo);
		            convo.next();
		        });
		    });
        });
};
	        
var askSecretKey = function(convo) {
	convo.ask("What is your AWS Secret Key?", function(message, convo){
		controller.storage.users.get(message.user,function(err, user) {
	        if (!user) {
	            user = {
	                id: message.user,
	            };
	        }
	        user.secret_key = message.text;
	        controller.storage.users.save(user,function(err, id) {
	        	askRegion(convo);
	    		convo.next();
	        });
	    });
	});
};

var askRegion = function(convo) {
	convo.ask("What is the region(ex: us-east-1)?", function(message, convo){
		controller.storage.users.get(message.user,function(err, user) {
	        if (!user) {
	            user = {
	                id: message.user,
	            };
	        }
	        user.region = message.text;
	        controller.storage.users.save(user,function(err, id) {
	        	convo.say("Great! try some commands");
	        	convo.next();
	        });
	    });
	});
};