import React, { useContext } from 'react';
import { AuthContext } from '@/App';
import { User, Mail, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen" data-testid="profile-page">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold luxury-text mb-8" style={{fontFamily: 'Playfair Display'}} data-testid="profile-title">
          My Profile
        </h1>

        <div className="glass-effect p-8 rounded-2xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 luxury-gradient rounded-full flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1" data-testid="profile-name">{user?.name}</h2>
              <p className="text-gray-600" data-testid="profile-email">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
              <Mail size={24} className="text-[#8b4513]" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{user?.email}</p>
              </div>
            </div>

            {user?.is_admin && (
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
                <Shield size={24} className="text-[#8b4513]" />
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-semibold">Administrator</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;