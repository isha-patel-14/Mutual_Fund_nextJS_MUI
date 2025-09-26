// src/components/ReturnsTable.tsx
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { ReturnCalculationResult } from '@/lib/types';

async function getReturn(code: string, period: string): Promise<ReturnCalculationResult | { error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/scheme/${code}/returns?period=${period}`, { cache: 'no-store' });
    if (!res.ok) return { error: 'Failed to fetch' };
    return res.json();
  } catch (e) {
    return { error: 'Calculation failed' };
  }
}

export default async function ReturnsTable({ schemeCode }: { schemeCode: string }) {
  const periods = ['1m', '3m', '6m', '1y'];
  const returnsData = await Promise.all(
    periods.map(p => getReturn(schemeCode, p))
  );

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
      <Typography variant="h6" gutterBottom>Point-to-Point Returns</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell align="right">Return (%)</TableCell>
              <TableCell align="right">Annualized (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {periods.map((period, index) => {
              const data = returnsData[index];
              return (
                <TableRow key={period}>
                  <TableCell>{period.replace('m', ' Month').replace('y', ' Year')}</TableCell>
                  {'error' in data ? (
                    <TableCell colSpan={2} align="center" sx={{color: 'error.main'}}>{data.error}</TableCell>
                  ) : (
                    <>
                      <TableCell align="right" sx={{ color: data.simpleReturn > 0 ? 'success.main' : 'error.main' }}>
                        {data.simpleReturn.toFixed(2)}%
                      </TableCell>
                      <TableCell align="right" sx={{ color: data.annualizedReturn > 0 ? 'success.main' : 'error.main' }}>
                        {data.annualizedReturn.toFixed(2)}%
                      </TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}