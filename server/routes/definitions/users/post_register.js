'use strict';

var Joi  = require('joi'),
    User = require('../../../models/user');

module.exports = {
  description: 'Register a User',
  tags:['users'],
  validate: {
    payload: {
      username: Joi.string().min(3).max(12).required(),
      photo: Joi.string().required(),
      password: Joi.string().min(3).required()
    }
  },
  auth: {
    mode: 'try'
  },
  handler: function(request, reply){
    var user = new User(request.payload);
    user.encrypt();
    user.downloadImage(function(){
      user.save(function(err){
        reply().code(err ? 401 : 200);
      });
    });
  }
};
