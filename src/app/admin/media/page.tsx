import { MediaUpload } from '@/components/admin/media-upload';
export default function Page() {
  return (
    <>
      <div className="admin-heading">
        <h1>Thư viện media</h1>
      </div>
      <p>
        Ảnh và tài liệu trong các bucket này có thể truy cập công khai. Chỉ tải nội dung đã được
        duyệt để xuất bản.
      </p>
      <MediaUpload />
    </>
  );
}
