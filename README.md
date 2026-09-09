## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Eugenekime/next.js-5.10.git
```

Go to the project directory:

```bash
cd movie-search-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root of the project:

```env
TMDB_API_KEY=your_tmdb_api_key
```

Replace `your_tmdb_api_key` with your TMDB API key.

You can get an API key from:

https://www.themoviedb.org/settings/api

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

### Requirements

- Node.js 20 or newer
- npm
- TMDB API key

### Available scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run ESLint
```
