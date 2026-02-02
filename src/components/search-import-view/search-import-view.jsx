import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

export function SearchImportView({ apiBaseUrl, token, onImported }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(null);
  const [error, setError] = useState("");

  const doSearch = async (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${apiBaseUrl}/external/search?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const doImport = async (tmdbId) => {
    setError("");
    setImporting(tmdbId);

    try {
      const res = await fetch(`${apiBaseUrl}/external/import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tmdbId }),
      });

      if (!res.ok) throw new Error(await res.text());
      await res.json();

      if (onImported) onImported();
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(null);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Search & Add</h1>
        <p className="page__subtitle">
          Search TMDB and import movies into your myFlix database.
        </p>
      </div>

      <Form onSubmit={doSearch} className="searchBar">
        <Form.Control
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search… (e.g., Interstellar)"
          className="searchBar__input"
        />
        <Button
          type="submit"
          variant="light"
          className="searchBar__btn"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : "Search"}
        </Button>
      </Form>

      {error ? (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      ) : null}

      <div className="importGrid">
        {results.map((m) => (
          <div key={m.tmdbId} className="importCard">
            <div
              className="importPoster"
              style={{
                backgroundImage: `url(${m.ImagePath || ""})`,
              }}
            />
            <div className="importBody">
              <div className="importTitle">{m.Title}</div>
              <div className="importMeta">{m.Year || ""}</div>
              <div className="importDesc">{m.Description}</div>

              <Button
                variant="outline-light"
                className="importBtn"
                onClick={() => doImport(m.tmdbId)}
                disabled={importing === m.tmdbId}
              >
                {importing === m.tmdbId ? "Adding…" : "Add to myFlix"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
