'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Save, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ImageUpload from '../../../components/ImageUpload';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web App',
    technologies: [],
    thumbnail: '',
    images: [],
    liveLink: '',
    githubLink: '',
    featured: false,
  });
  const [tech, setTech] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('💾 Saving project:', formData);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/projects`, formData);
      console.log('✅ Project created successfully');
      router.push('/dashboard/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project');
    } finally {
      setLoading(false);
    }
  };

  const addTechnology = () => {
    if (tech.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech],
      }));
      setTech('');
    }
  };

  const removeTechnology = (index) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const handleThumbnailUpload = (imageUrl) => {
    console.log('🖼️ Thumbnail uploaded:', imageUrl);
    setFormData(prev => ({
      ...prev,
      thumbnail: imageUrl,
    }));
  };

  const handleImagesUpload = (imageUrls) => {
    console.log('🖼️ Gallery images updated:', imageUrls);
    setFormData(prev => ({
      ...prev,
      images: Array.isArray(imageUrls) ? imageUrls : [],
    }));
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-8">Add New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-white font-semibold mb-2">Project Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
            placeholder="E-Commerce Platform"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            required
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-white font-semibold mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
            placeholder="Describe your project in detail..."
            rows="6"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            required
          />
        </motion.div>

        {/* Thumbnail Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-white font-semibold mb-2">Thumbnail Image (Featured Image)</label>
          <ImageUpload 
            onImageUpload={handleThumbnailUpload} 
            multiple={false}
            initialImages={formData.thumbnail ? [formData.thumbnail] : []}
          />
          {formData.thumbnail && (
            <div className="mt-4 relative">
              <img
                src={formData.thumbnail}
                alt="Thumbnail"
                className="w-full h-48 object-cover rounded-lg border border-gray-800"
              />
              <p className="text-green-400 text-sm mt-2">✓ Thumbnail uploaded</p>
            </div>
          )}
        </motion.div>

        {/* Gallery Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-white font-semibold mb-2">Gallery Images (Multiple)</label>
          <p className="text-gray-400 text-sm mb-3">Upload multiple images for the project gallery</p>
          <ImageUpload 
            onImageUpload={handleImagesUpload} 
            multiple={true}
            initialImages={formData.images || []}
          />
          {formData.images.length > 0 && (
            <p className="text-green-400 text-sm mt-2">✓ {formData.images.length} images uploaded</p>
          )}
        </motion.div>

        {/* Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-white font-semibold mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option>Web App</option>
            <option>Mobile</option>
            <option>UI/UX</option>
            <option>Graphic Design</option>
          </select>
        </motion.div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-white font-semibold mb-2">Technologies Used</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              placeholder="e.g., React, Node.js, MongoDB"
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addTechnology}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((t, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-2"
              >
                {t}
                <button
                  type="button"
                  onClick={() => removeTechnology(i)}
                  className="hover:text-blue-300"
                >
                  ×
                </button>
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-white font-semibold mb-2">Live Link</label>
            <input
              type="url"
              value={formData.liveLink}
              onChange={(e) => setFormData(prev => ({...prev, liveLink: e.target.value}))}
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-2">GitHub Link</label>
            <input
              type="url"
              value={formData.githubLink}
              onChange={(e) => setFormData(prev => ({...prev, githubLink: e.target.value}))}
              placeholder="https://github.com/..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </motion.div>

        {/* Featured Checkbox */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 rounded-lg"
        >
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData(prev => ({...prev, featured: e.target.checked}))}
            className="w-5 h-5"
          />
          <label className="text-white font-semibold">Pin this project (show on home)</label>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Saving Project...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Project
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}