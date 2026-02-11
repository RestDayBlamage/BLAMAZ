import MetallicPaint from "./MetallicPaint";
import logo from "../assets/2026 logo.svg";

export default function Hero() {
  return (
<section
  style={{
    position: 'fixed',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '400px',
    zIndex: -1
  }}
>
 <MetallicPaint
          imageSrc={logo}

          // Pattern
          seed={0.001}
          scale={15}
          patternSharpness={15}
          noiseScale={0.1}

          // Animation
          speed={0.22}
          liquid={0.78}
          mouseAnimation={false}

          // Visual
          brightness={1}
          contrast={1}
          refraction={0.018}
          blur={0.008}
          chromaticSpread={2.6}
          fresnel={1.4}
          angle={45}
          waveAmplitude={1.15}
          distortion={1.25}
          contour={0.22}

          // Colors
          lightColor="#f0f0f0"
          darkColor="#2d2d2d"
          tintColor="#f3c32b"
      />
    </section>
  );
}
