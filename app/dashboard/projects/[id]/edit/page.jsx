'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Save, Loader, ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import ImageUpload from '../../../../components/ImageUpload';
import Link from 'next/link';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    pinned: false,
  });
  const [tech, setTech] = useState('');

  // Fetch project data ONLY ONCE
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`);
        console.log('📌 Project loaded:', response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
        alert('Error loading project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, formData);
      console.log('✅ Project updated:', response.data);
      alert('Project updated successfully!');
      router.push('/dashboard/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project');
    } finally {
      setSaving(false);
    }
  };

  const addTechnology = () => {
    if (tech.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, tech],
      });
      setTech('');
    }
  };

  const removeTechnology = (index) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
  };

  // Handle thumbnail
  const handleThumbnailUpload = (imageUrl) => {
    console.log('🖼️ Thumbnail updated:', imageUrl);
    setFormData(prev => ({
      ...prev,
      thumbnail: imageUrl,
    }));
  };

  // Handle gallery images
  const handleImagesUpload = (imageUrls) => {
    console.log('🖼️ Gallery updated:', imageUrls);
    setFormData(prev => ({
      ...prev,
      images: Array.isArray(imageUrls) ? imageUrls : [],
    }));
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size={48} className="text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/projects">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </motion.button>
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-white mb-8">Edit Project</h1>

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
          <label className="block text-white font-semibold mb-2">Thumbnail Image</label>
          <ImageUpload 
            onImageUpload={handleThumbnailUpload} 
            multiple={false}
            initialImages={formData.thumbnail ? [formData.thumbnail] : []}
          />
          {formData.thumbnail && (
            <div className="mt-4">
              <img
                src={formData.thumbnail}
                alt="Thumbnail"
                className="w-full h-48 object-cover rounded-lg border border-gray-800"
              />
            </div>
          )}
        </motion.div>

        {/* Gallery Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-white font-semibold mb-2">Gallery Images</label>
          <p className="text-gray-400 text-sm mb-3">
            Click "Upload Images" to add multiple images to your gallery.
          </p>
          <ImageUpload 
            onImageUpload={handleImagesUpload} 
            multiple={true}
            initialImages={formData.images || []}
          />

          {/* Current Gallery Images */}
          {formData.images && formData.images.length > 0 && (
            <div className="mt-6 border-t border-gray-800 pt-6">
              <h3 className="text-white font-semibold mb-4">
                Current Gallery ({formData.images.length} images)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <motion.div
                    key={`${image}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-800 group-hover:border-red-500 transition"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                      {index + 1}
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
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
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-2">GitHub Link</label>
            <input
              type="url"
              value={formData.githubLink}
              onChange={(e) => setFormData(prev => ({...prev, githubLink: e.target.value}))}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </motion.div>

        {/* Featured Checkbox - For Homepage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-3 p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg"
        >
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData(prev => ({...prev, featured: e.target.checked}))}
            className="w-5 h-5 rounded"
          />
          <div>
            <label className="text-white font-semibold block">Featured (Show on Homepage)</label>
            <p className="text-gray-400 text-sm">Max 3 projects can be featured on home page</p>
          </div>
        </motion.div>

        {/* Pinned Checkbox - For Projects Page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="flex items-center gap-3 p-4 bg-blue-900/20 border border-blue-800 rounded-lg"
        >
          <input
            type="checkbox"
            checked={formData.pinned}
            onChange={(e) => setFormData(prev => ({...prev, pinned: e.target.checked}))}
            className="w-5 h-5 rounded"
          />
          <div>
            <label className="text-white font-semibold block">Pinned (Show at Top of Projects)</label>
            <p className="text-gray-400 text-sm">Pinned projects appear first on the projects page</p>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader size={20} className="animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save size={20} />
              Update Project
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}