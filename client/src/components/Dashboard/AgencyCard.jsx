import { Card, CardContent, Typography, Button, Chip, Stack, Rating } from '@mui/material';

export default function AgencyCard({ agency, score, onContact }) {
  return (
    <Card sx={{ width: 300 }}>
      <CardContent>
        <Typography variant="h6">{agency.agencyName}</Typography>
        
        <Stack direction="row" spacing={1} sx={{ my: 1 }}>
          <Chip 
            label={`${score}% Match`} 
            color={score > 70 ? 'success' : score > 40 ? 'warning' : 'error'}
          />
          <Rating value={4.5} precision={0.5} readOnly />
        </Stack>

        <Typography variant="body2" color="text.secondary">
          <strong>Services:</strong> {agency.services.map(s => s.type).join(', ')}
        </Typography>

        <Button 
          variant="contained" 
          fullWidth 
          sx={{ mt: 2 }}
          onClick={onContact}
        >
          Contact Agency
        </Button>
      </CardContent>
    </Card>
  );
}