import { Suspense, useEffect, useRef, useState } from "react";

// Montuje ciężki komponent (np. mapę z Leafletem) dopiero, gdy zbliża się do ekranu.
// Do tego czasu stoi placeholder o podanej wysokości, żeby układ strony nie skakał.
export default function LazyMount({ children, minHeight = 560, rootMargin = "600px" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  const placeholder = <div className="skeleton" style={{ minHeight }} aria-hidden="true" />;

  return <div ref={ref}>{visible ? <Suspense fallback={placeholder}>{children}</Suspense> : placeholder}</div>;
}
