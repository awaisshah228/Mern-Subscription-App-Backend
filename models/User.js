import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'user must enter his/her full name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'user must enter his/her email address'],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'please provide a valid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'user must enter his/her password'],
        min: [6, 'the minimum length of password should be 6']
    },
    stripe_customer_id: {
        type: String 
    },
    subscriptions: [] 
}, {
    timestamps: true
});

userSchema.pre('save', async function() {

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

});


userSchema.methods.comparePasswords = async function(passwordEnteredByTheUser) {

    const isMatch = await bcrypt.compare(passwordEnteredByTheUser, this.password);

    return isMatch;

};


userSchema.methods.generateJWTToken = function() {

    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });

}


export default mongoose.model('User', userSchema);

