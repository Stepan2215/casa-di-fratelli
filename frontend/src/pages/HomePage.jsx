import Header from "../components/layout/Header";
import HeroSection from "../components/home/HeroSection";
import Footer from "../components/layout/Footer";
import AboutSection from "../components/home/AboutSection";
import MenuSection from "../components/home/MenuSection";
import GallerySection from "../components/home/GallerySection";
import ReservationPreviewSection from "../components/home/ReservationPreviewSection";
import ReviewsSection from "../components/home/ReviewsSection";
import AwardsSection from "../components/home/AwardsSection";
import EventsSection from "../components/home/EventsSection";

export default function HomePage({
  t,
  language,
  setLanguage,
  onOpenReservation,
  onOpenMenu,
  cmsMenuItems,
}) {
  return (
    <div className="luxury-shell min-h-screen overflow-x-hidden text-stone-100">
      <Header
        t={t}
        language={language}
        setLanguage={setLanguage}
        onOpenReservation={onOpenReservation}
        onOpenMenu={onOpenMenu}
        onGoHome={() => {}}
      />

      <HeroSection
        t={t}
        onOpenReservation={onOpenReservation}
        onOpenMenu={onOpenMenu}
        language={language}
      />

      <AboutSection t={t} />
      <MenuSection
        t={t}
        language={language}
        onOpenMenu={onOpenMenu}
        cmsMenuItems={cmsMenuItems}
      />
      <GallerySection t={t} />
      <AwardsSection language={language} />
      <ReservationPreviewSection t={t} onOpenReservation={onOpenReservation} />
      <ReviewsSection language={language} />
      <EventsSection language={language} />
      <Footer t={t} />
    </div>
  );
}
