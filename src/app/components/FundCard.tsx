// src/components/FundCard.tsx
import { Card, CardContent, Typography, CardActionArea } from '@mui/material';
import Link from 'next/link';
import { Scheme } from '@/lib/types';

interface FundCardProps {
  scheme: Scheme;
}

export default function FundCard({ scheme }: FundCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea component={Link} href={`/scheme/${scheme.schemeCode}`} sx={{ height: '100%' }}>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {scheme.schemeName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Code: {scheme.schemeCode}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}