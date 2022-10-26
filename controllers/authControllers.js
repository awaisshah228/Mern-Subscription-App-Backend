import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';

dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


import User from './../models/User';


const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!(name && email && password)) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: 'please fill all the input fields'
            });
        }

        if (password.length < 6) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: 'length of password should be greater than 6'
            });
        }

        const doUserAlreadyExists = await User.findOne({ email: email });

        if (doUserAlreadyExists) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: 'user with this emailID already exists. please try another email address'
            });
        }

        const customer = await stripe.customers.create({ email }); 

        const newUser = await User.create({ name, email, password, stripe_customer_id: customer.id });

        const token = await newUser.generateJWTToken();


        res.status(StatusCodes.CREATED).json({
            token: token,
            user: {
                name: newUser.name,
                email: newUser.email,
            }
        });

    } catch (error) {

        console.log(error);

    }


};

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: 'please fill all the input fields'
            });
        }

        if (password.length < 6) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: 'length of password should be greater than 6'
            });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: 'Invalid Credentials'
            });
        }

        const isMatchPassword = await user.comparePasswords(password);

        if (!isMatchPassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: 'Invalid Credentials'
            });
        }

        const token = user.generateJWTToken();

        res.status(StatusCodes.CREATED).json({
            token: token,
            user: {
                name: user.name,
                email: user.email,
            }
        });


    } catch (error) {

        console.log(error);

    }

};


export { register, login };