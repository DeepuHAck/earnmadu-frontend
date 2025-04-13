# EarnMadu - Watch Videos & Earn Rewards

A full-stack web application where users can earn money by watching YouTube videos. Built with React, Node.js, and MongoDB.

## Features

- 👤 User Authentication System
  - Email & Password authentication
  - JWT-based session management
  - Password reset functionality

- 📺 Video Watching System
  - YouTube video embedding
  - Anti-skip protection
  - Progress tracking
  - Reward system (₹1 per completed view)

- 💰 Wallet System
  - Real-time balance updates
  - Transaction history
  - Multiple withdrawal methods

- 💸 Withdrawal System
  - Multiple payment methods (PhonePe, Google Pay, Paytm, PayPal, Bank Transfer)
  - Admin approval workflow
  - Minimum withdrawal limit

- 👑 Admin Dashboard
  - User management
  - Video management
  - Withdrawal approval
  - Analytics & Statistics

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Query for data fetching
- React Hook Form for forms
- YouTube Embed API

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Rate limiting & Security features

## Prerequisites

- Node.js 18+ and npm
- MongoDB instance
- YouTube API Key
- SMTP server for emails
- Payment gateway accounts (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/earnmadu.git
cd earnmadu
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Frontend
cp frontend/.env.example frontend/.env
# Backend
cp backend/.env.example backend/.env
```

4. Update the environment variables in both `.env` files with your configuration.

5. Start the development servers:
```bash
# Start both frontend and backend
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend
```

The frontend will be available at http://localhost:5173 and the backend at http://localhost:3000.

## Project Structure

```
earnmadu/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities and API client
│   │   ├── pages/         # Page components
│   │   ├── store/         # Global state management
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
│
├── backend/                # Express backend application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── tests/             # Test files
│
└── package.json           # Root package.json for workspace management
```

## API Documentation

The API documentation is available at `/api/docs` when running the backend server in development mode.

## Security Features

- Rate limiting on API endpoints
- JWT-based authentication
- HTTP-only cookies
- CORS protection
- Anti-cheat mechanisms:
  - IP tracking
  - View time validation
  - Multiple view prevention
  - Device fingerprinting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- YouTube API for video embedding
- Various open-source libraries and tools used in this project
- The developer community for inspiration and support 