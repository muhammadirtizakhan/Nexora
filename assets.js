// ================= DATA ARRAYS =================

export const featuresData = [
    { 
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500 size-8 mt-4"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`, 
        title: "Web Development", 
        description: "Modern, responsive websites built with cutting-edge technology that drive conversions and deliver exceptional user experiences." 
    },
    { 
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500 size-8 mt-4"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>`, 
        title: "AI Agents", 
        description: "AI Agents Coming soon — Intelligent AI agents that automate workflows, answer customer queries, and boost your business efficiency." 
    },
    { 
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500 size-8 mt-4"><path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"/><rect x="3" y="14" width="7" height="7" rx="1"/><circle cx="17.5" cy="17.5" r="3.5"/></svg>`, 
        title: "Web Applications", 
        description: "Custom web apps tailored to your business needs — scalable, secure, and built for performance." 
    },
    { 
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500 size-8 mt-4"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`, 
        title: "Smart Chatbots", 
        description: "AI-powered chatbots that engage customers 24/7, answer questions instantly, and capture qualified leads automatically." 
    },
];

 export const projectsData = [
        { title:"EDUSITY", desc:"Edusity is a modern website built with React and CSS. Fully responsive, works on all devices, features clean UI/UX. Users can watch embedded video and interact via Web3 forms.", tags:["React","Tailwind","Vercel"], liveLink:"https://edusity-com-beige.vercel.app/" },
        { title:"QUICKSTAY", desc:"QuickStay — Scalable MERN booking platform with real-time availability, secure authentication & seamless reservations.", tags:["MERN stack","Cloudinary","clerk"], liveLink:"https://hotel-booking-app-amber-omega.vercel.app/" },
        { title:"AETHERIC STORE", desc:"A full-stack luxury e-commerce platform where customers can browse, favourite, and securely purchase products — with an admin dashboard to track orders and spending.", tags:["HTML","CSS","JS","Node","Express","Firebase","Supabase","Cloudinary"], liveLink:"https://aetheric-neon.vercel.app" },
        { title:"AETHERIC ADMIN", desc:"Modern full-stack dashboard to manage the entire AETHERIC e-commerce ecosystem with real-time control over orders, products, customers, inventory, and revenue analytics.", tags:["HTML","CSS","JS","Express","Supabase"], liveLink:"https://aetheric-admin-panel.vercel.app" },
        { title:"HOT N TASTY ROLL", desc:"Food ordering UI system with smooth UX flow.", tags:["HTML","CSS","JS","Node","Express","Supabase"], liveLink:"https://hot-n-tasty-roll.vercel.app/" },
    ];

export const pricingData = [
    { 
        title: "Basic Plan", 
        price: '5k-10k', 
        features: ["SEO Optimization, Google Analytics Setup", "Deployed & working dynamically", "Stunning UI/UX Design", "No backend engineering", "Responsive on all device", "Basic chatbot"], 
        buttonText: "connect with us" 
    },
    { 
        title: "Pro Plan", 
        price: '10k-20k', 
        mostPopular: true, 
        features: ["Domain provided", "Stunning UI/UX Design", "Active Backend Engineering", "Website statistics", "Chatbot with LLM integration", "Compatible on all devices", "Agents upon client requests"], 
        buttonText: "connect with us" 
    },
    { 
        title: "Enterprise Plan", 
        price: '20k-50k', 
        features: ["System Architecture", "Maintenance and updates", "Team Collaboration", "Custom Integrations", "Fascinating UI/UX"], 
        buttonText: "connect with us" 
    },
];

export const faqsData = [
    { 
        question: "How we get clients?", 
        answer: "We find local businesses without websites using Google Maps, visit them in person, and explain how a website can boost their visibility, trust, and sales." 
    },
    { 
        question: "What do you mean by domain provided?", 
        answer: "A domain is the website address (like example.com) that you purchase and use to host your website." 
    },
    { 
        question: "What is a chatbot and how does it help businesses?", 
        answer: "A chatbot is an automated tool that provides guidance and information related to your website, web application, or digital ads." 
    },
    { 
        question: "How can a chatbot benefit my website?", 
        answer: "A chatbot provides instant support to visitors, answers common questions, and guides users through your services." 
    },
    { 
        question: "How do I start freelancing as a web developer?", 
        answer: "Build a portfolio, join freelancing platforms, and start bidding on projects. Focus on small projects first to gain reviews." 
    },
];

export const githubLink = "https://github.com/muhmmmadirtizakhan";
export const logos = ["framer", "huawei", "instagram", "microsoft", "walmart"];