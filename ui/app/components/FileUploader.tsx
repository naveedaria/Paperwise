import { useState } from 'react';
import { Upload } from 'lucide-react';

export function FileUploader({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center">
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold">Upload your PDF</h3>
      <p className="mt-1 text-sm text-gray-500">PDF files up to 10MB</p>
      
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
        id="pdf-upload"
        disabled={uploading}
      />
      
      <button
        onClick={() => document.getElementById('pdf-upload')?.click()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Select PDF'}
      </button>
    </div>
  );
}