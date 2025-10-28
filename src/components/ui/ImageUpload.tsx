'use client';

import { useState, useRef, useEffect } from 'react';
import Button from './Button';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  required?: boolean;
}

export default function ImageUpload({ 
  label, 
  value, 
  onChange, 
  folder = 'general',
  required = false 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview with value prop changes
  useEffect(() => {
    setPreview(value || '');
  }, [value]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload an image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 10MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('folder', folder);

    fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.url) {
          onChange(data.url);
          setPreview(data.url);
          toast.success('Image uploaded successfully!');
        } else {
          toast.error(data.error || 'Failed to upload image');
          setPreview(value || '');
        }
        setUploading(false);
      })
      .catch(() => {
        toast.error('An error occurred while uploading');
        setPreview(value || '');
        setUploading(false);
      });
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="flex flex-col space-y-3">
        {/* Preview */}
        {preview && (
          <div className="relative w-full max-w-sm">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex items-center space-x-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, '-')}`}
          />
          <Button
            type="button"
            variant="outline"
            isLoading={uploading}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!uploading) {
                fileInputRef.current?.click();
              }
            }}
          >
            <i className="fas fa-upload mr-2" />
            {uploading ? 'Uploading...' : preview ? 'Change Image' : 'Upload Image'}
          </Button>
          
          {preview && !uploading && (
            <span className="text-sm text-green-600">
              <i className="fas fa-check-circle mr-1" />
              Image uploaded
            </span>
          )}
        </div>

        {/* Manual URL Input (optional fallback) */}
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
            Or enter image URL manually
          </summary>
          <input
            type="url"
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value);
              setPreview(e.target.value);
            }}
            placeholder="https://example.com/image.jpg"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </details>
      </div>
    </div>
  );
}

