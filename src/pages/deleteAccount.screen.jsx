import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { AlertTriangle, Trash2, XCircle, Info, ArrowLeft } from 'lucide-react';
import COLORS from '../theme/colors';
import { clearAuthToken, redirectToLogin } from '../lib/auth';
import DELETE_ACCOUNT from '../graphql/mutations/deleteAccount.mutation';

const CONSEQUENCES = [
  'Your account will be permanently deleted',
  'All your flashcards and progress will be removed',
  'Your SRS learning history will be lost',
  'You will be signed out immediately',
];

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [deleteAccount] = useMutation(DELETE_ACCOUNT);

  const performDelete = async () => {
    setIsDeleting(true);
    setErrorMessage('');
    try {
      const userId = localStorage.getItem('userId') || '';
      const { data } = await deleteAccount({
        variables: { userId },
      });

      if (data?.deleteAccount?.success) {
        clearAuthToken();
        if (!redirectToLogin()) {
          navigate('/');
        }
      } else {
        setErrorMessage(
          data?.deleteAccount?.errorMessage || 'Failed to delete account',
        );
      }
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      'This action cannot be undone. Are you absolutely sure?',
    );
    if (confirmed) {
      performDelete();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <button
        onClick={() => navigate('/dashboard/settings')}
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
        style={{ color: COLORS.textSecondary }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to settings
      </button>

      <div className="flex flex-col items-center text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundColor: COLORS.warningSoft }}
        >
          <AlertTriangle
            className="w-10 h-10"
            style={{ color: COLORS.accentDanger }}
          />
        </div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: COLORS.textPrimary }}
        >
          Delete Your Account
        </h1>
        <p style={{ color: COLORS.textSecondary }}>
          This action is permanent and cannot be undone.
        </p>
      </div>

      <div
        className="p-6 rounded-2xl shadow-lg"
        style={{ backgroundColor: COLORS.surface }}
      >
        <h2
          className="text-base font-semibold mb-4"
          style={{ color: COLORS.textPrimary }}
        >
          What will happen:
        </h2>
        <ul className="space-y-3">
          {CONSEQUENCES.map((text) => (
            <li key={text} className="flex items-center gap-3">
              <XCircle
                className="w-5 h-5 flex-shrink-0"
                style={{ color: COLORS.accentDanger }}
              />
              <span
                className="text-sm"
                style={{ color: COLORS.textSecondary }}
              >
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="p-4 rounded-xl flex items-center gap-3"
        style={{ backgroundColor: COLORS.warningSoft }}
      >
        <Info
          className="w-6 h-6 flex-shrink-0"
          style={{ color: COLORS.accentWarning }}
        />
        <p className="text-sm" style={{ color: COLORS.textSecondary }}>
          If you just want to take a break, consider logging out instead. Your
          progress will be saved.
        </p>
      </div>

      {errorMessage ? (
        <div
          className="p-4 rounded-xl text-sm"
          style={{
            backgroundColor: COLORS.warningSoft,
            color: COLORS.accentDanger,
          }}
        >
          {errorMessage}
        </div>
      ) : null}

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none"
        style={{
          backgroundColor: COLORS.accentDanger,
          boxShadow: '0 14px 30px rgba(238, 93, 103, 0.25)',
        }}
      >
        {isDeleting ? (
          'Deleting...'
        ) : (
          <>
            <Trash2 className="w-5 h-5" />
            Delete My Account
          </>
        )}
      </button>

      <button
        onClick={() => navigate('/dashboard/settings')}
        disabled={isDeleting}
        className="w-full py-4 font-semibold transition-colors disabled:opacity-50"
        style={{ color: COLORS.textSecondary }}
      >
        Cancel
      </button>
    </div>
  );
}
