import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { CloseIcon } from '../components/icons';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(password);
    setIsLoading(false);

    if (success) {
      onClose();
    } else {
      setError('Contraseña incorrecta o error de conexión.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-sm p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 z-10 p-1 transition-colors"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl text-center text-ink mb-6 font-display">Acceso Galería</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 font-mono">Contraseña de Administrador</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="mt-1 block w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-neutral-900 transition-all font-mono"
              disabled={isLoading}
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold uppercase tracking-widest text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 disabled:bg-neutral-300 disabled:text-neutral-500 transition-all duration-300"
          >
            {isLoading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
