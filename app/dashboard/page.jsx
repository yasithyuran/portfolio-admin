'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Mail, Settings, Loader, Star, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    blogPosts: 0,
    messages: 0,
    skills: 0,
  });
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const headers = { Authorization: `Bearer ${token}` };

        const [projectsRes, blogRes, messagesRes, featuredRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/contact`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects/featured`),
        ]);

        setStats({
          projects: projectsRes.data.length,
          blogPosts: blogRes.data.length,
          messages: messagesRes.data.length,
          skills: 12,
        });

        setFeaturedProjects(featuredRes.data);
        
        // Get last 5 messages, sorted by newest first
        const sortedMessages = messagesRes.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentMessages(sortedMessages);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900 border border-gray-800 rounded-lg p-6 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <Icon size={32} className="opacity-50" />
      </div>
    </motion.div>
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader size={48} className="text-blue-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Briefcase} label="Projects" value={stats.projects} color="border-blue-500" />
            <StatCard icon={FileText} label="Blog Posts" value={stats.blogPosts} color="border-purple-500" />
            <StatCard icon={Mail} label="Messages" value={stats.messages} color="border-green-500" />
            <StatCard icon={Settings} label="Skills" value={stats.skills} color="border-pink-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Projects Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-gray-900 border-2 border-yellow-500/50 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Star size={24} className="text-yellow-400" fill="currentColor" />
                  <h2 className="text-2xl font-bold text-white">Featured Projects ({featuredProjects.length}/3)</h2>
                </div>
                <Link href="/dashboard/projects">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                  >
                    Manage
                  </motion.button>
                </Link>
              </div>

              {featuredProjects.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No featured projects yet. Go to Projects to pin some!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredProjects.map((project, index) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-black border border-gray-800 rounded-lg overflow-hidden hover:border-yellow-500 transition group"
                    >
                      {/* Project Image */}
                      {project.thumbnail ? (
                        <div className="h-32 overflow-hidden bg-gray-800 relative">
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition"
                          />
                          <div className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs flex items-center gap-1">
                            <Star size={12} fill="currentColor" />
                            Featured
                          </div>
                        </div>
                      ) : (
                        <div className="h-32 bg-gray-800 flex items-center justify-center">
                          <p className="text-gray-500">No image</p>
                        </div>
                      )}

                      {/* Project Info */}
                      <div className="p-4">
                        <h3 className="text-white font-bold mb-1 line-clamp-1">{project.title}</h3>
                        <p className="text-gray-400 text-xs mb-2 line-clamp-1">{project.description}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                            {project.category}
                          </span>
                          <Link href={`/dashboard/projects/${project._id}/edit`}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <ExternalLink size={16} />
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recent Messages Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900 border-2 border-green-500/50 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MessageSquare size={24} className="text-green-400" />
                  <h2 className="text-2xl font-bold text-white">New Messages</h2>
                </div>
                <Link href="/dashboard/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                  >
                    View All
                  </motion.button>
                </Link>
              </div>

              {recentMessages.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No messages yet.
                </p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {recentMessages.map((message, index) => (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-black border border-gray-800 rounded-lg p-4 hover:border-green-500 transition"
                    >
                      {/* Sender Info */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-sm">{message.name}</h3>
                          <p className="text-gray-400 text-xs">{message.email}</p>
                        </div>
                        <span className="text-gray-500 text-xs whitespace-nowrap ml-2">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>

                      {/* Subject */}
                      {message.subject && (
                        <p className="text-gray-300 text-sm font-medium mb-2 line-clamp-1">
                          {message.subject}
                        </p>
                      )}

                      {/* Message Preview */}
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                        {truncateText(message.message, 150)}
                      </p>

                      {/* Action Button */}
                      <Link href="/dashboard/contact">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-3 py-2 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30 transition"
                        >
                          Reply
                        </motion.button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}