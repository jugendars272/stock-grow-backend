// const Portfolio = require('../models/portfolio');
// const States = require('../models/states');
// const {Transection} = require("../models");
// exports.addStock = async (req, res) => {
//     const {stockPrice, quantity, ticker } = req.body;
//     const userId = req.userId
//     try {
//         const totalCost = stockPrice * quantity;

//         // Update the user's wallet
//         const userState = await States.findOne({ userId });
//         if (userState.current < totalCost) {
//             return res.status(400).json({ message: "Insufficient funds." });
//         }
//         userState.current -= totalCost;
//         userState.invested += totalCost;
//         await userState.save();

//         // Check if the user already owns the stock
//         let portfolio = await Portfolio.findOne({ userId, ticker });

//         if (portfolio) {
//             // Update the existing stock holding
//             portfolio.quantity += quantity;
//             portfolio.averagePrice = (portfolio.averagePrice * portfolio.quantity + stockPrice * quantity) / (portfolio.quantity + quantity);
//         } else {
//             // Add the new stock holding
//             portfolio = new Portfolio({
//                 userId,
//                 ticker,
//                 quantity,
//                 averagePrice: stockPrice
//             });
//         }
//         await portfolio.save();
//         const newTransaction = new Transection({userId, description:`Buy ${ticker}`, amount:stockPrice*quantity});
//          await newTransaction.save();
//         res.status(200).json({ message: "Stock bought successfully", portfolio });

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: "An error occurred", error });
//     }
// };

// exports.sellStock = async (req, res) => {
//     const {stockPrice, quantity, ticker } = req.body;
//     const userId = req.userId
//     try {
//         // Check the user's portfolio
//         const portfolio = await Portfolio.findOne({ userId, ticker });
//         if (!portfolio || portfolio.quantity < quantity) {
//             return res.status(400).json({ message: "Not enough stock to sell." });
//         }

//         // Calculate profit or loss
//         const totalSale = stockPrice * quantity;
//         const profit = totalSale - (portfolio.averagePrice * quantity);

//         // Update the user's wallet
//         const userState = await States.findOne({ userId });
//         userState.current += totalSale;
//         userState.returns += profit;
//         userState.totalReturnsPerc = (userState.returns / userState.invested) * 100;
//         await userState.save();

//         // Update or remove the stock from portfolio
//         portfolio.quantity -= quantity;
//         if (portfolio.quantity === 0) {
//             await Portfolio.deleteOne({ _id: portfolio._id });
//         } else {
//             await portfolio.save();
//         }
//         const newTransaction = new Transection({userId, description:`Sell ${ticker}`, amount:stockPrice*quantity});
//         await newTransaction.save();
//         res.status(200).json({ message: "Stock sold successfully", profit });

//     } catch (error) {
//         res.status(500).json({ message: "An error occurred", error });
//     }
// };

//Get Portfolio of a user
// exports.getPortfolio = async (req, res) => {
//     const userId = req.userId;
//     try {
//         const portfolio = await Portfolio.find({ userId });

//         // Fetch the current price for each stock
//         const portfolioWithPrices = await Promise.all(
//             portfolio.map(async (item) => {
//                 try {
//                     const quote = await yahooFinance.quote(item.ticker);
//                     const currentPrice = quote.regularMarketPrice || 0;
//                     return {
//                         ...item.toObject(),
//                         currentPrice,
//                         totalInvested: item.averagePrice * item.quantity,
//                         totalPrice: currentPrice * item.quantity,
//                     };
//                 } catch (error) {
//                     console.error(`Failed to fetch quote for ${item.ticker}:`, error);
//                     return {
//                         ...item.toObject(),
//                         currentPrice: 0,
//                         totalInvested: item.averagePrice * item.quantity,
//                         totalPrice: 0,
//                     };
//                 }
//             })
//         );

//         res.status(200).json({ portfolio: portfolioWithPrices });

//     } catch (error) {
//         res.status(500).json({ message: "An error occurred", error });
//     }
// };
const yahooFinance = require("yahoo-finance2").default;
const Portfolio = require('../models/portfolio');
const States = require('../models/states');
const Transaction  = require('../models/transections');
// exports.getPortfolio = async (req, res) => {
//     const userId = req.userId;
//     try {
//         const portfolio = await Portfolio.find({ userId });

//         // Fetch current prices and calculate profit/loss for each item in the portfolio
//         const portfolioWithProfitLoss = await Promise.all(
//             portfolio.map(async (item) => {
//                 console.log(item)
//                 const quote = await yahooFinance.quote(item.ticker);
//                 console.log(quote)
//                 const currentPrice = quote?.regularMarketPrice || 0;

//                 const totalInvested = item.averagePrice * item.quantity;
//                 const currentTotalValue = currentPrice * item.quantity;
//                 const profitLoss = currentTotalValue - totalInvested;

//                 return {
//                     ticker: item.ticker,
//                     quantity: item.quantity,
//                     averagePrice: item.averagePrice,
//                     currentPrice,
//                     profitLoss,
//                 };
//             })
//         );

//         res.status(200).json({ portfolio: portfolioWithProfitLoss });
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: "An error occurred", error });
//     }
// };


const axios = require('axios');
// Function to fetch conversion rate using the same API logic from the frontend
const convertToINR = async (amount, currency) => {
    if (currency === "INR") return amount; // No need to convert if it's already in INR

    try {
        // Use the same API endpoint you used on the frontend
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
        const conversionRate = response.data.rates.INR;

        // Convert amount to INR
        return amount * conversionRate;
    } catch (error) {
        console.error("Error fetching conversion rate:", error);
        return amount; // Return the original amount if conversion fails
    }
};

exports.getPortfolio = async (req, res) => {
    const userId = req.userId;
    try {
        const portfolio = await Portfolio.find({ userId });

        // Fetch current prices and calculate profit/loss for each item in the portfolio
        const portfolioWithProfitLoss = await Promise.all(
            portfolio.map(async (item) => {
                console.log(item);
                const quote = await yahooFinance.quote(item.ticker);
                console.log(quote);
                const currentPrice = quote?.regularMarketPrice || 0;
                const currency = quote.currency || "USD"; // Fallback to USD if currency is undefined

                // Convert current price to INR using the external API
                const currentPriceINR = await convertToINR(currentPrice, currency);

                const totalInvested = item.averagePrice * item.quantity;
                const currentTotalValue = currentPriceINR * item.quantity;
                const profitLoss = currentTotalValue - totalInvested;

                return {
                    ticker: item.ticker,
                    quantity: item.quantity,
                    averagePrice: item.averagePrice,
                    currentPrice: currentPriceINR, // Show the converted INR price
                    profitLoss,
                };
            })
        );

        res.status(200).json({ portfolio: portfolioWithProfitLoss });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};

//New--------------------------------------->

exports.buyStock = async (req, res) => {
    const { stockPrice, quantity, ticker } = req.body;
    const userId = req.userId;

    try {
        const totalCost = stockPrice * quantity;

        // Check user's available funds
        const userState = await States.findOne({ userId });
        if (userState.current < totalCost) {
            return res.status(400).json({ message: "Insufficient funds." });
        }

        // Deduct funds and update the investment
        userState.current -= totalCost;
        userState.invested += totalCost;
        await userState.save();

        // Check if the user already owns the stock
        let portfolio = await Portfolio.findOne({ userId, ticker, positionType: 'long' });
        if (portfolio) {
            // Update the existing holding
            portfolio.averagePrice = (portfolio.averagePrice * portfolio.quantity + stockPrice * quantity) / (portfolio.quantity + quantity);
            portfolio.quantity += quantity;
        } else {
            // Add new stock holding
            portfolio = new Portfolio({
                userId,
                ticker,
                quantity,
                averagePrice: stockPrice,
                positionType: 'long'
            });
        }
        await portfolio.save();

        // Log the transaction
        await new Transaction({
            userId,
            description: `Bought ${quantity} shares of ${ticker}`,
            amount: totalCost
        }).save();

        res.status(200).json({ message: "Stock bought successfully", portfolio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};

exports.sellStock = async (req, res) => {
    const { stockPrice, quantity, ticker } = req.body;
    const userId = req.userId;

    try {
        const portfolio = await Portfolio.findOne({ userId, ticker, positionType: 'long' });
        if (!portfolio || portfolio.quantity < quantity) {
            return res.status(400).json({ message: "Not enough stock to sell." });
        }

        const totalSale = stockPrice * quantity;
        const profit = totalSale - (portfolio.averagePrice * quantity);

        // Update user's wallet and returns
        const userState = await States.findOne({ userId });
        userState.current += totalSale;
        userState.returns += profit;
        userState.totalReturnsPerc = (userState.returns / userState.invested) * 100;
        await userState.save();

        // Update or remove portfolio entry
        portfolio.quantity -= quantity;
        if (portfolio.quantity === 0) {
            await Portfolio.deleteOne({ _id: portfolio._id });
        } else {
            await portfolio.save();
        }

        // Log the transaction
        await new Transaction({
            userId,
            description: `Sold ${quantity} shares of ${ticker}`,
            amount: totalSale
        }).save();

        res.status(200).json({ message: "Stock sold successfully", profit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};


exports.shortSell = async (req, res) => {
    const { stockPrice, quantity, ticker } = req.body;
    const userId = req.userId;

    try {
        const totalCost = stockPrice * quantity;

        // Check user's available funds
        const userState = await States.findOne({ userId });
        if (userState.current < totalCost) {
            return res.status(400).json({ message: "Insufficient funds for short selling." });
        }

        // Deduct the margin amount
        userState.current -= totalCost;
        userState.margin += totalCost;
        await userState.save();

        // Create a short position
        const portfolio = new Portfolio({
            userId,
            ticker,
            quantity,
            averagePrice: stockPrice,
            positionType: 'short'
        });
        await portfolio.save();

        // Log the transaction
        await new Transaction({
            userId,
            description: `Short sold ${quantity} shares of ${ticker}`,
            amount: totalCost
        }).save();

        res.status(200).json({ message: "Short position opened successfully", portfolio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};


exports.coverShort = async (req, res) => {
    const { stockPrice, quantity, ticker } = req.body;
    const userId = req.userId;

    try {
        const portfolio = await Portfolio.findOne({ userId, ticker, positionType: 'short' });
        if (!portfolio || portfolio.quantity < quantity) {
            return res.status(400).json({ message: "Not enough shares to cover the short position." });
        }

        const totalCost = stockPrice * quantity;
        const profit = (portfolio.averagePrice - stockPrice) * quantity;

        // Release margin and add profit to the user's wallet
        const userState = await States.findOne({ userId });
        userState.margin -= portfolio.averagePrice * quantity;
        userState.current += portfolio.averagePrice * quantity + profit;
        await userState.save();

        // Update or remove the portfolio entry
        portfolio.quantity -= quantity;
        if (portfolio.quantity === 0) {
            await portfolio.deleteOne();
        } else {
            await portfolio.save();
        }

        // Log the transaction
        await new Transaction({
            userId,
            description: `Covered short ${quantity} shares of ${ticker}`,
            amount: totalCost
        }).save();

        res.status(200).json({ message: "Short position covered successfully", profit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};
