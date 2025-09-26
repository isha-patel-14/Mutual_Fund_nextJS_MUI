// src/components/SchemeMetadata.tsx
import { Paper, Typography, Box } from '@mui/material';
import { SchemeDetails } from '@/lib/types';

interface SchemeMetadataProps {
  meta: SchemeDetails['meta'];
}

export default function SchemeMetadata({ meta }: SchemeMetadataProps) {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" gutterBottom>{meta.scheme_name}</Typography>
      <Box sx={{ 
        display: 'grid', 
        gap: 2,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }
      }}>
        <Box>
          <Typography variant="subtitle1"><strong>Fund House:</strong> {meta.fund_house}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1"><strong>Scheme Category:</strong> {meta.scheme_category}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1"><strong>Scheme Type:</strong> {meta.scheme_type}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1"><strong>Scheme Code:</strong> {meta.scheme_code}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}