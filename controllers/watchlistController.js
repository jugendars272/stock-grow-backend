const { Watchlist } = require("../models");
const { User } = require("../models");
const yahooFinance = require('yahoo-finance2').default;

// API to add a ticker into watchlist
const add = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: true, msg: "User not found" });
        }

        const { ticker } = req.body;
        let watchlist = await Watchlist.findOne({ userId: userId });
        if (!watchlist) {
            const newWatchlist = new Watchlist({
                userId,
                list: [ticker]
            });
            await newWatchlist.save();
            return res.status(201).send({ error: false, msg: "Added to watchlist", watchlist: newWatchlist });
        }

        watchlist.list.push(ticker);
        await watchlist.save();
        return res.status(200).send({ error: false, msg: "Added to watchlist", watchlist });
    } catch (error) {
        return res.status(500).send({ error: true, msg: "Something went wrong" });
    }
};


const getWatchlist = async (req, res) => {
  try {
    const { userId } = req;
    const watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) {
      return res.status(200).send({ error: false, msg: "Watchlist fetched successfully", list: [] });
    }

    // Fetch current stock price and percentage change for each ticker
    const watchlistWithPrices = await Promise.all(
      watchlist.list.map(async (ticker) => {
        try {
          const quote = await yahooFinance.quote(ticker);
          const currentPrice = quote.regularMarketPrice || 0;
          const percentageChange = quote.regularMarketChangePercent || 0;

          return {
            ticker,
            currentPrice,
            percentageChange,
          };
        } catch (error) {
          console.error(`Error fetching data for ticker ${ticker}:`, error);
          return {
            ticker,
            currentPrice: 0,
            percentageChange: 0,
          };
        }
      })
    );

    return res.status(200).send({
      error: false,
      msg: "Watchlist fetched successfully",
      list: watchlistWithPrices,
    });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return res.status(500).send({ error: true, msg: "Something went wrong" });
  }
};


const deleteTicker = async (req, res) => {
    try {
        const { userId } = req;
        const { ticker } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: true, msg: "User not found" });
        }

        const watchlist = await Watchlist.findOne({ userId });
        if (!watchlist) {
            return res.status(404).send({ error: true, msg: "Watchlist not found" });
        }

        const tickerIndex = watchlist.list.indexOf(ticker);
        if (tickerIndex === -1) {
            return res.status(404).send({ error: true, msg: "Ticker not found in watchlist" });
        }

        watchlist.list.splice(tickerIndex, 1);
        await watchlist.save();

        return res.status(200).send({ error: false, msg: "Ticker removed from watchlist", watchlist });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: true, msg: "Something went wrong" });
    }
};

module.exports = {
    add,
    getWatchlist,
    deleteTicker
};
