import {
  User,
  Award,
  Shield,
  Bell,
  Mail,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import COLORS from '../theme/colors';

export default function Settings() {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [settings, setSettings] = useState({
    studyReminders: true,
    emailUpdates: false,
    darkMode: false,
  });

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || 'user@bundai.com';
    const name = localStorage.getItem('userName') || 'User';
    setUserEmail(email);
    setUserName(name);
  }, []);

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: COLORS.textPrimary }}
        >
          Settings
        </h1>
        <p style={{ color: COLORS.textSecondary }}>
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div
        className="p-8 rounded-2xl shadow-lg"
        style={{ backgroundColor: COLORS.surface }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
            style={{
              background: `linear-gradient(135deg, ${COLORS.brandPrimary} 0%, ${COLORS.brandPrimaryDark} 100%)`,
            }}
          >
            <span
              className="font-bold text-4xl"
              style={{ color: COLORS.surface }}
            >
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: COLORS.textPrimary }}
          >
            {userName}
          </h2>
          <p style={{ color: COLORS.textMuted }}>{userEmail}</p>
        </div>

        <div className="flex justify-center space-x-4"></div>
      </div>
    </div>
  );
}
