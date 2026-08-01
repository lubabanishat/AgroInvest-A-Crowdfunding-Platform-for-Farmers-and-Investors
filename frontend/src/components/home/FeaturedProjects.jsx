import { Link } from "react-router-dom";

function FeaturedProjects() {
  const projects = [
    {
      id: 1,
      title: "Organic Vegetable Farming",
      location: "Rajshahi, Bangladesh",
      funded: 64,
      image:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600",
    },
    {
      id: 2,
      title: "Mango Orchard Project",
      location: "Khulna, Bangladesh",
      funded: 62,
      image:
        "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600",
    },
    {
      id: 3,
      title: "Rice Farming Project",
      location: "Jessore, Bangladesh",
      funded: 64,
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600",
    },
  ];

  return (
    <section
      aria-labelledby="featured-projects-heading"
      style={{
        backgroundColor: "#ffffff",
        padding: "28px 0 39px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div
          className="text-center"
          style={{
            marginBottom: "28px",
          }}
        >
          <h2
            id="featured-projects-heading"
            style={{
              margin: 0,
              fontFamily: "Poppins, sans-serif",
              fontSize: "32px",
              fontWeight: 600,
              lineHeight: 1.25,
              color: "#111111",
            }}
          >
            Featured Farming Projects
          </h2>

          <p
            style={{
              margin: "3px 0 0",
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              color: "#222222",
            }}
          >
            Explore verified projects and invest in a better tomorrow.
          </p>
        </div>

        <div
          className="d-flex justify-content-center align-items-start"
          style={{
            gap: "30px",
            flexWrap: "nowrap",
          }}
        >
          {projects.map((project) => (
            <article
              key={project.id}
              style={{
                position: "relative",
                flex: "0 0 360px",
                width: "360px",
                height: "270px",
                backgroundColor: "#fffbfb",
                border: "1px solid #ededed",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.10)",
                overflow: "hidden",
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "135px",
                  height: "170px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <h3
                style={{
                  position: "absolute",
                  top: "21px",
                  left: "150px",
                  width: "195px",
                  margin: 0,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  lineHeight: 1.25,
                  color: "#000000",
                }}
              >
                {project.title}
              </h3>

              <p
                style={{
                  position: "absolute",
                  top: "86px",
                  left: "148px",
                  width: "198px",
                  margin: 0,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    marginRight: "5px",
                    color: "#34c759",
                    fontSize: "16px",
                  }}
                >
                  ●
                </span>

                {project.location}
              </p>

              <div
                role="progressbar"
                aria-label={`${project.title} funding progress`}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={project.funded}
                style={{
                  position: "absolute",
                  top: "123px",
                  left: "150px",
                  width: "170px",
                  height: "12px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${project.funded}%`,
                    height: "100%",
                    backgroundColor: "#2e7d32",
                    borderRadius: "10px",
                  }}
                />
              </div>

              <p
                style={{
                  position: "absolute",
                  top: "141px",
                  left: "148px",
                  margin: 0,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "20px",
                  fontWeight: 500,
                  color: "#000000",
                }}
              >
                {project.funded}% Funded
              </p>

              <Link
                to={`/projects/${project.id}`}
                style={{
                  position: "absolute",
                  top: "200px",
                  left: "20px",
                  width: "320px",
                  height: "42px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fffbfb",
                  border: "1px solid #34c759",
                  borderRadius: "8px",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#2e7d32",
                  textDecoration: "none",
                }}
              >
                View Details
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjects;