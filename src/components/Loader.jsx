export default function Loader({ done }) {
  return (
    <div className={done ? 'loader loader-done' : 'loader'}>
      <div className="loader-inner">
        <span>Abhii Designs</span>
        <div className="loader-track"><i /></div>
        <small>Premium web experiences loading</small>
      </div>
    </div>
  );
}
