import { useEffect, useState } from "react";
import { getStats } from "../api/tickets";

const StatsDashboard = ({ refreshKey }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await getStats();
      setStats(res.data);
    };
    fetch();
  }, [refreshKey]);

  if (!stats) return null;

  return (
    <div className="card">
      <h2>Statistics</h2>
      <p>Total Tickets: {stats.total_tickets}</p>
      <p>Open Tickets: {stats.open_tickets}</p>
      <p>Avg per Day: {stats.avg_tickets_per_day}</p>

      <h4>Priority Breakdown</h4>
      {Object.entries(stats.priority_breakdown).map(([k,v]) =>
        <p key={k}>{k}: {v}</p>
      )}

      <h4>Category Breakdown</h4>
      {Object.entries(stats.category_breakdown).map(([k,v]) =>
        <p key={k}>{k}: {v}</p>
      )}
    </div>
  );
};

export default StatsDashboard;
