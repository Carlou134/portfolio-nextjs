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
        <Hero />
        <Projects />
        <Stack />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
