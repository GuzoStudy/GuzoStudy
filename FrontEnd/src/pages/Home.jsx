import Header from "../components/Header";
import Hero from "../components/Hero";
import PopularCourses from "../components/PopularCourses";
import HowItWorks from "../components/HowItWorks";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <PopularCourses />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </>
  );
}

export default Home;