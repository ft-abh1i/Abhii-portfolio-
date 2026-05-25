export default function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="section-head reveal-block">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
