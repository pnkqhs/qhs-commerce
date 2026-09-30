export default function Loading() {
  return (
    <div className="container section loading" aria-live="polite" aria-busy="true">
      <p>Đang tải nội dung...</p>
      <div className="skeleton" />
      <div className="product-grid">
        {[1, 2, 3, 4].map((i) => (
          <div className="skeleton" key={i} />
        ))}
      </div>
    </div>
  );
}
