Project Cost Tracker
Overview
Project Cost Tracker is a comprehensive web application designed to help users manage project expenses efficiently. Built with React and Firebase, this application allows users to track, categorize, and analyze project costs in real-time.

Features
Core Functionality
User Authentication: Secure login and registration system powered by Firebase
Item Management: Add, edit, and delete project items with name and cost tracking
Other Costs Tracking: Record and manage additional expenses like shipping, taxes, etc.
Dashboard Overview: Visualize total project costs and breakdown of expenses
Real-time Updates: All changes are instantly saved and synchronized
Data Management
Persistent Storage: Data is stored in both Firebase and localStorage for offline capability
Data Filtering: Search functionality to quickly find specific items or costs
Sorting Options: Sort items and costs by name/description, amount, or date
User Interface
Responsive Design: Fully responsive layout that works on mobile, tablet, and desktop devices
Intuitive Navigation: Simple sidebar navigation to access different sections
Modern UI Components: Clean, modern interface with a focus on usability
Additional Features
Reports Section: Comprehensive cost summary reports
Bug Reporting Tool: Built-in system to report issues directly from the application
User Settings: Profile management and password change functionality
Technology Stack
Frontend
React.js with TypeScript
Redux for state management
Tailwind CSS for styling
Vite for build tooling
Backend & Database
Firebase Authentication for user management
Firestore for database functionality
Local storage for offline data persistence
Getting Started
Prerequisites
Node.js (v14 or later)
npm or yarn package manager
Firebase account
Installation
Clone the repository
Install dependencies with npm install
Configure Firebase credentials in the environment variables
Start the development server with npm run dev
Environment Variables
The application requires the following environment variables:

VITE_FIREBASE_API_KEY
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
Usage Guide
User Authentication
Register with email and password
Login to access your project data
Secure logout functionality
Managing Items
Add new items with name and cost
Edit existing items
Delete items when no longer needed
Sort and filter items as required
Tracking Other Costs
Add miscellaneous expenses
Categorize additional costs
Track total project expenses
Viewing Reports
See total project cost breakdown
Analyze spending patterns
Project Structure
The application follows a modular component-based architecture:

components/: UI components
store/: Redux state management
firebase/: Firebase configuration and services
hooks/: Custom React hooks
utils/: Utility functions
Future Enhancements
Data export functionality
Advanced reporting with charts and graphs
Multiple project support
Team collaboration features
Developed as part of Karkhana.io Frontend Developer Internship Assignment
