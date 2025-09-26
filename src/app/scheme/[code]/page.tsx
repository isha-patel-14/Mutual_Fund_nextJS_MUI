// src/app/scheme/[code]/page.tsx
import { Suspense } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import SchemeMetadata from '@/components/SchemeMetadata';
import NAVChart from '@/components/NAVChart';
import ReturnsTable from '@/components/ReturnsTable';
import SIPCalculator from '@/components/SIPCalculator';
import { SchemeDetails } from '@/lib/types';

async function getSchemeDetails(code: string): Promise<SchemeDetails> {
    // Add an environment variable for your app's URL
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/scheme/${code}`, {
        // Revalidate frequently for NAV updates, but not on every request
        next: { revalidate: 3600 } 
    });
    if (!res.ok) {
        throw new Error('Failed to fetch scheme details');
    }
    return res.json();
}

export default async function SchemeDetailPage({ params }: { params: { code: string } }) {
    const schemeDetails = await getSchemeDetails(params.code);

    if (!schemeDetails || !schemeDetails.meta) {
        return <Typography>Scheme not found.</Typography>;
    }
    
    return (
        <Container>
            <SchemeMetadata meta={schemeDetails.meta} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box>
                    <NAVChart data={schemeDetails.data} />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
                    <Box>
                        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center'}}><CircularProgress /></Box>}>
                            <ReturnsTable schemeCode={params.code} />
                        </Suspense>
                    </Box>
                    <Box>
                        <SIPCalculator 
                            schemeCode={params.code}
                            returns={5} // Using 5% as a default return rate
                        />
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}