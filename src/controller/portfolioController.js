const Portfolio = require('../modules/portfolio/models/portfolio');
const { validationResult } = require('express-validator');

exports.createPortfolioEntry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const portfolio = new Portfolio(req.body);
    const saved = await portfolio.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating portfolio entry' });
  }
};

exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().sort({ createdAt: -1 });
    res.status(200).json(portfolios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving portfolios' });
  }
};

