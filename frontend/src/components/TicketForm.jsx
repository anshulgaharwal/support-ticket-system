import { useState } from "react";
import { createTicket, classifyTicket } from "../api/tickets";

const TicketForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: ""
  });

  const [loadingLLM, setLoadingLLM] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleDescriptionBlur = async () => {
    if (!form.description) return;

    try {
      setLoadingLLM(true);
      const res = await classifyTicket(form.description);

      if (res.data.suggested_category)
        setForm(prev => ({
          ...prev,
          category: res.data.suggested_category,
          priority: res.data.suggested_priority
        }));
    } catch {
      console.log("LLM failed gracefully");
    } finally {
      setLoadingLLM(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createTicket(form);
      setForm({ title: "", description: "", category: "", priority: "" });
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Submit Ticket</h2>

      <input
        placeholder="Title"
        maxLength={200}
        required
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Description"
        required
        value={form.description}
        onBlur={handleDescriptionBlur}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />

      {loadingLLM && <p>Analyzing with AI...</p>}

      <select
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
        required
      >
        <option value="">Select Category</option>
        <option value="billing">Billing</option>
        <option value="technical">Technical</option>
        <option value="account">Account</option>
        <option value="general">General</option>
      </select>

      <select
        value={form.priority}
        onChange={e => setForm({ ...form, priority: e.target.value })}
        required
      >
        <option value="">Select Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <button disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default TicketForm;
