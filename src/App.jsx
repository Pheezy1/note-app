import { useEffect, useState } from "react";
import "./App.css";

function NoteApp() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pheezy-notes") || "[]");
    } catch {
      return [];
    }
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("pheezy-notes", JSON.stringify(notes));
  }, [notes]);

  function handleSaveNote(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editId) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editId
            ? { ...note, title: title.trim(), content: content.trim() }
            : note
        )
      );
      setEditId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        date: new Date().toLocaleDateString(),
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    setTitle("");
    setContent("");
  }

  function handleEdit(note) {
    setEditId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  function handleDelete(id) {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (editId === id) {
      setEditId(null);
      setTitle("");
      setContent("");
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="note-app">
      <h1>Note Taking App</h1>

      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <form onSubmit={handleSaveNote}>
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your note..."
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">{editId ? "Update Note" : "Add Note"}</button>
      </form>

      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          filteredNotes.map((note) => (
            <article key={note.id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <small>{note.date}</small>
              <div>
                <button type="button" onClick={() => handleEdit(note)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(note.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

export default NoteApp;
