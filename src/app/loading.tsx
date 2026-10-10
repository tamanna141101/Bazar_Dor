export default function Loading() {
  return (
    <div className="container loading-page">
      <div className="skeleton hero-skeleton" />
      <div className="skeleton-title" />
      <div className="product-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <div className="skeleton product-skeleton" key={i} />
        ))}
      </div>
    </div>
  );
}
