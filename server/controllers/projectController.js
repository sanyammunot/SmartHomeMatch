const User = require('../models/User');
const Project = require('../models/Project');
const { Types } = require('mongoose');

// Cache for frequently accessed data (optional)
const agencyCache = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

// AI Matching Algorithm (optimized)
exports.matchAgencies = async (req, res) => {
  const { customerId } = req.body;
  
  try {
    // Input validation
    if (!Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ msg: 'Invalid customer ID format' });
    }

    // Get customer with only necessary fields
    const customer = await User.findById(customerId)
      .select('userType needs')
      .lean();

    if (!customer || customer.userType !== 'customer') {
      return res.status(404).json({ msg: 'Customer not found' });
    }

    if (!customer.needs?.length) {
      return res.status(200).json([]);
    }

    // Get unique need types for efficient matching
    const neededServiceTypes = [...new Set(
      customer.needs.map(need => need.type)
    )];

    // Try to get agencies from cache first
    const cacheKey = neededServiceTypes.join(',');
    let agencies = agencyCache.get(cacheKey);

    if (!agencies) {
      // Database query with optimized projection
      agencies = await User.find({
        userType: 'agency',
        'services.type': { $in: neededServiceTypes }
      })
      .select('agencyName services rating reviewCount yearsInBusiness')
      .lean();

      // Cache the result
      agencyCache.set(cacheKey, agencies);
      setTimeout(() => agencyCache.delete(cacheKey), CACHE_TTL);
    }

    // Enhanced scoring algorithm
    const matchedAgencies = agencies.map(agency => {
      const serviceMatches = customer.needs.filter(need =>
        agency.services.some(s => s.type === need.type)
      );

      // Weighted score calculation
      const baseScore = serviceMatches.length * 20;
      const ratingBonus = (agency.rating || 3) * 2; // Max 10 points for 5-star rating
      const experienceBonus = Math.min(agency.YearsOfExperience || 0, 10); // Max 10 points
      
      return {
        agency,
        score: Math.min(baseScore + ratingBonus + experienceBonus, 100), // Cap at 100
        matchedServices: serviceMatches.map(m => m.type),
        breakdown: {
          baseScore,
          ratingBonus,
          experienceBonus
        }
      };
    })
    .sort((a, b) => b.score - a.score || (b.agency.rating || 0) - (a.agency.rating || 0));

    res.json(matchedAgencies);
  } catch (err) {
    console.error(`Match error for customer ${customerId}:`, err);
    res.status(500).json({ 
      msg: 'Server error during matching',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};