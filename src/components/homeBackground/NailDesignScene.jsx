export default function NailDesignScene() {
  return (
    <div className="home-scene home-scene-hands" aria-hidden="true">
      <div className="home-bg-media-wrap gsap-bg-media-2">
        <video
          className="home-bg-video"
          src="/fondo2.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>
      <div className="home-bg-depth-glow gsap-bg-depth-glow-2" />
      <div className="home-bg-contrast-veil veil-scene-2" />
    </div>
  );
}
