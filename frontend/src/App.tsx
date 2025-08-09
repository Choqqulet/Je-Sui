import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TestFlow from "./pages/TestFlow";
import PasswordManager from "./pages/PasswordManager"; // adjust path/name

function Home() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Je-Sui</h1>
      <p className="text-gray-600">Welcome. Use the test page to run on-chain calls.</p>
      <Link
        to="/vault"
        className="inline-block px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
      >
        Go to Vault
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestFlow />} />
        <Route path="/vault" element={<PasswordManager />} />
      </Routes>
    </Router>
  );
}

export default App;
