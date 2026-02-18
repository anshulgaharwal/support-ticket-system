import { useEffect, useState } from "react";
import { listTickets } from "../api/tickets";
import TicketItem from "./TicketItem";

const TicketList = ({ refreshKey }) => {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({});

  const fetchTickets = async () => {
    const res = await listTickets(filters);
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, [filters, refreshKey]);

  return (
    <div>
      <h2>Tickets</h2>

      <div className="filters">
        <select onChange={e => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          <option value="billing">Billing</option>
          <option value="technical">Technical</option>
          <option value="account">Account</option>
          <option value="general">General</option>
        </select>
      </div>

      {tickets.map(ticket => (
        <TicketItem key={ticket.id} ticket={ticket} refresh={fetchTickets} />
      ))}
    </div>
  );
};

export default TicketList;
