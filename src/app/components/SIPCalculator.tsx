// src/components/SIPCalculator.tsx
'use client';
import { useState } from 'react';
import { Box, Button, Card, CardContent, CircularProgress, TextField, Typography, Alert } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { SipCalculationResult } from '@/lib/types';

export default function SIPCalculator({ schemeCode }: { schemeCode: string }) {
  const [amount, setAmount] = useState('5000');
  const [from, setFrom] = useState<Dayjs | null>(dayjs().subtract(3, 'year'));
  const [to, setTo] = useState<Dayjs | null>(dayjs());
  const [result, setResult] = useState<SipCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    if (!amount || !from || !to || Number(amount) <= 0) {
      setError('Please fill all fields with valid values.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`/api/scheme/${schemeCode}/sip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          from: from.format('YYYY-MM-DD'),
          to: to.format('YYYY-MM-DD'),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to calculate SIP.');
      }

      const data: SipCalculationResult = await response.json();
      setResult(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={3} sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>SIP Calculator</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            <TextField
              label="Monthly Amount (₹)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
            <DatePicker label="Start Date" value={from} onChange={setFrom} sx={{ width: '100%' }} />
            <DatePicker label="End Date" value={to} onChange={setTo} sx={{ width: '100%' }} />
            <Button
              variant="contained"
              onClick={handleCalculate}
              disabled={loading}
              fullWidth
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : 'Calculate'}
            </Button>
          </Box>
        </LocalizationProvider>
        
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        
        {result && (
          <Box mt={3}>
            <Typography variant="h5" align="center" gutterBottom>Calculation Result</Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
              gap: 2,
              mt: 2
            }}>
              <Typography align="center">Total Invested: <br/><strong>₹{result.totalInvested.toLocaleString('en-IN')}</strong></Typography>
              <Typography align="center">Current Value: <br/><strong>₹{result.currentValue.toLocaleString('en-IN')}</strong></Typography>
              <Typography align="center">Absolute Return: <br/><strong style={{color: result.absoluteReturn > 0 ? '#4caf50' : '#f44336'}}>{result.absoluteReturn}%</strong></Typography>
              <Typography align="center">Annualized (CAGR): <br/><strong style={{color: result.annualizedReturn > 0 ? '#4caf50' : '#f44336'}}>{result.annualizedReturn}%</strong></Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}