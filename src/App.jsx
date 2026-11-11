/* Created by Ahmed Eltahan - 2026 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoard from "./layouts/dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import AddNewTripPage from "./components/addNewTrip";
import AddNewMuseumPage from "./components/addNewMuseum";

function App() {
    return (
        <div dir="rtl">
            <ErrorBoundary>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<AddNewTripPage />} />
                        <Route path="/museums" element={<AddNewMuseumPage />} />
                        <Route path="/dashboard" element={<DashBoard />} />
                    </Routes>
                </BrowserRouter>
            </ErrorBoundary>
        </div>
    );
}

export default App;
