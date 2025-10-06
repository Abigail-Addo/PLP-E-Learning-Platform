export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  lessons: Lesson[];
  totalDuration: string;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites from scratch.",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    instructor: "Sarah Johnson",
    totalDuration: "4h 30m",
    lessons: [
      { id: "1-1", title: "Getting Started with HTML", duration: "30m", completed: false },
      { id: "1-2", title: "CSS Fundamentals", duration: "45m", completed: false },
      { id: "1-3", title: "JavaScript Basics", duration: "1h", completed: false },
      { id: "1-4", title: "Building Your First Website", duration: "1h 15m", completed: false },
      { id: "1-5", title: "Responsive Design Principles", duration: "1h", completed: false },
    ],
  },
  {
    id: "2",
    title: "React for Beginners",
    description: "Master React and build interactive user interfaces with components, hooks, and state management.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
    instructor: "Mike Chen",
    totalDuration: "6h 15m",
    lessons: [
      { id: "2-1", title: "Introduction to React", duration: "45m", completed: false },
      { id: "2-2", title: "Components and Props", duration: "1h", completed: false },
      { id: "2-3", title: "State and Lifecycle", duration: "1h 15m", completed: false },
      { id: "2-4", title: "Hooks Deep Dive", duration: "1h 30m", completed: false },
      { id: "2-5", title: "Building a Real Project", duration: "1h 45m", completed: false },
    ],
  },
  {
    id: "3",
    title: "Python Programming Masterclass",
    description: "From basics to advanced concepts, become proficient in Python programming and automation.",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop",
    instructor: "David Martinez",
    totalDuration: "8h 45m",
    lessons: [
      { id: "3-1", title: "Python Fundamentals", duration: "1h", completed: false },
      { id: "3-2", title: "Data Structures", duration: "1h 30m", completed: false },
      { id: "3-3", title: "Object-Oriented Programming", duration: "2h", completed: false },
      { id: "3-4", title: "Working with Files and APIs", duration: "1h 45m", completed: false },
      { id: "3-5", title: "Advanced Python Techniques", duration: "2h 30m", completed: false },
    ],
  },
  {
    id: "4",
    title: "UI/UX Design Fundamentals",
    description: "Learn design principles, user research, prototyping, and create beautiful user experiences.",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    instructor: "Emma Wilson",
    totalDuration: "5h 20m",
    lessons: [
      { id: "4-1", title: "Design Principles", duration: "50m", completed: false },
      { id: "4-2", title: "User Research Methods", duration: "1h 10m", completed: false },
      { id: "4-3", title: "Wireframing and Prototyping", duration: "1h 20m", completed: false },
      { id: "4-4", title: "Visual Design", duration: "1h", completed: false },
      { id: "4-5", title: "Usability Testing", duration: "1h", completed: false },
    ],
  },
  {
    id: "5",
    title: "Data Science with Python",
    description: "Explore data analysis, visualization, and machine learning using Python libraries.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    instructor: "Alex Thompson",
    totalDuration: "10h",
    lessons: [
      { id: "5-1", title: "Introduction to Data Science", duration: "1h", completed: false },
      { id: "5-2", title: "NumPy and Pandas", duration: "2h", completed: false },
      { id: "5-3", title: "Data Visualization", duration: "1h 30m", completed: false },
      { id: "5-4", title: "Statistical Analysis", duration: "2h", completed: false },
      { id: "5-5", title: "Machine Learning Basics", duration: "3h 30m", completed: false },
    ],
  },
  {
    id: "6",
    title: "Mobile App Development",
    description: "Build native mobile applications for iOS and Android using modern frameworks.",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    instructor: "Rachel Kim",
    totalDuration: "7h 30m",
    lessons: [
      { id: "6-1", title: "Mobile Development Overview", duration: "45m", completed: false },
      { id: "6-2", title: "Setting Up Development Environment", duration: "1h", completed: false },
      { id: "6-3", title: "Building UI Components", duration: "2h", completed: false },
      { id: "6-4", title: "Navigation and Routing", duration: "1h 30m", completed: false },
      { id: "6-5", title: "Publishing Your App", duration: "2h 15m", completed: false },
    ],
  },
];
