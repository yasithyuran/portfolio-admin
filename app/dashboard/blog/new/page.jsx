'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Save, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ImageUpload from '../../../components/ImageUpload';

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    tags: [],
    published: false,
  });
  const [tag, setTag] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50);
      
      console.log('💾 Creating blog post:', formData);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/blog`, {
        ...formData,
        slug,
      });
      console.log('✅ Blog post created:', response.data);
      router.push('/dashboard/blog');
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert('Error creating blog post');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTag('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleFeaturedImageUpload = (imageUrl) => {
    console.log('🖼️ Featured image uploaded:', imageUrl);
    setFormData(prev => ({
      ...prev,
      featured_image: imageUrl,
    }));
  };

  const handleTitleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: value.toLowerCase().replace(/\s+/g, '-').slice(0, 50),
    }));
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-8">Write New Blog Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-white font-semibold mb-2">Blog Post Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="How to Build a REST API with Node.js"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            required
          />
        </motion.div>

        {/* Slug (auto-generated) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-white font-semibold mb-2">Slug (Auto-generated)</label>
          <input
            type="text"
            value={formData.slug}
            readOnly
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 cursor-not-allowed"
          />
          <p className="text-gray-500 text-sm mt-1">Auto-generated from title. Used in URL.</p>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-white font-semibold mb-2">Featured Image (Thumbnail)</label>
          <ImageUpload 
            onImageUpload={handleFeaturedImageUpload} 
            multiple={false}
            initialImages={formData.featured_image ? [formData.featured_image] : []}
          />
          {formData.featured_image && (
            <div className="mt-4 relative">
              <img
                src={formData.featured_image}
                alt="Featured"
                className="w-full h-48 object-cover rounded-lg border border-gray-800"
              />
              <p className="text-green-400 text-sm mt-2">✓ Featured image uploaded</p>
            </div>
          )}
        </motion.div>

        {/* Excerpt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-white font-semibold mb-2">Excerpt (Short Description)</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({...prev, excerpt: e.target.value}))}
            placeholder="Brief summary of your blog post (shown in lists)..."
            rows="3"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
          <p className="text-gray-500 text-sm mt-1">Max 150 characters recommended</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-white font-semibold mb-2">Full Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))}
            placeholder="Write your full blog post content here. You can use markdown if needed..."
            rows="12"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
            required
          />
          <p className="text-gray-500 text-sm mt-1">
            Word count: {formData.content.split(/\s+/).filter(w => w.length > 0).length}
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-white font-semibold mb-2">Tags</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="e.g., JavaScript, Backend, Tutorial"
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Tag
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((t, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-2"
              >
                {t}
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="hover:text-purple-300"
                >
                  ×
                </button>
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Publish Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 rounded-lg"
        >
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData(prev => ({...prev, published: e.target.checked}))}
            className="w-5 h-5 rounded"
          />
          <label className="text-white font-semibold">
            Publish this post (make it visible on blog page)
          </label>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 transition"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Publishing Post...
            </>
          ) : (
            <>
              <Save size={20} />
              Publish Post
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}