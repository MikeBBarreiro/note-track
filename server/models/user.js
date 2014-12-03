'use strict';

var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    UserSchema = null,
    User = null;

UserSchema = new mongoose.Schema({
  username:  {type: String, required: true, validate: [usernameV, 'username length'], unique: true},
  password:  {type: String, required: true, validate: [passwordV, 'password length']},
  createdAt: {type: Date,  required: true, default: Date.now},
    avatarUrl: {type: String}
});

UserSchema.methods.encrypt = function(){
  this.password = bcrypt.hashSync(this.password, 10);
};
/*
UserSchema.methods.downloadImage = function(cb){
    var dirName   = 'client/assets/img/' + this.username,
        relPath  = 'assets/img/' + this.username + '/avatar.png',
        self = this;

    if(!fs.existsSync(dirName)){fs.mkdirSync(dirName);}


    request(self.avatarUrl).pipe(fs.createWriteStream(dirName + '/avatar.png'))
        .on('close', function(){
            self.avatarUrl = relPath;
            cb(null);
        })
        .on('error', function(){
            //error catching for requests
            cb(null);
        });
};
*/
/*
UserSchema.methods.download = function(){
    var assetDir = dirnam + '/../../assets/' + this._id,
        ext      = path.extname(this.avatar);

    fs.mkdirSync(assetDir);

    request(this.avatar).pipe(fs.createWriteStream(assetDir + '/avatar' + ext));
    this.avatar = '/assets/' + this._id + '/avatar' + ext;
}*/

UserSchema.statics.login = function(obj, cb){
  User.findOne({username: obj.username}, function(err, user){
    if(!user){
     return cb();
    }

    var isGood = bcrypt.compareSync(obj.password, user.password);

    if(!isGood){
      return cb();
    }

    cb(user);
  });
};

function usernameV(v){
  return v.length >= 3 && v.length <= 12;
}

function passwordV(v){
  return v.length === 60;
}

User = mongoose.model('User', UserSchema);
module.exports = User;
