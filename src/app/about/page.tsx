import type { Metadata } from "next";
import NewsletterForm from "@/components/newsletter-form";

export const metadata: Metadata = {
  title: "About",
  description: "About SiddhantKrishna and this digital void.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <div className="mb-16 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-void-white mb-8">
          About
        </h1>

        <div className="prose-void">
          <p>
            Welcome to the Void—a digital space for exploring ideas at the intersection
            of technology, philosophy, intelligence, and the future of civilization.
          </p>

          <p>
            I&apos;m SiddhantKrishna. I think about how intelligence works—both natural
            and artificial. I write about the systems that shape our world: technology,
            institutions, markets, and the protocols that coordinate human behavior at
            scale.
          </p>

          <h2>What You&apos;ll Find Here</h2>

          <p>
            <strong>Essays</strong> — Long-form explorations of ideas. Each essay is an
            attempt to compress a complex topic into its essential truth, removing
            everything that doesn&apos;t serve understanding.
          </p>

          <p>
            <strong>Notes</strong> — Short reflections and observations. Ideas in their
            nascent form, before they become essays.
          </p>

          <p>
            <strong>Research</strong> — Deep technical dives into AI, computation theory,
            mathematics, and physics.
          </p>

          <p>
            <strong>Projects</strong> — Software and systems I&apos;ve built. Each project
            is an experiment in applied intelligence.
          </p>

          <h2>Interests</h2>

          <ul>
            <li>Artificial Intelligence and Machine Learning</li>
            <li>Computational Theory and Algorithmic Information Theory</li>
            <li>Philosophy of Mind and Consciousness</li>
            <li>Complex Systems and Emergence</li>
            <li>Robotics and Embodied Intelligence</li>
            <li>Startup Building and Systems Design</li>
            <li>Mathematics and Theoretical Physics</li>
            <li>Civilization Design and Coordination Mechanisms</li>
          </ul>

          <h2>Philosophy</h2>

          <p>
            I believe the most important skill is the ability to think clearly. Clear
            thinking is not a talent—it&apos;s a practice. It requires relentless
            questioning of assumptions, comfort with uncertainty, and the discipline to
            follow arguments wherever they lead.
          </p>

          <p>
            The name &ldquo;Void&rdquo; is not nihilistic. In physics, the vacuum is not
            empty—it seethes with quantum fluctuations, virtual particles appearing and
            disappearing at the edge of existence. The void is the most creative space
            there is. Ideas emerge from it, and to it they return, refined.
          </p>

          <h2>Values</h2>

          <p>
            <strong>Clarity over cleverness.</strong> The best ideas are simple. If an
            explanation is complex, the understanding is incomplete.
          </p>

          <p>
            <strong>Depth over breadth.</strong> Better to understand one thing deeply than
            to know many things superficially.
          </p>

          <p>
            <strong>Building over talking.</strong> The ultimate test of understanding is
            the ability to create.
          </p>

          <p>
            <strong>Long-term over short-term.</strong> The most important things compound.
            Knowledge, relationships, and systems all reward patience.
          </p>
        </div>
      </div>

      <div className="animate-fade-in-up animation-delay-300">
        <NewsletterForm />
      </div>
    </div>
  );
}
