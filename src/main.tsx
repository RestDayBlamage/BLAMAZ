import { createRoot } from "react-dom/client"

import "@fontsource/space-mono/400.css"
import "./styles/global.css"
import App from "./App.tsx"
import { startPreloaderFallback } from "./utils/preloader"

// Ekran ładowania znika, gdy model w hero jest gotowy (HeroSection) – awaryjnie po 10 s
startPreloaderFallback()

// Bez StrictMode: podwójne montowanie w dev niszczy kontekst WebGL modelu 3D (react-three-fiber)
createRoot(document.getElementById("root")!).render(<App />)
