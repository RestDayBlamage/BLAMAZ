import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"

// Bez StrictMode: podwójne montowanie w dev niszczy kontekst WebGL modelu 3D (react-three-fiber)
createRoot(document.getElementById("root")!).render(<App />)
