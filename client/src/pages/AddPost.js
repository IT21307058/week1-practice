import React, { useState } from "react";
import { createPost } from "../service/api";
import { useNavigate } from "react-router-dom";

const AddPost = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        file: null,
    });

    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setFormData((prev) => ({
                ...prev,
                file: file,
            }));

            // Create preview for images/audio/video
            const fileUrl = URL.createObjectURL(file);
            setPreview({
                url: fileUrl,
                type: file.type,
                name: file.name,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.name.trim()) {
            setError("Name is required");
            return;
        }

        if (!formData.description.trim()) {
            setError("Description is required");
            return;
        }

        if (!formData.file) {
            setError("Please select a file");
            return;
        }

        try {
            setLoading(true);

            // Create FormData object
            const data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("file", formData.file);

            // Send to API
            await createPost(data);

            // Success - redirect to home
            alert("Post created successfully!");
            navigate("/");
        } catch (err) {
            setError(err.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm("Are you sure you want to cancel? Your changes will be lost.")) {
            navigate("/");
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0">Add New Post</h3>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={() => setError("")}
                                    >
                                        <span>&times;</span>
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Name Field */}
                                <div className="form-group mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter post name"
                                        required
                                    />
                                </div>

                                {/* Description Field */}
                                <div className="form-group mb-3">
                                    <label htmlFor="description" className="form-label">
                                        Description <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter description"
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>

                                {/* File Upload Field */}
                                <div className="form-group mb-3">
                                    <label htmlFor="file" className="form-label">
                                        Upload File <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="file"
                                        name="file"
                                        onChange={handleFileChange}
                                        accept="image/*,audio/*,video/*"
                                        required
                                    />
                                    <small className="form-text text-muted">
                                        Supported formats: Images, Audio, Video
                                    </small>
                                </div>

                                {/* File Preview */}
                                {preview && (
                                    <div className="form-group mb-3">
                                        <label className="form-label">Preview:</label>
                                        <div className="border rounded p-3 bg-light">
                                            {preview.type.startsWith("image/") && (
                                                <img
                                                    src={preview.url}
                                                    alt="Preview"
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: "300px" }}
                                                />
                                            )}

                                            {preview.type.startsWith("audio/") && (
                                                <div>
                                                    <audio controls className="w-100">
                                                        <source src={preview.url} type={preview.type} />
                                                    </audio>
                                                    <p className="mt-2 mb-0 text-muted">{preview.name}</p>
                                                </div>
                                            )}

                                            {preview.type.startsWith("video/") && (
                                                <video controls className="w-100" style={{ maxHeight: "300px" }}>
                                                    <source src={preview.url} type={preview.type} />
                                                </video>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Post"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPost;
