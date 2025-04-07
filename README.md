# Cocktail Explorer 🍸

A modern React TypeScript application for exploring and discovering cocktail recipes. Built with React, TypeScript, and Vite for optimal performance and developer experience.

## Features

- 🔍 Search for cocktails by name
- 🎲 View random cocktail suggestions
- 📝 Detailed recipe information including:
  - Ingredients and measurements
  - Preparation instructions
  - Glass type
  - Cocktail image
- 📱 Responsive design for all devices
- ⚡ Fast and smooth user experience
- 🎨 Modern and clean UI

## Technologies Used

- React 18
- TypeScript
- Vite
- CSS3
- TheCocktailDB API

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cocktail-explorer.git
   cd cocktail-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Running the Project

1. Start the development server:
   ```bash
   npm run start
   # or
   yarn start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build files will be created in the `dist` directory.

## Project Structure

```
cocktail-explorer/
├── src/
│   ├── components/         # React components
│   ├── services/          # API services
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── index.html           # HTML template
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- [TheCocktailDB](https://www.thecocktaildb.com/) for providing the cocktail data API
- All contributors who have helped shape this project

