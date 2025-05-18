import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Skeleton
} from '@mui/material';
import {
  Star as StarIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
  Construction as ConstructionIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import api from '../../services/api';

function CustomerDashboard() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  //console.log('Initial userId:', userId);
 
  const fetchMatches = async () => {
    const isRefresh = !loading;
    isRefresh ? setRefreshing(true) : setLoading(true);
    
    try {
      //console.log('Fetching matches for user:', userId); // Debug log
      const res = await api.post('/projects/match', { customerId: userId });
      //console.log('API Response:', res); // Debug log
      //console.log('Response data:', res.data); // Debug log
      setAgencies(res.data);
    } catch (err) {
      console.error('Matching error:', err);
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [userId]);

  const AgencyCard = ({ agency, score }) => (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" fontWeight="600">
            {agency.agencyName}
          </Typography>
          <Chip 
            label={`${score}% Match`}
            sx={{
              backgroundColor: theme => 
                score > 75 ? theme.palette.success.light : 
                score > 50 ? theme.palette.warning.light : theme.palette.error.light,
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} mb={1.5}>
          <StarIcon fontSize="small" color="warning" />
          <Typography variant="body2" color="text.secondary">
          {agency.reviews?.length
            ? `${(
                agency.reviews.reduce((acc, r) => acc + r.rating, 0) / agency.reviews.length
              ).toFixed(1)} (${agency.reviews.length} review${agency.reviews.length > 1 ? 's' : ''})`
            : 'No reviews yet'}
</Typography>

        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1} mb={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <BusinessIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {agency.YearsOfExperience || '5+'} years experience
            </Typography>
          </Stack>
            
              
          
          <Stack direction="row" alignItems="flex-start" spacing={1}>
            <ConstructionIcon fontSize="small" color="action" />
            <Typography variant="body2">
              <strong>Services:</strong> {agency.services.map(s => s.type).join(', ')}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          size="medium"
          startIcon={<PhoneIcon />}
          onClick={() => navigate(`/contact/${agency._id}`)}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          Contact Now
        </Button>
      </Box>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            Your Perfect Home Automation Partners
          </Typography>
          <Typography color="text.secondary">
            We've matched you with the best agencies for your needs
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={fetchMatches}
          disabled={loading || refreshing}
          startIcon={<RefreshIcon />}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            borderWidth: 2,
            '&:hover': { borderWidth: 2 }
          }}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Matches'}
        </Button>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : agencies.length === 0 ? (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '40vh',
          textAlign: 'center'
        }}>
          <Typography variant="h5" gutterBottom>
            No agencies found
          </Typography>
          <Typography color="text.secondary" mb={3}>
            We couldn't find agencies matching your current needs
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/profile')}
            sx={{ px: 4 }}
          >
            Update Your Profile
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {agencies.map((match) => (
            <Grid item key={match.agency._id} xs={12} sm={6} md={4} lg={3}>
              <AgencyCard agency={match.agency} score={match.score} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default CustomerDashboard;