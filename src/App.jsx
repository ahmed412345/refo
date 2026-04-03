import DashBoard from "./layouts/dashboard";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <div dir="rtl">
      <ErrorBoundary>
        <DashBoard></DashBoard>
      </ErrorBoundary>
    </div>
  );
}

export default App;
