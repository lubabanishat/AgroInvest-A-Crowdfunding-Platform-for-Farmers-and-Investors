import "./HowItWorks.css";

import registerIcon from "../../assets/home-page/register.png";
import browseIcon from "../../assets/home-page/browse.png";
import investIcon from "../../assets/home-page/invest.png";
import trackIcon from "../../assets/home-page/track.png";

const steps = [
  {
    id: 1,
    icon: registerIcon,
    title: "Register",
    description: "Create your account as an investor or farmer.",
  },
  {
    id: 2,
    icon: browseIcon,
    title: "Browse Projects",
    description: "Explore farming projects and choose one to invest.",
  },
  {
    id: 3,
    icon: investIcon,
    title: "Invest",
    description: "Invest securely and help farmers grow.",
  },
  {
    id: 4,
    icon: trackIcon,
    title: "Track Progress",
    description: "Track project progress and earn returns.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="how-it-works-container">
        <h2 className="how-it-works-title">How It Works</h2>

        <div className="how-it-works-steps">
          {steps.map((step, index) => (
            <div className="how-step-wrapper" key={step.id}>
              <article className="how-step">
                <img
                  src={step.icon}
                  alt=""
                  className="how-step-icon"
                />

                <div className="how-step-content">
                  <h3>
                    {step.id}. {step.title}
                  </h3>

                  <p>{step.description}</p>
                </div>
              </article>

              {index < steps.length - 1 && (
                <span className="how-step-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;