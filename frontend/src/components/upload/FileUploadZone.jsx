import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";

export default function FileUploadZone({
  onUpload,
  files,
  onRemove,
  isUploading,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach((file) => onUpload(file));
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    selectedFiles.forEach((file) => onUpload(file));
    e.target.value = "";
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Drop zone */}
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all hover:scale-[1.01]"
        style={{
          borderColor: isDragging ? "var(--accent)" : "var(--border)",
          backgroundColor: isDragging
            ? "var(--bg-hover)"
            : "var(--bg-secondary)",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.md"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload
          size={40}
          className="mx-auto mb-4"
          style={{
            color: isDragging ? "var(--accent)" : "var(--text-tertiary)",
          }}
        />
        <p
          className="text-sm font-medium mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Drag & drop file ke sini
        </p>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          atau klik untuk pilih file • PDF, TXT, MD
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            File yang di-upload
          </h3>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 rounded-lg border"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border)",
              }}
            >
              <FileText size={16} style={{ color: "var(--text-tertiary)" }} />
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {file.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {formatSize(file.size)}
                </p>
              </div>
              {/* Status */}
              {file.status === "uploading" && (
                <div
                  className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{
                    borderColor: "var(--border)",
                    borderTopColor: "var(--accent)",
                  }}
                />
              )}
              {file.status === "done" && (
                <CheckCircle size={16} style={{ color: "var(--success)" }} />
              )}
              {file.status === "error" && (
                <AlertCircle size={16} style={{ color: "var(--error)" }} />
              )}
              <button
                onClick={() => onRemove(file.id)}
                className="p-1 rounded hover:bg-[var(--bg-hover)] transition-all"
              >
                <X size={14} style={{ color: "var(--text-tertiary)" }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
