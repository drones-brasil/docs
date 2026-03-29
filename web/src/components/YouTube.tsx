import React from 'react';

export type YouTubeProps = {
  id: string;
  title?: string;
};

export function YouTube({id, title}: YouTubeProps) {
  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
    id,
  )}?rel=0&modestbranding=1`;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        margin: '1rem 0',
      }}>
      <iframe
        src={src}
        title={title ?? 'YouTube video'}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          border: 0,
        }}
      />
    </div>
  );
}

