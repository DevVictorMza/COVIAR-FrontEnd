import Navbar from '@/components/Navbar';
import Hero from '@/sections/Hero';
import Introduction from '@/sections/Introduction';
import Process from '@/sections/Process';
import Pillars from '@/sections/Pillars';
import Footer from '@/sections/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Introduction />
        <Process />
        <Pillars />
      </main>
      <Footer />
    </>
  )
}
