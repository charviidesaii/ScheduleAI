import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RateProfessorsPage from './pages/RateProfessorsPage';
import CourseSelectionPage from './pages/CourseSelectionPage';
import ResultsPage from './pages/ResultsPage';

import Layout from './components/Layout';

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/rate" element={<RateProfessorsPage />} />
                    <Route path="/courses" element={<CourseSelectionPage />} />
                    <Route path="/schedule" element={<ResultsPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
