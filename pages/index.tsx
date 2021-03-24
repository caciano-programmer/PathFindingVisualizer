import Link from 'next/link';

export default function Home() {
  return (
    <div className="app-container">
      <Link href="/path">
        <a>Path</a>
      </Link>
      <Link href="/nodes">
        <a>Nodes</a>
      </Link>
    </div>
  );
}
