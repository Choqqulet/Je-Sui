import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TestFlow from "./pages/TestFlow";

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Je-Sui</h1>
      <p>Welcome. Use the test page to run on-chain calls.</p>
      <Link to="/test">Go to TestFlow →</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestFlow />} />
      </Routes>
    </Router>
  );
}

export default App;
