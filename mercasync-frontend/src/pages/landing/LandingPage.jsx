import HeroSection    from "./HeroSection"
import BrandsCarousel from "./BrandsCarousel"
import AboutSection   from "./AboutSection"
import MapSection     from "./MapSection"
import Footer         from "./Footer"

export default function LandingPage({ onSearch, t }) {
  return (
    <>
      <HeroSection    onSearch={onSearch} t={t} />
      <BrandsCarousel />
      <AboutSection   t={t} />
      <MapSection     t={t} />
      <Footer         t={t} />
    </>
  )
}