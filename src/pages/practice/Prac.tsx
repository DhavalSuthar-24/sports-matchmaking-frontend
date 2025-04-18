import { useState, useEffect, useRef } from 'react';

export default function Prac() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const selectRef = useRef();

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    
    const newItems = await fetchItems(page);
    setItems(prev => [...prev, ...newItems]);
    setPage(p => p + 1);
    setLoading(false);
  };

  const handleScroll = (e) => {
    const element = e.target;
    // Calculate how far we've scrolled (0-1)
    const scrollRatio = element.scrollTop / (element.scrollHeight - element.clientHeight);
    
    // Load more when 90% scrolled
    if (scrollRatio > 0.9) {
      loadMore();
    }
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <select 
      ref={selectRef}
      onScroll={handleScroll}
      multiple
      size={10} // Important for scroll to work
      style={{ height: '300px', width: '300px' }}
    >
      {items.map(item => (
        <option key={item.id} value={item.id}>
          {item.label}
        </option>
      ))}
      {loading && <option disabled>Loading more...</option>}
    </select>
  );
}