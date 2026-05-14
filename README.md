# Firewall Audit Dashboard

A React-based web application for auditing and managing firewall configurations.

## Project Structure

```
firewall-audit-dashboard/
├── public/
│   └── index.html              # Main HTML file
├── src/
│   ├── components/             # Reusable React components
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── pages/                  # Page components
│   ├── utils/                  # Utility functions
│   │   └── api.js
│   ├── styles/                 # Global styles
│   ├── App.js                  # Main App component
│   ├── App.css                 # App styles
│   ├── index.js                # React entry point
│   └── index.css               # Global styles
├── package.json                # Project dependencies
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

## Technologies Used

- React 18.2.0
- React DOM 18.2.0
- React Scripts 5.0.1

## Development

To add new components:
1. Create a new file in `src/components/`
2. Export the component
3. Import and use it in your application

To add utility functions:
1. Create files in `src/utils/`
2. Export functions for use across the app

## License

This project is private.