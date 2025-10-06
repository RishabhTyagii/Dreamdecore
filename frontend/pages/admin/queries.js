import { useEffect, useState } from 'react';
import { fetchQueries } from '../../lib/api';

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    fetchQueries().then(setQueries).catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1>Admin — Queries</h1>
      {queries.length === 0 ? <p>No queries yet.</p> : (
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Message</th><th>When</th></tr></thead>
          <tbody>
            {queries.map(q => (
              <tr key={q.id}>
                <td>{q.name}</td>
                <td>{q.email}</td>
                <td>{q.message}</td>
                <td>{new Date(q.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}