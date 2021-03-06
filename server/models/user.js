const mongoose = require('mongoose');

// const UserSchema = new Schema({
// 	name: String,
// 	username: {type: String, index: true, unique: true , required: true },
// 	id: Schema.Types.ObjectId,
// 	email: {type: String, index: true, unique: true , required: true },
//   password: String,
// 	image: {data: Buffer, contentType: String },
// 	age: { type: Number, min: 18, max: 99 },
// 	date: { type: Date, default: Date.now },
// 	location: {street: String, number: String, zip: Number, city: String}
// =======
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const UserSchema = new Schema({
	name: { type: String, required: true },
	id: Schema.Types.ObjectId,
	email: { type: String, index: { unique: true }, required: true },
  password: { type: String, required: true },
	date: { type: Date, default: Date.now },
  age: { type: Number, min: 18, max: 99 },
  address: { type: String, required: true },
  avatar: { type: String, required: true }
});

/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
UserSchema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};


/**
 * The pre-save hook method.
 */
UserSchema.pre('save', function saveHook(next) {
  const user = this;

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();


  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      // replace a password string with hash value
      user.password = hash;

      return next();
    });
  });
});
module.exports = mongoose.model('User', UserSchema);
