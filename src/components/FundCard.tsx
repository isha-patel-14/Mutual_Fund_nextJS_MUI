import { Card, CardContent, Typography } from '@mui/material';
import Link from 'next/link';

import { Scheme } from '@/lib/types';

interface FundCardProps {
  scheme: Scheme;
}

export default function FundCard({ scheme }: FundCardProps) {
  return (
    <Link href={`/scheme/${scheme.schemeCode}`} style={{ textDecoration: 'none' }}>
      <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 } }}>
        <CardContent>
          <Typography variant="h6" component="div" noWrap>
            {scheme.schemeName}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}