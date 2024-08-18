
const yahooFinance = require('yahoo-finance2').default;
// Define valid ranges that Yahoo Finance supports
const VALID_RANGES = [
  '1d',   // 1 day
  '5d',   // 5 days
  '1mo',  // 1 month
  '3mo',  // 3 months
  '6mo',  // 6 months
  '1y',   // 1 year
  '2y',   // 2 years
  '5y',   // 5 years
  '10y',  // 10 years
  'ytd',  // Year-to-date
  'max',  // Maximum range available
];

// Set a default range in case an invalid range is provided
const DEFAULT_RANGE = '1y';  // Default to 1 year if the range is invalid

// Define valid intervals for each range
const INTERVALS_FOR_RANGE = {
  '1d': ['1m', '5m', '15m', '30m', '60m'],
  '5d': ['5m', '15m', '30m', '60m'],
  '1mo': ['1d', '5d'],
  '3mo': ['1d', '5d'],
  '6mo': ['1d', '1wk'],
  '1y': ['1d', '1wk'],
  '2y': ['1d', '1wk', '1mo'],
  '5y': ['1wk', '1mo'],
  '10y': ['1wk', '1mo'],
  'ytd': ['1d', '1wk'],
  'max': ['1mo'],
};


const validateRange = (range) => {
  return VALID_RANGES.includes(range) ? range : DEFAULT_RANGE;
};


const validateInterval = (range, interval) => {
  return INTERVALS_FOR_RANGE[range].includes(interval)
    ? interval
    : INTERVALS_FOR_RANGE[range][0];
};

const CalculateRange = (range) => {
  const now = new Date();
  
  switch (range) {
    case '1d':
      return Math.floor(now.setDate(now.getDate() - 1) / 1000);
    case '5d':
      return Math.floor(now.setDate(now.getDate() - 5) / 1000);
    case '1mo':
      return Math.floor(now.setMonth(now.getMonth() - 1) / 1000);
    case '3mo':
      return Math.floor(now.setMonth(now.getMonth() - 3) / 1000);
    case '6mo':
      return Math.floor(now.setMonth(now.getMonth() - 6) / 1000);
    case '1y':
      return Math.floor(now.setFullYear(now.getFullYear() - 1) / 1000);
    case '2y':
      return Math.floor(now.setFullYear(now.getFullYear() - 2) / 1000);
    case '5y':
      return Math.floor(now.setFullYear(now.getFullYear() - 5) / 1000);
    case '10y':
      return Math.floor(now.setFullYear(now.getFullYear() - 10) / 1000);
    case 'ytd':
      return Math.floor(new Date(now.getFullYear(), 0, 1) / 1000);
    case 'max':
      return Math.floor(new Date(1970, 0, 1) / 1000);
    default:
      return Math.floor(now.setFullYear(now.getFullYear() - 1) / 1000);
  }
};

exports.fetchChartData = async (req, res) => {
  const { ticker, range, interval } = req.query;

  const validatedRange = validateRange(range);
  const validatedInterval = validateInterval(validatedRange, interval);

  const queryOptions = {
    period1: CalculateRange(validatedRange),
    interval: validatedInterval,
  };

  try {
    const chartData = await yahooFinance.chart(ticker, queryOptions);
    res.status(200).json(chartData);
  } catch (error) {
    console.error("Failed to fetch chart data", error);
    res.status(500).json({ message: "Failed to fetch chart data." });
  }
};
