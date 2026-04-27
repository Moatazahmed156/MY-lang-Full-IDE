import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import IDEPage from './pages/IDEPage.jsx';
import DocsPage from './pages/DocsPage.jsx';
import TutorialPage from './pages/TutorialPage.jsx';
import './styles/main.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<IDEPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/tutorial" element={<TutorialPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
