import { useState } from 'react';
import { apiUpload } from '../lib/api';

export function useUpload() {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file) => {
    const fileEntry = {
      id: Date.now(),
      name: file.name,
      size: file.size,
      status: 'uploading',
    };
    setFiles(prev => [...prev, fileEntry]);
    setIsUploading(true);

    try {
      const data = await apiUpload('/documents/upload', file);
      setFiles(prev =>
        prev.map(f =>
          f.id === fileEntry.id
            ? { ...f, status: 'done', documentId: data.document.id }
            : f
        )
      );
      return data;
    } catch (err) {
      console.error('Upload error:', err);
      setFiles(prev =>
        prev.map(f =>
          f.id === fileEntry.id ? { ...f, status: 'error' } : f
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return { files, isUploading, uploadFile, removeFile };
}
