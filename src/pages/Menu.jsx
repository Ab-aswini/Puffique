import { useState, useEffect } from 'react';
import { fetchProducts, resolveImagePath } from '../utils/api';

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const getProductImage = (product) => {
    if (product.image) return product.image;
    const fallbacks = { 'Bun Maska':'/products/bun-maska.png', 'Chai':'/products/mocha drink..png', 'Cheesecake':'/products/cheese cake.png' };
    return resolveImagePath(fallbacks[product.type] || '/products/bun-maska.png');
  };

  return (
    <section className="section" style={{ paddingTop: '120px' }}>
      <h1 className="section-title">Our Menu</h1>
      <p className="section-subtitle">We don't just bake — we engineer textures. Each product is a masterclass in craft.</p>

      {loading ? (
        <p style={{ color: 'var(--color-gold)' }}>Loading menu...</p>
      ) : (
        <div className="grid-3">
          {products.map(product => (
            <div className="card" key={product.id}>
              <div style={{ height: '240px', background: 'var(--color-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  style={{ maxHeight: '200px', objectFit: 'contain', filter: product.isOutOfStock ? 'grayscale(1) opacity(0.5)' : 'none' }}
                />
              </div>
              <div className="card-body">
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{product.name}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px', minHeight: '45px' }}>
                  {product.desc}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-gold)', fontSize: '1.3rem', fontWeight: '700' }}>₹{product.price}</span>
                  {product.isOutOfStock
                    ? <span className="tag tag-oos">Out of Stock</span>
                    : <span className="tag tag-available">Available</span>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
