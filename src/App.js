import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './styles/mtg-theme.css';
import './styles/markdown-styles.css'
import AdminPage from './sites/AdminPage';
// Import individual event sites
import BDCVI from './sites/BDCVI';
import FuckAround from './sites/FuckAround';
// import Event2Page from './sites/Event2Page';
// Import more event sites as needed

function App() {
  const events = [
    { id: 1, name: "BDC VI", path: "/bdc-vi" },
    { id: 2, name: "Føkk around", path: "/find-out" },
    // Add more events as needed
  ];

  return (
    <Router>
      <div className="App mtg-page">
        <nav className="mtg-header">
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-mtg-primary hover:text-mtg-background">Framsie</Link></li>
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
          <Route path="/find-out" element={<FuckAround />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* <Route path="/winter-warhammer" element={<Event2Page />} /> */}
          {/* Add more routes as needed */}
        </Routes>

        <footer className="mtg-footer">
          <p>© 2024 Big Dick Committee</p>
        </footer>
      </div>
    </Router>
  );
}

function Home() {
  const [content, setContent] = useState('');

  useEffect(() => {
    // Load markdown content from a file
    fetch('/BDC-VI.md')
      .then(response => response.text())
      .then(text => setContent(text))
      .catch(error => console.error('Error loading markdown:', error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="markdown-body mtg-text">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default App;