import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Stack from "@/components/Stack";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* tabIndex={-1} lets the skip link move focus here, not just scroll. */}
      <main id="contenido" tabIndex={-1} className="outline-none">
        {/* Mockup order. Más proyectos, Educación and the convergence divider
            slot in later (after Projects, after Experience, before Contact). */}
        <Hero />
        <About />
        <Stack />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
