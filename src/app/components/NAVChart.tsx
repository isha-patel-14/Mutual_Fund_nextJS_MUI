// src/components/NAVChart.tsx
'use client';
import { LineChart } from '@mui/x-charts/LineChart';
import { Paper, Typography, CircularProgress, Box } from '@mui/material';
import { NavData } from '@/lib/types';
import { parseISO } from 'date-fns';

interface NAVChartProps {
  navData: NavData[];
}

export default function NAVChart({ navData }: NAVChartProps) {
  if (!navData || navData.length === 0) {
    return <CircularProgress />;
  }
  
  // Take last 1 year of data for cleaner chart
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const chartData = navData
    .map(d => ({ date: parseISO(d.date), nav: parseFloat(d.nav) }))
    .filter(d => d.date >= oneYearAgo)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (chartData.length === 0) {
    return <Typography>Not enough data for a 1-year chart.</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
      <Typography variant="h6" gutterBottom>NAV (Last 1 Year)</Typography>
      <Box sx={{ height: 400 }}>
        <LineChart
          xAxis={[{ 
            data: chartData.map(d => d.date), 
            scaleType: 'time',
            valueFormatter: (date) => date.toLocaleDateString(),
          }]}
          series={[{
            data: chartData.map(d => d.nav),
            label: 'NAV',
            valueFormatter: (value) => `₹${value?.toFixed(2)}`,
          }]}
          margin={{ left: 70 }}
        />
      </Box>
    </Paper>
  );
}