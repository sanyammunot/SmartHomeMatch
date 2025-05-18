import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import AgencyCard from '../components/Dashboard/AgencyCard';
import api from '../services/api';

function MatchingResults() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
      const fetchMatches = async () => {
          try {
              const customerId = location.state?.customerId || localStorage.getItem('userId');
              //console.log('Fetching matches for customerId:', customerId);
              const res = await api.post('/projects/match', { customerId });
              //console.log('API response data:', res.data);
              //console.log('Current userId:', customerId);
        setAgencies(res.data);
      } catch (err) {
        console.error('Full error:', err.response); 
        // setError(err.response?.data?.message || 'Server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [location.state]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Recommended Agencies
        
      </Typography>
      
      {loading ? (
        <CircularProgress />
      ) : agencies.length === 0 ? (
        <Typography>No agencies match your current needs.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {agencies.map((match) => (
            <AgencyCard 
              key={match.agency._id} 
              agency={match.agency} 
              score={match.score}
              onContact={() => navigate(`/contact/${match.agency._id}`)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default MatchingResults;