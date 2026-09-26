import { lazy, Suspense, useEffect, useRef, useState } from "react";

// Three.js ładuje się dopiero, gdy model zbliża się do ekranu
const ModelViewer = lazy(() => import("./ModelViewer"));

export default function LazyModel({ height = "560px", ...props }) {
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
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ height, width: "100%" }}>
      {visible && (
        <Suspense fallback={null}>
          <ModelViewer height={height} {...props} />
        </Suspense>
      )}
    </div>
  );
}
