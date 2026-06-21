import { 
  InterviewAnalysis, 
  ResumeAnalysis, 
  CoverLetterInput, 
  LinkedInInput, 
  LinkedInOutputs, 
  RoadmapInput, 
  RoadmapOutput, 
  RoadmapPhase,
  EligibilityInput, 
  EligibilityOutput, 
  LeetCodeInput, 
  StudyTask,
  ExpenseSplitReport
} from '../types';

// Predefined industry keywords for matches
const TECH_KEYWORDS = [
  'React', 'Node.js', 'Next.js', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'SQL', 'NoSQL', 
  'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'CI/CD', 'Agile', 'Scrum',
  'REST API', 'GraphQL', 'System Design', 'Algorithms', 'Data Structures', 'Machine Learning', 
  'Cloud Computing', 'UI/UX', 'Figma', 'Redux', 'Tailwind CSS', 'Testing', 'Jest'
];

const SOFT_KEYWORDS = [
  'Leadership', 'Communication', 'Collaboration', 'Problem Solving', 'Critical Thinking', 
  'Time Management', 'Adaptability', 'Creativity', 'Conflict Resolution', 'Mentorship', 'Negotiation'
];

// Filler words to search in interview answers
const FILLER_WORDS = ['like', 'just', 'basically', 'actually', 'literally', 'um', 'uh', 'so yeah', 'you know', 'sort of'];

// Positive action verbs to boost scores
const ACTION_VERBS = ['led', 'managed', 'developed', 'created', 'designed', 'built', 'improved', 'increased', 'optimized', 'solved', 'implemented', 'achieved', 'delivered'];

/**
 * 1. Interview Answer Improver Engine
 */
export function analyzeInterviewAnswer(question: string, userAnswer: string): InterviewAnalysis {
  const words = userAnswer.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const charCount = userAnswer.length;
  const readingTime = Math.ceil(wordCount / 3); // Average reading speed ~3 words/second

  if (wordCount === 0) {
    return {
      metrics: { wordCount: 0, charCount: 0, readingTime: 0, confidenceScore: 0, grammarScore: 0, clarityScore: 0, toneScore: 0 },
      strengths: [], weaknesses: ['No answer provided.'], missingKeywords: [], suggestions: ['Please enter an answer to analyze.'], enhancedAnswer: ''
    };
  }

  // Heuristic Scoring
  let fillerCount = 0;
  FILLER_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = userAnswer.match(regex);
    if (matches) fillerCount += matches.length;
  });

  let actionVerbCount = 0;
  ACTION_VERBS.forEach(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    const matches = userAnswer.match(regex);
    if (matches) actionVerbCount += matches.length;
  });

  // Structural checks (STAR Method elements)
  const hasSituation = /situation|when I was|at my previous|project|role|during/i.test(userAnswer);
  const hasTask = /task|responsibility|goal|challenge|aim|required/i.test(userAnswer);
  const hasAction = /action|i decided to|i coded|i led|i created|we solved|implemented/i.test(userAnswer);
  const hasResult = /result|outcome|metric|consequently|finally|saved|increased|improved|percentage/i.test(userAnswer);

  // Math-based scoring
  let confidenceScore = 60 + (actionVerbCount * 5) - (fillerCount * 4);
  if (hasSituation) confidenceScore += 5;
  if (hasResult) confidenceScore += 10;
  confidenceScore = Math.max(10, Math.min(100, confidenceScore));

  let clarityScore = 70 - (fillerCount * 3);
  if (wordCount < 30) clarityScore -= 20; // Too short is unclear
  if (wordCount > 250) clarityScore -= 10; // Too wordy gets rambling
  clarityScore = Math.max(15, Math.min(100, clarityScore));

  let grammarScore = 80 - (fillerCount * 2);
  if (userAnswer.includes('...')) grammarScore -= 10;
  grammarScore = Math.max(20, Math.min(100, grammarScore));

  let toneScore = 55 + (actionVerbCount * 6);
  if (userAnswer.toLowerCase().includes('stuff') || userAnswer.toLowerCase().includes('things')) toneScore -= 10;
  toneScore = Math.max(10, Math.min(100, toneScore));

  // Compile Strengths & Weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  if (actionVerbCount > 1) strengths.push('Good usage of active, impact-driven verbs.');
  if (hasSituation && hasAction && hasResult) strengths.push('Strong structural flow conforming to the STAR method.');
  else if (hasResult) strengths.push('Great job mentioning concrete results and outcomes.');

  if (wordCount > 80 && fillerCount === 0) strengths.push('Highly concise and clean answer with no noticeable filler words.');

  if (fillerCount > 2) {
    weaknesses.push('High frequency of verbal fillers (e.g. "like", "just", "um").');
    suggestions.push('Practice pausing instead of using filler words to sound more confident.');
  }
  if (!hasResult) {
    weaknesses.push('Lacks a defined "Result" component.');
    suggestions.push('Conclude your answer with a specific metric or lesson learned (e.g. "This resulted in 20% faster load times").');
  }
  if (wordCount < 40) {
    weaknesses.push('Answer is too brief to explain your achievements.');
    suggestions.push('Expand your response. A good interview answer is usually between 100 to 200 words.');
  }

  // Keywords scan
  const missingKeywords: string[] = [];
  const lowercaseAnswer = userAnswer.toLowerCase();
  
  // Custom keyword suggestions based on common questions
  const qaKeywords: { [key: string]: string[] } = {
    'conflict': ['collaboration', 'empathy', 'communication', 'compromise', 'resolution'],
    'strength': ['leadership', 'initiative', 'adaptability', 'technical expertise', 'problem-solving'],
    'weakness': ['self-awareness', 'improvement', 'delegation', 'feedback', 'growth mindset'],
    'project': ['architecture', 'testing', 'scalability', 'performance', 'version control', 'agile']
  };

  let matchedCategory = 'project';
  for (let key in qaKeywords) {
    if (question.toLowerCase().includes(key)) {
      matchedCategory = key;
      break;
    }
  }

  qaKeywords[matchedCategory].forEach(kw => {
    if (!lowercaseAnswer.includes(kw)) {
      missingKeywords.push(kw);
    }
  });

  // Dynamic STAR Re-structure based on inputs
  let enhancedAnswer = '';
  if (wordCount > 0) {
    let situationText = 'In my previous software engineering project, we were developing a critical user feature.';
    let taskText = 'The goal was to engineer a robust, scalable system while managing tight deployment deadlines.';
    let actionText = `I analyzed the codebase and proactively ${actionVerbCount > 0 ? 'implemented optimizations' : 'collaborated with the team'} to streamline execution pathing.`;
    let resultText = 'This resulted in a significant stability improvement, accelerating load times by 20% and earning stakeholder approval.';

    // Try to pull snippets from user answer
    const sentences = userAnswer.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
    if (sentences.length > 0) situationText = sentences[0] + '.';
    if (sentences.length > 1) taskText = `Our challenge was that ${sentences[1].toLowerCase()}.`;
    if (sentences.length > 2) actionText = `To solve this, I ${sentences[2].toLowerCase()}.`;
    if (sentences.length > 3) resultText = `Ultimately, ${sentences[3].toLowerCase()}.`;

    enhancedAnswer = `To restructure this into an optimized STAR response:\n\n` +
      `• **Situation:** ${situationText}\n` +
      `• **Task:** ${taskText}\n` +
      `• **Action:** ${actionText}\n` +
      `• **Result:** ${resultText}`;
  }

  return {
    metrics: { wordCount, charCount, readingTime, confidenceScore, grammarScore, clarityScore, toneScore },
    strengths,
    weaknesses: weaknesses.length > 0 ? weaknesses : ['None detected! Keep it up.'],
    missingKeywords,
    suggestions: suggestions.length > 0 ? suggestions : ['Your answer is solid. Maintain high energy and clear pronunciation.'],
    enhancedAnswer
  };
}


/**
 * 2. Resume ATS Scanner Engine
 */
export function analyzeResume(resumeText: string): ResumeAnalysis {
  if (!resumeText.trim()) {
    return {
      atsScore: 0, skillsDetected: [], missingKeywords: [], weakSections: [], formattingQuality: 'Needs Improvement', suggestedImprovements: ['Please input your resume text to begin scanner.']
    };
  }

  const lowercaseResume = resumeText.toLowerCase();

  // Find skills
  const skillsDetected = TECH_KEYWORDS.filter(skill => lowercaseResume.includes(skill.toLowerCase()))
    .concat(SOFT_KEYWORDS.filter(skill => lowercaseResume.includes(skill.toLowerCase())));

  // Missing Skills Heuristics
  const missingKeywords = [...TECH_KEYWORDS, ...SOFT_KEYWORDS]
    .filter(skill => !skillsDetected.includes(skill))
    .slice(0, 8); // Display top 8 missing skills

  // Check section headings
  const hasExperience = /experience|work history|employment/i.test(lowercaseResume);
  const hasEducation = /education|academic|university|college/i.test(lowercaseResume);
  const hasSkills = /skills|expertise|technologies/i.test(lowercaseResume);
  const hasProjects = /projects|portfolio|achievements/i.test(lowercaseResume);
  const hasContact = /email|phone|contact|linkedin|github/i.test(lowercaseResume);

  const weakSections: string[] = [];
  if (!hasExperience) weakSections.push('Work Experience');
  if (!hasEducation) weakSections.push('Education');
  if (!hasSkills) weakSections.push('Skills Section');
  if (!hasProjects) weakSections.push('Projects / Portfolio');
  if (!hasContact) weakSections.push('Contact Information');

  // Formatting Quality Heuristics
  let formatScore = 100;
  if (!hasContact) formatScore -= 30;
  if (resumeText.length < 500) formatScore -= 20; // Too short
  if (resumeText.length > 6000) formatScore -= 10; // Too long / multi-page
  
  // Bullet points indicator
  const bulletCount = (resumeText.match(/[•\-\*]/g) || []).length;
  if (bulletCount < 5) formatScore -= 15;

  let formattingQuality: ResumeAnalysis['formattingQuality'] = 'Excellent';
  if (formatScore < 50) formattingQuality = 'Needs Improvement';
  else if (formatScore < 70) formattingQuality = 'Fair';
  else if (formatScore < 90) formattingQuality = 'Good';

  // Calculate ATS Score
  let atsScore = 30; // base score
  atsScore += (skillsDetected.length * 4); // more skills, higher score
  atsScore += (5 - weakSections.length) * 8; // less weak sections, higher score
  if (bulletCount >= 10) atsScore += 10;
  if (lowercaseResume.includes('email') || lowercaseResume.includes('@')) atsScore += 10;
  
  atsScore = Math.max(10, Math.min(98, atsScore)); // Cap below 100 because there is always room for enhancement

  // Recommendations
  const suggestedImprovements: string[] = [];
  if (weakSections.includes('Work Experience')) {
    suggestedImprovements.push('Add a dedicated "Work Experience" section detailing your roles, responsibilities, and key accomplishments.');
  }
  if (weakSections.includes('Contact Information')) {
    suggestedImprovements.push('Ensure your email address, phone number, and LinkedIn/GitHub profiles are clearly visible at the top.');
  }
  if (bulletCount < 10) {
    suggestedImprovements.push('Use structured bullet points (starting with strong action verbs) instead of paragraph text to describe your roles.');
  }
  if (skillsDetected.length < 5) {
    suggestedImprovements.push('Increase keyword density: Add a distinct "Skills" section listing your core technologies and frameworks.');
  }
  if (resumeText.length < 800) {
    suggestedImprovements.push('Your resume content is sparse. Elaborate on your academic projects and technical responsibilities.');
  }

  if (suggestedImprovements.length === 0) {
    suggestedImprovements.push('Your resume matches high ATS standards. Continue tweaking wording to target specific job descriptions.');
  }

  return {
    atsScore,
    skillsDetected,
    missingKeywords,
    weakSections,
    formattingQuality,
    suggestedImprovements
  };
}

/**
 * 3. Cover Letter Generator
 */
export function generateCoverLetter(input: CoverLetterInput): string {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const name = input.name || 'Your Name';
  const company = input.companyName || 'Target Company';
  const role = input.role || 'Target Role';
  const skills = input.skills || 'critical technical skills';
  const experience = input.experience || 'your background';

  let customPara = '';
  if (/digital heroes|startup|launch|agency/i.test(company.toLowerCase())) {
    customPara = `I am particularly drawn to ${company}'s agile culture and reputation for high-impact innovation. In a fast-paced environment, I understand the importance of rapid prototyping, continuous delivery, and taking ownership of end-to-end features.`;
  } else if (/google|microsoft|amazon|meta|apple|netflix|salesforce/i.test(company.toLowerCase())) {
    customPara = `I admire ${company}'s focus on engineering excellence, scalability, and robust system designs. I am excited by the prospect of contributing to high-availability systems that serve millions of users globally.`;
  } else {
    customPara = `I am excited by ${company}'s product roadmap and customer-first engineering culture. I am eager to apply my technical design skills to help build reliable and engaging user experiences.`;
  }

  return `[${name}]
[City, State, Zip]
[Your Email] | [Your Phone Number]

${date}

Hiring Manager
${company}
[Company Address]

Subject: Application for ${role} position

Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${company}. With a solid foundation in ${experience} and a proven track record of developing key assets, I am confident in my ability to make an immediate impact on your engineering and development teams.

${customPara}

Throughout my career, I have prioritized coding clean, modular systems, and optimizing workflows. I have extensive experience working with ${skills}, which directly aligns with the technical requirements mentioned in your job posting.

In my previous projects, I successfully:
• Leveraged my skills to build high-performance applications, improving response rates.
• Collaborated in cross-functional team environments to resolve complex algorithmic issues.
• Applied modern development workflows to shorten development lifecycles and increase reliability.

I am eager to bring my problem-solving mindset, collaborative spirit, and technical competencies to the team at ${company}. Thank you for your time, consideration, and review of my application. I look forward to the possibility of discussing how my skills and background can support the goals of ${company}.

Sincerely,

${name}`;
}

/**
 * 4. LinkedIn Post Generator
 */
export function generateLinkedInPost(input: LinkedInInput): LinkedInOutputs {
  const proj = input.projectName || 'My Side Project';
  const skills = input.skillsUsed || 'Next.js, TypeScript, Tailwind';
  const problem = input.problemSolved || 'made workflows easier';

  // Dynamic hashtags based on skills
  const skillsList = skills.split(',').map(s => s.trim().toLowerCase());
  const dynamicHashtags = ['#Innovation', '#Portfolio', '#CareerDevelopment', '#OpenSource'];
  if (skillsList.some(s => s.includes('react'))) dynamicHashtags.push('#ReactJS');
  if (skillsList.some(s => s.includes('next'))) dynamicHashtags.push('#NextJS');
  if (skillsList.some(s => s.includes('typescript') || s.includes('ts'))) dynamicHashtags.push('#TypeScript');
  if (skillsList.some(s => s.includes('python'))) dynamicHashtags.push('#Python');
  if (skillsList.some(s => s.includes('java') && !s.includes('javascript'))) dynamicHashtags.push('#Java');
  if (skillsList.some(s => s.includes('tailwind'))) dynamicHashtags.push('#TailwindCSS');
  if (skillsList.some(s => s.includes('aws') || s.includes('cloud'))) dynamicHashtags.push('#CloudComputing');
  const hashtagsStr = dynamicHashtags.join(' ');

  const emojiRich = `🚀 I'm thrilled to share a new project I've been working on: **${proj}**! 

💡 **The Problem:** 
Many developers and students face roadblocks when trying to ${problem}. It's time-consuming, fragmented, and often requires expensive software.

🛠️ **The Solution:** 
I built ${proj} to solve this exact issue. It provides a clean, client-side browser solution that streamlines the entire workflow.

🔑 **Key Tech Stack Used:**
• ${skills.split(',').map(s => s.trim()).join('\n• ')}

📈 Building this taught me so much about system optimization, clean architecture, and modern UX design principles. Check out the demo and let me know your thoughts!

${hashtagsStr}`;

  const shortVersion = `🚀 Just finished building **${proj}**! 

It's a client-side tool designed to help developers ${problem}. 

Built with: ${skills}

Check out the code, play around with the features, and let me know what you think! 👇

${hashtagsStr}`;

  const longVersion = `Excited to announce the launch of **${proj}**, an open-source web application designed to solve a major pain point: how to ${problem} without relying on paid APIs or external servers.

Building this application from scratch was a fantastic journey in building responsive interfaces. Here is a breakdown of what went into it:

1️⃣ **Core Challenge**: Handling complex processes (like optimization) completely in the browser environment.
2️⃣ **Tech Stack Decisions**: Selected ${skills} for maximum performance, type-safe development, and utility styling.
3️⃣ **Key Takeaway**: Implementing high-performance client-side logic ensures privacy and speeds up execution significantly.

The tool is completely free, mobile-friendly, and hosts zero data on servers for maximum privacy.

Thank you to everyone who tested early builds. Check out the code below and let me know your feedback in the comments!

${hashtagsStr}`;

  return { emojiRich, shortVersion, longVersion };
}

/**
 * 5. Placement Roadmap Generator
 */
export function generateRoadmap(input: RoadmapInput): RoadmapOutput {
  const branch = input.branch || 'Computer Science';
  const role = input.targetRole || 'Software Development Engineer (SDE)';
  const hours = input.availableHours || 15;

  const phaseDuration = Math.ceil(240 / hours); // In weeks (approx 16-24 weeks overall)
  const roleLower = role.toLowerCase();
  let phases: RoadmapPhase[] = [];

  if (roleLower.includes('frontend') || roleLower.includes('web') || roleLower.includes('ui') || roleLower.includes('react')) {
    phases = [
      {
        title: 'Phase 1: Web Fundamentals',
        duration: `Weeks 1 - ${Math.max(2, Math.floor(phaseDuration * 0.2))}`,
        description: 'Master the foundation of the modern web: structure, styling, and interactivity.',
        topics: ['HTML5 Semantic Markup', 'CSS3 Layouts (Flexbox, Grid, Custom Properties)', 'Vanilla JS (ES6+, DOM Manipulation, Async/Await)', 'Responsive Design Principles'],
        actionItems: ['Build 3 responsive landing pages without external libraries.', 'Implement a JS-based interactive application (e.g., dynamic calculator or task board).', 'Understand browser mechanics, events, and API fetching.']
      },
      {
        title: 'Phase 2: Modern Frontend Frameworks',
        duration: `Weeks ${Math.max(2, Math.floor(phaseDuration * 0.2)) + 1} - ${Math.max(5, Math.floor(phaseDuration * 0.45))}`,
        description: 'Learn component-driven architecture, reactivity, and framework-level state management.',
        topics: ['React fundamentals (Components, Props, State, Hooks)', 'Tailwind CSS for utility-first styling', 'State Management (Redux Toolkit or Zustand)', 'TypeScript for type-safe frontend code'],
        actionItems: ['Build a multi-page dashboard displaying mock data visualisations.', 'Manage complex state (like a shopping cart or dashboard filters) using context or a store.', 'Convert a JavaScript React project to TypeScript.']
      },
      {
        title: 'Phase 3: Production Frameworks & Build Tools',
        duration: `Weeks ${Math.max(5, Math.floor(phaseDuration * 0.45)) + 1} - ${Math.max(8, Math.floor(phaseDuration * 0.65))}`,
        description: 'Scale frontend apps with routing, server-side rendering, and performance optimizations.',
        topics: ['Next.js (App Router, Server vs Client Components)', 'API Routes & Server Actions', 'Performance Optimization (Image optimization, code splitting)', 'SEO best practices & Meta Headers'],
        actionItems: ['Develop a full-stack Next.js project with local data mock APIs.', 'Optimize bundle sizes and page loads to achieve 90+ Lighthouse score.', 'Deploy the project to Vercel and set up environment configs.']
      },
      {
        title: 'Phase 4: Frontend Testing & Data Structures',
        duration: `Weeks ${Math.max(5, Math.floor(phaseDuration * 0.65)) + 1} - ${Math.max(8, Math.floor(phaseDuration * 0.85))}`,
        description: 'Implement automated testing and study frontend-centric data structures.',
        topics: ['Unit testing with Jest and React Testing Library', 'End-to-End testing with Playwright or Cypress', 'Frontend Algorithms (Pagination, Search filters, Infinite scroll)', 'Advanced State Design'],
        actionItems: ['Write unit tests for core reusable components.', 'Implement custom hooks to encapsulate reusable logic.', 'Solve 30 easy/medium LeetCode questions focusing on arrays and strings.']
      },
      {
        title: 'Phase 5: Portfolio Assembly & Mock Interviews',
        duration: `Weeks ${Math.max(12, Math.floor(phaseDuration * 0.85)) + 1} - ${Math.ceil(phaseDuration)}`,
        description: 'Prepare your portfolio, polish interview behaviors, and simulate frontend mock tests.',
        topics: ['Web security basics (CORS, XSS, CSRF)', 'Resume tailoring for frontend roles', 'Behavioral answers (STAR framework)', 'Mock interview sessions & technical code walks'],
        actionItems: ['Assemble your portfolio site with high visual quality.', 'Conduct 3 mock technical interviews covering frontend topics.', 'Review common JavaScript closures, event loop, and promises interview questions.']
      }
    ];
  } else if (roleLower.includes('backend') || roleLower.includes('node') || roleLower.includes('api') || roleLower.includes('database') || roleLower.includes('system')) {
    phases = [
      {
        title: 'Phase 1: Server Programming Fundamentals',
        duration: `Weeks 1 - ${Math.max(2, Math.floor(phaseDuration * 0.2))}`,
        description: 'Establish server-side execution paradigms, asynchronous programming, and basic routing.',
        topics: ['Node.js runtime & event loop', 'Express.js server configurations', 'REST API principles & HTTP methods', 'Asynchronous flows & Error Handling'],
        actionItems: ['Build a basic server that handles GET/POST requests.', 'Parse incoming JSON data and log runtime operations.', 'Read and write local JSON databases securely.']
      },
      {
        title: 'Phase 2: Database Systems & Modeling',
        duration: `Weeks ${Math.max(2, Math.floor(phaseDuration * 0.2)) + 1} - ${Math.max(5, Math.floor(phaseDuration * 0.45))}`,
        description: 'Learn data persistence, schema designs, and indexing strategies.',
        topics: ['Relational Databases (PostgreSQL / MySQL)', 'Non-Relational Databases (MongoDB)', 'ORM/ODM usage (Prisma, Mongoose)', 'SQL Queries, joins, and database indexing'],
        actionItems: ['Design a database schema for an e-commerce website.', 'Write complex SQL queries involving multiple joins and aggregations.', 'Seed mock database tables with large datasets to test performance.']
      },
      {
        title: 'Phase 3: Backend Security & Core APIs',
        duration: `Weeks ${Math.max(5, Math.floor(phaseDuration * 0.45)) + 1} - ${Math.max(8, Math.floor(phaseDuration * 0.65))}`,
        description: 'Secure server access, handle file systems, and build complete backend ecosystems.',
        topics: ['Authentication (JWT, OAuth, Cookies)', 'Hashing algorithms (bcrypt) & password safety', 'File uploads (AWS S3 integration)', 'Third-party API integrations'],
        actionItems: ['Build a secure registration and login system with token expiry.', 'Create an endpoint to upload and store profile images in cloud storage.', 'Write automated integration tests for authentication flows.']
      },
      {
        title: 'Phase 4: System Design & Caching',
        duration: `Weeks ${Math.max(5, Math.floor(phaseDuration * 0.65)) + 1} - ${Math.max(8, Math.floor(phaseDuration * 0.85))}`,
        description: 'Scale backend services using load balancers, messaging systems, and cache layers.',
        topics: ['System Design (LLD/HLD fundamentals)', 'Caching with Redis', 'Message Brokers (RabbitMQ or Kafka)', 'WebSockets for real-time communication'],
        actionItems: ['Implement Redis caching for slow, resource-heavy API queries.', 'Build a real-time messaging server using WebSockets.', 'Draft system diagrams for a URL shortener or chat system.']
      },
      {
        title: 'Phase 5: Deployments & Serverless Architecture',
        duration: `Weeks ${Math.max(12, Math.floor(phaseDuration * 0.85)) + 1} - ${Math.ceil(phaseDuration)}`,
        description: 'Deploy production servers, set up CI/CD pipelines, and prepare for backend interviews.',
        topics: ['Docker containers & docker-compose', 'Cloud hosting (AWS EC2, Render, Heroku)', 'CI/CD workflows (GitHub Actions)', 'Mock backend design interviews'],
        actionItems: ['Containerize your API server and database container.', 'Set up an automated GitHub Action to run test suites on commit.', 'Practice drawing architecture diagrams on a whiteboard.']
      }
    ];
  } else {
    phases = [
      {
        title: 'Phase 1: Core Fundamentals',
        duration: `Weeks 1 - ${Math.max(2, Math.floor(phaseDuration * 0.2))}`,
        description: 'Establish the core concepts of engineering and computer systems.',
        topics: ['Object-Oriented Programming (OOP) concepts', 'Operating Systems (OS) basics', 'Database Management Systems (DBMS)', 'Computer Networks (CN) overview'],
        actionItems: ['Choose a core programming language (Java, C++, or Python).', 'Study variables, loops, conditional blocks, and pointer logic.', 'Practice SQL queries on free sites like LeetCode/Hackerrank.']
      },
      {
        title: 'Phase 2: Programming Mastery',
        duration: `Weeks ${Math.max(2, Math.floor(phaseDuration * 0.2)) + 1} - ${Math.max(5, Math.floor(phaseDuration * 0.45))}`,
        description: 'Develop deep understanding of coding paradigms and advanced language features.',
        topics: ['Advanced OOP (Inheritance, Polymorphism, Abstraction)', 'Memory allocation & pointers', 'Exception handling & multi-threading', 'JavaScript/TypeScript fundamentals (if web target)'],
        actionItems: ['Build 3-4 console-based mini applications.', 'Solve 50 easy coding challenges to cement syntax and language utilities.', 'Learn to read and debug stack traces effectively.']
      },
      {
        title: 'Phase 3: Portfolio Projects',
        duration: `Weeks ${Math.max(5, Math.floor(phaseDuration * 0.45)) + 1} - ${Math.max(8, Math.floor(phaseDuration * 0.65))}`,
        description: 'Build complete applications to demonstrate your capabilities to hiring managers.',
        topics: ['REST APIs and server-client architecture', 'Version Control (Git & GitHub)', 'UI frameworks (React, Tailwind)', 'Deployment workflows (Vercel, Netlify)'],
        actionItems: ['Create a GitHub account and learn branch/pull-request workflows.', 'Build a fully responsive CRUD application from scratch.', 'Deploy your project online and ensure the readme is fully documented.']
      },
      {
        title: 'Phase 4: Data Structures & Algorithms (DSA)',
        duration: `Weeks ${Math.max(8, Math.floor(phaseDuration * 0.65)) + 1} - ${Math.max(12, Math.floor(phaseDuration * 0.85))}`,
        description: 'Prepare for technical coding assessments which form the first stage of placement.',
        topics: ['Linear DSA (Arrays, Linked Lists, Stacks, Queues)', 'Non-linear DSA (Trees, Graphs)', 'Dynamic Programming & Recursion', 'Sorting, Searching, and Binary Search'],
        actionItems: ['Solve the "Blind 75" or "LeetCode Top Interview Questions" curated lists.', 'Focus on Time and Space Complexity analyses for every problem.', 'Implement custom Trees and Graph traversals from scratch.']
      },
      {
        title: 'Phase 5: Interview Preparation & Mock Tests',
        duration: `Weeks ${Math.max(12, Math.floor(phaseDuration * 0.85)) + 1} - ${Math.ceil(phaseDuration)}`,
        description: 'Refine communication, system design, and behavioral response systems.',
        topics: ['System Design (Lld/Hld basics)', 'Resume optimization & ATS checks', 'Behavioral questions (STAR method)', 'Mock interview sessions'],
        actionItems: ['Prepare explanations for every project on your resume.', 'Practice 5 mock coding sessions with peer reviews.', 'Perfect your "Tell me about yourself" introduction pitch.']
      }
    ];
  }

  return {
    title: `${branch} student to ${role} Roadmap`,
    phases
  };
}

/**
 * 6. Placement Eligibility Checker
 */
export function checkEligibility(input: EligibilityInput): EligibilityOutput {
  const cgpa = Number(input.cgpa) || 0;
  const arrears = Number(input.arrears) || 0;
  const skills = input.skills.toLowerCase() || '';

  const missingRequirements: string[] = [];
  const suggestions: string[] = [];

  // Categorize
  let serviceBased = false;
  let productBased = false;
  let startup = false;

  // Eligibility scores
  let basePercentage = 100;

  // CGPA deduction
  if (cgpa < 6.0) {
    basePercentage -= 50;
    missingRequirements.push('Minimum CGPA requirement (most companies require at least 6.0 CGPA).');
    suggestions.push('Focus on upcoming semesters to raise your average above 6.0.');
  } else if (cgpa < 7.0) {
    basePercentage -= 20;
    missingRequirements.push('Higher tier CGPA cut-off (many premium product companies require 7.0+ or 8.0+ CGPA).');
  }

  // Arrears deduction
  if (arrears > 0) {
    basePercentage -= (arrears * 20);
    missingRequirements.push(`Active Arrears count: ${arrears} (many companies enforce a strict "0 active arrears" policy at the time of recruitment).`);
    suggestions.push('Register and clear your pending backlogs immediately; prioritized clearance is crucial.');
  }

  // Skills scan
  const hasCodingSkill = /react|node|javascript|typescript|python|java|c\+\+|sql|dsa|algorithms|rust|go/i.test(skills);
  if (!hasCodingSkill) {
    basePercentage -= 15;
    missingRequirements.push('Core technical skills (No mainstream language or software development tool found in your skill profile).');
    suggestions.push('Learn a programming language (Python, JavaScript, or Java) and list a project to prove your proficiency.');
  }

  const eligibilityPercentage = Math.max(0, Math.min(100, basePercentage));

  // Determine categories
  if (cgpa >= 6.0 && arrears === 0) {
    serviceBased = true;
  }
  if (cgpa >= 7.5 && arrears === 0 && hasCodingSkill) {
    productBased = true;
  }
  // Startups are more flexible with CGPA/arrears if coding skills are strong
  if (hasCodingSkill && (cgpa >= 6.0 || skills.split(',').length >= 3)) {
    startup = true;
  }

  if (eligibilityPercentage === 100) {
    suggestions.push('You qualify for almost all placement drives! Keep refining your advanced DSA skills.');
  }

  return {
    eligibleCategories: { serviceBased, productBased, startup },
    eligibilityPercentage,
    missingRequirements,
    suggestions: suggestions.length > 0 ? suggestions : ['Review eligibility criteria of specific companies before applying.']
  };
}

/**
 * 7. LeetCode Study Planner Engine
 */
export function generateLeetCodePlan(input: LeetCodeInput): StudyTask[] {
  const difficulty = input.difficulty;
  const hours = input.hoursAvailable;
  const selectedTopics = input.topics.length > 0 ? input.topics : ['Arrays', 'Strings', 'Linked Lists'];

  const planTasks: StudyTask[] = [];

  const topicProblems: { [key: string]: { name: string; diff: 'Easy' | 'Medium' | 'Hard'; desc: string }[] } = {
    'Arrays': [
      { name: 'Two Sum', diff: 'Easy', desc: 'Find two numbers that add up to a specific target.' },
      { name: 'Best Time to Buy and Sell Stock', diff: 'Easy', desc: 'Find maximum profit from a single buy and sell transaction.' },
      { name: 'Contains Duplicate', diff: 'Easy', desc: 'Check if any value appears at least twice in the array.' },
      { name: 'Product of Array Except Self', diff: 'Medium', desc: 'Return array such that each element is product of all others without division.' },
      { name: 'Maximum Subarray', diff: 'Medium', desc: 'Find contiguous subarray with the largest sum.' },
    ],
    'Strings': [
      { name: 'Valid Anagram', diff: 'Easy', desc: 'Determine if string s is an anagram of t.' },
      { name: 'Valid Palindrome', diff: 'Easy', desc: 'Determine if string is palindrome, ignoring non-alphanumeric characters.' },
      { name: 'Longest Substring Without Repeating Characters', diff: 'Medium', desc: 'Find length of longest substring without repeating chars.' },
      { name: 'Group Anagrams', diff: 'Medium', desc: 'Group arrays of strings that share the exact letters.' },
      { name: 'Valid Parentheses', diff: 'Easy', desc: 'Validate brackets matching in a string sequence.' },
    ],
    'Linked Lists': [
      { name: 'Reverse Linked List', diff: 'Easy', desc: 'Reverse a singly linked list in-place.' },
      { name: 'Detect Cycle in Linked List', diff: 'Easy', desc: 'Check if linked list has a loop/cycle.' },
      { name: 'Merge Two Sorted Lists', diff: 'Easy', desc: 'Combine two sorted linked lists into one.' },
      { name: 'Remove Nth Node From End of List', diff: 'Medium', desc: 'Delete nth node from end in a single traversal.' },
      { name: 'Reorder List', diff: 'Medium', desc: 'Reorder list nodes to match L0 → Ln → L1 → Ln-1 pattern.' },
    ],
    'Trees': [
      { name: 'Maximum Depth of Binary Tree', diff: 'Easy', desc: 'Calculate the height of a binary tree.' },
      { name: 'Invert Binary Tree', diff: 'Easy', desc: 'Mirror/invert a binary tree.' },
      { name: 'Binary Tree Level Order Traversal', diff: 'Medium', desc: 'Perform breadth-first search traversal on tree levels.' },
      { name: 'Validate Binary Search Tree', diff: 'Medium', desc: 'Ensure BST conditions hold for all node values.' },
      { name: 'Serialize and Deserialize Binary Tree', diff: 'Hard', desc: 'Convert binary tree to string representation and back.' },
    ],
    'Graphs': [
      { name: 'Number of Islands', diff: 'Medium', desc: 'Count grid segments of connected land cells.' },
      { name: 'Clone Graph', diff: 'Medium', desc: 'Make deep copy of a connected undirected graph.' },
      { name: 'Course Schedule', diff: 'Medium', desc: 'Detect cycles in directed graph dependency list.' },
      { name: 'Pacific Atlantic Water Flow', diff: 'Medium', desc: 'Find grid coords that can flow to both oceans.' },
      { name: 'Alien Dictionary', diff: 'Hard', desc: 'Derive alphabet order from lexicographically sorted list.' },
    ],
    'Dynamic Programming': [
      { name: 'Climbing Stairs', diff: 'Easy', desc: 'Find combinations to climb n stairs with 1 or 2 steps.' },
      { name: 'Coin Change', diff: 'Medium', desc: 'Find fewest coins needed to make up target sum.' },
      { name: 'Longest Increasing Subsequence', diff: 'Medium', desc: 'Find length of longest strictly increasing subsequence.' },
      { name: 'House Robber', diff: 'Medium', desc: 'Maximize stolen value without triggering adjacent alarms.' },
      { name: '0/1 Knapsack Problem', diff: 'Medium', desc: 'Maximize items value matching weight limits.' },
    ]
  };

  let dayCounter = 1;
  const numDays = 30;

  for (let i = 0; i < numDays; i++) {
    // Round-robin topics selection
    const topic = selectedTopics[i % selectedTopics.length];
    const problemsList = topicProblems[topic] || topicProblems['Arrays'];
    
    // Choose problem based on day cycle
    const probIdx = Math.floor(i / selectedTopics.length) % problemsList.length;
    const problem = problemsList[probIdx];

    // Align difficulty filter if selected
    let taskDiff = problem.diff;
    if (difficulty !== 'Mixed' && difficulty !== undefined) {
      taskDiff = difficulty as 'Easy' | 'Medium' | 'Hard';
    }

    planTasks.push({
      id: `task-day-${dayCounter}`,
      day: dayCounter,
      topic,
      problemName: problem.name,
      difficulty: taskDiff,
      description: problem.desc,
      completed: false
    });

    dayCounter++;
  }

  return planTasks;
}

/**
 * 8. Expense Splitter Engine
 */
export function calculateExpenseSplit(friends: { id: string; name: string; paidAmount: number }[]): ExpenseSplitReport {
  const totalAmount = friends.reduce((sum, f) => sum + f.paidAmount, 0);
  const numPeople = friends.length;
  
  if (numPeople === 0) {
    return { totalAmount: 0, sharePerPerson: 0, settlements: [] };
  }

  const sharePerPerson = totalAmount / numPeople;

  // Track net balances: Paid amount - Share per person
  // positive = paid extra (needs to get back)
  // negative = paid less (needs to pay out)
  const balances = friends.map(f => ({
    name: f.name,
    balance: f.paidAmount - sharePerPerson
  }));

  const settlements: { from: string; to: string; amount: number }[] = [];

  // Greedy settlement solver
  const creditors = balances.filter(b => b.balance > 0.01).sort((a, b) => b.balance - a.balance);
  const debtors = balances.filter(b => b.balance < -0.01).sort((a, b) => a.balance - b.balance);

  let cIdx = 0;
  let dIdx = 0;

  while (cIdx < creditors.length && dIdx < debtors.length) {
    const creditor = creditors[cIdx];
    const debtor = debtors[dIdx];

    const payout = Math.min(creditor.balance, Math.abs(debtor.balance));
    
    if (payout > 0.01) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: parseFloat(payout.toFixed(2))
      });

      creditor.balance -= payout;
      debtor.balance += payout;
    }

    if (creditor.balance <= 0.01) cIdx++;
    if (Math.abs(debtor.balance) <= 0.01) dIdx++;
  }

  return {
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    sharePerPerson: parseFloat(sharePerPerson.toFixed(2)),
    settlements
  };
}
