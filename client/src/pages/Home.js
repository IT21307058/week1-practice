import React, { useEffect, useState } from "react";
import "../App.css";
import { fetchPostData } from "../service/api";
import FilePreview from "../components/FilePreview";

const fmt = (v) => (v ? new Date(v).toLocaleString() : "-");

const Home = () => {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPostData();
        // If your API returns {posts:[...]} adjust to data.posts
        setRows(Array.isArray(data) ? data : data?.posts ?? []);
      } catch (e) {
        setErr(e.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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


