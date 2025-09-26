# Mutual Fund Explorer

A modern web application built with Next.js and Material-UI (MUI) for exploring and analyzing mutual funds. The application provides real-time mutual fund data, interactive charts, and powerful search and filtering capabilities.

## Features

### 1. Fund Discovery and Search
- Comprehensive mutual fund listing with dynamic search
- Advanced filtering by fund categories
- Multiple sorting options (Name A-Z/Z-A, NAV Low-High/High-Low)
- Responsive grid layout with beautiful fund cards
- Real-time search with instant results

### 2. Fund Details and Analysis
- Detailed fund information page for each scheme
- Interactive NAV charts showing historical performance
- Scheme metadata including fund house and category
- Returns calculation for different time periods:
  - 1 Month
  - 3 Months
  - 6 Months
  - 1 Year
  - Custom date range

### 3. SIP Calculator
- Interactive SIP (Systematic Investment Plan) calculator
- Monthly investment amount customization
- Date range selection for investment period
- Real-time calculation of:
  - Total Investment
  - Current Value
  - Absolute Returns
  - Annualized Returns (CAGR)

### 4. Modern UI/UX
- Responsive design that works on all devices
- Material Design with custom theme
- Smooth animations and transitions
- Loading states with skeleton placeholders
- Error handling with user-friendly messages
- Beautiful gradients and glassmorphism effects
- Interactive cards with hover effects

## Tech Stack

- **Frontend Framework**: Next.js 15.5
- **UI Library**: Material-UI (MUI) v7
- **State Management**: SWR for data fetching
- **Charting**: Chart.js with react-chartjs-2
- **Date Handling**: date-fns and dayjs
- **Type Safety**: TypeScript
- **Styling**: MUI Styled Components with Emotion

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```
git clone https://github.com/isha-patel-14/Mutual_Fund_nextJS_MUI.git
```

2. Install dependencies:
```
npm install
```
# or
```
yarn install
```

3. Run the development server:
```
npm run dev
```
### or
```
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Routes

The application uses the following API endpoints:

- `/api/mf` - Get list of all mutual funds
- `/api/scheme/[code]` - Get details of a specific mutual fund
- `/api/scheme/[code]/returns` - Calculate returns for a specific period
- `/api/scheme/[code]/sip` - Calculate SIP returns

## Data Source

The application uses the MFAPI (mfapi.in) as its data source, which provides:
- List of all mutual funds in India
- Historical NAV data for each fund
- Fund house and scheme details

## Performance Optimizations

- API response caching for better performance
- Lazy loading of images and components
- Client-side data caching with SWR
- Optimized bundle size with proper code splitting
- Responsive images and lazy loading

## Deployment

The application is deployed on Vercel. You can deploy your own instance by:

1. Fork the repository
2. Connect to Vercel
3. Deploy with default settings

The project is set up to work seamlessly with Vercel's platform and will automatically build and deploy on every push to the main branch.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Acknowledgments

- [MFAPI](https://mfapi.in) for providing the mutual fund data
- [Next.js](https://nextjs.org) team for the amazing framework
- [Material-UI](https://mui.com) team for the beautiful components
