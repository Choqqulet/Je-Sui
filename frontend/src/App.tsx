import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestFlow from "./pages/TestFlow";
import PasswordManager from "./pages/PasswordManager"; // adjust path/name
import AuthCallback from "./pages/AuthCallback";
import Landing from "./pages/Landing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/test" element={<TestFlow />} />
        <Route path="/vault" element={<PasswordManager />} />
      </Routes>
    </Router>
  );
}

export default App;
