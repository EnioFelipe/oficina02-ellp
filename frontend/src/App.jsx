import { BrowserRouter, Route, Routes } from 'react-router-dom';

function Home() {
  return (
    <main style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.25rem', margin: 0 }}>ELLP</h1>
      <p style={{ marginTop: '0.5rem', color: '#444' }}>Frontend em construcao.</p>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
