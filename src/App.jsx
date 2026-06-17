import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Request from './pages/Request';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Confirmation from './pages/Confirmation';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demande" element={<Request />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/admin-redonner" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
