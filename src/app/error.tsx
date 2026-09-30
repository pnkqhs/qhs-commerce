'use client';
import Link from 'next/link';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="container section empty">
      <h1>Không thể tải nội dung lúc này</h1>
      <p>Vui lòng thử lại sau. Thông tin của bạn chưa bị thay đổi.</p>
      <button onClick={reset} className="button button-primary">
        Thử lại
      </button>
      <Link className="button button-outline" href="/">
        Về trang chủ
      </Link>
    </main>
  );
}
