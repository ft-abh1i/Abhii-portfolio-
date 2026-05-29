import { ArrowUpRight } from 'lucide-react';

export function Contact() {
  return (
    <section className="section contact" id="contact">
      <p className="eyebrow">Contact</p>
      <h2>Have a serious idea? Bring the business. I will handle the build.</h2>
      <div className="contact-actions">
        <a className="btn btn-primary" href="mailto:abhijeetshrivastava132@gmail.com">Email <ArrowUpRight size={18} /></a>
        <a className="btn btn-ghost" href="#top">Back To Top</a>
      </div>
    </section>
  );
}
