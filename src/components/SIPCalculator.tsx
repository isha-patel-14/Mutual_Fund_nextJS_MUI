'use client';

import { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';

interface SIPCalculatorProps {
  schemeCode: string;
  returns: number;
}

export default function SIPCalculator({ schemeCode, returns }: SIPCalculatorProps) {
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('');
  const [result, setResult] = useState<{
    totalInvestment: number;
    estimatedReturns: number;
    futureValue: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setError(null);
    setResult(null);
    try {
      const response = await fetch(`/api/scheme/${schemeCode}/sip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          period: parseFloat(period),
          rate: returns,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate SIP');
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Ensure all required properties exist before setting the result
      if (typeof data.totalInvestment === 'number' && 
          typeof data.estimatedReturns === 'number' && 
          typeof data.futureValue === 'number') {
        setResult(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to calculate SIP:', error);
      setError(error instanceof Error ? error.message : 'Failed to calculate SIP');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          SIP Calculator
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 200px' }}>
              <TextField
                fullWidth
                label="Monthly Investment (₹)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Box>
            
            <Box sx={{ flex: '1 1 200px' }}>
              <TextField
                fullWidth
                label="Time Period (Years)"
                type="number"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </Box>
          </Box>
          
          <Button
            variant="contained"
            onClick={handleCalculate}
            disabled={!amount || !period}
            fullWidth
          >
            Calculate
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          
          {result && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
              <Box sx={{ flex: '1 1 200px' }}>
                <Typography color="text.secondary">Total Investment</Typography>
                <Typography variant="h6">
                  ₹{result.totalInvestment?.toLocaleString() ?? '0'}
                </Typography>
              </Box>
              
              <Box sx={{ flex: '1 1 200px' }}>
                <Typography color="text.secondary">Est. Returns</Typography>
                <Typography variant="h6">
                  ₹{result.estimatedReturns?.toLocaleString() ?? '0'}
                </Typography>
              </Box>
              
              <Box sx={{ flex: '1 1 200px' }}>
                <Typography color="text.secondary">Future Value</Typography>
                <Typography variant="h6">
                  ₹{result.futureValue?.toLocaleString() ?? '0'}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}