// Extra public sections. Each returns nothing when it has no items.
type Item = { _id: unknown; [k: string]: unknown };
const s = (v: unknown) => (typeof v === "string" ? v : "");
const key = (i: Item) => String(i._id);

export function Services({ items }: { items: Item[] }) {
  if (!items.length) return null;
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <h2>What I do</h2>
        <div className="cards">
          {items.map((i) => (
            <div className="c rev" key={key(i)}>
              <h3>{s(i.title)}</h3>
              <p>{s(i.description)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Sits after the timeline, inside the About section.
export function Experience({ internships, education }: { internships: Item[]; education: Item[] }) {
  if (!internships.length && !education.length) return null;
  return (
    <div className="duo">
      {internships.length > 0 && (
        <div>
          <h3 className="d">Internships</h3>
          {internships.map((i) => (
            <div className="c rev" key={key(i)}>
              <span className={s(i.status) === "Completed" ? "st" : "st on"}>{s(i.status)}</span>
              <h4>{s(i.company)}</h4>
              {s(i.role) && <p>{s(i.role)}</p>}
              <small>{s(i.period)}</small>
              {s(i.description) && <p>{s(i.description)}</p>}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div>
          <h3 className="d">Education</h3>
          {education.map((i) => (
            <div className="c rev" key={key(i)}>
              <h4>{s(i.title)}</h4>
              <p>{s(i.school)}</p>
              <small>{s(i.period)}</small>
              {s(i.description) && <p>{s(i.description)}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Certificates({ items }: { items: Item[] }) {
  if (!items.length) return null;
  return (
    <section className="sec" id="certificates">
      <div className="wrap">
        <h2>Certificates</h2>
        <div className="cards">
          {items.map((i) => (
            <div className="c rev" key={key(i)}>
              {s(i.image) && (
                // base64 data URL: next/image cannot optimise it
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s(i.image)} alt={`${s(i.title)} certificate`} loading="lazy" />
              )}
              <h4>{s(i.title)}</h4>
              <small>{[s(i.issuer), s(i.date)].filter(Boolean).join(" · ")}</small>
              {s(i.link) && (
                <a className="btn" href={s(i.link)} target="_blank" rel="noopener noreferrer">View</a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
