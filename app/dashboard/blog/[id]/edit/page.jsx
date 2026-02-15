'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Save, Loader, ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import ImageUpload from '../../../../components/ImageUpload';
import Link from 'next/link';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  // Fetch blog post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/admin/${postId}`);
        console.log('📝 Blog post loaded:', response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('Error loading post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('💾 Updating blog post:', formData);
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/blog/${postId}`, formData);
      console.log('✅ Blog post updated:', response.data);
      alert('Blog post updated successfully!');
      router.push('/dashboard/blog');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post');
    } finally {
      setSaving(false);
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
    console.log('🖼️ Featured image updated:', imageUrl);
    setFormData(prev => ({
      ...prev,
      featured_image: imageUrl,
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
        <Link href="/dashboard/blog">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </motion.button>
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-white mb-8">Edit Blog Post</h1>

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
            onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            required
          />
        </motion.div>

        {/* Slug */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-white font-semibold mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value}))}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            required
          />
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-white font-semibold mb-2">Featured Image</label>
          <ImageUpload 
            onImageUpload={handleFeaturedImageUpload} 
            multiple={false}
            initialImages={formData.featured_image ? [formData.featured_image] : []}
          />
          {formData.featured_image && (
            <div className="mt-4">
              <img
                src={formData.featured_image}
                alt="Featured"
                className="w-full h-48 object-cover rounded-lg border border-gray-800"
              />
            </div>
          )}
        </motion.div>

        {/* Excerpt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-white font-semibold mb-2">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({...prev, excerpt: e.target.value}))}
            rows="3"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-white font-semibold mb-2">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))}
            rows="12"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
            required
          />
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
          <label className="text-white font-semibold">Publish this post</label>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader size={20} className="animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save size={20} />
              Update Post
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}