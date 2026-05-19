import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const navigate = useNavigate();

  const handleUploadSuccess = (result) => {
    navigate('/dashboard', { state: { result } });
  };

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<UploadPage onUploadSuccess={handleUploadSuccess} />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
