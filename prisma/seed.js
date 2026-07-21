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
    // --- NEPAL OPPORTUNITIES ---
    // 1. Lok Sewa / Government Jobs (लोक सेवा आयोग)
    {
      title: "Section Officer (शाखा अधिकृत - प्रशासन / सामान्य प्रशासन)",
      description: "Public Service Commission Nepal (लोक सेवा आयोग) invites applications for Gazetted Third Class (Section Officer) positions in General Administration, Revenue, and Accounting cadres. Selected officers will be assigned across central ministries and provincial departments.",
      requirements: "Bachelor's Degree in any discipline from a recognized university. Age between 21 and 35 years (40 for women and marginalized candidates). Must pass Lok Sewa preliminary, written, and interview stages.",
      organizationName: "Public Service Commission (लोक सेवा आयोग)",
      logoUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=150",
      category: "JOB",
      subCategory: "Lok Sewa / Public Sector",
      fundingType: "PAID",
      degreeLevel: "UNDERGRADUATE",
      location: "Kathmandu Valley",
      isRemote: false,
      deadline: new Date("2026-09-15T23:59:59Z"),
      applyUrl: "https://psc.gov.np/",
      isApproved: true,
      isFeatured: true,
      views: 1240,
      applicationsCount: 310
    },
    {
      title: "Computer Officer (कम्प्युटर अधिकृत - Grade 7)",
      description: "Nepal Rastra Bank (Central Bank of Nepal) is recruiting Computer Officers to oversee core banking systems, cyber security operations, and financial database infrastructure at its Baluwatar Central Office.",
      requirements: "Bachelor's Degree in Computer Science (BE Computer, BIT, BCA, BSc CSIT). Experience with SQL databases, network security, and linux servers required.",
      organizationName: "Nepal Rastra Bank (नेपाल राष्ट्र बैंक)",
      logoUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=150",
      category: "JOB",
      subCategory: "Banking & IT",
      fundingType: "PAID",
      degreeLevel: "UNDERGRADUATE",
      location: "Kathmandu (Baluwatar)",
      isRemote: false,
      deadline: new Date("2026-08-30T23:59:59Z"),
      applyUrl: "https://www.nrb.org.np/careers",
      isApproved: true,
      isFeatured: true,
      views: 890,
      applicationsCount: 175
    },
    {
      title: "Civil Sub-Engineer (ओभरसियर - Gandaki Province)",
      description: "Provincial Public Service Commission (प्रदेश लोक सेवा आयोग, गण्डकी प्रदेश) invites applications for Civil Sub-Engineer positions for rural road construction, irrigation, and municipal infrastructure projects.",
      requirements: "Diploma in Civil Engineering from a recognized technical institution (CTEVT). Age limit: 18-35 years.",
      organizationName: "PPSC Gandaki Province (प्रदेश लोक सेवा आयोग)",
      logoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=150",
      category: "JOB",
      subCategory: "Lok Sewa / Engineering",
      fundingType: "PAID",
      degreeLevel: "NONE",
      location: "Pokhara (Gandaki Province)",
      isRemote: false,
      deadline: new Date("2026-10-05T23:59:59Z"),
      applyUrl: "https://ppsc.gandaki.gov.np/",
      isApproved: true,
      views: 620,
      applicationsCount: 112
    },

    // 2. INGO / NGO Sector Nepal
    {
      title: "Senior Program Officer (Climate Resilient Development)",
      description: "USAID Nepal is hiring a Senior Program Officer to design and monitor community-level climate adaptation and watershed management projects across western Nepal watersheds.",
      requirements: "Master's Degree in Environmental Science, Agriculture, Development Studies, or related field with at least 5 years of relevant INGO project management experience.",
      organizationName: "USAID Nepal",
      logoUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=150",
      category: "JOB",
      subCategory: "INGO / International Dev",
      fundingType: "PAID",
      degreeLevel: "MASTERS",
      location: "Lalitpur (Sanepa)",
      isRemote: false,
      deadline: new Date("2026-09-10T23:59:59Z"),
      applyUrl: "https://www.usaid.gov/nepal/careers",
      isApproved: true,
      isFeatured: true,
      views: 1150,
      applicationsCount: 198
    },
    {
      title: "Humanitarian Response & Disaster Coordinator",
      description: "Save the Children Nepal seeks a dedicated Humanitarian Response Coordinator to manage rapid response emergency logistics, flood relief initiatives, and child safety programs in Karnali & Koshi provinces.",
      requirements: "Bachelor's or Master's in Disaster Risk Management, Social Sciences, or Public Health. Minimum 4 years field experience in emergency response in Nepal.",
      organizationName: "Save the Children Nepal",
      logoUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=150",
      category: "JOB",
      subCategory: "INGO / Relief",
      fundingType: "PAID",
      degreeLevel: "UNDERGRADUATE",
      location: "Surkhet & Kathmandu",
      isRemote: false,
      deadline: new Date("2026-08-25T23:59:59Z"),
      applyUrl: "https://nepal.savethechildren.net/careers",
      isApproved: true,
      views: 740,
      applicationsCount: 94
    },
    {
      title: "Public Health Specialist (Maternal & Child Health)",
      description: "UNICEF Nepal is recruiting a Public Health Specialist to support nutrition, immunization, and community health officer training in Province 2 and Chitwan district.",
      requirements: "Master's in Public Health (MPH) or MBBS with postgraduate qualification. Proven field experience working with Nepal Ministry of Health.",
      organizationName: "UNICEF Nepal",
      logoUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=150",
      category: "JOB",
      subCategory: "INGO / Public Health",
      fundingType: "PAID",
      degreeLevel: "MASTERS",
      location: "Chitwan / Bagmati Province",
      isRemote: false,
      deadline: new Date("2026-09-20T23:59:59Z"),
      applyUrl: "https://www.unicef.org/nepal/careers",
      isApproved: true,
      views: 830,
      applicationsCount: 130
    },

    // 3. Tech & IT Industry Nepal
    {
      title: "Senior AI/ML Engineer",
      description: "Cotiviti Nepal is looking for a Senior AI/ML Engineer to build intelligent healthcare data pipelines, medical NLP models, and automated claim analysis systems for international clients.",
      requirements: "3+ years experience with Python, PyTorch, Scikit-learn, Docker, and REST/gRPC API deployments. Experience with healthcare NLP models is a plus.",
      organizationName: "Cotiviti Nepal",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150",
      category: "JOB",
      subCategory: "Tech & AI",
      fundingType: "PAID",
      degreeLevel: "UNDERGRADUATE",
      location: "Kathmandu (Hattisar) / Hybrid",
      isRemote: true,
      deadline: new Date("2026-08-31T23:59:59Z"),
      applyUrl: "https://www.cotiviti.com.np/careers",
      isApproved: true,
      isFeatured: true,
      views: 1420,
      applicationsCount: 240
    },
    {
      title: "Lead Full-Stack Software Engineer (Node.js & React)",
      description: "Leapfrog Technology Nepal is seeking an experienced Lead Full-Stack Engineer to architect enterprise web platforms, mentor junior engineers, and drive modern DevOps practices.",
      requirements: "4+ years experience in React, Next.js, Node.js/TypeScript, PostgreSQL, and AWS/GCP cloud environments.",
      organizationName: "Leapfrog Technology",
      logoUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=150",
      category: "JOB",
      subCategory: "Tech & Software",
      fundingType: "PAID",
      degreeLevel: "UNDERGRADUATE",
      location: "Kathmandu / Remote Nepal",
      isRemote: true,
      deadline: new Date("2026-09-30T23:59:59Z"),
      applyUrl: "https://www.lftechnology.com/careers",
      isApproved: true,
      views: 980,
      applicationsCount: 160
    },
    {
      title: "Associate React & Frontend Developer",
      description: "Deerhold Nepal is hiring an Associate Frontend Developer to craft interactive UI components, dashboards, and mobile-responsive web applications for healthcare analytics.",
      requirements: "Strong proficiency in JavaScript, TypeScript, React.js, Tailwind CSS, and Git version control.",
      organizationName: "Deerhold Nepal",
      logoUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=150",
      category: "INTERNSHIP",
      subCategory: "Tech / Frontend",
      fundingType: "PAID",
      degreeLevel: "NONE",
      location: "Kathmandu (Siphal)",
      isRemote: false,
      deadline: new Date("2026-08-15T23:59:59Z"),
      applyUrl: "https://deerhold.com/careers",
      isApproved: true,
      views: 890,
      applicationsCount: 210
    },

    // 4. Banking & Corporate Nepal
    {
      title: "Management Trainee 2026 (MT Batch)",
      description: "Nabil Bank Limited, Nepal's premier private commercial bank, announces its Management Trainee Batch 2026. Successful candidates will undergo intensive banking rotation across credit, trade finance, and digital operations.",
      requirements: "Master's degree in Management (MBA, MBS, M.Com) or Finance/Economics with minimum 65% or CGPA 3.3. Age limit: Not exceeding 28 years.",
      organizationName: "Nabil Bank Limited",
      logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=150",
      category: "JOB",
      subCategory: "Banking & Finance",
      fundingType: "PAID",
      degreeLevel: "MASTERS",
      location: "Kathmandu & Nationwide Branches",
      isRemote: false,
      deadline: new Date("2026-10-15T23:59:59Z"),
      applyUrl: "https://www.nabilbank.com/careers",
      isApproved: true,
      isFeatured: true,
      views: 1850,
      applicationsCount: 420
    },

    // 5. Scholarships for Nepali Students
    {
      title: "Fulbright Foreign Student Program 2027 (USA)",
      description: "USEF-Nepal announces the Fulbright Master's Degree Program for Nepali citizens seeking to pursue a Master's degree at top universities in the United States. Fully funded tuition, stipend, health insurance, and airfare.",
      requirements: "Nepali citizenship, minimum 4-year Bachelor's degree with strong academic record, at least 2 years post-degree work experience, and commitment to return to Nepal.",
      organizationName: "USEF-Nepal (Fulbright Commission)",
      logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=150",
      category: "SCHOLARSHIP",
      subCategory: "Fully Funded / USA",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "MASTERS",
      location: "United States (For Nepali Citizens)",
      isRemote: false,
      deadline: new Date("2026-10-30T23:59:59Z"),
      applyUrl: "https://usefnepal.org/fulbright/",
      isApproved: true,
      isFeatured: true,
      views: 2100,
      applicationsCount: 510
    },
    {
      title: "Chevening Nepal Scholarship 2026/27 (UK)",
      description: "The UK Government's global scholarship program offers fully funded Master's degrees at any UK university for outstanding Nepali emerging leaders.",
      requirements: "Nepali citizen, undergraduate degree, 2+ years (2,800 hours) work experience, and clear leadership potential.",
      organizationName: "British Embassy Kathmandu & Chevening UK",
      logoUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=150",
      category: "SCHOLARSHIP",
      subCategory: "Fully Funded / UK",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "MASTERS",
      location: "United Kingdom (For Nepali Citizens)",
      isRemote: false,
      deadline: new Date("2026-11-05T23:59:59Z"),
      applyUrl: "https://www.chevening.org/nepal/",
      isApproved: true,
      views: 1650,
      applicationsCount: 380
    },
    {
      title: "Australia Awards Nepal Scholarship 2027",
      description: "Fully funded Master's scholarships in Australia provided by the Australian Government for qualified Nepali professionals in priority sectors (Education, Environment, Economic Governance).",
      requirements: "Nepali citizen residing in Nepal, Bachelor's degree, minimum 2 years relevant work experience in Nepal. Special encouragement for women and persons with disabilities.",
      organizationName: "Australian Embassy Nepal",
      logoUrl: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=80&w=150",
      category: "SCHOLARSHIP",
      subCategory: "Fully Funded / Australia",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "MASTERS",
      location: "Australia (For Nepali Citizens)",
      isRemote: false,
      deadline: new Date("2026-11-30T23:59:59Z"),
      applyUrl: "https://australiaawardsnepal.org/",
      isApproved: true,
      views: 1490,
      applicationsCount: 340
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
