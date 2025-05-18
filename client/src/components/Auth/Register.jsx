import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper
} from '@mui/material';
import api from '../../services/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    userType: 'customer', // Default to customer
    // Customer-specific
    address: '',
    budgetRange: { low: '', high: '' },
    needs: [{ type: '', priority: 3 }],
    // Agency-specific
    agencyName: '',
    YearsOfExperience: '',
    services: [{ type: '' }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parentField, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: { ...prev[parentField], [field]: value }
    }));
  };

  const handleArrayChange = (field, index, key, value) => {
    const updatedArray = formData[field].map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    setFormData(prev => ({ ...prev, [field]: updatedArray }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], field === 'needs' ? { type: '', priority: 3 } : { type: '' }]
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up empty array fields before submission
      const submissionData = {
        ...formData,
        needs: formData.userType === 'customer' ? formData.needs.filter(n => n.type) : undefined,
        services: formData.userType === 'agency' ? formData.services.filter(s => s.type) : undefined
      };

      const res = await api.post('/auth/register', submissionData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId); // Assuming backend returns userId
      navigate('/dashboard');
    } catch (err) {
      alert(`Registration failed: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        
        <form onSubmit={handleSubmit}>
          {/* Common Fields */}
          <FormControl fullWidth margin="normal">
            <InputLabel>User Type</InputLabel>
            <Select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              label="User Type"
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="agency">Agency</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          {/* Customer-Specific Fields */}
          {formData.userType === 'customer' && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Min Budget"
                  type="number"
                  value={formData.budgetRange.low}
                  onChange={(e) => handleNestedChange('budgetRange', 'low', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Max Budget"
                  type="number"
                  value={formData.budgetRange.high}
                  onChange={(e) => handleNestedChange('budgetRange', 'high', e.target.value)}
                />
              </Box>

              <Typography variant="h6" sx={{ mt: 3 }}>Your Needs</Typography>
              {formData.needs.map((need, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Need Type</InputLabel>
                    <Select
                      value={need.type}
                      onChange={(e) => handleArrayChange('needs', index, 'type', e.target.value)}
                      label="Need Type"
                    >
                      <MenuItem value="security">Security</MenuItem>
                      <MenuItem value="lighting">Lighting</MenuItem>
                      <MenuItem value="climate">Climate</MenuItem>
                      <MenuItem value="entertainment">Entertainment</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={need.priority}
                      onChange={(e) => handleArrayChange('needs', index, 'priority', e.target.value)}
                      label="Priority"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <MenuItem key={num} value={num}>{num}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    color="error"
                    onClick={() => removeArrayField('needs', index)}
                    disabled={formData.needs.length <= 1}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button
                sx={{ mt: 2 }}
                onClick={() => addArrayField('needs')}
              >
                + Add Another Need
              </Button>
            </>
          )}

          {/* Agency-Specific Fields */}
          {formData.userType === 'agency' && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Agency Name"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                margin="normal"
                label="Years of Experience"
                name="YearsOfExperience"
                type="number"
                value={formData.YearsOfExperience}
                onChange={handleChange}
                required
              />

              <Typography variant="h6" sx={{ mt: 3 }}>Services Offered</Typography>
              {formData.services.map((service, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Service Type</InputLabel>
                    <Select
                      value={service.type}
                      onChange={(e) => handleArrayChange('services', index, 'type', e.target.value)}
                      label="Service Type"
                    >
                      <MenuItem value="security">Security</MenuItem>
                      <MenuItem value="lighting">Lighting</MenuItem>
                      <MenuItem value="climate">Climate</MenuItem>
                      <MenuItem value="entertainment">Entertainment</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    color="error"
                    onClick={() => removeArrayField('services', index)}
                    disabled={formData.services.length <= 1}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button
                sx={{ mt: 2 }}
                onClick={() => addArrayField('services')}
              >
                + Add Another Service
              </Button>
            </>
          )}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 3, py: 2 }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Register;