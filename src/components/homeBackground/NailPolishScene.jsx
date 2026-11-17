export default function NailPolishScene() {
  return (
    <div className="home-scene home-scene-polish" aria-hidden="true">
      <div className="home-bg-media-wrap gsap-bg-media-1">
        <video
          className="home-bg-video"
          src="/fondo1.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>
      <div className="home-bg-depth-glow gsap-bg-depth-glow-1" />
      <div className="home-bg-contrast-veil veil-scene-1" />
    </div>
  );
}
