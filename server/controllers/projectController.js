exports.matchAgencies = async (req, res) => {
   console.log('matchAgencies called with body:', req.body);
  const { customerId } = req.body;
  try {
    const customer = await User.findById(customerId);
    if (!customer || customer.userType !== 'customer') {
      return res.status(400).json({ msg: 'Invalid customer' });
    }

    const neededTypes = customer.needs.map(need => need.type);
    console.log('Customer needs:', customer.needs);
    console.log('Needed types:', neededTypes);

    if (neededTypes.length === 0) {
      return res.status(200).json([]);
    }

    const agencies = await User.find({
      userType: 'agency',
      'services.type': { $in: neededTypes }
    });

    console.log('Found agencies:', agencies.length);

    const matchedAgencies = agencies.map(agency => {
      let priorityScore = 0;
      customer.needs.forEach(need => {
        const hasService = agency.services.some(service => service.type === need.type);
        if (hasService) {
          priorityScore += need.priority * 10;
        }
      });

      const experienceBonus = agency.YearsOfExperience ? agency.YearsOfExperience * 3 : 0;

      const score = priorityScore + experienceBonus;

      return { agency, score };
    }).sort((a, b) => b.score - a.score);

    res.json(matchedAgencies);

  } catch (err) {
    console.error('Matching error:', err);
    res.status(500).send('Server error');
  }
};
