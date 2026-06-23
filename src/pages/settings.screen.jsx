import {
  User,
  Award,
  Shield,
  Bell,
  Mail,
  Moon,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import COLORS from '../theme/colors';

export default function Settings() {
  const navigate = useNavigate();
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

      {/* Danger Zone */}
      <section>
        <h3
          className="text-2xl font-bold mb-4"
          style={{ color: COLORS.textPrimary }}
        >
          Danger Zone
        </h3>
        <button
          onClick={() => navigate('/dashboard/delete-account')}
          className="w-full p-6 flex items-center justify-between rounded-2xl shadow-lg transition-colors"
          style={{
            backgroundColor: COLORS.surface,
            border: `1px solid ${COLORS.accentDanger}`,
          }}
        >
          <div className="flex items-center space-x-4">
            <Trash2
              className="w-6 h-6"
              style={{ color: COLORS.accentDanger }}
            />
            <div className="text-left">
              <div
                className="font-medium text-lg"
                style={{ color: COLORS.textPrimary }}
              >
                Delete account
              </div>
              <div
                className="text-sm"
                style={{ color: COLORS.textSecondary }}
              >
                Permanently remove your account and all data
              </div>
            </div>
          </div>
          <ChevronRight
            className="w-6 h-6"
            style={{ color: COLORS.textMuted }}
          />
        </button>
      </section>
    </div>
  );
}
