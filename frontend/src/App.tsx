import React, { useEffect, useState } from 'react';

const API_BASE = '/v1'; // Ingress routes /v1 to the backend service

function App() {
  const [total, setTotal] = useState<number | null>(null);
  const [increment, setIncrement] = useState<string>('1');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTotal = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/bitcoins`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`GET /bitcoins failed: ${response.status}`);
      }

      const text = await response.text();
      const value = parseInt(text, 10);
      if (Number.isNaN(value)) {
        throw new Error(`Unexpected response body: ${text}`);
      }
      setTotal(value);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Failed to fetch total');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const delta = parseInt(increment, 10);
    if (Number.isNaN(delta)) {
      setError('Please enter a valid integer amount');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ bitcoins: String(delta) });
      const response = await fetch(`${API_BASE}/bitcoins?${params.toString()}`, {
        method: 'POST',
      });

      if (!response.ok && response.status !== 204) {
        throw new Error(`POST /bitcoins failed: ${response.status}`);
      }

      // After a successful POST, re-fetch the total
      await fetchTotal();
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Failed to update total');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial value on load
    fetchTotal().catch((e) => console.error(e));
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 480, margin: '0 auto' }}>
      <h1>BitCoin generator</h1>

      <section style={{ marginBottom: '1.5rem' }}>
        <p>
          Current total:{' '}
          {total === null ? (
            <span>loading…</span>
          ) : (
            <strong>{total}</strong>
          )}
        </p>
        <button onClick={fetchTotal} disabled={loading}>
          Refresh
        </button>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <label>
          Add bitcoins:{' '}
          <input
            type="number"
            value={increment}
            onChange={(e) => setIncrement(e.target.value)}
            style={{ width: '6rem' }}
          />
        </label>
        <button onClick={handleAdd} disabled={loading} style={{ marginLeft: '0.5rem' }}>
          Bank
        </button>
      </section>

      {loading && <p>Working…</p>}
      {error && (
        <p style={{ color: 'red' }}>
          Error: {error}
        </p>
      )}
    </div>
  );
}

export default App;
