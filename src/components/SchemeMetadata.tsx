'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import { SchemeDetails } from '@/lib/types';

interface SchemeMetadataProps {
  meta: SchemeDetails['meta'];
}

export default function SchemeMetadata({ meta }: SchemeMetadataProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {meta.scheme_name}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px' }}>
            <Typography color="text.secondary">Category</Typography>
            <Typography variant="body1" gutterBottom>{meta.scheme_category}</Typography>
            
            <Typography color="text.secondary">Fund House</Typography>
            <Typography variant="body1" gutterBottom>{meta.fund_house}</Typography>
          </Box>
          <Box sx={{ flex: '1 1 300px' }}>
            <Typography color="text.secondary">Scheme Type</Typography>
            <Typography variant="body1" gutterBottom>{meta.scheme_type}</Typography>
            
            <Typography color="text.secondary">Scheme Code</Typography>
            <Typography variant="body1">
              {meta.scheme_code}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}