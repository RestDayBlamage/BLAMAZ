import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";

// Three.js ładuje się dopiero, gdy model zbliża się do ekranu
const ModelViewer = lazy(() => import("./ModelViewer"));

// Gdy model 3D się nie wczyta (brak WebGL, błąd sieci, uszkodzony plik .glb), zamiast pustego miejsca
// pokazujemy płaskie logo
class ModelErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

const fallbackLogo = (
  <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
    <img
      src={`${import.meta.env.BASE_URL}icons/logo-wordmark.webp`}
      alt="BLaMaZ"
      style={{ width: "min(60%, 420px)", height: "auto" }}
    />
  </div>
);

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
        <ModelErrorBoundary fallback={fallbackLogo}>
          <Suspense fallback={null}>
            <ModelViewer height={height} {...props} />
          </Suspense>
        </ModelErrorBoundary>
      )}
    </div>
  );
}
