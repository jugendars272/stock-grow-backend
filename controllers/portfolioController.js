const Portfolio = require('../models/portfolio');
const States = require('../models/states');
const yahooFinance = require("yahoo-finance2").default;

exports.addStock = async (req, res) => {
    const {stockPrice, quantity, ticker } = req.body;
    const userId = req.userId
    try {
        const totalCost = stockPrice * quantity;

        // Update the user's wallet
        const userState = await States.findOne({ userId });
        if (userState.current < totalCost) {
            return res.status(400).json({ message: "Insufficient funds." });
        }
        userState.current -= totalCost;
        userState.invested += totalCost;
        await userState.save();

        // Check if the user already owns the stock
        let portfolio = await Portfolio.findOne({ userId, ticker });

        if (portfolio) {
            // Update the existing stock holding
            portfolio.quantity += quantity;
            portfolio.averagePrice = (portfolio.averagePrice * portfolio.quantity + stockPrice * quantity) / (portfolio.quantity + quantity);
        } else {
            // Add the new stock holding
            portfolio = new Portfolio({
                userId,
                ticker,
                quantity,
                averagePrice: stockPrice
            });
        }
        await portfolio.save();

        res.status(200).json({ message: "Stock bought successfully", portfolio });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "An error occurred", error });
    }
};

exports.sellStock = async (req, res) => {
    const {stockPrice, quantity, ticker } = req.body;
    const userId = req.userId
    try {
        // Check the user's portfolio
        const portfolio = await Portfolio.findOne({ userId, ticker });
        if (!portfolio || portfolio.quantity < quantity) {
            return res.status(400).json({ message: "Not enough stock to sell." });
        }

        // Calculate profit or loss
        const totalSale = stockPrice * quantity;
        const profit = totalSale - (portfolio.averagePrice * quantity);

        // Update the user's wallet
        const userState = await States.findOne({ userId });
        userState.current += totalSale;
        userState.returns += profit;
        userState.totalReturnsPerc = (userState.returns / userState.invested) * 100;
        await userState.save();

        // Update or remove the stock from portfolio
        portfolio.quantity -= quantity;
        if (portfolio.quantity === 0) {
            await Portfolio.deleteOne({ _id: portfolio._id });
        } else {
            await portfolio.save();
        }

        res.status(200).json({ message: "Stock sold successfully", profit });

    } catch (error) {
        res.status(500).json({ message: "An error occurred", error });
    }
};

//Get Portfolio of a user

// exports.getPortfolio = async (req, res) => {
//     const userId = req.userId
//     try {
//         const portfolio = await Portfolio.find({ userId });
//         res.status(200).json({ portfolio });

//     } catch (error) {
//         res.status(500).json({ message: "An error occurred", error });
//     }
// };


exports.getPortfolio = async (req, res) => {
    const userId = req.userId;
    try {
        const portfolio = await Portfolio.find({ userId });

        // Fetch the current price for each stock
        const portfolioWithPrices = await Promise.all(
            portfolio.map(async (item) => {
                try {
                    const quote = await yahooFinance.quote(item.ticker);
                    const currentPrice = quote.regularMarketPrice || 0;
                    return {
                        ...item.toObject(),
                        currentPrice,
                        totalInvested: item.averagePrice * item.quantity,
                        totalPrice: currentPrice * item.quantity,
                    };
                } catch (error) {
                    console.error(`Failed to fetch quote for ${item.ticker}:`, error);
                    return {
                        ...item.toObject(),
                        currentPrice: 0,
                        totalInvested: item.averagePrice * item.quantity,
                        totalPrice: 0,
                    };
                }
            })
        );

        res.status(200).json({ portfolio: portfolioWithPrices });

    } catch (error) {
        res.status(500).json({ message: "An error occurred", error });
    }
};
