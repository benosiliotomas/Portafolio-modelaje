import React, { useEffect, useRef, useState } from 'react';
import { embedGridClass, embedUrl, parseMeasureMessage } from '../lib/instagram';
import type { InstagramPost } from '../lib/instagram';

const INSTAGRAM_ORIGIN = 'https://www.instagram.com';
const LABELS: Record<InstagramPost['kind'], string> = { p: 'el posteo', reel: 'el reel', tv: 'el video' };

/**
 * One post, embedded with Instagram's own embed page in an iframe we insert ourselves.
 * Instagram's embed.js would do the same, but it waits about ten seconds before inserting the
 * iframes; going direct, a reel shows up in under a second. The page tells us its height through
 * a MEASURE message, so the frame grows to fit without the script.
 */
const InstagramEmbed: React.FC<{ post: InstagramPost }> = ({ post }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== INSTAGRAM_ORIGIN || event.source !== frameRef.current?.contentWindow) return;
      const measured = parseMeasureMessage(event.data);
      if (measured) setHeight(measured);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const isReady = height !== null;

  return (
    <li className="relative w-full max-w-[420px] mx-auto">
      {/* Placeholder at a reel's proportions until Instagram reports the real height; it also
          keeps a working link if the embed never loads (e.g. blocked by an extension). */}
      {!isReady && (
        <div className="aspect-[4/7] flex items-end bg-surface border border-hairline">
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow block w-full p-4 text-ink hover:text-clay transition-colors duration-150"
          >
            Ver {LABELS[post.kind]} en Instagram →
          </a>
        </div>
      )}
      <iframe
        ref={frameRef}
        src={embedUrl(post)}
        title={`${LABELS[post.kind][0].toUpperCase()}${LABELS[post.kind].slice(1)} de Instagram`}
        loading="lazy"
        allow="encrypted-media; picture-in-picture; clipboard-write"
        allowFullScreen
        scrolling="no"
        style={isReady ? { height } : undefined}
        className={`w-full bg-surface border border-hairline transition-opacity duration-300 ${isReady
          ? 'block opacity-100'
          : 'absolute inset-0 h-full opacity-0 pointer-events-none'
          }`}
      />
    </li>
  );
};

interface InstagramEmbedsProps {
  posts: InstagramPost[];
}

const InstagramEmbeds: React.FC<InstagramEmbedsProps> = ({ posts }) => (
  <ul className={`list-none p-0 m-0 grid gap-6 items-start ${embedGridClass(posts.length)}`}>
    {posts.map(post => <InstagramEmbed key={post.shortcode} post={post} />)}
  </ul>
);

export default InstagramEmbeds;
