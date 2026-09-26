import React, { useState } from "react";
import "./ProjectTile.css";

// 🔹 Mapowanie kodów krajów na pliki flag w /public/flags/
const flagIcons = {
  PL: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/flags/pl.png",
  IT: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/flags/it.png",
  VA: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/flags/va.png",
  SM: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/flags/sm.png",
  CH: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/flags/ch.png",
  LI: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/flags/li.png",
  DE: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/flags/de.png",
  AT: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/flags/at.png",
  SI: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/flags/si.png",
  HR: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/flags/hr.png",
  CZ: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/flags/cz.png",
  SK: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/flags/sk.png",
  HU: "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/flags/hu.png",
};

// 🔹 Komponent renderujący flagę
function Flag({ code, size = 20 }) {
  const src = flagIcons[code];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={code}
      className="flag-icon"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "cover",
      }}
    />
  );
}

// 🔹 Dane projektów (kody ISO zamiast emoji)
const projects = [
  {
    id: "p1",
    title: "Labubu Macharelli",
    subtitle: "2025 _____________",
    tags: ["IT", "VA", "SM"],
    year: 2025,
    thumbnail:
      "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/photos/1.JPG",
    description: " 1 307 km Duration: 12 days",
    elevation: "8 110 m",
    AVGspeed: "116.4 km/day",
  },
  {
    id: "p2",
    title: "Italo Disco",
    subtitle: "2024 ____________",
    tags: ["CH", "LI", "IT"],
    year: 2024,
    thumbnail:
      "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/photos/3.JPG",
    description: "Distance: 1 198 km Duration: 12 days",
    elevation: "10 350 m",
    AVGspeed: "108.0 km/day",
  },
  {
    id: "p3",
    title: "Rest Day Blamage",
    subtitle: "2023 ___________________",
    tags: ["CZ","DE", "AT", "IT", "SI", "HR", "AT", "PL"],
    year: 2023,
    thumbnail:
      "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/photos/2.JPG",
    description: "Distance: 1 886 km Duration: 15 days",
    elevation: "15 090 m",
    AVGspeed: "129.6 km/day",
  },
  {
    id: "p4",
    title: "Schnell wie Niki Lauda",
    subtitle: "2022 _________________",
    tags: ["PL","CZ", "AT", "SK", "HU"],
    year: 2022,
    thumbnail:
      "https://raw.githubusercontent.com/RestDayBlamage/BLMZ/main/photos/4.JPG",
    description: "Distance: 1 695 km Duration: 16 days",
    elevation: "12 250 m",
    AVGspeed: "110.4 km/day",
  },
];


function ProjectTile() {
  const [selectedTag, setSelectedTag] = useState("All");
  const [activeProject, setActiveProject] = useState(null);

  // 🔹 Funkcja nadająca kolor w zależności od roku
  function getYearColor(year) {
    switch (year) {
      case 2025:
        return "#0e6360"; // czerwony
      case 2024:
        return "#7ed7d1"; // ciemny niebieski
      case 2023:
        return "#ff4f3f"; // turkusowy
      case 2022:
        return "#f4cb2e"; // pomarańczowy
      default:
        return "#6c757d"; // szary (dla innych)
    }
  }

  const allTags = ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))];
  const sortedProjects = [...projects].sort((a, b) => b.year - a.year);
  const filtered =
    selectedTag === "All"
      ? sortedProjects
      : sortedProjects.filter((p) => p.tags.includes(selectedTag));

  function openProject(project) {
    setActiveProject(project);
    document.body.style.overflow = "hidden";
  }

  function closeProject() {
    setActiveProject(null);
    document.body.style.overflow = "";
  }

  return (
    <div className="portfolio-container">
      {/* 🔹 Filtry (flagi) */}
      <div className="tags-container">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`tag ${selectedTag === tag ? "active" : ""}`}
          >
            {tag === "All" ? "All" : <Flag code={tag} size={20} />}
          </button>
        ))}
      </div>

      {/* 🔹 Siatka projektów */}
      <div className="grid-container">
        {filtered.map((p) => (
          <div key={p.id} className="project-card" onClick={() => openProject(p)}>
            <img src={p.thumbnail} alt={p.title} className="project-image" />
            <div className="project-info">
              <h3>{p.title}</h3>
              <p style={{ color: getYearColor(p.year), fontWeight: "500" }}>
                {p.subtitle}
              </p>
              <div className="project-tags">
                {p.tags.slice(0, 3).map((t) => (
                  <span key={t} className="project-tag">
                    <Flag code={t} size={18} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Modal */}
      {activeProject && (
        <div className="modal-overlay" onClick={closeProject}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeProject}>×</button>
            <h2>{activeProject.title}</h2>
            <p style={{ color: getYearColor(activeProject.year), fontWeight: "500" }}>
              {activeProject.subtitle}
            </p>
            <img
              src={activeProject.thumbnail}
              alt={activeProject.title}
              className="modal-image"
            />
{(() => {
  const [distancePart, durationPart] = activeProject.description.split("Duration:");
  return (
    <p style={{ lineHeight: "1.6" }}>
      <strong>Distance:</strong> {distancePart.trim()}<br />
      <strong>Duration:</strong> {durationPart.trim()}<br />
      <strong>Elevation:</strong> {activeProject.elevation}<br />
      <strong>AVGspeed:</strong> {activeProject.AVGspeed}
    </p>
  );
})()}
            <div className="project-tags">
              {activeProject.tags.map((t) => (
                <span key={t} className="project-tag">
                  <Flag code={t} size={22} />
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectTile;
