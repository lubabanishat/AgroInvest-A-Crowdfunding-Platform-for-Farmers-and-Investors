import { Link } from "react-router-dom";

import hero from "../../assets/images/Hero.jpeg";

import "./Hero.css";


function Hero() {
  return (
    <section
      style={{
        height: "420px",
        backgroundColor: "#effbf0",
        overflow: "hidden",
      }}
    >

      <div
        className="container-fluid p-0"
        style={{
          maxWidth: "1440px",
          height: "100%",
          margin: "0 auto",
        }}
      >

        <div className="row g-0 h-100">

          {/* =========================
              LEFT SIDE
          ========================= */}

          <div
            className="col-lg-5 position-relative"
            style={{
              height: "420px",
            }}
          >

            {/* TITLE */}

            <div
              style={{
                position: "absolute",
                top: "42px",
                left: "108px",
                width: "419px",
              }}
            >

              <h1
                className="fw-semibold mb-0"
                style={{
                  fontFamily:
                    "Poppins, sans-serif",
                  fontSize: "36px",
                  lineHeight: "1.25",
                  color: "#0c110c",
                }}
              >
                Invest in Agriculture,

                <br />

                <span
                  style={{
                    color: "#34c759",
                  }}
                >
                  Grow Together
                </span>

              </h1>

            </div>


            {/* DESCRIPTION */}

            <p
              style={{
                position: "absolute",
                top: "163px",
                left: "108px",
                width: "384px",
                fontFamily:
                  "Poppins, sans-serif",
                fontSize: "16px",
                lineHeight: "1.5",
                color: "#0c110c",
                margin: 0,
              }}
            >
              Connect with verified farmers,
              invest securely, and track
              agricultural projects from funding
              to harvest.
            </p>


            {/* =========================
                BUTTONS
            ========================= */}

            <div
              className="d-flex"
              style={{
                position: "absolute",
                top: "288px",
                left: "108px",

                // Was 40px
                // Reduced so Explore moves left
                gap: "20px",
              }}
            >

              {/* INVEST NOW */}

              <Link
                to="/projects"
                className="btn d-flex align-items-center justify-content-center hero-primary-btn"
                style={{
                  width: "169px",
                  height: "49px",
                  backgroundColor:
                    "#196f2f",
                  color: "#ffffff",
                  borderRadius: "8px",
                  fontFamily:
                    "Poppins, sans-serif",
                  fontSize: "20px",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Invest Now →
              </Link>


              {/* EXPLORE PROJECTS */}

              <Link
                to="/projects"
                className="btn d-flex align-items-center justify-content-center hero-secondary-btn"
                style={{
                  width: "213px",
                  height: "49px",
                  border:
                    "1px solid #196f2f",
                  color: "#196f2f",
                  borderRadius: "8px",
                  backgroundColor:
                    "transparent",
                  fontFamily:
                    "Poppins, sans-serif",
                  fontSize: "20px",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                ◉ Explore Projects
              </Link>

            </div>

          </div>


          {/* =========================
              RIGHT SIDE IMAGE
          ========================= */}

          <div
            className="col-lg-7"
            style={{
              height: "420px",
              overflow: "hidden",
            }}
          >

            <img
              src={hero}
              alt="Farmer holding crops"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

          </div>

        </div>

      </div>

    </section>
  );
}


export default Hero;