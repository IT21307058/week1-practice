import React, { useEffect, useState } from "react";
import "../App.css";
import { fetchPostData, deletePost } from "../service/api";
import FilePreview from "../components/FilePreview";

const fmt = (v) => (v ? new Date(v).toLocaleString() : "-");

const Home = () => {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPostData();
        setRows(Array.isArray(data) ? data : data?.posts ?? []);
      } catch (e) {
        setErr(e.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (postId, postName) => {
    if (!window.confirm(`Are you sure you want to delete "${postName}"? This will also delete the associated file.`)) {
      return;
    }

    try {
      setDeleting(postId);
      await deletePost(postId);

      alert('Post and file deleted successfully!');
    } catch (e) {
      alert(`Failed to delete: ${e.message}`);
    } finally {
      setDeleting(null);
    }
  };


  if (loading) return <div className="p-3">Loading…</div>;
  if (err) return <div className="alert alert-danger m-3">{err}</div>;

  return (
    <>
      <div className="container py-4">
        <h1 className="mb-4">All Posts</h1>

        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th style={{ width: '300px' }}>Media</th>
              <th>Added</th>
              <th style={{ width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">No posts found</td>
              </tr>
            ) : (
              rows.map((p, i) => (
                <tr key={p.id || i}>
                  <td>{i + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>
                    <FilePreview file={p.file} />
                  </td>
                  <td>{fmt(p.addedDate)}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={deleting === p.id}
                    >
                      {deleting === p.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Home;


