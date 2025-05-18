const User = require('../models/User');
const Project = require('../models/Project');

// AI Matching Algorithm (simplified)
exports.matchAgencies = async (req, res) => {
  const { customerId } = req.body;
  try {
    const customer = await User.findById(customerId);
    if (!customer || customer.userType !== 'customer') {
      return res.status(400).json({ msg: 'Invalid customer' });
    }

    // Find agencies that match customer's needs
    const agencies = await User.find({
      userType: 'agency',
      'services.type': { $in: customer.needs.map(need => need.type) }
    });

    // Simplified scoring (prioritize agencies with more matching services)
    const matchedAgencies = agencies.map(agency => {
      const score = customer.needs.filter(need => 
        agency.services.some(service => service.type === need.type)
      ).length * 20; // 20 points per matching service
      return { agency, score };
    }).sort((a, b) => b.score - a.score);

    res.json(matchedAgencies);
  } catch (err) {
    res.status(500).send('Server error');
  }
};