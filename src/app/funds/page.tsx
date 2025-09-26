'use client';
import { useState, useMemo } from 'react';
import { 
  TextField, 
  Container, 
  Typography, 
  Box, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Paper,
  InputAdornment,
  Chip,
  IconButton,
  Skeleton,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

import FundCard from '@/components/FundCard';
import { Scheme } from '@/lib/types';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());
const ITEMS_PER_PAGE = 12;

type SortOption = 'name-asc' | 'name-desc' | 'nav-asc' | 'nav-desc';

export default function FundsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { data: schemes, error, isLoading } = useSWR<Scheme[]>('/api/mf', fetcher);

  // Extract unique categories
  const categories = useMemo(() => {
    if (!schemes) return [];
    return ['all', ...new Set(schemes.map(scheme => scheme.category))].filter(Boolean);
  }, [schemes]);

  // Filter and sort schemes
  const processedSchemes = useMemo(() => {
    if (!schemes) return [];
    
    let filtered = schemes.filter(scheme =>
      scheme.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === 'all' || scheme.category === categoryFilter)
    );

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.schemeName.localeCompare(b.schemeName);
        case 'name-desc':
          return b.schemeName.localeCompare(a.schemeName);
        case 'nav-asc':
          return (parseFloat(a.nav) || 0) - (parseFloat(b.nav) || 0);
        case 'nav-desc':
          return (parseFloat(b.nav) || 0) - (parseFloat(a.nav) || 0);
        default:
          return 0;
      }
    });
  }, [schemes, searchTerm, sortBy, categoryFilter]);

  // Pagination
  const pageCount = Math.ceil(processedSchemes.length / ITEMS_PER_PAGE);
  const currentSchemes = processedSchemes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Alert severity="error" variant="outlined">
        Failed to load funds. Please try again later.
      </Alert>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        align="center" 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Explore Mutual Funds
      </Typography>

      {/* Filters Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4,
          maxWidth: '100%',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2
        }}
      >
        {/* Search Bar - Full Width */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search funds..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover': {
                  '& > fieldset': { borderColor: 'primary.main' }
                }
              }
            }}
          />
        </Box>

        {/* Filters Row */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
          mb: 2
        }}>
          {/* Category Filter */}
          <FormControl fullWidth>
            <InputLabel id="category-filter-label">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterListIcon fontSize="small" />
                Category
              </Box>
            </InputLabel>
            <Select
              labelId="category-filter-label"
              value={categoryFilter}
              label="Category"
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  '& > fieldset': { borderColor: 'primary.main' }
                }
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sort */}
          <FormControl fullWidth>
            <InputLabel id="sort-label">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SortIcon fontSize="small" />
                Sort By
              </Box>
            </InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  '& > fieldset': { borderColor: 'primary.main' }
                }
              }}
            >
              <MenuItem value="name-asc">Name (A-Z)</MenuItem>
              <MenuItem value="name-desc">Name (Z-A)</MenuItem>
              <MenuItem value="nav-asc">NAV (Low to High)</MenuItem>
              <MenuItem value="nav-desc">NAV (High to Low)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Results summary */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {!isLoading && (
            <Chip 
              label={`${processedSchemes.length} funds found`}
              color="primary"
              variant="outlined"
              sx={{ 
                borderRadius: '16px',
                '& .MuiChip-label': { px: 2 }
              }}
            />
          )}
          {categoryFilter !== 'all' && (
            <Chip 
              label={categoryFilter}
              onDelete={() => setCategoryFilter('all')}
              color="primary"
              sx={{ 
                borderRadius: '16px',
                '& .MuiChip-label': { px: 2 }
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Loading State */}
      {isLoading ? (
        <Box sx={{ 
          display: 'grid', 
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(auto-fill, minmax(280px, 1fr))'
          }
        }}>
          {[...Array(8)].map((_, index) => (
            <Skeleton 
              key={index} 
              variant="rectangular" 
              height={180} 
              sx={{ 
                borderRadius: 2,
                transform: 'scale(0.98)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1)',
                }
              }}
            />
          ))}
        </Box>
      ) : (
        <>
          {/* Fund Cards */}
          <Box sx={{ 
            display: 'grid', 
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fill, minmax(280px, 1fr))'
            }
          }}>
            {currentSchemes.map((scheme) => (
              <Box 
                key={scheme.schemeCode}
                sx={{
                  transform: 'scale(0.98)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1)',
                    '& > *': {
                      boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.main}25`
                    }
                  }
                }}
              >
                <FundCard scheme={scheme} />
              </Box>
            ))}
          </Box>

          {/* Empty State */}
          {processedSchemes.length === 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)',
              borderRadius: 4,
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No funds found
              </Typography>
              <Typography color="text.secondary">
                Try adjusting your search or filters
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {processedSchemes.length > ITEMS_PER_PAGE && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={pageCount} 
                page={currentPage} 
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    '&.Mui-selected': {
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    }
                  }
                }}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}