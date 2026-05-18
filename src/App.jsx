import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login
from "./pages/Login";

import AdminDashboard
from "./pages/AdminDashboard";

import CounterScreen
from "./pages/CounterScreen";

import StudentEntry
from "./pages/StudentEntry";

import StudentStatus
from "./pages/StudentStatus";

import QueueDisplay
from "./pages/QueueDisplay";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Login */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* Admin */}

        <Route
          path="/admin"
          element={
            <AdminDashboard />
          }
        />

        {/* Faculty Counter */}

        <Route
          path="/counter"
          element={
            <CounterScreen />
          }
        />

        {/* Student QR Entry */}

        <Route
          path="/student-entry"
          element={
            <StudentEntry />
          }
        />

        {/* Student Live Status */}

        <Route
          path="/student-status/:id"
          element={
            <StudentStatus />
          }
        />

        {/* Live Queue Display */}

        <Route
          path="/display"
          element={
            <QueueDisplay />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;