import { useState } from "react";
import TicketForm from "../components/TicketForm";
import TicketList from "../components/TicketList";
import StatsDashboard from "../components/StatsDashboard";

const Home = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container">
      <TicketForm onSuccess={triggerRefresh} />
      <StatsDashboard refreshKey={refreshKey} />
      <TicketList refreshKey={refreshKey} />
    </div>
  );
};

export default Home;
