import { db } from "@/db";
import {
  users,
  categories,
  tags,
  posts,
  postTags,
  projects,
  quotes,
  books,
  siteSettings,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "./auth";
import { estimateReadingTime, wordCount, slugify } from "./utils";

export async function seedDatabase() {
  /* ── Admin user ── */
  const [existingAdmin] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, "admin@void.dev"))
    .limit(1);

  let adminId: number;
  if (!existingAdmin) {
    const hash = await hashPassword("admin123456");
    const [admin] = await db
      .insert(users)
      .values({
        email: "admin@void.dev",
        name: "SiddhantKrishna",
        passwordHash: hash,
        role: "admin",
        bio: "Explorer of intelligence, technology, philosophy, and the infinite void.",
      })
      .returning({ id: users.id });
    adminId = admin.id;
  } else {
    adminId = existingAdmin.id;
  }

  /* ── Categories ── */
  const categoryData = [
    { name: "Technology", slug: "technology", description: "On computing, systems, and digital frontiers" },
    { name: "Philosophy", slug: "philosophy", description: "On meaning, consciousness, and existence" },
    { name: "AI & Intelligence", slug: "ai-intelligence", description: "On artificial and natural intelligence" },
    { name: "Startups", slug: "startups", description: "On building, scaling, and creating value" },
    { name: "Science", slug: "science", description: "On understanding the physical universe" },
  ];

  for (const cat of categoryData) {
    const [existing] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, cat.slug)).limit(1);
    if (!existing) {
      await db.insert(categories).values(cat);
    }
  }

  /* ── Tags ── */
  const tagData = ["ai", "philosophy", "technology", "startups", "science", "consciousness", "robotics", "future", "civilization", "mathematics"];
  for (const t of tagData) {
    const [existing] = await db.select({ id: tags.id }).from(tags).where(eq(tags.slug, t)).limit(1);
    if (!existing) {
      await db.insert(tags).values({ name: t.charAt(0).toUpperCase() + t.slice(1), slug: t });
    }
  }

  /* ── Essays ── */
  const essayData = [
    {
      title: "The Architecture of Thought",
      slug: "the-architecture-of-thought",
      type: "essay",
      content: `Human thought is not linear. It is a vast, recursive architecture—a cathedral built from neural patterns that fold upon themselves in infinite regress.\n\nWe think we think in words. But words are merely the surface representation of something far deeper: a pre-linguistic substrate of meaning that our brains construct from sensory experience, memory, and prediction.\n\nConsider how you understand a sentence. You don't process it word by word, building meaning like bricks in a wall. Instead, your brain predicts the entire structure before you've finished reading it. The prediction is the understanding.\n\nThis has profound implications for artificial intelligence. When we build language models, we're not just building statistical engines—we're building prediction machines. And prediction, it turns out, might be all that consciousness is.\n\nThe question is not whether machines can think. The question is whether thinking is what we believe it to be. If thought is prediction, and prediction is computation, then computation is thought. The architecture is the same; only the substrate differs.\n\nWe stand at the edge of understanding our own minds, and the tools we build to understand them are becoming minds themselves. This is the recursion at the heart of intelligence: to know the knower, you must become the knower.`,
      excerpt: "On the recursive nature of human cognition and what it means for artificial intelligence.",
      categorySlug: "philosophy",
    },
    {
      title: "Civilization as a Technology",
      slug: "civilization-as-a-technology",
      type: "essay",
      content: `Civilization is not a natural phenomenon. It is an invention—a technology for coordinating human behavior at scale.\n\nLike all technologies, it has versions. Agriculture was Civilization 1.0. Writing was 2.0. The printing press was 3.0. The internet is 4.0. Each version expanded the bandwidth of human coordination.\n\nBut coordination is not the same as cooperation. Coordination can be coerced. The great civilizational challenge has always been to build coordination mechanisms that align individual incentives with collective flourishing.\n\nMarkets solved part of this problem. Democracy solved another part. Science solved yet another. But none of these solutions are complete, and all of them are breaking down under the weight of exponential technological change.\n\nThe next version of civilization will be built on protocols, not institutions. Protocols are rules that machines can enforce without human intermediaries. They are the operating system of a post-institutional world.\n\nThis is not a prediction about blockchain or Web3. Those are specific implementations of a broader idea. The broader idea is that human coordination can be automated, just as human computation was automated by computers.\n\nThe question is not whether this will happen. The question is whether we will design these protocols deliberately, or whether they will emerge from the chaos of competing interests.`,
      excerpt: "Why civilization is humanity's greatest invention, and how its next version will be built on protocols.",
      categorySlug: "technology",
    },
    {
      title: "Intelligence is Compression",
      slug: "intelligence-is-compression",
      type: "essay",
      content: `The most profound insight in the theory of intelligence is that intelligence is compression. To understand something is to compress it—to find a shorter description of the data than the data itself.\n\nNewton's laws compress the trajectories of every falling object in the universe into three elegant equations. Einstein's field equations compress the geometry of spacetime into a single tensor equation. DNA compresses the instructions for building an organism into four letters.\n\nThis is not a metaphor. It is the formal mathematical definition of intelligence, first articulated by Solomonoff and later refined by Hutter in his theory of universal artificial intelligence.\n\nA model is intelligent to the degree that it can predict the next observation given all previous observations. Prediction is compression. If you can predict the next word, you don't need to store it—you've compressed it away.\n\nThis is why large language models are more than just autocomplete. They are compression engines of unprecedented power. GPT is compressing the entirety of human written knowledge into a set of neural network weights. The better the compression, the better the intelligence.\n\nBut compression has limits. Kolmogorov complexity tells us that some data is incompressible—it is truly random. And randomness, in a deep sense, is the opposite of intelligence. Intelligence finds patterns. Randomness is the absence of patterns.\n\nThe universe, it seems, is compressible. There are patterns. There are laws. And the fact that intelligence exists at all—that the universe contains entities capable of compressing it—is perhaps the deepest mystery of all.`,
      excerpt: "On the mathematical foundations of intelligence and why understanding is compression.",
      categorySlug: "ai-intelligence",
    },
  ];

  for (const essay of essayData) {
    const [existing] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, essay.slug)).limit(1);
    if (!existing) {
      const [cat] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, essay.categorySlug)).limit(1);
      await db.insert(posts).values({
        title: essay.title,
        slug: essay.slug,
        type: essay.type,
        content: essay.content,
        contentHtml: essay.content.split("\n").map(p => p.trim() ? `<p>${p.trim()}</p>` : "").join("\n"),
        excerpt: essay.excerpt,
        status: "published",
        featured: true,
        authorId: adminId,
        categoryId: cat?.id,
        readingTime: estimateReadingTime(essay.content),
        wordCount: wordCount(essay.content),
        publishedAt: new Date(),
      });
    }
  }

  /* ── Notes ── */
  const noteData = [
    {
      title: "On Silence and Productivity",
      slug: "on-silence-and-productivity",
      content: "The most productive hours are silent ones. Not because silence eliminates distraction, but because it eliminates performance. In silence, you stop performing productivity and start being productive. There's a crucial difference.",
      excerpt: "Why silence is the ultimate productivity tool.",
    },
    {
      title: "The Paradox of Choice in Software",
      slug: "paradox-of-choice-in-software",
      content: "Every framework claims to be the last framework you'll need. Every tool promises to simplify your workflow. But adding tools never simplifies—it merely shifts complexity from one domain to another. The only way to simplify is to do less.",
      excerpt: "On the endless cycle of tools and frameworks.",
    },
    {
      title: "Reading as Time Travel",
      slug: "reading-as-time-travel",
      content: "When you read Marcus Aurelius, you are literally interfacing with a mind that existed two millennia ago. The words are a protocol, and your brain is the decoder. Reading is the closest thing we have to time travel—and it requires no technology beyond marks on a surface.",
      excerpt: "Books are humanity's time machines.",
    },
  ];

  for (const note of noteData) {
    const [existing] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, note.slug)).limit(1);
    if (!existing) {
      await db.insert(posts).values({
        title: note.title,
        slug: note.slug,
        type: "note",
        content: note.content,
        contentHtml: note.content.split("\n").map(p => p.trim() ? `<p>${p.trim()}</p>` : "").join("\n"),
        excerpt: note.excerpt,
        status: "published",
        authorId: adminId,
        readingTime: estimateReadingTime(note.content),
        wordCount: wordCount(note.content),
        publishedAt: new Date(),
      });
    }
  }

  /* ── Projects ── */
  const projectData = [
    {
      title: "Void CMS",
      slug: "void-cms",
      description: "A minimal, space-themed content management system built with Next.js and PostgreSQL.",
      techStack: ["Next.js", "TypeScript", "PostgreSQL", "Drizzle", "Tailwind CSS"],
      status: "published" as const,
      featured: true,
    },
    {
      title: "Neural Compression Engine",
      slug: "neural-compression-engine",
      description: "An experimental deep learning system for achieving near-optimal data compression using transformer architectures.",
      techStack: ["Python", "PyTorch", "CUDA", "Transformers"],
      status: "published" as const,
      featured: true,
    },
  ];

  for (const proj of projectData) {
    const [existing] = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, proj.slug)).limit(1);
    if (!existing) {
      await db.insert(projects).values({
        ...proj,
        publishedAt: new Date(),
      });
    }
  }

  /* ── Quotes ── */
  const quoteData = [
    { text: "The universe is not only queerer than we suppose, but queerer than we can suppose.", author: "J.B.S. Haldane", source: "Possible Worlds" },
    { text: "We are a way for the cosmos to know itself.", author: "Carl Sagan", source: "Cosmos" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", source: "Stanford Commencement, 2005" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", source: null },
    { text: "A human being should be able to change a diaper, plan an invasion, butcher a hog, conn a ship, design a building, write a sonnet, balance accounts, build a wall, set a bone, comfort the dying, take orders, give orders, cooperate, act alone, solve equations, analyze a new problem, pitch manure, program a computer, cook a tasty meal, fight efficiently, die gallantly.", author: "Robert A. Heinlein", source: "Time Enough for Love" },
  ];

  for (const q of quoteData) {
    const existing = await db.select({ id: quotes.id }).from(quotes).where(eq(quotes.text, q.text)).limit(1);
    if (existing.length === 0) {
      await db.insert(quotes).values({ ...q, featured: true });
    }
  }

  /* ── Books ── */
  const bookData = [
    { title: "Gödel, Escher, Bach", author: "Douglas Hofstadter", slug: "godel-escher-bach", rating: 5, status: "read" as const, notes: "A meditation on minds, machines, and the strange loops that connect them. This book fundamentally changed how I think about consciousness and self-reference." },
    { title: "The Beginning of Infinity", author: "David Deutsch", slug: "the-beginning-of-infinity", rating: 5, status: "read" as const, notes: "Deutsch argues that good explanations are the foundation of all progress. Optimistic, rigorous, and breathtaking in scope." },
    { title: "Meditations", author: "Marcus Aurelius", slug: "meditations", rating: 5, status: "read" as const, notes: "The private journal of a Roman emperor, wrestling with the same questions we face today. Proof that wisdom is timeless." },
  ];

  for (const book of bookData) {
    const [existing] = await db.select({ id: books.id }).from(books).where(eq(books.slug, book.slug)).limit(1);
    if (!existing) {
      await db.insert(books).values({ ...book, featured: true });
    }
  }

  /* ── Site Settings ── */
  const settingsData = [
    { key: "site_title", value: "SiddhantKrishna's Void" },
    { key: "site_description", value: "Thoughts at the edge of technology, philosophy, intelligence, and the future." },
    { key: "site_tagline", value: "Thoughts on intelligence, technology, startups, philosophy, robotics, AI, civilization, and the future." },
    { key: "author_name", value: "SiddhantKrishna" },
    { key: "social_twitter", value: "" },
    { key: "social_github", value: "" },
  ];

  for (const s of settingsData) {
    const [existing] = await db.select({ id: siteSettings.id }).from(siteSettings).where(eq(siteSettings.key, s.key)).limit(1);
    if (!existing) {
      await db.insert(siteSettings).values(s);
    }
  }
}
