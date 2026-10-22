/* Created by Ahmed Eltahan - 2026 */
import DashBoard from "./layouts/dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import AddNewTripPage from "./components/addNewTrip";

function App() {
    return (
        <div dir="rtl">
            <ErrorBoundary>
                <AddNewTripPage />
            </ErrorBoundary>
        </div>
    );
}

export default App;
