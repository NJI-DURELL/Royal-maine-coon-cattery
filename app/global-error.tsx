'use client';

// Last-resort boundary: catches errors thrown in the root layout itself, so it
// must render its own <html>/<body>. Falls back to inline styles since the app
// chrome (and possibly global CSS) may have failed to load.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#fdf7e8',
          color: '#0f172a'
        }}
      >
        <div style={{ maxWidth: 480, padding: 40, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Royal Maine Coon Cattery</h1>
          <p style={{ color: '#475569', marginBottom: 24 }}>
            The site hit a critical error. Please try again in a moment.
          </p>
          <button
            onClick={reset}
            style={{
              border: 'none',
              borderRadius: 9999,
              background: '#d4af37',
              color: '#fff',
              padding: '12px 24px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
