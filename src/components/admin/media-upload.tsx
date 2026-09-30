'use client';
import { useState } from 'react';
export function MediaUpload() {
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setUrl('');
    setMessage('');
    const form = new FormData(e.currentTarget);
    try {
      const r = await fetch('/api/media', { method: 'POST', body: form });
      const data = await r.json();
      if (!r.ok) setMessage(data.error);
      else setUrl(data.url);
    } catch {
      setMessage('Không thể tải tệp. Vui lòng thử lại.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="form-card" onSubmit={submit}>
      <label>
        Thư mục
        <select name="bucket">
          <option value="products">Sản phẩm</option>
          <option value="posts">Bài viết</option>
          <option value="projects">Dự án</option>
          <option value="documents">Tài liệu PDF</option>
        </select>
      </label>
      <label>
        Tệp (ảnh tối đa 5 MB, PDF tối đa 10 MB)
        <input
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          required
        />
      </label>
      <button className="button button-primary" disabled={busy}>
        {busy ? 'Đang tải...' : 'Tải lên'}
      </button>
      {message && (
        <p role="alert" className="notice">
          {message}
        </p>
      )}
      {url && (
        <label>
          URL đã tải lên — sao chép vào trình biên tập
          <input value={url} readOnly onFocus={(e) => e.currentTarget.select()} />
        </label>
      )}
    </form>
  );
}
