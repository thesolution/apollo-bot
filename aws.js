"use strict"

var aws = require('aws-sdk');
var Proxy = require('harmony-proxy');
var Promise = require("bluebird");

exports.getEC2 = function(controller, message, requireUserCredentials) {
	// console.log(controller.storage);
	console.log(Promise.promisifyAll(controller.storage.channels));
	var skeleton = new aws.EC2();
	// controller.storage.channels.getAsync("one")
	// 	.then(function(chan) {
	// 		console.log(chan);
	// 	})
	// 	.error(function(err){console.log(err);});
	

}

// var e = exports.getEC2(null, null);
// e.createOrUpdateTags({yo:11}, function(e,d){
// 	console.log(e);
// 	console.log(d);

// });
// console.log(e);
// e.Connection({one:1}, function(err, data){
// 	console.log(err);
// 	console.log(data);

// });