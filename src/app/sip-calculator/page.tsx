'use client';

import { useState } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, FormControl, InputLabel, MenuItem, Select, Slider } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

export default function SIPCalculatorPage() {
  const [amount, setAmount] = useState('5000');
  const [period, setPeriod] = useState('10');
  const [returnRate, setReturnRate] = useState('12');
  const [frequency, setFrequency] = useState('monthly');

  const [result, setResult] = useState<{
    totalInvestment: number;
    estimatedReturns: number;
    futureValue: number;
  } | null>(null);

  const handleCalculate = () => {
    const monthlyRate = Number(returnRate) / 12 / 100;
    const months = Number(period) * 12;
    const investmentAmount = Number(amount);

    const futureValue = investmentAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvestment = investmentAmount * months;
    const estimatedReturns = futureValue - totalInvestment;

    setResult({
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(estimatedReturns),
      futureValue: Math.round(futureValue)
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        SIP Calculator
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Input Section */}
        <Paper elevation={3} sx={{ flex: 1, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Investment Details
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Investment Frequency</InputLabel>
              <Select
                value={frequency}
                label="Investment Frequency"
                onChange={(e: SelectChangeEvent) => setFrequency(e.target.value)}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography gutterBottom>Monthly Investment Amount: ₹{amount}</Typography>
              <Slider
                value={Number(amount)}
                onChange={(_, value) => setAmount(value.toString())}
                min={500}
                max={100000}
                step={500}
                marks={[
                  { value: 500, label: '₹500' },
                  { value: 100000, label: '₹1L' }
                ]}
              />
            </Box>

            <Box>
              <Typography gutterBottom>Investment Period: {period} years</Typography>
              <Slider
                value={Number(period)}
                onChange={(_, value) => setPeriod(value.toString())}
                min={1}
                max={30}
                marks={[
                  { value: 1, label: '1Y' },
                  { value: 30, label: '30Y' }
                ]}
              />
            </Box>

            <Box>
              <Typography gutterBottom>Expected Return Rate: {returnRate}%</Typography>
              <Slider
                value={Number(returnRate)}
                onChange={(_, value) => setReturnRate(value.toString())}
                min={1}
                max={30}
                marks={[
                  { value: 1, label: '1%' },
                  { value: 30, label: '30%' }
                ]}
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={handleCalculate}
              sx={{ mt: 2 }}
            >
              Calculate
            </Button>
          </Box>
        </Paper>

        {/* Results Section */}
        <Paper elevation={3} sx={{ flex: 1, p: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography variant="h6" gutterBottom>
            Investment Summary
          </Typography>

          <Box sx={{ mt: 4 }}>
            {result ? (
              <>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>Total Investment</Typography>
                  <Typography variant="h4">₹{result.totalInvestment.toLocaleString()}</Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>Expected Returns</Typography>
                  <Typography variant="h4">₹{result.estimatedReturns.toLocaleString()}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>Future Value</Typography>
                  <Typography variant="h4">₹{result.futureValue.toLocaleString()}</Typography>
                </Box>

                <Typography sx={{ mt: 4, fontSize: '0.875rem', opacity: 0.8 }}>
                  * These calculations are based on assumed constant rate of return and are for illustration purposes only.
                </Typography>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="h6">
                  Fill in your investment details and click Calculate to see the results
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}