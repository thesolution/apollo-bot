// Module for registering aws credentials
"use strict";

var aws = require("aws-sdk");
var _ = require('lodash');
var controller;
exports.init = function(ctrl) {
	controller = ctrl;
	controller.hears(['tahiti status'],'direct_message',function(bot, message) {
		controller.storage.channels.get(message.channel,function(err, channel){

		});
    	
	});
};

var as = new aws.AutoScaling({region:"us-east-1"}); 
as.describeAutoScalingGroups({}, function(err, data){console.log(data)});
// ec2.describeInstances({}, function(err, data) {
// 	var reservations = _.flatten(data.Reservations, true)
// 	var instances = _.chain(reservations)
// 		.map(function(reservation){ return reservation.Instances})
// 		.flatten(true)
// 		.map(function(instance) {
// 			instance.tag = _.reduce(instance.Tags, function(hash, val){
// 				hash[val.Key] = val.Value;
// 				return hash;
// 			}, {});
			
// 			return instance;
// 		})
// 		.reduce( function(hash, inst){
			
// 			if(!!!inst.tag.Environment) {
// 				// console.log(inst.InstanceId, inst.tag);
// 			}
// 			if(!!!hash[inst.tag.Environment]) {
// 				hash[inst.tag.Environment] = {};
// 			}
// 			if(hash[inst.tag.Environment][inst.State.Name]){
// 				// hash[inst.tag.Environment][inst.State.Name].push(inst.InstanceId);
// 				hash[inst.tag.Environment][inst.State.Name] += 1
// 			} else {
// 				// hash[inst.tag.Environment][inst.State.Name] = [inst.InstanceId];
// 				hash[inst.tag.Environment][inst.State.Name] = 1;
// 			}
// 			return hash;
// 		}, {})
// 		.value();
		

// 	console.log(instances);
// });

