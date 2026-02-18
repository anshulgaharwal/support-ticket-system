import { updateTicket } from "../api/tickets";

const TicketItem = ({ ticket, refresh }) => {
  const handleStatusChange = async (status) => {
    await updateTicket(ticket.id, { status });
    refresh();
  };

  return (
    <div className="card">
      <h3>{ticket.title}</h3>
      <p>{ticket.description.slice(0, 120)}...</p>
      <p>Category: {ticket.category}</p>
      <p>Priority: {ticket.priority}</p>
      <p>Status: {ticket.status}</p>
      <p>{new Date(ticket.created_at).toLocaleString()}</p>

      <select
        value={ticket.status}
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>
    </div>
  );
};

export default TicketItem;
