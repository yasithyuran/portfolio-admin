'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Check } from 'lucide-react';

export default function ImageUpload({ onImageUpload, multiple = false, initialImages = [] }) {
  const [images, setImages] = useState([]);

  // Initialize with existing images - ONLY run once when initialImages changes
  useEffect(() => {
    console.log('🔄 useEffect: initialImages changed');
    console.log('initialImages:', initialImages);
    
    if (initialImages && initialImages.length > 0) {
      const imagesToSet = Array.isArray(initialImages) ? initialImages : [initialImages];
      console.log('Setting images to:', imagesToSet);
      setImages(imagesToSet);
    } else {
      console.log('No initial images, setting []');
      setImages([]);
    }
  }, [initialImages]); // ONLY depend on initialImages

  const handleUpload = (result) => {
    const imageUrl = result.info.secure_url;
    console.log('✅ Uploaded image URL:', imageUrl);
    console.log('Current state before update:', images);
    console.log('Multiple mode?:', multiple);

    if (multiple) {
      // KEY FIX: Use callback form to get latest state
      setImages(prevImages => {
        console.log('Previous images:', prevImages);
        const newImages = [...prevImages, imageUrl]; // ADD to array
        console.log('New images after adding:', newImages);
        
        // Call parent with updated array
        onImageUpload(newImages);
        
        return newImages;
      });
    } else {
      // For single: replace
      setImages([imageUrl]);
      onImageUpload(imageUrl);
    }
  };

  const removeImage = (index) => {
    console.log('Removing image at index:', index);
    
    if (multiple) {
      setImages(prevImages => {
        const newImages = prevImages.filter((_, i) => i !== index);
        console.log('Images after removal:', newImages);
        onImageUpload(newImages);
        return newImages;
      });
    } else {
      setImages([]);
      onImageUpload('');
    }
  };

  console.log('RENDER - images state:', images);

  return (
    <div>
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={handleUpload}
      >
        {({ open }) => (
          <motion.button
            type="button"
            onClick={() => open()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full justify-center transition"
          >
            <Upload size={20} />
            {multiple ? 'Upload Images (Add Multiple)' : 'Upload Image'}
          </motion.button>
        )}
      </CldUploadWidget>

      {/* Display uploaded images */}
      {images && images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Check size={20} className="text-green-400" />
            <p className="text-green-400 font-semibold">
              {images.length} image{images.length > 1 ? 's' : ''} uploaded
            </p>
          </div>

          <div className={multiple ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 'space-y-3'}>
            {images.map((image, index) => (
              <motion.div
                key={`${image}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg border border-gray-700 group-hover:border-green-500 transition"
                />
                
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                  {index + 1}
                </div>

                <motion.button
                  type="button"
                  onClick={() => removeImage(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={18} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {(!images || images.length === 0) && (
        <p className="text-gray-400 text-sm mt-2">
          {multiple
            ? 'Click the button above to upload multiple images'
            : 'Click the button above to upload an image'}
        </p>
      )}
    </div>
  );
}