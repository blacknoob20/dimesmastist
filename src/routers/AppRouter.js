import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DimesmatistApp } from '../components/DimesmatistApp';
// import { PublicRoute } from './PublicRoute';

export const AppRouter = () => {
    return (
        <Router>
            <div>
                <div>
                    <Routes>
                        <Route path="/home" element={ <DimesmatistApp /> } />
                        {/* <Route path="/auth/register">
                            <RegisterPage />
                        </Route> */}
                        <Route path="/" element={ <Navigate to="/home" /> } />
                    </Routes>
                </div>
            </div>
        </Router>
    )
}
