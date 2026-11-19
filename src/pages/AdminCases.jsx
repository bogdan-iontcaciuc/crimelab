import { useEffect, useState } from "react";

const API_URL = "http://localhost:3001/cases";

const EMPTY_FORM = {
  title: "",
  difficulty: "Ușor",
  location: "",
  description: "",
};

function AdminCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  // READ
  const loadCases = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Nu s-au putut încărca cazurile.");
        return res.json();
      })
      .then((data) => {
        setCases(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  // CREATE + UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      setError("Titlul și descrierea sunt obligatorii.");
      return;
    }

    try {
      let res;

      if (editingId) {
        // PATCH păstrează probele, suspecții și cronologia existente
        res = await fetch(`${API_URL}/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            evidence: [],
            suspects: [],
            timeline: [],
          }),
        });
      }

      if (!res.ok) throw new Error("Salvarea a eșuat.");

      resetForm();
      setError(null);
      loadCases();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      difficulty: item.difficulty,
      location: item.location || "",
      description: item.description,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // DELETE
  const handleDelete = async (item) => {
    if (!window.confirm(`Sigur ștergi cazul "${item.title}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Ștergerea a eșuat.");

      if (editingId === item.id) resetForm();
      loadCases();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-page">
      <h1>Administrare cazuri</h1>

      {error && <p className="admin-error">{error}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Modifică cazul" : "Adaugă un caz nou"}</h2>

        <label>
          Titlu
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </label>

        <label>
          Dificultate
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
          >
            <option value="Ușor">Ușor</option>
            <option value="Mediu">Mediu</option>
            <option value="Greu">Greu</option>
          </select>
        </label>

        <label>
          Locația crimei
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </label>

        <label>
          Descriere
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <div className="admin-form-actions">
          <button type="submit">
            {editingId ? "Salvează modificările" : "Adaugă cazul"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Anulează
            </button>
          )}
        </div>
      </form>

      <h2>Cazuri existente</h2>

      {loading ? (
        <p>Se încarcă...</p>
      ) : cases.length === 0 ? (
        <p>Nu există cazuri.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titlu</th>
              <th>Dificultate</th>
              <th>Probe</th>
              <th>Suspecți</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.difficulty}</td>
                <td>{item.evidence?.length || 0}</td>
                <td>{item.suspects?.length || 0}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Editează</button>
                  <button onClick={() => handleDelete(item)}>Șterge</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminCases;
