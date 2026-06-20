/**
 * GUtech Academic Catalogue 2025–2026 (bachelor programmes only)
 * Source: Academic-Catalogue-2025-2026.pdf — covers BSc/BEng bachelor degrees only;
 * not master's, PhD, or other postgraduate programmes.
 * Structured for roadmap generation — swap Firestore backend later without changing consumers.
 */

import {
  getGutechSemesterNumbers,
  parseStudyPeriod,
} from "../utils/studyPeriod";

const c = (code, name, credits) => ({ code, name, credits });

export const GUtech_UNIVERSITY = {
  id: "gutech",
  name: "GUtech (German University of Technology)",
  shortName: "GUtech",
  affiliation: "RWTH Aachen University",
  language: "English",
  totalCredits: 240,
  durationSemesters: 8,
};

export const GUtech_FOUNDATION = {
  name: "GUbridge Foundation Programme",
  description:
    "Entry pathway covering English, mathematics, and IT. Requires IELTS 6.0+ and IC3 pass for bachelor entry.",
  courses: {
    semester1: [
      c("FGE 0 001", "General English 1", 4),
      c("FAE 0 002", "Academic English 2", 4),
      c("FAE 0 004", "Academic English 4", 4),
      c("FAE 0 006", "English for Academic Presentations", 4),
      c("FPM 0 001", "Math Vocabulary", 4),
      c("FPM 0 002", "Applied Mathematics Level 1", 4),
      c("FPM 0 004", "Pure Mathematics Level 1", 4),
      c("FIT 0 001", "IT 1", 4),
    ],
    semester2: [
      c("FAE 0 001", "Academic English 1", 4),
      c("FAE 0 003", "Academic English 3", 4),
      c("FAE 0 005", "Academic English 5", 4),
      c("FAE 0 007", "English for Academic Report Writing", 4),
      c("FPM 0 003", "Applied Mathematics Level 2", 4),
      c("FPM 0 005", "Pure Mathematics Level 2", 4),
      c("FIT 0 002", "IT 2", 4),
    ],
  },
};

export const GUtech_GRADUATE_ATTRIBUTES = [
  "Ethics — responsible citizenship in a globalised context",
  "Critical thinking and problem solving",
  "Creative thinking",
  "Individual and teamwork",
  "Communication — oral, written, and electronic",
  "Life-long learning",
  "Sustainability — aligned with UN SDGs and Oman Vision 2040",
];

export const GUtech_LIFE_SKILLS = [
  "German 1–3 (mandatory)",
  "Entrepreneurship: Creativity and Innovation",
  "Presentation Techniques & Scientific Report Writing",
  "Leadership",
  "Design Thinking",
  "Introduction to Artificial Intelligence (non-AI majors)",
  "Preparing for Employment",
  "Digital Marketing",
  "Sustainable Living: Individuals and Society",
];

/** GUtech bachelor programmes — Academic Catalogue 2025–2026 */
export const GUtech_PROGRAMS = [
  {
    id: "ibsm",
    shortName: "International Business and Service Management",
    name: "Bachelor of Science in International Business and Service Management",
    faculty: "Faculty of Business and Economics",
    degree: "BSc",
    semesters: [
      { semester: 1, courses: [c("IBSM 1 101", "General Mathematics", 6), c("IBSM 1 102", "Tourism Geography of Oman", 5), c("IBSM 1 103", "The Business Environment", 5), c("IBSM 1 104", "Microeconomics", 5), c("IBSM 1 105", "Financial Accounting", 5), c("LS", "Life Skills Course", 4)] },
      { semester: 2, courses: [c("IBSM 1 106", "International Travel Operations", 5), c("IBSM 1 107", "International Hospitality Management", 5), c("IBSM 1 110", "Decision Theory", 5), c("IBSM 1 121", "Marketing", 5), c("IBSM 1 146", "Statistics", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 3, courses: [c("IBSM 2 111", "Port and Cruise Management", 5), c("IBSM 2 112", "Tourism Planning and Development 1", 5), c("IBSM 2 120", "Human Resource Management", 5), c("IBSM 2 123", "Strategic Management", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 4, courses: [c("IBSM 2 113", "Business Law", 4), c("IBSM 2 115", "Airport and Aviation Management", 5), c("IBSM 2 116", "Management Accounting", 5), c("IBSM 2 117", "Tourism and Technology", 5), c("IBSM 2 118", "International Destinations Management", 5), c("IBSM 2 122", "International Business Strategy", 5), c("LS", "Life Skills Course", 4)] },
      { semester: 5, courses: [c("IBSM 2 114", "GIS and Statistical Analysis Tools", 4), c("IBSM 3 124", "Tourism Marketing and Communication", 5), c("IBSM 3 125", "Project Management", 4), c("IBSM 3 126", "Entrepreneurship and Innovation", 4), c("IBSM 3 132", "Tourism Planning and Development 2", 5), c("LS", "Life Skills Course", 4)] },
      { semester: 6, courses: [c("IBSM 3 119", "Macroeconomics", 5), c("IBSM 3 129", "Finance and Investment", 5), c("IBSM 4 135", "Applied Economics", 5), c("IBSM 4 136", "Leadership", 5), c("IBSM", "Elective 1", 5)] },
      { semester: 7, label: "Summer + Semester 7", courses: [c("IBSM 3 127", "Internship", 15), c("IBSM 4 128", "Tourism and Consumer Behavior", 5), c("IBSM 4 130", "Culture and Heritage Tourism", 4), c("IBSM 4 131", "Research Methods for the Service Sector", 5), c("IBSM 4 133", "Revenue Management", 6), c("IBSM 4 134", "Tourism Project Appraisal", 5), c("IBSM", "Electives 2–3", 5)] },
      { semester: 8, courses: [c("IBSM 4 154", "Bachelor Thesis", 15)] },
    ],
    electives: ["Event Management", "FinTech", "Healthcare Service Management", "International Trade", "Service Management", "Total Quality Management"],
  },
  {
    id: "logistics",
    shortName: "Logistics",
    name: "Bachelor of Science in Logistics",
    faculty: "Faculty of Business and Economics",
    degree: "BSc",
    semesters: [
      { semester: 1, courses: [c("LOG 1 101", "Maths 1: Calculus", 6), c("LOG 1 102", "Logistics Management", 7), c("LOG 1 103", "The Business Environment", 5), c("LOG 1 104", "Microeconomics", 5), c("LOG 1 144", "Financial Accounting", 5), c("LS", "Life Skills Course", 4)] },
      { semester: 2, courses: [c("LOG 1 106", "Maths 2: Linear Algebra", 6), c("LOG 1 110", "Decision Theory", 5), c("LOG 1 115", "Production Logistics and Transportation Management", 5), c("LOG 1 121", "Marketing", 5), c("LOG 1 146", "Statistics", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 3, courses: [c("LOG 2 107", "Modelling Language", 2), c("LOG 2 108", "Operations Research and Management", 5), c("LOG 2 118", "IT Systems in Logistics", 5), c("LOG 2 120", "Human Resource Management", 5), c("LOG 2 123", "Strategic Management", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 4, courses: [c("LOG 2 112", "Procurement", 6), c("LOG 2 113", "Business Law", 4), c("LOG 2 114", "Distribution Networks", 5), c("LOG 2 116", "Management Accounting", 5), c("LOG 2 117", "Supply Chain Management", 5), c("LS", "Life Skills Course", 4)] },
      { semester: 5, courses: [c("LOG 3 122", "Industrial Projects in Logistics", 8), c("LOG 3 124", "Transportation and Traffic", 4), c("LOG 3 125", "Project Management", 4), c("LOG 3 126", "Entrepreneurship and Innovation", 4), c("LOG 3 128", "Production Logistics", 5), c("LS", "Life Skills Course", 4)] },
      { semester: 6, courses: [c("LOG 3 119", "Macroeconomics", 5), c("LOG 3 129", "Finance and Investment", 5), c("LOG 4 132", "Material Flows and Intra-Logistics", 6), c("LOG 4 135", "Applied Economics", 5), c("LOG 4 136", "Leadership", 5), c("LOG", "Elective 1", 5)] },
      { semester: 7, courses: [c("LOG 3 127", "Internship", 15), c("LOG 4 131", "Research Methods", 2), c("LOG 4 133", "Revenue Management", 6), c("LOG 4 134", "Factory Planning", 5), c("LOG 4 145", "Warehouse and Inventory Management", 5), c("LOG", "Electives 2–3", 5)] },
      { semester: 8, courses: [c("LOG 4 154", "Bachelor Thesis", 15)] },
    ],
    electives: ["Automotive Logistics", "Maritime Logistics", "Airport Logistics", "Railway Logistics", "Ocean Shipping and Maritime Logistics", "Optimisation Applications in Logistics"],
  },
  {
    id: "computer-science",
    shortName: "Computer Science",
    name: "Bachelor of Science in Computer Science",
    faculty: "Faculty of Engineering and Computer Science",
    degree: "BSc",
    semesters: [
      { semester: 1, courses: [c("CS 1 101", "Programming Fundamentals", 8), c("CS 1 102", "Computer Architecture", 7), c("CS 1 112", "Introduction to Computer Applications and Business Management", 4), c("CS 1 145", "Maths 1: Calculus", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 2, courses: [c("CS 1 151", "Fundamentals of Object Oriented Programming", 7), c("CS 1 118", "Logic", 4), c("CS 1 119", "Discrete Structures", 4), c("CS 1 146", "Maths 2: Linear Algebra", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 3, courses: [c("CS 1 107", "Data Structures", 8), c("CS 2 114", "Database Systems", 7), c("CS 2 145", "Accounting and Controlling", 5), c("CS 2 158", "Probability and Statistics", 6), c("CS", "Business Elective(s)", 5)] },
      { semester: 4, courses: [c("CS 2 106", "Proseminar", 3), c("CS 2 109", "Efficient Algorithms", 4), c("CS 2 120", "Numerical Computation", 6), c("CS 2 134", "Introduction to Information Security", 7), c("CS 2 152", "Software Engineering", 7), c("LS", "Life Skills Course", 4)] },
      { semester: 5, courses: [c("CS 2 110", "Web Design and Development", 7), c("CS 2 111", "Theory of Computing", 7), c("CS 3 117", "Operating Systems", 7), c("CS 2 123", "Decision Theory", 5), c("LS", "Life Skills Course", 4)] },
      { semester: 6, courses: [c("CS 4 130", "Research Methods", 5), c("CS 3 155", "Computer Networks", 7), c("CS 3 160", "Mobile Applications", 6), c("CS", "Business Elective(s)", 5), c("CS", "Computing Elective(s)", 7)] },
      { semester: 7, courses: [c("CS 4 133", "Internship", 9), c("CS 4 125", "Interactive Systems & Computer Graphics", 7), c("CS 3 129", "Seminar", 4), c("CS", "Computing Elective(s)", 7), c("CS", "Theory Elective(s)", 7), c("LS", "Life Skills Course", 4)] },
      { semester: 8, courses: [c("CS 4 131", "Bachelor Thesis", 15), c("CS", "Computing Elective(s)", 7), c("LS", "Life Skills Course", 4)] },
    ],
    electives: ["Introduction to Artificial Intelligence", "Introduction to Information Security", "Data Mining Algorithms", "Introduction to Cloud Computing", "Object-Oriented Software Design Patterns", "Embedded Systems", "Cryptography and Blockchain"],
  },
  {
    id: "artificial-intelligence",
    shortName: "Artificial Intelligence",
    name: "Bachelor of Science in Artificial Intelligence",
    faculty: "Faculty of Engineering and Computer Science",
    degree: "BSc",
    semesters: [
      { semester: 1, courses: [c("CS 1 101", "Programming Fundamentals", 8), c("CS 1 102", "Computer Architecture", 7), c("CS 1 112", "Introduction to Computer Applications and Business Management", 4), c("CS 1 145", "Maths 1: Calculus", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 2, courses: [c("AI 1 101", "Concepts in AI", 7), c("CS 1 151", "Fundamentals of Object Oriented Programming", 7), c("CS 1 118", "Logic", 4), c("CS 1 146", "Maths 2: Linear Algebra", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 3, courses: [c("AI 2 102", "AI: Representation and Problem Solving", 7), c("CS 1 107", "Data Structures", 8), c("CS 2 114", "Database Systems", 7), c("CS 2 145", "Accounting and Controlling", 5), c("CS", "Business Elective(s)", 5)] },
      { semester: 4, courses: [c("AI 2 103", "Introduction to Machine Learning", 7), c("CS 2 106", "Proseminar", 3), c("CS 2 109", "Efficient Algorithms", 4), c("CS 2 120", "Numerical Computation", 6), c("CS 2 134", "Introduction to Information Security", 7), c("LS", "Life Skills Course", 4)] },
      { semester: 5, courses: [c("AI 3 104", "Advanced Machine Learning", 6), c("CS 1 119", "Discrete Structures", 4), c("CS 2 110", "Web Design and Development", 7), c("CS 3 117", "Operating Systems", 7), c("LS", "Life Skills Course", 4)] },
      { semester: 6, courses: [c("CS 2 152", "Software Engineering", 7), c("CS 2 158", "Probability and Statistics", 6), c("CS 3 155", "Computer Networks", 7), c("CS 4 130", "Research Methods", 5), c("AI", "AI Elective 1", 7)] },
      { semester: 7, courses: [c("CS 4 133", "Internship", 9), c("AI 4 105", "AI Seminar", 4), c("AI 4 106", "Decision Making for Autonomous Systems", 7), c("AI 4 108", "Cognitive Computing", 5), c("AI", "AI Elective 2", 7), c("LS", "Life Skills Course", 4)] },
      { semester: 8, courses: [c("AI 4 107", "Special Topic in AI", 5), c("CS 4 131", "Bachelor Thesis", 15), c("LS", "Life Skills Course", 4)] },
    ],
    electives: ["Introduction to Natural Language Processing", "Computer Vision", "Knowledge Engineering in AI", "Big Data Analytics", "Internet of Things", "Extended Reality", "Data Analytics and Visualisation"],
  },
  {
    id: "cyber-security",
    shortName: "Cyber Security",
    name: "Bachelor of Science in Cyber Security",
    faculty: "Faculty of Engineering and Computer Science",
    degree: "BSc",
    semesters: [
      { semester: 1, courses: [c("CS 1 101", "Programming Fundamentals", 8), c("CS 1 102", "Computer Architecture", 7), c("CS 1 112", "Introduction to Computer Applications and Business Management", 4), c("CS 1 145", "Maths 1: Calculus", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 2, courses: [c("CS 1 151", "Fundamentals of Object Oriented Programming", 7), c("CS 1 118", "Logic", 4), c("CS 1 119", "Discrete Structures", 4), c("CS 1 146", "Maths 2: Linear Algebra", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 3, courses: [c("CS 1 107", "Data Structures", 8), c("CS 2 114", "Database Systems", 7), c("CS 2 145", "Accounting and Controlling", 5), c("CS 2 158", "Probability and Statistics", 6), c("CS", "Business Elective(s)", 5)] },
      { semester: 4, courses: [c("CS 2 106", "Proseminar", 3), c("CS 2 109", "Efficient Algorithms", 4), c("CS 2 120", "Numerical Computation", 6), c("CS 2 134", "Introduction to Information Security", 7), c("CS 2 152", "Software Engineering", 7), c("LS", "Life Skills Course", 4)] },
      { semester: 5, courses: [c("CYS 3 101", "Web and Mobile App Security", 7), c("CYS 3 102", "Cyber Crime Investigations and Forensics", 7), c("CYS 3 103", "Ethical Hacking", 7), c("CS 3 117", "Operating Systems", 7), c("LS", "Life Skills Course", 4)] },
      { semester: 6, courses: [c("CS 3 155", "Computer Networks", 7), c("CS 4 130", "Research Methods", 5), c("CYS 3 104", "Applied Cryptography", 7), c("CYS 3 105", "Cyber Security Risk Management", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 7, courses: [c("CS 4 133", "Internship", 9), c("CYS 3 106", "Network Security: VPN and Firewalls", 7), c("CYS 4 107", "Cyber Security Seminar", 4), c("CYS 4 108", "Disaster Recovery and Business Continuity", 7), c("CYS 4 110", "Data Storage Privacy and Security", 5), c("CYS", "Cyber Security Elective(s)", 7)] },
      { semester: 8, courses: [c("CS 4 131", "Bachelor Thesis", 15), c("CYS 4 109", "Special Topic in Cyber Security", 5), c("LS", "Life Skills Course", 4)] },
    ],
    electives: ["IT Security and System Auditing", "Introduction to Artificial Intelligence", "Cryptography and Blockchain", "Embedded Systems", "Data Analytics and Visualisation", "Introduction to Cloud Computing"],
  },
  {
    id: "environmental-engineering",
    shortName: "Environmental Engineering",
    name: "Bachelor of Engineering in Environmental Engineering",
    faculty: "Department of Engineering",
    degree: "BEng",
    semesters: [
      { semester: 1, courses: [c("ENG 1 102", "Physics 1", 5), c("ENG 1 103", "Chemistry 1", 5), c("ENG 1 143", "Programming for Engineering", 3), c("ENG 1 140", "Project Work 1", 3), c("ENG 1 145", "Mathematics 1: Calculus", 6), c("ENG 1 146", "Mathematics 2: Linear Algebra", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 2, courses: [c("ENG 1 108", "Physics 2", 5), c("ENG 1 109", "Chemistry 2", 5), c("ENG 1 112", "Project Work 2", 4), c("ENG 1 139", "Engineering Drawing", 3), c("ENG 1 141", "Engineering Principles and Calculation", 4), c("ENG 1 147", "Mathematics 3: Advanced Calculus", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 3, courses: [c("ENG 1 114", "Mechanics 1", 5), c("ENG 2 115", "Electrical and Electronic Engineering", 5), c("ENG 2 116", "Environmental Engineering", 5), c("ENG 2 120", "Thermodynamics 1", 5), c("ENG 2 148", "Mathematics 4: Numerical Mathematics", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 4, courses: [c("ENG 2 119", "Mechanics 2", 5), c("ENG 3 123", "Material Science 1", 6), c("ENG 3 125", "Thermodynamics Laboratory", 4), c("ENG 3 126", "Fluid Dynamics", 7), c("ENV 4 111", "Environmental Law", 2), c("LS", "Life Skills Course", 4)] },
      { semester: 5, courses: [c("ENV 3 102", "Hydrology and Water Resources", 6), c("ENV 3 103", "Renewable Energy & Energy Efficiency", 5), c("ENV 3 104", "Global Changes & Sustainable Development", 5), c("ENV 3 105", "Air Pollution Control", 5), c("ENV 3 108", "Sea Water Desalination", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 6, courses: [c("ENG 2 117", "Project Work 3", 4), c("ENG 3 128", "Measurement Techniques (Laboratory)", 4), c("ENG 3 129", "Business Engineering", 3), c("ENV 3 106", "Integrated Water Resources Management", 6), c("ENV 3 107", "Solid Waste Management", 6), c("ENV 3 138", "Introduction to GIS", 3), c("LS", "Life Skills Course", 4)] },
      { semester: 7, courses: [c("ENG 4 141", "Internship", 15), c("ENG 2 121", "Project Work 4", 4), c("ENV 3 109", "Light and Noise Pollution", 5), c("ENV 3 110", "Green Building", 6), c("ENG 4 130", "Research Methods", 2), c("ENV 4 112", "Environmental Impact Assessment", 5), c("ENG 3 127", "Simulation Techniques", 6)] },
      { semester: 8, courses: [c("ENG 4 133", "Bachelor Thesis", 12), c("ENG 4 134", "Colloquium", 3), c("ENV 3 101", "Environmental Engineering Laboratory Methods", 5)] },
    ],
    electives: [],
  },
  {
    id: "mechanical-engineering",
    shortName: "Mechanical Engineering",
    name: "Bachelor of Engineering in Mechanical Engineering",
    faculty: "Department of Engineering",
    degree: "BEng",
    semesters: [
      { semester: 1, courses: [c("ENG 1 102", "Physics 1", 5), c("ENG 1 103", "Chemistry 1", 5), c("ENG 1 140", "Project Work 1", 3), c("ENG 1 143", "Programming for Engineering", 3), c("ENG 1 145", "Mathematics 1: Calculus", 6), c("ENG 1 146", "Mathematics 2: Linear Algebra", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 2, courses: [c("ENG 1 108", "Physics 2", 5), c("ENG 1 109", "Chemistry 2", 5), c("ENG 1 112", "Project Work 2", 4), c("ENG 1 139", "Engineering Drawing", 3), c("ENG 1 141", "Engineering Principles and Calculation", 4), c("ENG 1 147", "Mathematics 3: Advanced Calculus", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 3, courses: [c("ENG 2 114", "Mechanics 1", 5), c("ENG 2 115", "Electrical and Electronic Engineering", 5), c("ENG 2 116", "Environmental Engineering", 5), c("ENG 2 120", "Thermodynamics 1", 5), c("ENG 2 148", "Mathematics 4: Numerical Mathematics", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 4, courses: [c("ENG 1 104", "Introduction to CAD", 3), c("ENG 2 119", "Mechanics 2", 5), c("ENG 2 144", "Thermodynamics 2", 4), c("ENG 3 123", "Material Science I", 6), c("ENG 3 126", "Fluid Dynamics", 7), c("MECH 2 101", "Introduction to Mechanical Engineering", 5), c("LS", "Life Skills Course", 4)] },
      { semester: 5, courses: [c("ENG 3 125", "Thermodynamics Laboratory", 4), c("ENG 3 149", "Mechanics 3", 5), c("ENG 4 131", "Heat & Mass Transfer", 7), c("MECH 3 103", "Material Science 2", 5), c("MECH 3 102", "Machine Design 1", 5), c("LS", "Life Skills Course", 4)] },
      { semester: 6, courses: [c("ENG 2 117", "Project Work 3", 4), c("ENG 3 128", "Measurement Techniques (Laboratory)", 4), c("ENG 3 129", "Business Engineering", 3), c("ENG 4 132", "Control & Automation", 7), c("MECH 3 104", "Machine Design 2", 5), c("LS", "Life Skills Course", 4)] },
      { semester: 7, courses: [c("ENG 4 135", "Internship", 15), c("ENG 2 121", "Project Work 4", 4), c("ENG 3 127", "Simulation Techniques", 6), c("ENG 4 130", "Research Methods", 2), c("MECH 4 105", "Production Technology", 5), c("MECH 4 106", "Machine Tools", 5)] },
      { semester: 8, courses: [c("ENG 4 133", "Bachelor Thesis", 12), c("ENG 4 134", "Colloquium", 3), c("MECH 4 107", "Control and Automation Laboratory", 4)] },
    ],
    electives: [],
  },
  {
    id: "process-engineering",
    shortName: "Process Engineering",
    name: "Bachelor of Engineering in Process Engineering",
    faculty: "Department of Engineering",
    degree: "BEng",
    semesters: [
      { semester: 1, courses: [c("ENG 1 102", "Physics 1", 5), c("ENG 1 103", "Chemistry 1", 5), c("ENG 1 140", "Project Work 1", 3), c("ENG 1 143", "Programming for Engineering", 3), c("ENG 1 145", "Mathematics 1: Calculus", 6), c("ENG 1 146", "Mathematics 2: Linear Algebra", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 2, courses: [c("ENG 1 108", "Physics 2", 5), c("ENG 1 109", "Chemistry 2", 5), c("ENG 1 112", "Project Work 2", 4), c("ENG 1 139", "Engineering Drawing", 3), c("ENG 1 141", "Engineering Principles and Calculation", 4), c("ENG 1 147", "Mathematics 3: Advanced Calculus", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 3, courses: [c("ENG 2 114", "Mechanics 1", 5), c("ENG 2 115", "Electrical and Electronic Engineering", 5), c("ENG 2 116", "Environmental Engineering", 5), c("ENG 2 120", "Thermodynamics 1", 5), c("ENG 2 148", "Mathematics 4: Numerical Mathematics", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 4, courses: [c("ENG 1 104", "Introduction to CAD", 3), c("ENG 2 119", "Mechanics 2", 5), c("ENG 3 123", "Material Science I", 6), c("ENG 2 144", "Thermodynamics 2", 4), c("ENG 3 125", "Thermodynamics Laboratory", 4), c("ENG 3 126", "Fluid Dynamics", 7), c("LS", "Life Skills Course", 4)] },
      { semester: 5, courses: [c("ENG 3 149", "Mechanics 3", 5), c("ENG 4 131", "Heat & Mass Transfer", 7), c("PROC 3 110", "Introduction to Process Engineering", 4), c("PROC 4 105", "Multi-phase Flow", 4), c("LS", "Life Skills Course", 4)] },
      { semester: 6, courses: [c("ENG 2 117", "Project Work 3", 4), c("ENG 3 128", "Measurement Techniques (Laboratory)", 4), c("ENG 3 129", "Business Engineering", 3), c("ENG 4 132", "Control & Automation", 7), c("PROC 3 102", "Chemical Process Engineering", 5), c("PROC 3 104", "Thermal Separation Processes", 5), c("PROC 4 109", "Mechanical Process Engineering", 4), c("LS", "Life Skills Course", 4)] },
      { semester: 7, courses: [c("ENG 4 135", "Internship", 15), c("ENG 2 121", "Project Work 4", 4), c("ENG 3 127", "Simulation Techniques", 6), c("ENG 4 130", "Research Methods", 2), c("PROC 3 103", "Petroleum and Petrochemical Processing", 5), c("PROC 4 111", "Plant Design 1", 3)] },
      { semester: 8, courses: [c("ENG 4 133", "Bachelor Thesis", 12), c("ENG 4 134", "Colloquium", 3), c("PROC 4 108", "Process Laboratory", 2), c("PROC 4 112", "Plant Design 2", 2)] },
    ],
    electives: [],
  },
  {
    id: "applied-geosciences",
    shortName: "Applied Geosciences",
    name: "Bachelor of Science in Applied Geosciences",
    faculty: "Faculty of Science",
    degree: "BSc",
    semesters: [
      { semester: 1, courses: [c("AGEO 1 102", "Rocks and Minerals", 5), c("AGEO 1 107", "Chemistry for Earth Scientists", 5), c("AGEO 1 145", "Mathematics 1: Calculus", 6), c("AGEO 1 163", "Geosciences Seminar", 2), c("AGEO 1 164", "Planet Earth", 5), c("AGEO 1 175", "Field Work Techniques", 3), c("LS", "Life Skills Course", 4)] },
      { semester: 2, courses: [c("AGEO 1 113", "Earth History", 4), c("AGEO 1 114", "Physics for Earth Scientists", 5), c("AGEO 1 118", "Laboratory Methods", 3), c("AGEO 1 146", "Mathematics 2: Linear Algebra", 6), c("AGEO 1 176", "Interpretation of Geological Map", 4), c("AGEO 1 177", "Petrographic Microscopy", 4), c("LS", "Life Skills Course", 4)] },
      { semester: 3, courses: [c("AGEO 2 109", "Geological Field Methods 1", 3), c("AGEO 2 115", "Structural Geology", 4), c("AGEO 2 117", "Sedimentology", 4), c("AGEO 2 170", "Water Cycle", 3), c("AGEO 2 171", "Surface Processes", 4), c("AGEO 2 174", "Probability and Statistics", 6), c("AGEO 2 178", "Field Studies 1", 3), c("LS", "Life Skills Course", 4)] },
      { semester: 4, courses: [c("AGEO 2 122", "Geophysics", 3), c("AGEO 2 126", "Geochemistry", 3), c("AGEO 2 127", "Geodynamics and Tectonics", 3), c("AGEO 2 140", "Applied Structural Geology", 4), c("AGEO 2 159", "Hydrogeology 1", 4), c("AGEO 2 161", "Mineralogy", 3), c("AGEO 2 180", "Introduction to GIS", 3), c("LS", "Life Skills Course", 4)] },
      { semester: 5, courses: [c("AGEO 3 119", "Palaeontology", 3), c("AGEO 3 130", "Geohazards", 2), c("AGEO 3 133", "Remote Sensing and Image Analysis", 3), c("AGEO 3 138", "Geology of Oman", 3), c("AGEO 3 173", "Hydrogeological Field Methods", 3), c("AGEO 3 181", "Geological Field Methods 2", 3), c("AGEO 3 182", "Field Studies 2", 3), c("AGEO 3 183", "Igneous and Metamorphic Petrology", 4), c("LS", "Life Skills Course", 4)] },
      { semester: 6, courses: [c("AGEO 3 125", "Introduction to Mineral Resources", 4), c("AGEO 3 139", "Petrophysics", 4), c("AGEO 3 184", "Introduction to Petroleum Geology", 3), c("AGEO 3 141", "Applied Sedimentology", 4), c("AGEO 3 142", "Hydraulic Test", 4), c("AGEO 3 144", "Hydro-geochemistry", 4), c("AGEO 3 146", "Project Management", 3), c("AGEO 3 160", "Hydrogeology 2", 4), c("LS", "Life Skills Course", 4)] },
      { semester: 7, courses: [c("AGEO 4 155", "Internship", 15), c("AGEO 4 147", "Mineral Exploration", 4), c("AGEO 4 149", "Petroleum Exploration", 4), c("AGEO 4 152", "Groundwater Modelling", 3), c("AGEO 4 153", "Team Project", 4), c("AGEO 4 167", "Applied Geophysics", 4), c("AGEO 4 168", "Geoengineering", 4), c("AGEO 4 172", "Geological Visualisation", 3), c("AGEO 4 185", "Field Studies 3", 4)] },
      { semester: 8, courses: [c("AGEO 4 186", "Bachelor's Thesis", 15)] },
    ],
    electives: [],
  },
  {
    id: "mining-engineering",
    shortName: "Mining Engineering",
    name: "Bachelor of Science in Mining Engineering",
    faculty: "Faculty of Science",
    degree: "BSc",
    semesters: [
      { semester: 1, courses: [c("AGEO 1 102", "Rocks and Minerals", 5), c("AGEO 1 107", "Chemistry for Earth Scientists", 5), c("AGEO 1 145", "Mathematics 1: Calculus", 6), c("AGEO 1 163", "Geoengineering Seminar", 3), c("AGEO 1 164", "Planet Earth", 5), c("AGEO 1 175", "Field Work Techniques", 3), c("LS", "Life Skills Course", 4)] },
      { semester: 2, courses: [c("AGEO 1 114", "Physics for Earth Scientists", 5), c("AGEO 1 118", "Laboratory Methods", 3), c("AGEO 1 146", "Mathematics 2: Linear Algebra", 6), c("ENG 1 139", "Engineering Drawing", 3), c("ENG 1 141", "Engineering Principles and Calculations", 4), c("AGEO 2 180", "Introduction to GIS", 3), c("AGEO", "Life of a Mine", 4), c("LS", "Life Skills Course", 4)] },
      { semester: 3, courses: [c("AGEO 2 115", "Structural Geology", 4), c("AGEO 2 174", "Probability and Statistics", 6), c("AGEO", "Mineral Resources", 4), c("LS", "Life Skills Course", 4)] },
      { semester: 4, courses: [c("AGEO", "Mineral Exploration", 4), c("AGEO", "Mining and Sustainability", 4), c("AGEO", "Mining Law", 3), c("AGEO 2 159", "Hydrogeology 1", 4), c("ENG 3 126", "Thermodynamics 1", 5), c("AGEO", "Mine Surveying", 4), c("AGEO", "Surface Mining Methods", 4), c("AGEO", "Underground Mining Methods", 4), c("AGEO", "Mineral Processing", 5), c("LS", "Life Skills Course", 4)] },
      { semester: 5, courses: [c("AGEO 2 122", "Applied Geophysics", 4), c("AGEO 3 133", "Remote Sensing and Image Analysis", 4), c("AGEO 3 138", "Geology of Oman", 3), c("AGEO 3 160", "Hydrogeology 2", 4), c("AGEO 3 182", "Field Studies 2", 3), c("AGEO", "Reserve Modelling", 4), c("AGEO", "Feasibility Studies", 3), c("LS", "Life Skills Course", 4)] },
      { semester: 6, courses: [c("AGEO", "Responsibility of Professional Engineers", 3), c("AGEO", "Environmental Engineering", 5), c("AGEO", "Mine Dewatering", 4), c("AGEO", "Mine Ventilation", 4), c("AGEO", "Mining Equipment", 4), c("AGEO", "Sensor Technology", 4), c("AGEO", "WHS in Mining", 3), c("LS", "Life Skills Course", 4)] },
      { semester: 7, courses: [c("ENV 3 107", "Solid Waste Management", 6), c("AGEO 4 185", "Field Studies 3", 4), c("AGEO", "Geometallurgy", 5), c("AGEO", "Mine Waste Management", 4), c("AGEO", "Mine Closure Planning", 5), c("AGEO", "Mine Reclamation", 4)] },
      { semester: 8, courses: [c("AGEO 4 156", "Colloquium and BEng Thesis", 15), c("AGEO 4 155", "Internship", 15)] },
    ],
    electives: [],
  },
  {
    id: "engineering-geology",
    shortName: "Engineering Geology",
    name: "Bachelor of Science in Engineering Geology",
    faculty: "Faculty of Science",
    degree: "BSc",
    semesters: [
      { semester: 1, courses: [c("AGEO 1 102", "Rocks and Minerals", 5), c("AGEO 1 107", "Chemistry for Earth Scientists", 5), c("AGEO 1 145", "Mathematics 1: Calculus", 6), c("AGEO 1 163", "Geoengineering Seminar", 3), c("AGEO 1 164", "Planet Earth", 5), c("AGEO 1 175", "Field Work Techniques", 3), c("LS", "Life Skills Course", 4)] },
      { semester: 2, courses: [c("AGEO 1 114", "Physics for Earth Scientists", 5), c("AGEO 1 118", "Laboratory Methods", 3), c("AGEO 1 146", "Mathematics 2: Linear Algebra", 6), c("AGEO 2 180", "Introduction to GIS", 3), c("AGEO 1 176", "Interpretation of Geological Maps", 4), c("ENG 1 139", "Engineering Drawing", 3), c("ENG 1 141", "Engineering Principles and Calculations", 4), c("LS", "Life Skills Course", 4)] },
      { semester: 3, courses: [c("AGEO 2 115", "Structural Geology", 4), c("AGEO 2 174", "Probability and Statistics", 6), c("AGEO 2 117", "Sedimentology", 4), c("AGEO 2 170", "Water Cycle", 3), c("AGEO 2 109", "Geological Field Methods 1", 3), c("AGEO 2 178", "Field Studies 1", 3), c("LS", "Life Skills Course", 4)] },
      { semester: 4, courses: [c("AGEO 2 159", "Hydrogeology 1", 4), c("ENG 3 126", "Thermodynamics 1", 5), c("ENG 3 126", "Fluid Dynamics", 7), c("AGEO", "Rock Mechanics", 6), c("AGEO", "Soil Mechanics", 6), c("LS", "Life Skills Course", 4)] },
      { semester: 5, courses: [c("AGEO 2 122", "Applied Geophysics", 4), c("AGEO 3 130", "Geohazards", 3), c("AGEO 3 133", "Remote Sensing and Image Analysis", 4), c("AGEO 3 138", "Geology of Oman", 3), c("AGEO 3 160", "Hydrogeology 2", 4), c("AGEO 3 173", "Hydrogeological Field Methods", 4), c("AGEO 3 182", "Field Studies 2", 3), c("LS", "Life Skills Course", 4)] },
      { semester: 6, courses: [c("AGEO 3 181", "Geological Field Methods 2", 3), c("AGEO", "Responsibility of Professional Engineers", 3), c("AGEO", "Environmental Engineering", 5), c("AGEO", "Site Investigation", 6), c("AGEO", "Engineering Geology 1", 5), c("ENG 2 116", "Practical Engineering Geology", 5), c("LS", "Life Skills Course", 4)] },
      { semester: 7, courses: [c("AGEO 4 185", "Field Studies 3", 4), c("AGEO", "Engineering Geology 2", 6), c("AGEO", "Hydrogeochemistry", 4), c("AGEO", "Environmental Engineering Lab Methods", 5), c("AGEO", "Groundwater Modelling", 3), c("ENV 3 107", "Solid Waste Management", 6)] },
      { semester: 8, courses: [c("AGEO 4 156", "Colloquium and BEng Thesis", 15), c("AGEO 4 155", "Internship", 15)] },
    ],
    electives: [],
  },
  {
    id: "urban-planning-architectural-design",
    shortName: "Urban Planning and Architectural Design",
    name: "Bachelor of Science in Urban Planning and Architectural Design",
    faculty: "Faculty of Urban Planning and Architecture",
    degree: "BSc",
    semesters: [
      { semester: 1, courses: [c("UPAD 1 102", "Creative Techniques 1", 3), c("UPAD 1 103", "History of Urban Development 1", 3), c("UPAD 1 105", "Introduction to Project Design", 6), c("UPAD 1 106", "Perceptions of Space and Shapes", 4), c("UPAD 1 174", "Architecture 1", 4), c("UPAD 1 175", "Technical Drawing", 5), c("LS", "Life Skills Course", 4)] },
      { semester: 2, courses: [c("UPAD 1 109", "Integrated Project 1", 6), c("UPAD 1 111", "Urban Design 1", 4), c("UPAD 1 113", "History of Urban Development 2", 3), c("UPAD 1 115", "Creative Techniques 2", 3), c("UPAD 1 117", "Computer Aided Design 1", 5), c("UPAD 1 176", "Architecture 2", 4), c("LS", "Life Skills Course", 4)] },
      { semester: 3, courses: [c("UPAD 2 114", "Computer Aided Design 2", 4), c("UPAD 2 116", "Urban Planning History 1", 2), c("UPAD 2 120", "Urban Design 2", 5), c("UPAD 2 123", "Integrated Project 2: City and Landscape", 6), c("UPAD 2 177", "Architecture 3", 5), c("UPAD 2 190", "Building Construction 1", 3), c("UPAD 2 192", "Building Construction 2", 4), c("LS", "Life Skills Course", 4)] },
      { semester: 4, courses: [c("UPAD 2 127", "Urban Planning History 2", 2), c("UPAD 2 131", "Integrated Project 3: Building and Construct", 6), c("UPAD 2 135", "Urban Design 3", 5), c("UPAD 2 178", "Architecture 4", 4), c("UPAD 2 179", "Building Construction 3", 3), c("UPAD 2 180", "Building Construction 4", 3), c("UPAD 2 181", "Computer Aided Design 3", 4), c("LS", "Life Skills Course", 4)] },
      { semester: 5, courses: [c("UPAD 3 137", "Economics 1", 3), c("UPAD 3 138", "Urban Preservation and Renewal", 5), c("UPAD 3 140", "Integrated Project 4: Build and Construct", 9), c("UPAD 3 141", "Planning Law 1", 3), c("UPAD 3 194", "Building Construction 5", 4), c("UPAD 3 195", "Urban Infrastructure and Technologies", 4), c("LS", "Life Skills Course", 4)] },
      { semester: 6, courses: [c("UPAD 3 143", "Integrated Project 5: City and Landscape", 9), c("UPAD 3 145", "Economics 2", 3), c("UPAD 3 146", "International Urban Design", 5), c("UPAD 3 147", "Planning Law 2", 3), c("UPAD 3 189", "Urban Planning Theory", 4), c("UPAD", "General Elective", 4), c("LS", "Life Skills Course", 4)] },
      { semester: 7, courses: [c("UPAD 4 153", "Internship", 7), c("UPAD 4 151", "Excursion", 5), c("UPAD 4 152", "Integrated Project 6", 9), c("UPAD", "Electives 1–2", 4)] },
      { semester: 8, courses: [c("UPAD 4 371", "Thesis Preparation", 3), c("UPAD 4 156", "Bachelor Thesis", 12), c("UPAD 4 155", "Colloquium", 3), c("UPAD 4 158", "Brief Design", 7)] },
    ],
    electives: ["Intro to GIS for Architects and Urban Planners", "BIM Systems", "Landscape Architecture", "Arabic Urban Design", "Urban Analysis and Design", "Visualisation Techniques"],
  },
];

export const GUtech_MAJOR_NAMES = GUtech_PROGRAMS.map((p) => p.shortName).sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: "base" })
);

/** All 12 GUtech bachelor programmes from Academic Catalogue 2025–2026 */
export const GUtech_BACHELOR_PROGRAMMES = GUtech_PROGRAMS.map((p) => ({
  id: p.id,
  shortName: p.shortName,
  name: p.name,
  faculty: p.faculty,
  degree: p.degree,
}));

export function isGutechUniversity(university) {
  if (!university) return false;
  const u = university.toLowerCase();
  return u.includes("gutech") || u.includes("german university of technology");
}

export function findGutechProgram(major) {
  if (!major || major === "Not sure yet") return null; // legacy profiles
  const normalized = major.toLowerCase().trim();
  const aliases = {
    cybersecurity: "cyber-security",
    "cyber security": "cyber-security",
    "software engineering": "computer-science",
    "information technology": "computer-science",
    "data science": "computer-science",
    "urban planning": "urban-planning-architectural-design",
    architecture: "urban-planning-architectural-design",
  };
  const id = aliases[normalized];
  if (id) {
    return GUtech_PROGRAMS.find((p) => p.id === id) ?? null;
  }
  return (
    GUtech_PROGRAMS.find(
      (p) =>
        p.shortName.toLowerCase() === normalized ||
        p.name.toLowerCase() === normalized ||
        p.id === normalized.replace(/\s+/g, "-")
    ) ?? null
  );
}

function buildSemesterSections(program, semesterNumbers) {
  return semesterNumbers
    .map((semNum, index) => {
      const semData = program.semesters.find((s) => s.semester === semNum);
      if (!semData?.courses?.length) return null;

      return {
        id: `sem-${semNum}`,
        title: `Semester ${index + 1}`,
        description: `Catalogue semester ${semNum}`,
        semester: semNum,
        topics: semData.courses.map((course) => courseToTopic(course, semNum)),
      };
    })
    .filter(Boolean);
}

function difficultyForSemester(semester) {
  if (semester <= 2) return "Beginner";
  if (semester <= 4) return "Intermediate";
  return "Advanced";
}

function courseToTopic(course, semester) {
  return {
    id: `${course.code}-${course.name}`.replace(/\s+/g, "-").toLowerCase(),
    title: course.name,
    code: course.code,
    difficulty: difficultyForSemester(semester),
    weeks: Math.max(2, Math.round((course.credits || 5) * 0.75)),
    credits: course.credits,
    semester,
    mastery: "not_started",
  };
}

/**
 * Returns roadmap sections split into Semester 1 & Semester 2 for the student's year.
 */
export function getGutechRoadmapForProfile(profile) {
  const program = findGutechProgram(profile?.major);
  const { yearNum, term } = parseStudyPeriod(profile?.year);

  if (!program) {
    return null;
  }

  const semesterNumbers = getGutechSemesterNumbers(yearNum, term);
  const sections = buildSemesterSections(program, semesterNumbers);

  if (yearNum === 1 && term === 1 && profile?.onFoundation) {
    const foundationTopics = GUtech_FOUNDATION.courses.semester1
      .slice(0, 3)
      .map((course) => courseToTopic(course, 0));
    if (sections[0]) {
      sections[0].topics = [...foundationTopics, ...sections[0].topics];
    }
  }

  return {
    meta: {
      major: program.shortName,
      programName: program.name,
      faculty: program.faculty,
      university: GUtech_UNIVERSITY.shortName,
      year: String(yearNum),
      term: term ? String(term) : null,
      semesters: semesterNumbers,
      catalogue: "2025-2026",
      catalogueScope: "bachelor",
      catalogueNote:
        "Academic Catalogue 2025–2026 covers bachelor programmes only (not master's or other degrees).",
      totalCredits: GUtech_UNIVERSITY.totalCredits,
    },
    sections,
    program,
  };
}

export function getMajorsForUniversity(university) {
  if (isGutechUniversity(university)) return GUtech_MAJOR_NAMES;
  return null;
}
