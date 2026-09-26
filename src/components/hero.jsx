import MetallicPaint from "./MetallicPaint";
import logo from "../assets/2026 logo.svg";

export default function Hero() {
  return (
<section
  style={{
    position: 'fixed',
    top: '200px',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '360px',
    zIndex: -1
  }}
>
<MetallicPaint
  imageSrc={logo}

  // Pattern
  seed={0.317}
  scale={1.05}
  patternSharpness={20}
  noiseScale={0.08}

  // Animation
  speed={0.18}
  liquid={0.65}
  mouseAnimation={false}

  // Visual
  brightness={1.12}
  contrast={1.35}
  refraction={0.045}
  blur={0.006}
  chromaticSpread={1.6}
  fresnel={1.55}
  angle={50}
  waveAmplitude={1.1}
  distortion={0.9}
  contour={4}

  // Modern holographic palette
  lightColor="#E6F0FF"
  darkColor="#4A5DFF"
  tintColor="#B7FFEA"
/>
    </section>
  );
}
