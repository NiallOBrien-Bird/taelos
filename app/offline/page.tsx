import Link from 'next/link';

export default function OfflinePage() {
  return (
    <main className="offline-page">
      <section className="offline-card" aria-labelledby="offline-title">
        <div className="offline-mark" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <p className="offline-kicker">Connection paused</p>
        <h1 id="offline-title">You’re offline</h1>
        <p>
          Dudu couldn’t reach the network. Your private tasks were not cached on
          this device; reconnect, then try again.
        </p>
        <Link href="/">Try again</Link>
      </section>
    </main>
  );
}
