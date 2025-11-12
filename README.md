# Tandem Match™

**Find your local language partner**

Tandem Match is a language exchange platform that connects users with language partners for mutual learning. Users can discover, match, and chat with people who speak the languages they want to learn and want to learn the languages they speak.

**Live deployment:** [tandem-match-4cyw.vercel.app/
](https://tandem-match-4cyw.vercel.app/)

## Features

### Core Functionality

- **Profile Creation**: Users create detailed profiles including spoken languages (with proficiency levels) and languages they want to learn
- **Smart Matching**: Swipe-based matching system similar to dating apps, connecting users based on complementary language skills
- **Real-time Chat**: Matched users can communicate through an integrated messaging system
- **Language Support**: Comprehensive language database with proficiency levels (Beginner, A1-C2, Native)

### User Experience

- **Authentication**: Secure user registration and login system
- **Profile Management**: Upload photos, write bio descriptions, and manage language preferences
- **Match Discovery**: Browse potential language partners with profile cards
- **Interactive Matching**: Like/dislike system with instant match notifications
- **Chat Interface**: Clean messaging interface with match selection and profile viewing

## Tech Stack

### Frontend

- **React** (v19.1.0) - User interface framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** (v4.1.11) - Styling and responsive design
- **React Router DOM** - Navigation and routing
- **Vite** - Build tool and development server
- **Additional Libraries**:
  - `react-select` - Language selection dropdowns
  - `react-swipeable` - Touch gestures for mobile matching
  - `react-confetti` - Match celebration effects
  - `lucide-react` - Icon components

### Backend

- **Node.js** with **Express** - REST API server
- **TypeScript** - Server-side type safety
- **MongoDB** with **Mongoose** - Database and ODM
- **Authentication**:
  - JWT (JSON Web Tokens) for session management
  - bcrypt for password hashing
- **File Upload**: Cloudinary integration for profile images
- **Security**: CORS configuration and request validation

### Development Tools

- **ESLint** - Code linting and quality
- **Nodemon** - Development server auto-restart
- **Multer** - File upload handling

## Key Components

### User Profiles

- Personal information (name, age, gender preferences)
- Language skills with proficiency levels
- Profile photos via Cloudinary
- Personal bio and interests

### Matching Algorithm

- Mutual language compatibility checking
- Like/dislike tracking with match detection
- Real-time match notifications
- Profile filtering and discovery

### Messaging System

- Secure chat between matched users
- Message history persistence
- Real-time message updates
- Profile viewing within chat

## License

Private project - All rights reserved.
