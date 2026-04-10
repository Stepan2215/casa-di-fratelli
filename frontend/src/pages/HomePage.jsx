import Header from "../components/layout/Header";
import HeroSection from "../components/home/HeroSection";
import Footer from "../components/layout/Footer";
import AboutSection from "../components/home/AboutSection";
import MenuSection from "../components/home/MenuSection";
import GallerySection from "../components/home/GallerySection";
import ReservationPreviewSection from "../components/home/ReservationPreviewSection";
import ReviewsSection from "../components/home/ReviewsSection";

export default function HomePage({
  t,
  language,
  setLanguage,
  onOpenReservation,
  onOpenMenu,
}) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
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
      <MenuSection t={t} language={language} />
      <GallerySection t={t} />
      <ReservationPreviewSection t={t} onOpenReservation={onOpenReservation} />
      <ReviewsSection language={language} />
      <Footer t={t} />
    </div>
  );
}