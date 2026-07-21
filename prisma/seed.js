require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });




async function main() {
  console.log("Cleaning database...");
  await prisma.forumComment.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.document.deleteMany();
  await prisma.application.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating seed users...");

  // 1. Candidate
  const candidate = await prisma.user.create({
    data: {
      email: "candidate@opportunity.com",
      name: "Alex Mercer",
      role: "CANDIDATE",
      membership: "PREMIUM",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      profile: {
        create: {
          title: "Graduate Research Assistant & Software Engineer",
          bio: "Passionate about applying machine learning to climate modeling and sustainable engineering. Seeking fully funded PhD fellowships or Remote AI software roles.",
          education: "B.S. in Computer Science, Stanford University",
          skills: "React, Next.js, Python, PyTorch, SQL, TypeScript, Git",
          interests: "Artificial Intelligence, Climate Tech, Open Source, Higher Education",
          resumeName: "Alex_Mercer_CV.pdf",
          resumeText: "ALEX MERCER\nEmail: candidate@opportunity.com\nEducation: B.S. Computer Science from Stanford University (GPA 3.9/4.0).\nExperience:\n- Software Engineer Intern at Google (Summer 2025): Developed features for Google Cloud AI pipelines.\n- Undergraduate Researcher at Stanford ML Group (2024-Present): Trained transformer models for weather forecasting.\nSkills: Python, PyTorch, TypeScript, Next.js, Docker.",
          completedChecklist: JSON.stringify([
            "Upload Resume",
            "Complete Profile Bio",
            "Add Skills & Interests",
            "Generate First SOP"
          ])
        }
      }
    }
  });

  // 2. Employer
  const employer = await prisma.user.create({
    data: {
      email: "employer@opportunity.com",
      name: "Global Innovation Org",
      role: "EMPLOYER",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
    }
  });

  // 3. Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@opportunity.com",
      name: "Super Administrator",
      role: "ADMIN",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
    }
  });

  console.log("Seeding badges...");
  await prisma.badge.createMany({
    data: [
      { userId: candidate.id, name: "Global Scout", description: "Saved opportunities from 3 different continents", icon: "Globe" },
      { userId: candidate.id, name: "AI Practitioner", description: "Created an optimized resume using AI Advisor", icon: "Cpu" },
      { userId: candidate.id, name: "First Steps", description: "Created a verified profile", icon: "CheckCircle" }
    ]
  });

  console.log("Seeding documents...");
  await prisma.document.createMany({
    data: [
      { userId: candidate.id, name: "Alex_Mercer_CV.pdf", fileType: "pdf", sizeBytes: 142048, url: "/vault/Alex_Mercer_CV.pdf" },
      { userId: candidate.id, name: "Stanford_Transcript_Official.pdf", fileType: "pdf", sizeBytes: 524288, url: "/vault/Stanford_Transcript_Official.pdf" }
    ]
  });

  console.log("Seeding opportunities...");
  
  const opportunitiesData = [
    // 1. Scholarships
    {
      title: "Gates Cambridge Scholarship 2027",
      description: "Gates Cambridge Scholarships are prestigious, fully funded scholarships for international students to pursue a full-time postgraduate degree in any subject available at the University of Cambridge.",
      requirements: "Outstanding intellectual ability, leadership potential, a commitment to improving the lives of others, and a first-class or high upper-second-class honors degree.",
      organizationName: "Bill & Melinda Gates Foundation",
      logoUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=150",
      category: "SCHOLARSHIP",
      subCategory: "Fully Funded",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "MASTERS",
      location: "United Kingdom",
      isRemote: false,
      deadline: new Date("2026-10-15T23:59:59Z"),
      applyUrl: "https://www.gatescambridge.org/apply/",
      isApproved: true,
      isFeatured: true,
      views: 342,
      applicationsCount: 45
    },
    {
      title: "Knight-Hennessy Scholars Program",
      description: "The Knight-Hennessy Scholars program cultivates and supports a multidisciplinary community of graduate students at Stanford University, preparing leaders to address complex challenges.",
      requirements: "Open to citizens of all countries. You must apply to Stanford's graduate program and be accepted, in addition to being selected as a scholar.",
      organizationName: "Stanford University",
      logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=150",
      category: "SCHOLARSHIP",
      subCategory: "PhD & Masters",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "PHD",
      location: "United States",
      isRemote: false,
      deadline: new Date("2026-10-09T23:59:59Z"),
      applyUrl: "https://knight-hennessy.stanford.edu/",
      isApproved: true,
      isFeatured: true,
      views: 520,
      applicationsCount: 88
    },
    {
      title: "MEXT Japanese Government Scholarship",
      description: "Fully funded scholarship for international students seeking to study in top Japanese universities under undergraduate, masters, or PhD tracks.",
      requirements: "Academic excellence, willingness to learn Japanese language, recommended by local embassy or university.",
      organizationName: "Ministry of Education, Culture, Sports, Science and Technology (MEXT)",
      logoUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=150",
      category: "SCHOLARSHIP",
      subCategory: "Government",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "UNDERGRADUATE",
      location: "Japan",
      isRemote: false,
      deadline: new Date("2026-09-30T23:59:59Z"),
      applyUrl: "https://www.mext.go.jp/en/",
      isApproved: true,
      views: 290,
      applicationsCount: 30
    },

    // 2. Jobs
    {
      title: "Senior AI/ML Engineer",
      description: "Join our core engineering team to build scalable inference pipelines and fine-tune large language models for production workflows. Highly autonomous, fully remote team.",
      requirements: "3+ years of production experience in Python, PyTorch, Next.js, Docker, and experience managing LLM endpoints.",
      organizationName: "OpenAI Dev Group",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150",
      category: "JOB",
      subCategory: "AI Jobs",
      fundingType: "PAID",
      degreeLevel: "NONE",
      location: "Global",
      isRemote: true,
      deadline: new Date("2026-08-30T23:59:59Z"),
      applyUrl: "https://openai.com/careers",
      isApproved: true,
      isFeatured: true,
      views: 789,
      applicationsCount: 120
    },
    {
      title: "Graduate Software Engineer (Research & Dev)",
      description: "A fast-paced program rotating across Cloud Infrastructure, Machine Learning, and API Services teams. Includes dedicated mentorship from Principal Engineers.",
      requirements: "Recently graduated or graduating in 2026 with a degree in CS, Math, Physics, or equivalent.",
      organizationName: "Stripe",
      logoUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=150",
      category: "JOB",
      subCategory: "Graduate Programs",
      fundingType: "PAID",
      degreeLevel: "UNDERGRADUATE",
      location: "Ireland",
      isRemote: false,
      deadline: new Date("2026-11-15T23:59:59Z"),
      applyUrl: "https://stripe.com/jobs",
      isApproved: true,
      views: 180,
      applicationsCount: 22
    },

    // 3. Internships
    {
      title: "Summer 2027 Research Internship - ML for Science",
      description: "Work with leading climate and material scientists to apply graph neural networks and diffusion models to weather forecasting or molecule generation.",
      requirements: "Currently enrolled in a Masters or PhD program in CS, Stats, or Chemistry/Physics with strong PyTorch experience.",
      organizationName: "Google DeepMind",
      logoUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=150",
      category: "INTERNSHIP",
      subCategory: "Paid",
      fundingType: "PAID",
      degreeLevel: "MASTERS",
      location: "United Kingdom",
      isRemote: false,
      deadline: new Date("2026-12-01T23:59:59Z"),
      applyUrl: "https://deepmind.google/careers",
      isApproved: true,
      isFeatured: true,
      views: 450,
      applicationsCount: 65
    },
    {
      title: "Remote Frontend Developer Intern",
      description: "Contribute to open-source UI libraries, build sleek web applications using Next.js and Tailwind CSS, and learn modern deployment pipelines.",
      requirements: "Basic knowledge of React, CSS, and Git. Portfolio of web projects is a strong plus.",
      organizationName: "Vercel Labs",
      logoUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=150",
      category: "INTERNSHIP",
      subCategory: "Remote",
      fundingType: "PAID",
      degreeLevel: "NONE",
      location: "Global",
      isRemote: true,
      deadline: new Date("2026-08-15T23:59:59Z"),
      applyUrl: "https://vercel.com/careers",
      isApproved: true,
      views: 610,
      applicationsCount: 140
    },

    // 4. Fellowships
    {
      title: "CERN Senior Fellowship Program",
      description: "Research fellowships at the European Organization for Nuclear Research. Candidates participate in groundbreaking particle physics, computer science, and accelerator engineering experiments.",
      requirements: "PhD or at least 4 years of research experience after your MSc degree. Open to nationals of CERN member states.",
      organizationName: "CERN",
      logoUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=150",
      category: "FELLOWSHIP",
      subCategory: "Research",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "PHD",
      location: "Switzerland",
      isRemote: false,
      deadline: new Date("2026-09-01T23:59:59Z"),
      applyUrl: "https://careers.cern/fellowships",
      isApproved: true,
      views: 220,
      applicationsCount: 18
    },

    // 5. Competitions
    {
      title: "Global AI Hackathon 2026",
      description: "Build innovative tools utilizing generative models to solve challenges in Education, Healthcare, or Logistics. 1st Place: $50,000 USD prize pool, GPU compute credits, and investor matching.",
      requirements: "Open to individuals and teams of up to 4 members. All software must be developed during the hackathon period.",
      organizationName: "Hugging Face & NVIDIA",
      logoUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=150",
      category: "COMPETITION",
      subCategory: "Hackathons",
      fundingType: "PAID",
      degreeLevel: "NONE",
      location: "Global",
      isRemote: true,
      deadline: new Date("2026-11-20T23:59:59Z"),
      applyUrl: "https://huggingface.co/hackathon-2026",
      isApproved: true,
      isFeatured: true,
      views: 890,
      applicationsCount: 210
    },

    // 6. Grants
    {
      title: "Y Combinator Bio Grant",
      description: "Grants and investments for early-stage life-sciences and biotechnology founders seeking to validate pre-clinical concepts or build diagnostic hardware.",
      requirements: "Submit a research deck, team bio, and a brief demonstration of underlying technology or scientific proof-of-concept.",
      organizationName: "Y Combinator",
      logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=150",
      category: "GRANT",
      subCategory: "Startup Grants",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "NONE",
      location: "United States",
      isRemote: true,
      deadline: new Date("2026-10-30T23:59:59Z"),
      applyUrl: "https://www.ycombinator.com/apply",
      isApproved: true,
      views: 310,
      applicationsCount: 42
    },

    // 7. Exchange Programs
    {
      title: "Erasmus+ Mundus Joint Master Degree",
      description: "An integrated study program, jointly delivered by an international consortium of higher education institutions, offering student mobility across Europe.",
      requirements: "Bachelor's degree or equivalent, academic excellence, and proof of English/European language capability.",
      organizationName: "European Union Council",
      logoUrl: "https://images.unsplash.com/photo-1461536848560-be8172f3c045?auto=format&fit=crop&q=80&w=150",
      category: "EXCHANGE",
      subCategory: "Student Exchange",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "MASTERS",
      location: "Europe",
      isRemote: false,
      deadline: new Date("2026-12-15T23:59:59Z"),
      applyUrl: "https://erasmus-plus.ec.europa.eu/",
      isApproved: true,
      views: 400,
      applicationsCount: 55
    },

    // 8. Conferences
    {
      title: "NeurIPS 2026 Conference (Travel Grants Available)",
      description: "The premier global conference on Neural Information Processing Systems. Fully covered travel grants, registrations, and lodging support for accepted student paper presenters and workshop authors.",
      requirements: "Must be a student author of an accepted paper or work-in-progress workshop submission.",
      organizationName: "NeurIPS Foundation",
      logoUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=150",
      category: "CONFERENCE",
      subCategory: "AI",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "PHD",
      location: "Canada",
      isRemote: false,
      deadline: new Date("2026-09-10T23:59:59Z"),
      applyUrl: "https://neurips.cc/Conferences/2026",
      isApproved: true,
      views: 380,
      applicationsCount: 29
    },

    // 9. Courses
    {
      title: "CS50: Introduction to Computer Science",
      description: "Harvard University's legendary entry-level introduction to the intellectual enterprises of computer science and the art of programming.",
      requirements: "Open to anyone, free of charge. Optional verified certificate available for a small fee.",
      organizationName: "Harvard University via edX",
      logoUrl: "https://images.unsplash.com/photo-1496307653780-3aee7788807b?auto=format&fit=crop&q=80&w=150",
      category: "COURSE",
      subCategory: "Free Certifications",
      fundingType: "FREE",
      degreeLevel: "NONE",
      location: "Global",
      isRemote: true,
      deadline: new Date("2026-12-31T23:59:59Z"),
      applyUrl: "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x",
      isApproved: true,
      views: 950,
      applicationsCount: 400
    }
  ];

  console.log(`Seeding ${opportunitiesData.length} opportunities...`);
  
  const opportunities = [];
  for (const item of opportunitiesData) {
    const opp = await prisma.opportunity.create({
      data: item
    });
    opportunities.push(opp);
  }

  console.log("Seeding application tracker items...");
  await prisma.application.createMany({
    data: [
      { userId: candidate.id, opportunityId: opportunities[0].id, status: "SAVED", notes: "Drafting motivation letter" },
      { userId: candidate.id, opportunityId: opportunities[1].id, status: "APPLIED", notes: "Submitted application via Stanford Portal on July 10" },
      { userId: candidate.id, opportunityId: opportunities[3].id, status: "INTERVIEW", notes: "Technical phone screen scheduled for July 25 at 4 PM EST" }
    ]
  });

  console.log("Seeding forum topics...");
  
  const post1 = await prisma.forumPost.create({
    data: {
      title: "Tips for Gates Cambridge Motivation Statement?",
      content: "Hi everyone! I am preparing my application for the Gates Cambridge Master's track in Machine Learning. Does anyone have advice on how to emphasize the 'leadership capability' and 'improving the lives of others' parts? What did past scholars focus on in their essay?",
      category: "SCHOLARSHIPS",
      authorId: candidate.id
    }
  });

  const post2 = await prisma.forumPost.create({
    data: {
      title: "Prepare for OpenAI's Senior AI Engineer interview",
      content: "Let's gather resources! Does anyone have experience with Stripe or OpenAI technical rounds? Is it mostly system design on training pipelines, or does it also include coding challenges on transformers and tensor operations?",
      category: "JOBS",
      authorId: candidate.id
    }
  });

  console.log("Seeding comments...");
  await prisma.forumComment.createMany({
    data: [
      {
        content: "Hi Alex! I got selected in 2024. The key is to connect your research directly to a tangible social impact. Don't just say your algorithm is fast—explain how it will help predict local crop failures or floods to help farmers. Leadership is shown by showing initiative in projects outside classes.",
        postId: post1.id,
        authorId: employer.id // using employer account as mentor/advisor response
      },
      {
        content: "For OpenAI, focus heavily on CUDA details, flash attention mechanism, distributed training architectures (data parallel vs tensor parallel), and optimization algorithms. Deep understanding of PyTorch internals is heavily tested.",
        postId: post2.id,
        authorId: employer.id
      }
    ]
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
