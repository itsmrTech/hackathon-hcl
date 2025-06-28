const Portfolio = require('../models/Portfolio');

exports.createPortfolioEntry = async (req, res) => {
  try {
    const {
      orderRefNo,
      securityName,
      transactionType,
      fromDate,
      toDate,
      quantity,
      totalValue
    } = req.body;

    const portfolio = new Portfolio({
      orderRefNo,
      securityName,
      transactionType,
      fromDate,
      toDate,
      quantity,
      totalValue
    });

    const saved = await portfolio.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating portfolio entry' });
  }
};