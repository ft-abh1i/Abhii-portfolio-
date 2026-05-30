export default function Loader({ progress, phase }) {
  return (
    <div className={`loader ${phase === 'hidden' ? 'loader-hidden' : ''}`}>
      <div className="loader-marquee loader-marquee-top" aria-hidden="true">
        <div className="loader-marquee-track loader-left-to-right">
          <span>FULL STACK DEVELOPER</span><span>FULL STACK DEVELOPER</span><span>FULL STACK DEVELOPER</span><span>FULL STACK DEVELOPER</span>
        </div>
      </div>
      <div className="loader-center">
        <div className="loader-count">{String(progress).padStart(2, '0')}</div>
        <div className="loader-bar"><span style={{ width: `${progress}%` }} /></div>
        <div className="loader-caption">Preloading Portfolio</div>
      </div>
      <div className="loader-marquee loader-marquee-bottom" aria-hidden="true">
        <div className="loader-marquee-track loader-right-to-left">
          <span>CREATIVE WEB DESIGNER</span><span>CREATIVE WEB DESIGNER</span><span>CREATIVE WEB DESIGNER</span><span>CREATIVE WEB DESIGNER</span>
        </div>
      </div>
    </div>
  );
}
