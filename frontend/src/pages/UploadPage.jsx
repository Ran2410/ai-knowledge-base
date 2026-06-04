import { useUpload } from '../hooks/useUpload';
import FileUploadZone from '../components/upload/FileUploadZone';

export default function UploadPage() {
  const { files, isUploading, uploadFile, removeFile } = useUpload();

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Upload Dokumen
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
          Upload PDF, TXT, atau MD untuk ditambahkan ke knowledge base.
        </p>

        <FileUploadZone
          onUpload={uploadFile}
          files={files}
          onRemove={removeFile}
          isUploading={isUploading}
        />
      </div>
    </div>
  );
}
