function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-5"
      style={{ backgroundColor: "#fbfcea" }}
    >
      <div className="container">
        <h2 className="text-center fw-bold mb-5">
          How It Works
        </h2>

        <div className="row text-center g-4">
          <div className="col-md-3">
            <h5 className="fw-bold">1. Register</h5>
            <p>Create your account as an investor or farmer.</p>
          </div>

          <div className="col-md-3">
            <h5 className="fw-bold">2. Browse Projects</h5>
            <p>Explore farming projects and choose one to invest.</p>
          </div>

          <div className="col-md-3">
            <h5 className="fw-bold">3. Invest</h5>
            <p>Invest securely and help farmers grow.</p>
          </div>

          <div className="col-md-3">
            <h5 className="fw-bold">4. Track Progress</h5>
            <p>Track project progress and earn returns.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;