const services = [
  'Website Design',
  'Frontend Development',
  'Backend Development',
  'Full Stack Apps',
  'Mobile First Interfaces',
  'Motion And Interaction'
];

export function Services() {
  return (
    <section className="section services" id="services">
      <div className="section-heading compact">
        <p className="eyebrow">Services</p>
        <h2>From interface to backend, the full build stays controlled.</h2>
      </div>
      <div className="service-grid">
        {services.map((service) => (
          <div className="service-pill" key={service}>{service}</div>
        ))}
      </div>
    </section>
  );
}
