'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Loader, Star, Pin } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
      setAllProjects(response.data);
      console.log('✅ All projects loaded:', response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredProjects = allProjects.filter(p => p.featured);
  const pinnedProjects = allProjects.filter(p => p.pinned);
  const regularProjects = allProjects.filter(p => !p.featured && !p.pinned);

  const deleteProject = async (id) => {
    if (!confirm('Are you sure?')) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`);
      setAllProjects(allProjects.filter(p => p._id !== id));
      alert('Project deleted!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  const toggleFeatured = async (projectId, currentFeatured) => {
    if (!currentFeatured && featuredProjects.length >= 3) {
      alert('You can only have 3 featured projects. Remove one first!');
      return;
    }

    setToggling({ id: projectId, type: 'featured' });
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
        { featured: !currentFeatured }
      );
      
      setAllProjects(allProjects.map(p => 
        p._id === projectId ? { ...p, featured: !currentFeatured } : p
      ));
      
      console.log(`✅ Project ${projectId} featured status toggled`);
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('Error updating project');
    } finally {
      setToggling(null);
    }
  };

  const togglePinned = async (projectId, currentPinned) => {
    setToggling({ id: projectId, type: 'pinned' });
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
        { pinned: !currentPinned }
      );
      
      setAllProjects(allProjects.map(p => 
        p._id === projectId ? { ...p, pinned: !currentPinned } : p
      ));
      
      console.log(`✅ Project ${projectId} pinned status toggled`);
    } catch (error) {
      console.error('Error toggling pinned:', error);
      alert('Error updating project');
    } finally {
      setToggling(null);
    }
  };

  const ProjectRow = ({ project }) => (
    <tr 
      key={project._id}
      className="border-b border-gray-800 hover:bg-gray-900/50"
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          {project.thumbnail && (
            <img 
              src={project.thumbnail} 
              alt={project.title} 
              className="w-12 h-12 object-cover rounded border border-gray-800"
            />
          )}
          <div>
            <p className="text-white font-semibold">{project.title}</p>
            <p className="text-gray-400 text-sm">{project.category}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex gap-2">
          {project.featured && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-semibold flex items-center gap-1">
              <Star size={12} fill="currentColor" />
              Featured
            </span>
          )}
          {project.pinned && (
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold flex items-center gap-1">
              <Pin size={12} fill="currentColor" />
              Pinned
            </span>
          )}
        </div>
      </td>
      <td className="py-4 px-6 flex gap-2">
        <motion.button
          onClick={() => toggleFeatured(project._id, project.featured)}
          disabled={toggling?.id === project._id && toggling?.type === 'featured'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded transition ${
            project.featured 
              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          } ${toggling?.id === project._id && toggling?.type === 'featured' ? 'opacity-50' : ''}`}
          title={project.featured ? 'Remove from featured' : 'Add to featured (max 3)'}
        >
          <Star size={18} fill={project.featured ? 'currentColor' : 'none'} />
        </motion.button>
        
        <motion.button
          onClick={() => togglePinned(project._id, project.pinned)}
          disabled={toggling?.id === project._id && toggling?.type === 'pinned'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded transition ${
            project.pinned 
              ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          } ${toggling?.id === project._id && toggling?.type === 'pinned' ? 'opacity-50' : ''}`}
          title={project.pinned ? 'Unpin from top' : 'Pin to top of projects page'}
        >
          <Pin size={18} fill={project.pinned ? 'currentColor' : 'none'} />
        </motion.button>
      </td>
      <td className="py-4 px-6 flex gap-3">
        <Link href={`/dashboard/projects/${project._id}/edit`}>
          <button className="text-blue-400 hover:text-blue-300 transition">
            <Edit2 size={18} />
          </button>
        </Link>
        <button 
          onClick={() => deleteProject(project._id)}
          className="text-red-400 hover:text-red-300 transition"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Projects</h1>
        <Link href="/dashboard/projects/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            Add Project
          </motion.button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader size={48} className="text-blue-400 animate-spin" />
        </div>
      ) : allProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No projects yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pinned Projects Section */}
          {pinnedProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border-2 border-blue-500/50 rounded-lg p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Pin size={24} className="text-blue-400" fill="currentColor" />
                <h2 className="text-2xl font-bold text-white">
                  Pinned Projects ({pinnedProjects.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-4 px-6 text-gray-400">Project</th>
                      <th className="text-left py-4 px-6 text-gray-400">Status</th>
                      <th className="text-left py-4 px-6 text-gray-400">Actions</th>
                      <th className="text-left py-4 px-6 text-gray-400">Edit/Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pinnedProjects.map((project) => (
                      <ProjectRow key={project._id} project={project} />
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Featured Projects Section */}
          {featuredProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border-2 border-yellow-500/50 rounded-lg p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Star size={24} className="text-yellow-400" fill="currentColor" />
                <h2 className="text-2xl font-bold text-white">
                  Featured Projects ({featuredProjects.length}/3)
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-4 px-6 text-gray-400">Project</th>
                      <th className="text-left py-4 px-6 text-gray-400">Status</th>
                      <th className="text-left py-4 px-6 text-gray-400">Actions</th>
                      <th className="text-left py-4 px-6 text-gray-400">Edit/Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featuredProjects.map((project) => (
                      <ProjectRow key={project._id} project={project} />
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* All Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              All Projects ({allProjects.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-6 text-gray-400">Project</th>
                    <th className="text-left py-4 px-6 text-gray-400">Status</th>
                    <th className="text-left py-4 px-6 text-gray-400">Actions</th>
                    <th className="text-left py-4 px-6 text-gray-400">Edit/Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {allProjects.map((project) => (
                    <ProjectRow key={project._id} project={project} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}