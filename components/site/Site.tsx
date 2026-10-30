import { getSite } from "@/lib/site";
import ClockEl from "./Clock";
import ContactForm from "./ContactForm";
import CountUp from "./CountUp";
import Mission from "./Mission";
import PointerFx from "./PointerFx";
import { Certificates, Experience, Services } from "./Sections";
import ScrollFx from "./ScrollFx";
import { cardColors, heroLines, stageColors, stages, tech } from "./content";

export default async function Site() {
  const { profile: p, projects, journey, services, internships, education, certificates, counts } = await getSite();
  const profile = p ?? ({} as NonNullable<typeof p>);
  const lines = heroLines(profile.heroTitle ?? "").filter(Boolean);
  const nums = [
    [counts.internships, "Internships"],
    [counts.certificates, "Certificates"],
    [counts.projects, "Projects"],
  ] as const;
  const links = [
    [profile.email && `mailto:${profile.email}`, profile.email],
    [profile.phone && `tel:${profile.phone.replace(/\s/g, "")}`, profile.phone],
    [profile.github, "GitHub"],
    [profile.linkedin, "LinkedIn"],
    [profile.youtube, "YouTube"],
    [profile.cvLink, "Download CV"],
  ].filter(([href]) => href);

  return (
    <div className="site">
      <div id="prog"><i /></div>
      <header>
        <div className="wrap">
          <a href="#top"><b>Haider Ali</b></a>
          <ClockEl />
          <span id="pct">0%</span>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <h1>{lines.map((l) => <span key={l}><em>{l}</em></span>)}</h1>
            <p>{profile.heroIntro}</p>
            <div className="row">
              <a className="btn" href="#contact">Start a project</a>
              <span className="hint">Scroll down to see how it works</span>
            </div>
          </div>
        </section>

        <div className="mq" aria-hidden="true">
          <div>{[...tech, ...tech].map((t, i) => <span key={i}>{t}</span>)}</div>
        </div>

        <section className="story pin" id="story" style={{ background: stageColors[0] }}>
          <div className="stick">
            <div className="wrap" style={{ position: "relative", height: "100%" }}>
              <div style={{ position: "relative", height: "100%", display: "grid", alignItems: "center" }}>
                {stages.map(([name, text], i) => (
                  <div key={name} className={i === 0 ? "stage on" : "stage"}>
                    <h2>{name}</h2>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
              <div className="dots" id="sdots">
                {stages.map(([name], i) => <span key={name} className={i === 0 ? "on" : undefined}>{i + 1} {name}</span>)}
              </div>
            </div>
          </div>
        </section>

        <section className="split pin" id="split">
          <div className="stick">
            <div className="layer front">
              <div className="title">Front: what visitors see</div>
              <div className="card">
                <div className="bar" />
                <div className="in">
                  <h3>Ali’s Bakery</h3>
                  <p>Fresh bread, baked at 5 a.m. Order online and pick up today.</p>
                  <span className="b">Order now</span>
                </div>
              </div>
            </div>
            <div className="layer back">
              <div className="title" style={{ color: "#ffd23f" }}>Back: what runs behind it</div>
              <pre>
                <b>app.post</b>(&quot;/api/orders&quot;, <b>async</b> (req, res) =&gt; {"{"}{"\n"}
                {"  "}<b>const</b> order = <b>await</b> Order.<i>create</i>(req.body);{"\n"}
                {"  "}<b>await</b> sendEmail(owner, order);{"\n"}
                {"  "}res.<i>status</i>(201).<i>json</i>(order);{"\n"}
                {"}"});
              </pre>
            </div>
            <h2>Scroll to peek behind the page.</h2>
          </div>
        </section>

        <Services items={services} />

        <section className="about" id="about">
          <div className="wrap">
            <p className="rv" id="rv">
              {(profile.aboutText ?? "").split(/\s+/).filter(Boolean).map((w: string, i: number) => <span key={i}>{w} </span>)}
            </p>
            <figure className="me" id="me" style={{ marginLeft: 0, marginBottom: 0 }}>
              {profile.photo ? (
                // base64 data URL: next/image cannot optimise it
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photo} alt="Portrait of Haider Ali" />
              ) : (
                <div className="ph">Your photo<small>Add it in the admin settings</small></div>
              )}
            </figure>
            <h3 className="d" style={{ fontSize: "clamp(24px,3.4vw,40px)", marginTop: 80 }}>The road so far</h3>
            <div className="tl" id="tl">
              <i />
              {journey.map((j) => (
                <div key={String(j._id)}>
                  <b>{j.label}</b>
                  <h4>{j.heading}</h4>
                  <p>{j.description}</p>
                </div>
              ))}
            </div>
            <Experience internships={internships} education={education} />
          </div>
        </section>

        <section className="hs pin" id="hs">
          <div className="stick">
            <h2>Selected work. Keep scrolling.</h2>
            <div className="track" id="track">
              {projects.map((pr, i) => (
                <article className="proj" key={pr.link || String(i)}>
                  {pr.image ? (
                    <div className="shot img">
                      {/* base64 data URL: next/image cannot optimise it */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pr.image} alt={`${pr.title} screenshot`} loading="lazy" />
                    </div>
                  ) : (
                    <div className="shot" style={{ background: cardColors[i % cardColors.length] }}>
                      <u /><s /><s />
                    </div>
                  )}
                  <h3>
                    {pr.link ? <a href={pr.link} target="_blank" rel="noopener noreferrer">{pr.title}</a> : pr.title}
                  </h3>
                  <small>{pr.category}</small>
                  <p>{pr.description}</p>
                </article>
              ))}
              {profile.github && (
                <article className="proj more">
                  <div className="shot" style={{ background: "#1f2937" }}><u /><s /><s /></div>
                  <h3>More work</h3>
                  <p>Every repository, as it is built.</p>
                  <a className="btn" href={profile.github} target="_blank" rel="noopener noreferrer">Show more on GitHub</a>
                </article>
              )}
            </div>
          </div>
        </section>

        <section className="mission">
          <div className="wrap">
            <h2>What do you need built?</h2>
            <Mission />
          </div>
        </section>

        <section className="facts" id="facts">
          <div className="wrap">
            <div className="big">Let’s launch yours.</div>
            <div className="nums">
              {nums.map(([n, label]) => (
                <div key={label}><CountUp n={n} />{label}</div>
              ))}
            </div>
          </div>
        </section>

        <Certificates items={certificates} />

        <section className="contact" id="contact">
          <div className="wrap">
            {profile.open && <div className="badge">Taking new projects</div>}
            <h2 className="d" style={{ fontSize: "clamp(30px,5vw,64px)", marginBottom: 26 }}>Tell me about it.</h2>
            <p>{profile.contactIntro}</p>
            <ul className="links">
              {links.map(([href, label]) => (
                <li key={href}><a href={href}>{label}</a></li>
              ))}
            </ul>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap"><span>{profile.footerText}</span><span>{profile.email}</span></div>
      </footer>

      <ScrollFx />
      <PointerFx />
    </div>
  );
}
