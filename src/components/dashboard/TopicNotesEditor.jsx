import { useEffect, useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import clsx from "clsx";
import { normalizeNotesForTopic } from "../../services/topicLearning";

function createNote(text = "") {
  return { id: crypto.randomUUID(), text, updatedAt: Date.now() };
}

export default function TopicNotesEditor({ topicId, initialNotes, onSave }) {
  const [notes, setNotes] = useState([]);
  const [editingIds, setEditingIds] = useState(() => new Set());
  const [drafts, setDrafts] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    const normalized = normalizeNotesForTopic(initialNotes);
    setNotes(normalized);
    setEditingIds(new Set());
    setDrafts({});
  }, [topicId]);

  const isEditing = (id) => editingIds.has(id);

  const startEdit = (id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    setDrafts((prev) => ({ ...prev, [id]: note.text }));
    setEditingIds((prev) => new Set(prev).add(id));
  };

  const updateDraft = (id, text) => {
    setDrafts((prev) => ({ ...prev, [id]: text }));
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text, updatedAt: Date.now() } : n))
    );
  };

  const cancelEdit = (id) => {
    const saved = normalizeNotesForTopic(initialNotes).find((n) => n.id === id);
    const draft = drafts[id];

    if (!saved) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } else {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, text: saved.text } : n))
      );
    }

    setEditingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const persistNotes = (nextNotes) => {
    const cleaned = normalizeNotesForTopic(nextNotes);
    setSaveStatus("saving");
    try {
      onSave(topicId, cleaned);
      setNotes(cleaned);
      setEditingIds(new Set());
      setDrafts({});
      setSaveStatus("saved");
      window.setTimeout(() => setSaveStatus(null), 2000);
    } catch {
      setSaveStatus("error");
      window.setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const saveNote = (id) => {
    const note = notes.find((n) => n.id === id);
    if (!note?.text.trim()) {
      cancelEdit(id);
      return;
    }
    persistNotes(notes);
  };

  const saveAllNotes = () => {
    const hasContent = notes.some((n) => n.text.trim());
    if (!hasContent) return;
    persistNotes(notes);
  };

  const addNote = () => {
    const note = createNote("");
    setNotes((prev) => [...prev, note]);
    setDrafts((prev) => ({ ...prev, [note.id]: "" }));
    setEditingIds((prev) => new Set(prev).add(note.id));
  };

  const removeNote = (id) => {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    setEditingIds((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
    setDrafts((prev) => {
      const d = { ...prev };
      delete d[id];
      return d;
    });
    persistNotes(next);
  };

  const hasUnsavedEdits = notes.some((n) => editingIds.has(n.id));

  return (
    <section className="dash-topic-focus-section">
      <div className="dash-notes-header">
        <h3 className="dash-topic-focus-heading">My Notes</h3>
        {saveStatus === "saved" && (
          <span className="dash-notes-status dash-notes-status-saved">Saved</span>
        )}
        {saveStatus === "saving" && (
          <span className="dash-notes-status">Saving...</span>
        )}
        {saveStatus === "error" && (
          <span className="dash-notes-status dash-notes-status-error">
            Could not save
          </span>
        )}
      </div>
      <p className="dash-topic-focus-hint">
        Add study notes, links, and reminders. Use Save when you&apos;re done editing.
      </p>

      {notes.length === 0 && (
        <p className="dash-notes-empty">No notes yet. Add your first note below.</p>
      )}

      <ul className="dash-notes-list">
        {notes.map((note) => {
          const editing = isEditing(note.id);
          const text = editing ? drafts[note.id] ?? note.text : note.text;

          return (
            <li key={note.id} className="dash-notes-item">
              {editing ? (
                <>
                  <textarea
                    className="dash-notes-input"
                    placeholder="Study notes, links, reminders, exam prep..."
                    value={text}
                    rows={3}
                    onChange={(e) => updateDraft(note.id, e.target.value)}
                  />
                  <div className="dash-notes-item-actions">
                    <button
                      type="button"
                      className="dash-notes-action dash-notes-action-save"
                      onClick={() => saveNote(note.id)}
                    >
                      <Save size={14} aria-hidden="true" />
                      Save
                    </button>
                    <button
                      type="button"
                      className="dash-notes-action"
                      onClick={() => cancelEdit(note.id)}
                    >
                      <X size={14} aria-hidden="true" />
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="dash-notes-view">{note.text}</p>
                  <div className="dash-notes-item-actions dash-notes-item-actions-view">
                    <button
                      type="button"
                      className="dash-notes-action"
                      onClick={() => startEdit(note.id)}
                    >
                      <Pencil size={14} aria-hidden="true" />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="dash-notes-action dash-notes-action-danger"
                      onClick={() => removeNote(note.id)}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>

      <div className="dash-notes-footer">
        <button type="button" className="dash-notes-add" onClick={addNote}>
          <Plus size={16} aria-hidden="true" />
          Add note
        </button>
        {notes.length > 0 && (
          <button
            type="button"
            className={clsx(
              "dash-notes-save-all",
              !hasUnsavedEdits && "dash-notes-save-all-muted"
            )}
            onClick={saveAllNotes}
            disabled={saveStatus === "saving"}
          >
            <Save size={16} aria-hidden="true" />
            Save all notes
          </button>
        )}
      </div>
    </section>
  );
}
