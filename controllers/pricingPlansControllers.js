import dotenv from 'dotenv';

import User from './../models/User';

dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getAllPlans = async (req, res) => {

    const planDetails = [
        {
            id: process.env.BASIC_PLAN_ID,
            name: 'BASIC',
            price: 100,
            feature_one: 'access to 5 exclusive features',
            feature_two: 'free market analysis',
            feature_three: 'email support'
        },
        {
            id: process.env.STANDARD_PLAN_ID,
            name: 'STANDARD',
            price: 300,
            feature_one: 'access to 10 exclusive features',
            feature_two: 'free market analysis',
            feature_three: 'email support'
        },
        {
            id: process.env.PREMIUM_PLAN_ID,
            name: 'PREMIUM',
            price: 350,
            feature_one: 'access to 15 exclusive features',
            feature_two: 'free market analysis',
            feature_three: 'email support'
        }
    ];


    res.status(200).json(planDetails);

};

const createSubscription = async (req, res) => {

    try {

        const user = await User.findById(req.user.userId);

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: req.body.planId,
                    quantity: 1
                }
            ],
            customer: user.stripe_customer_id,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        });

        console.log(session);

        res.status(200).json(session.url);


    } catch (error) {

        console.log(error);

    }

};


const subScriptionStatus = async (req, res) => {

    try {

        const userInfo = await User.findById(req.user.userId);

        const subscriptionsOfTheUser = await stripe.subscriptions.list({
            customer: userInfo.stripe_customer_id,
            status: "all",
            expand: ["data.default_payment_method"],
        });

        const userWithTheSubscriptionData = await User.findByIdAndUpdate(req.user.userId,
            {
                subscriptions: subscriptionsOfTheUser.data
            },
            { new: true }
        );

        res.status(200).json(userWithTheSubscriptionData);

    } catch (error) {

        console.log(error);

    }
};


const userSubscriptionInfo = async (req, res) => {

    const user = await User.findById(req.user.userId);

    const subscriptionsOfTheUser = await stripe.subscriptions.list({
        customer: user.stripe_customer_id,
        status: "all",
        expand: ["data.default_payment_method"],
    });

    res.status(200).json(subscriptionsOfTheUser);

};


export { getAllPlans, createSubscription, subScriptionStatus, userSubscriptionInfo };

