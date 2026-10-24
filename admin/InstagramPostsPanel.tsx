import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from '../components/icons';
import { parseInstagramUrl } from '../lib/instagram';
import { addPost, movePost, removePost, resolvePostLinks } from '../lib/instagramList';
import type { SavedPosts } from '../lib/instagramList';
import { subscribeToInstagramPosts, saveInstagramPosts } from '../services/instagramService';
import { ugc } from '../data/ugc';

const KIND_LABELS = { p: 'Posteo', reel: 'Reel', tv: 'Video' } as const;
const iconButton = 'p-2 text-stone border border-hairline hover:bg-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150';

const InstagramPostsPanel: React.FC = () => {
  const [saved, setSaved] = useState<SavedPosts | null>(null);
  const [link, setLink] = useState('');
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null);

  useEffect(() => subscribeToInstagramPosts(setSaved), []);

  const posts = saved ? resolvePostLinks(saved, ugc.defaultInstagramPosts) : [];

  const save = async (next: string[], okText: string) => {
    setIsSaving(true);
    setMessage(null);
    try {
      await saveInstagramPosts(next);
      setMessage({ kind: 'ok', text: okText });
    } catch (err: unknown) {
      console.error('Failed to save Instagram posts:', err);
      setMessage({ kind: 'error', text: 'No se pudo guardar. Revisá la conexión o las reglas de Firestore.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = addPost(posts, link, position);
    if (result.error) {
      setMessage({ kind: 'error', text: result.error });
      return;
    }
    await save(result.list, 'Posteo agregado.');
    setLink('');
  };

  const handleRemove = (index: number) => {
    if (window.confirm('¿Quitar este posteo de la página? En Instagram no cambia nada.')) {
      save(removePost(posts, index), 'Posteo quitado.');
    }
  };

  return (
    <div className="mt-12 pt-10 border-t border-hairline">
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <h3 className="eyebrow text-stone m-0">Posteos de Instagram · Página Contenido</h3>
        <a href="/contenido" target="_blank" rel="noopener noreferrer" className="eyebrow text-ash hover:text-ink">Ver página ↗</a>
      </div>

      <form onSubmit={handleAdd} className="space-y-4">
        <label className="block">
          <span className="eyebrow text-ash">Link del posteo o reel (botón Compartir → Copiar enlace)</span>
          <input
            type="url"
            inputMode="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://www.instagram.com/reel/…"
            className="mt-2 block w-full px-0 py-2 bg-transparent border-0 border-b border-hairline focus:border-ink focus:outline-none text-ink"
            disabled={isSaving}
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <fieldset className="border-0 p-0 m-0 flex gap-6">
            <legend className="sr-only">Dónde agregarlo</legend>
            {(['top', 'bottom'] as const).map(option => (
              <label key={option} className="eyebrow text-ink flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="instagram-position"
                  checked={position === option}
                  onChange={() => setPosition(option)}
                  disabled={isSaving}
                  className="accent-[var(--color-ink)]"
                />
                {option === 'top' ? 'Al principio' : 'Al final'}
              </label>
            ))}
          </fieldset>
          <button
            type="submit"
            disabled={isSaving || !link.trim() || saved === null}
            className="eyebrow text-ink border-b border-ink pb-1 hover:text-clay hover:border-clay disabled:text-ash disabled:border-hairline disabled:cursor-not-allowed"
          >
            {isSaving ? 'Guardando…' : 'Agregar'}
          </button>
        </div>
      </form>

      {message && (
        <p role={message.kind === 'error' ? 'alert' : 'status'} className={`text-sm mt-4 mb-0 ${message.kind === 'error' ? 'text-clay' : 'text-stone'}`}>
          {message.text}
        </p>
      )}

      {saved === null ? (
        <p className="eyebrow text-ash mt-8 mb-0">Cargando…</p>
      ) : saved.status === 'error' ? (
        <p role="alert" className="text-sm text-clay mt-8 mb-0">No se pudo leer la lista de posteos.</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-stone mt-8 mb-0">No hay posteos. La página muestra "Te mando ejemplos según tu rubro".</p>
      ) : (
        <ol className="list-none p-0 mt-8 mb-0 border-t border-hairline">
          {posts.map((url, index) => {
            const post = parseInstagramUrl(url);
            return (
              <li key={url} className="flex items-center gap-4 py-3 border-b border-hairline">
                <span className="eyebrow text-ash w-6">{String(index + 1).padStart(2, '0')}</span>
                <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 text-ink text-[15px] truncate hover:text-clay">
                  {post ? `${KIND_LABELS[post.kind]} · ${post.shortcode}` : url}
                </a>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => save(movePost(posts, index, -1), 'Orden guardado.')} disabled={isSaving || index === 0} className={iconButton} aria-label="Subir" title="Subir">
                    <ChevronLeftIcon className="h-4 w-4 rotate-90" />
                  </button>
                  <button onClick={() => save(movePost(posts, index, 1), 'Orden guardado.')} disabled={isSaving || index === posts.length - 1} className={iconButton} aria-label="Bajar" title="Bajar">
                    <ChevronRightIcon className="h-4 w-4 rotate-90" />
                  </button>
                  <button onClick={() => handleRemove(index)} disabled={isSaving} className={`${iconButton} text-clay`} aria-label="Quitar" title="Quitar">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {saved?.status === 'missing' && posts.length > 0 && (
        <p className="eyebrow text-ash mt-4 mb-0">Lista inicial: se guarda en la nube con tu primer cambio.</p>
      )}
    </div>
  );
};

export default InstagramPostsPanel;
