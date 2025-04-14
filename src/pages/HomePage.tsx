import React from "react";
import Hero from "../components/Hero";
import FamilyFeed from "../components/FamilyFeed";
import Gallery from "../components/Gallery";

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <FamilyFeed />
      <Gallery />
    </div>
  );
};

export default HomePage;
