# Overview

FarmPrice Intelligence Portal is a modern web application that provides farmers with real-time agricultural market price information, AI-powered recommendations, and market intelligence tools. The platform aims to help farmers make informed decisions about when and where to sell their crops by aggregating data from official government sources like AGMARKNET and presenting it through an intuitive, mobile-friendly interface.

The application features a comprehensive dashboard displaying current market prices, price trends, nearby market comparisons, and AI-generated selling recommendations. It supports multiple languages and is designed with a farmer-centric approach, prioritizing accessibility and ease of use.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built using React with TypeScript, utilizing a modern component-based architecture:
- **UI Framework**: React with Vite as the build tool for fast development and optimized production builds
- **Component System**: Radix UI primitives with shadcn/ui components for consistent, accessible UI elements
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Data Visualization**: Chart.js for rendering price trend charts and market analytics

## Backend Architecture
The server follows a Node.js Express-based REST API architecture:
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for type safety and modern JavaScript features
- **API Design**: RESTful endpoints for dashboard data, crop information, and market prices
- **Development Tools**: tsx for TypeScript execution in development, esbuild for production bundling

## Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM:
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema Design**: Relational design with tables for users, crops, markets, market prices, price history, and AI recommendations
- **Migrations**: Drizzle Kit for database schema migrations and version control

## Authentication and Session Management
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Session Management**: Express session middleware for user state management

## Data Architecture
The schema includes comprehensive agricultural market data modeling:
- **User Management**: User profiles with location and language preferences
- **Crop Catalog**: Crop information with multilingual names and categorization
- **Market Data**: Market locations with geographical coordinates and distance calculations
- **Price Tracking**: Current prices, historical data, and trend analysis
- **AI Recommendations**: Confidence-scored selling recommendations with reasoning

## Mobile-First Design
The application prioritizes mobile accessibility:
- **Responsive Design**: Tailwind CSS breakpoints for mobile, tablet, and desktop layouts
- **Progressive Enhancement**: Mobile navigation with tab-based interface
- **Touch Optimization**: Mobile-friendly interactions and gestures

## Development Workflow
- **Build System**: Vite for fast development with hot module replacement
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Code Organization**: Monorepo structure with shared types and schemas between client and server

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations and schema management

## Government Data Sources
- **AGMARKNET Portal**: Official agricultural market price data from the Government of India
- **UPAg Statistics**: Uttar Pradesh agricultural statistics and market information
- **Open Government Data Platform**: Additional agricultural data from data.gov.in

## UI and Component Libraries
- **Radix UI**: Accessible, unstyled UI primitives for building the component system
- **shadcn/ui**: Pre-built, customizable components built on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **Font Awesome**: Additional icons for agricultural and market-specific symbols

## Data Visualization
- **Chart.js**: Canvas-based charting library for price trend visualization and market analytics

## Development and Build Tools
- **Vite**: Fast build tool with plugin ecosystem for React development
- **Replit Integration**: Development environment plugins for Replit-specific features
- **TypeScript**: Type system for enhanced developer experience and code reliability

## Styling and Design
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **PostCSS**: CSS processing with autoprefixer for browser compatibility
- **Google Fonts**: Web fonts for improved typography and readability

## State Management and HTTP
- **TanStack Query**: Server state management with caching, background updates, and error handling
- **Wouter**: Lightweight routing library for single-page application navigation