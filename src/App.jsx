import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";

import CounterScreen from "./pages/CounterScreen";

import StudentEntry from "./pages/StudentEntry";

import StudentStatus from "./pages/StudentStatus";

import QueueDisplay from "./pages/QueueDisplay";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Admin Dashboard */}
        <Route
          path="/"
          element={<AdminDashboard />}
        />

        {/* Counter Screen */}
        <Route
          path="/counter"
          element={<CounterScreen />}
        />

        {/* Student Entry */}
        <Route
          path="/student-entry"
          element={<StudentEntry />}
        />

        {/* Student Status */}
        <Route
          path="/student-status/:id"
          element={<StudentStatus />}
        />

        {/* Live Queue Display */}
        <Route
          path="/display"
          element={<QueueDisplay />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;