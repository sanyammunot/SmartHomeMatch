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

    const agencies = await User.find({
      userType: 'agency',
      'services.type': { $in: customer.needs.map(need => need.type) }
    });

    const matchedAgencies = agencies.map(agency => {
      let priorityScore = 0;

      customer.needs.forEach(need => {
        const matches = agency.services.some(service => service.type === need.type);
        if (matches) {
          priorityScore += need.priority * 10; // weight of 10 per priority level
        }
      });

      const experienceBonus = agency.YearsOfExperience ? agency.YearsOfExperience * 3 : 0;
      //const ratingBonus = agency.averageRating ? agency.averageRating * 5 : 0;

      const score = priorityScore + experienceBonus;// + ratingBonus;

      return { agency, score };
    }).sort((a, b) => b.score - a.score);

    res.json(matchedAgencies);
  } catch (err) {
    console.error('Matching error:', err);
    res.status(500).send('Server error');
  }
};
