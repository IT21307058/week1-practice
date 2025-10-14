import React, { useEffect, useState } from "react";

const fmt = (v) => (v ? new Date(v).toLocaleString() : "-");

const FilePreview = ({ file }) => {
    if (!file) return <span>-</span>;

    const { contentType, data, filename } = file;

    // Create data URL from base64
    const dataUrl = `data:${contentType};base64,${data}`;

    // For audio files
    if (contentType?.startsWith('audio/')) {
        return (
            <div>
                <audio controls style={{ width: '250px' }}>
                    <source src={dataUrl} type={contentType} />
                </audio>
                <div style={{ fontSize: '0.75rem', marginTop: '5px' }}>
                    {filename}
                </div>
            </div>
        );
    }

    // For image files
    if (contentType?.startsWith('image/')) {
        return (
            <div>
                <img
                    src={dataUrl}
                    alt={filename}
                    style={{
                        maxWidth: '150px',
                        maxHeight: '100px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                    }}
                />
                <div style={{ fontSize: '0.75rem', marginTop: '5px' }}>
                    {filename}
                </div>
            </div>
        );
    }

    // For video files
    if (contentType?.startsWith('video/')) {
        return (
            <div>
                <video controls style={{ width: '250px' }}>
                    <source src={dataUrl} type={contentType} />
                </video>
                <div style={{ fontSize: '0.75rem', marginTop: '5px' }}>
                    {filename}
                </div>
            </div>
        );
    }

    // For other file types
    return (
        <div>
            <a
                href={dataUrl}
                download={filename}
                className="btn btn-sm btn-secondary"
            >
                Download
            </a>
            <div style={{ fontSize: '0.75rem', marginTop: '5px' }}>
                {filename}
            </div>
        </div>
    );
};

export default FilePreview;