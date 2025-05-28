import Features from "../components/section/Features";
import Hero from "../components/section/Hero";
import Team from "../components/section/Team";

const LandingPage = () => {
  return (
    <div className="h-full snap-y snap-proximity overflow-y-scroll scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <div className="snap-start">
        <Hero />
      </div>
      <div className="snap-start">
        <Features />
      </div>
      <div className="snap-start">
        <Team />
      </div>
    </div>
  );
};

export default LandingPage;
