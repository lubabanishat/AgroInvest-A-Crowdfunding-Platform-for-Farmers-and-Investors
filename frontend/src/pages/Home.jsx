import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import FeaturedProjects from "../components/home/FeaturedProjects";
import HowItWorks from "../components/home/HowItWorks";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedProjects />
      <HowItWorks />
      <Footer />
    </>
  );
}

export default Home;