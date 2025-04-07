import React, { useEffect, useRef, useState } from 'react';
import './InfiniteScroll.css';

interface InfiniteScrollProps {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  children: React.ReactNode;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  hasMore,
  isLoading,
  children
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const loadMoreContent = async () => {
      if (isIntersecting && hasMore && !isLoading) {
        await onLoadMore();
      }
    };

    loadMoreContent();
  }, [isIntersecting, hasMore, isLoading, onLoadMore]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    observer.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsIntersecting(entry.isIntersecting);
    }, options);

    const currentObserver = observer.current;
    const sentinel = document.querySelector('.sentinel');

    if (sentinel) {
      currentObserver.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        currentObserver.unobserve(sentinel);
      }
    };
  }, []);

  return (
    <div className="infinite-scroll-container">
      {children}
      <div className="sentinel" />
      {isLoading && (
        <div className="loading-more">
          <div className="spinner-small"></div>
          <p>Loading more drinks...</p>
        </div>
      )}
      {!hasMore && (
        <div className="no-more-content">
          <p>No more drinks to load</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll; 