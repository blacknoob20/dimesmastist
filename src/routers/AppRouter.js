import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Topbar } from '../components/topbar/Topbar';
import { CoinPage } from '../components/coin/CoinPage';
import { CoinForm } from '../components/coin/CoinForm';
// import { PublicRoute } from './PublicRoute';

export const AppRouter = () => {
    return (
        <Router>
            <div className="container mx-auto relative">
                <Topbar />
                <Navbar />
                <Routes>
                    <Route path="/home" element={<CoinPage />} />
                    <Route path="/coins" element={<CoinForm />} />
                    <Route path="/" element={<Navigate to="/home" />} />
                </Routes>
            </div>
        </Router>
    )
}
