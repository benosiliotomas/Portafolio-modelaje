import React, { useEffect, useRef, useState } from 'react';
import type { InstagramPost } from '../lib/instagram';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const EMBED_SCRIPT = 'https://www.instagram.com/embed.js';
let scriptPromise: Promise<void> | null = null;

function loadEmbedScript(): Promise<void> {
  if (window.instgrm) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = EMBED_SCRIPT;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error('No se pudo cargar el script de Instagram.'));
      };
      document.body.appendChild(script);
    });
  }
  return scriptPromise;
}

const LABELS: Record<InstagramPost['kind'], string> = { p: 'el posteo', reel: 'el reel', tv: 'el video' };

/**
 * Instagram's script replaces each blockquote with an iframe. React must never reconcile
 * those nodes, so the markup goes in through dangerouslySetInnerHTML; it is built only from
 * the parsed kind and shortcode ([\w-]+), never from the raw link.
 */
function embedMarkup(post: InstagramPost): string {
  return `<blockquote class="instagram-media" data-instgrm-permalink="${post.permalink}?utm_source=ig_embed" data-instgrm-version="14">`
    + `<a href="${post.permalink}" target="_blank" rel="noopener noreferrer">Ver ${LABELS[post.kind]} en Instagram →</a>`
    + '</blockquote>';
}

interface InstagramEmbedsProps {
  posts: InstagramPost[];
}

const InstagramEmbeds: React.FC<InstagramEmbedsProps> = ({ posts }) => {
  const containerRef = useRef<HTMLUListElement>(null);
  const [status, setStatus] = useState<'idle' | 'ready' | 'failed'>('idle');

  // The script and the iframes only load when the section gets close to the viewport.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || posts.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(e => e.isIntersecting)) return;
      observer.disconnect();
      loadEmbedScript()
        .then(() => {
          window.instgrm?.Embeds.process();
          setStatus('ready');
        })
        .catch((err: unknown) => {
          console.error('Instagram embeds unavailable:', err);
          setStatus('failed');
        });
    }, { rootMargin: '600px 0px' });

    observer.observe(container);
    return () => observer.disconnect();
  }, [posts.length]);

  return (
    <>
      <ul
        ref={containerRef}
        className="instagram-embeds list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
        aria-busy={status === 'idle'}
      >
        {posts.map(post => (
          <li key={post.shortcode} className="w-full max-w-[540px] mx-auto" dangerouslySetInnerHTML={{ __html: embedMarkup(post) }} />
        ))}
      </ul>
      {status === 'failed' && (
        <p className="eyebrow text-ash mt-6 mb-0">Instagram no se pudo cargar acá: abrí cada publicación con su enlace.</p>
      )}
    </>
  );
};

export default InstagramEmbeds;
