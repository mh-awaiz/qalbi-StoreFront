import HeroSection from "./sections/HeroSection";
import CollectionsSection from "./sections/CollectionsSection";
import FeaturedProducts from "./sections/FeaturedProducts";
import ReviewSection from "../app/sections/ReviewSection";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return (
    <main className="flex flex-col overflow-x-hidden">
      <HeroSection />
      <CollectionsSection />
      <FeaturedProducts />
      <ReviewSection />

     
    </main>
  );
}
