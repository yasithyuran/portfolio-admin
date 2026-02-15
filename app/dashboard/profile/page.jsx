'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Save, Loader, Plus, Trash2 } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [newSkill, setNewSkill] = useState({ skill: '', percentage: 80 });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`);
      setProfile(response.data);
      console.log('📌 Fetched profile:', response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAchievementChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      achievements: {
        ...prev.achievements,
        [field]: parseInt(value) || 0,
      },
    }));
  };

  const handleHeroImageUpload = (imageUrl) => {
    setProfile(prev => ({
      ...prev,
      heroImage: imageUrl,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('💾 Saving profile:', profile);
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/profile`, profile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.skill.trim()) {
      const updatedTechStack = [...(profile.techStack || []), newSkill];
      setProfile(prev => ({
        ...prev,
        techStack: updatedTechStack,
      }));
      
      console.log('✅ Added skill to profile:', newSkill);
      setNewSkill({ skill: '', percentage: 80 });
      alert('Skill added! Click "Save Profile" to save it.');
    }
  };

  const removeSkill = (index) => {
    const updatedTechStack = (profile.techStack || []).filter((_, i) => i !== index);
    setProfile(prev => ({
      ...prev,
      techStack: updatedTechStack,
    }));
    
    console.log('✅ Removed skill from profile');
  };

  if (loading || !profile) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size={48} className="text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-8">Profile & Tech Stack</h1>

      <form onSubmit={handleProfileSubmit} className="space-y-8">
        {/* Hero Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Hero Image</h2>
          <label className="block text-white font-semibold mb-2">Upload Your Hero Image</label>
          <ImageUpload 
            onImageUpload={handleHeroImageUpload} 
            multiple={false}
            initialImages={profile.heroImage ? [profile.heroImage] : []}
          />
          {profile.heroImage && (
            <div className="mt-4">
              <img
                src={profile.heroImage}
                alt="Hero"
                className="w-full h-48 object-cover rounded-lg border border-gray-800"
              />
            </div>
          )}
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Your Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2">Name</label>
              <input
                type="text"
                value={profile.profile?.name || ''}
                onChange={(e) => handleProfileChange('profile', {...profile.profile, name: e.target.value})}
                className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Title</label>
              <input
                type="text"
                value={profile.profile?.title || ''}
                onChange={(e) => handleProfileChange('profile', {...profile.profile, title: e.target.value})}
                className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Bio</label>
              <textarea
                value={profile.profile?.bio || ''}
                onChange={(e) => handleProfileChange('profile', {...profile.profile, bio: e.target.value})}
                rows="4"
                className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Email</label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Projects Completed</label>
              <input
                type="number"
                value={profile.achievements?.projectsCompleted || 0}
                onChange={(e) => handleAchievementChange('projectsCompleted', e.target.value)}
                className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Happy Clients</label>
              <input
                type="number"
                value={profile.achievements?.happyClients || 0}
                onChange={(e) => handleAchievementChange('happyClients', e.target.value)}
                className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Years Experience</label>
              <input
                type="number"
                value={profile.achievements?.yearsExperience || 0}
                onChange={(e) => handleAchievementChange('yearsExperience', e.target.value)}
                className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Tech Stack Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Tech Stack</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">Skill Name</label>
              <input
                type="text"
                value={newSkill.skill}
                onChange={(e) => setNewSkill({...newSkill, skill: e.target.value})}
                placeholder="e.g., React"
                className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Proficiency: {newSkill.percentage}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={newSkill.percentage}
                onChange={(e) => setNewSkill({...newSkill, percentage: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>

            <motion.button
              type="button"
              onClick={addSkill}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Plus size={20} />
              Add Skill
            </motion.button>
          </div>

          <div className="space-y-2">
            {profile.techStack && profile.techStack.length > 0 ? (
              profile.techStack.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-black border border-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-white font-semibold">{skill.skill}</p>
                    <div className="w-full bg-gray-800 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{width: `${skill.percentage}%`}}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-4 text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No skills added yet.</p>
            )}
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
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Profile
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}