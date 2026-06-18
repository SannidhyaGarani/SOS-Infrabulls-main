import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import "./ProjectDetail.css";

const formatLocationSummary = (location) => {
    if (!location) return "";
    if (typeof location === "string") return location;
    return location.summary || location.address || "";
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

const collectPricingTypes = (pricing = {}) => {
    const buckets = new Set();
    ["rate_per_sqft", "electricity_charge", "maintenance", "prime_location_charges", "plot_size_sqft"].forEach(
        (key) => {
            const group = pricing[key];
            if (group && typeof group === "object") {
                Object.keys(group).forEach((type) => buckets.add(type));
            }
        }
    );
    return Array.from(buckets);
};

const ProjectDetail = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;
            try {
                const docRef = doc(db, "projects", projectId);
                const snapshot = await getDoc(docRef);
                if (!snapshot.exists()) {
                    setError("The requested project was not found.");
                } else {
                    setProject({ id: snapshot.id, ...snapshot.data() });
                }
            } catch (err) {
                setError("Unable to load project details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    // ✅ MOVE HOOKS BEFORE ANY CONDITIONAL RETURN
    const pricing = project?.pricing || {};
    const pricingTypes = useMemo(() => collectPricingTypes(pricing), [pricing]);

    const configurations = project?.configurations || {};
    const configurationEntries = Object.entries(configurations);

    const advantages = safeArray(project?.location?.advantages);
    const amenities = safeArray(project?.amenities);

    // ❗ CONDITIONAL RETURNS MUST COME AFTER ALL HOOKS
    if (loading) {
        return <div className="project-detail-state">Loading project...</div>;
    }

    if (error || !project) {
        return <div className="project-detail-state error">{error || "Project not found."}</div>;
    }

    return (
        <div className="project-detail-page py-5 mb-5">
            <section
                className="project-hero d-flex align-items-end "
                style={{
                    backgroundImage: `url(${project.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="100%" height="100%" fill="%23ffffff"/><rect x="1" y="1" width="1598" height="898" fill="none" stroke="%23000" stroke-width="2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="%23000">No Image Available</text></svg>'})`
                }}
            >
                <div className="project-hero-overlay"></div>

                <div className="container project-hero-content">
                </div>
            </section>

            <div className="project-hero-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Link to="/projectgallery" className="back-btn">
                        ← Back to Projects
                    </Link>

                    <span
                        className={`status-badge ${project.status === "completed" ? "completed" : "running"
                            }`}
                    >
                        {project.status === "completed" ? "Completed" : "Running"}
                    </span>
                </div>

                <h1 className="hero-title">{project.title}</h1>
                <p className="hero-subtitle">
                    {project.tagline || formatLocationSummary(project.location)}
                </p>

                <div className="row mt-4">
                    <div className="col-md-4 col-6">
                        <div className="py-2 px-3 m-1 card">
                            <span className="meta-label">Developer</span>
                            <div className="meta-value">{project.developer || "SOS Infrabulls"}</div>
                        </div>
                    </div>
                    <div className="col-md-4 col-6">
                        <div className="py-2 px-3 m-1 card">
                            <span className="meta-label">Layout</span>
                            <div className="meta-value">{project.project_layout || "Coming soon"}</div>
                        </div>
                    </div>
                    <div className="col-md-4 col-12 mt-md-0 mt-3">
                        <div className="py-2 px-3 m-1 card">
                            <span className="meta-label">Location</span>
                            <div className="meta-value">
                                {project.location?.address || formatLocationSummary(project.location)}
                            </div>
                        </div>
                    </div>
                </div>

                {project.ctaUrl && (
                    <a
                        href={project.ctaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary mt-4 px-4 py-2"
                    >
                        {project.ctaLabel || "Visit Project Site"}
                    </a>
                )}
            </div>

            <section className="project-detail-body container">
                <div className="project-detail-intro">
                    <div>
                        <p>
                            {project.location?.summary ||
                                formatLocationSummary(project.location) ||
                                "Detailed description will be published soon."}
                        </p>
                    </div>
                    <div className="project-detail-pill-group">
                        <span className="detail-pill">{project.project_name || project.title}</span>
                        <span className="detail-pill">
                            {project.status === "completed" ? "Delivered milestone" : "Actively selling"}
                        </span>
                        {project.developer && <span className="detail-pill">By {project.developer}</span>}
                    </div>
                </div>

                <div className="project-detail-section-grid">
                    <div className="project-detail-section">
                        <h2>Location Advantage</h2>
                        {advantages.length ? (
                            <ul className="detail-bullet-list">
                                {advantages.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="project-detail-muted">Proximity highlights will be updated shortly.</p>
                        )}
                    </div>

                    <div className="project-detail-section">
                        <h2>Amenities</h2>
                        {amenities.length ? (
                            <div className="detail-chip-grid">
                                {amenities.map((amenity) => (
                                    <span key={amenity} className="detail-chip">
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="project-detail-muted">Amenity mix will be announced soon.</p>
                        )}
                    </div>
                </div>

                <div className="project-detail-section">
                    <h2>Configurations</h2>
                    {configurationEntries.length ? (
                        <div className="detail-config-grid">
                            {configurationEntries.map(([type, config]) => (
                                <div key={type} className="config-card">
                                    <h3>{type}</h3>
                                    <p>{safeArray(config?.sizes_sqft).join(", ")} sq.ft</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="project-detail-muted">Configuration matrix is being curated.</p>
                    )}
                </div>

                <div className="project-detail-section">
                    <h2>Pricing Snapshot</h2>
                    {pricingTypes.length ? (
                        <div className="detail-pricing-table-wrapper">
                            <table className="detail-pricing-table">
                                <thead>
                                    <tr>
                                        <th>Typology</th>
                                        <th>Rate / Sq.ft</th>
                                        <th>Electricity</th>
                                        <th>Maintenance</th>
                                        <th>Prime Charges</th>
                                        <th>Plot Sizes (Sq.ft)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pricingTypes.map((type) => (
                                        <tr key={type}>
                                            <td>{type}</td>
                                            <td>{pricing.rate_per_sqft?.[type] ?? "—"}</td>
                                            <td>{pricing.electricity_charge?.[type] ?? "—"}</td>
                                            <td>{pricing.maintenance?.[type] ?? "—"}</td>
                                            <td>{pricing.prime_location_charges?.[type] ?? "—"}</td>
                                            <td>
                                                {Array.isArray(pricing.plot_size_sqft?.[type])
                                                    ? pricing.plot_size_sqft[type].join(", ")
                                                    : pricing.plot_size_sqft?.[type] || "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="project-detail-muted">Pricing grid will be uploaded soon.</p>
                    )}
                </div>

                <div className="project-detail-cta-card">
                    <div>
                        <h3>Need a guided walkthrough?</h3>
                        <p>Connect with our advisory desk to receive brochures, payment plans, and site visit slots.</p>
                    </div>
                    <Link to="/contact" className="tf-btn primary">
                        Talk to us →
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ProjectDetail;

