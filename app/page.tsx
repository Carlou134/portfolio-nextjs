import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Stack from "@/components/Stack";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Education from "@/components/Education";
import ConvergeDivider from "@/components/ConvergeDivider";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* tabIndex={-1} lets the skip link move focus here, not just scroll. */}
      <main id="contenido" tabIndex={-1} className="outline-none">
        {/* Mockup order. Más proyectos slots in later, after Projects. */}
        <Hero />
        <About />
        <Stack />
        <Projects />
        <Experience />
        <Education />
        <ConvergeDivider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
