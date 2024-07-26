import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './styles/mtg-theme.css';
import AdminPage from './sites/AdminPage';

// Import individual event sites
import BDCVI from './sites/BDCVI';
// import Event2Page from './sites/Event2Page';
// Import more event sites as needed

function App() {
  const events = [
    { id: 1, name: "BDC VI", path: "/bdc-vi" },
    // { id: 2, name: "Winter Warhammer Campaign", path: "/winter-warhammer" },
    // Add more events as needed
  ];

  return (
    <Router>
      <div className="App mtg-page">
        <nav className="mtg-header">
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-mtg-primary hover:text-mtg-background">Home</Link></li>
            {events.map(event => (
              <li key={event.id}>
                <Link to={event.path} className="text-mtg-primary hover:text-mtg-background">{event.name}</Link>
              </li>
            ))}
            <li><Link to="/admin" className="text-mtg-primary hover:text-mtg-background">Admin</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bdc-vi" element={<BDCVI />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* <Route path="/winter-warhammer" element={<Event2Page />} /> */}
          {/* Add more routes as needed */}
        </Routes>

        <footer className="mtg-footer">
          <p>© 2024 Big Dick Comittee</p>
        </footer>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to our Gaming Group</h1>
      <p className="mb-4">Check out our upcoming major events in the header!</p>
    </div>
  );
}

export default App;