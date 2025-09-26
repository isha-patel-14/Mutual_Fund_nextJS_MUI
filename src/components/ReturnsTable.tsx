'use client';

import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Box } from '@mui/material';
import useSWR from 'swr';

interface Returns {
  '1M': number;
  '3M': number;
  '6M': number;
  '1Y': number;
  '3Y': number;
  '5Y': number;
}

interface ReturnsTableProps {
  schemeCode: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ReturnsTable({ schemeCode }: ReturnsTableProps) {
  const { data: returns, error, isLoading } = useSWR<Returns>(`/api/scheme/${schemeCode}/returns`, fetcher);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !returns) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell align="right">Returns (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(Object.entries(returns) as [keyof Returns, number][]).map(([period, value]) => (
              <TableRow key={period}>
                <TableCell>{period}</TableCell>
                <TableCell align="right" sx={{ color: value >= 0 ? 'success.main' : 'error.main' }}>
                  {value >= 0 ? '+' : ''}{value}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}