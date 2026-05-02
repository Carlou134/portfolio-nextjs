import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Stack from "@/components/Stack";
import Experience from "@/components/Experience";
import About from "@/components/About";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Projects />
      <Stack />
      <Experience />
      <About />
    </main>
  );
}
