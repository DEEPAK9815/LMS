const CATEGORIES = [
  'Web Development',
  'Java Programming',
  'Python Programming',
  'Data Structures & Algorithms',
  'Artificial Intelligence',
  'Machine Learning',
  'Cloud Computing',
  'Database Systems',
  'Cybersecurity',
  'Software Testing'
];

const INSTRUCTORS = [
  'Sarah Drasner', 'Kent C. Dodds', 'Jose Portilla', 'Angela Yu', 
  'Colt Steele', 'Andrei Neagoie', 'Maximilian Schwarzmüller', 'Stephen Grider'
];

const generateCourses = () => {
  const courses = [];
  for (let i = 0; i < 60; i++) {
    const isFree = i < 35; // 35 Free courses
    const category = CATEGORIES[i % CATEGORIES.length];
    const instructor = INSTRUCTORS[i % INSTRUCTORS.length];
    const price = isFree ? 0 : Math.floor(Math.random() * 80) + 19.99;
    const discount = isFree ? 0 : (Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : 0);
    
    // Duration
    const totalHours = Math.floor(Math.random() * 40) + 5;
    
    courses.push({
      id: `c${i + 1}`,
      title: `${category} - ${isFree ? 'Basics to Advanced' : 'Masterclass Master Bootcamp'} ${i + 1}`,
      description: `Comprehensive course on ${category}. Master the core concepts, build real-world projects, and advance your career with expert instruction from ${instructor}.`,
      instructor: instructor,
      category: category,
      price: price,
      discount: discount,
      duration: `${totalHours} hours`,
      thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?auto=format&fit=crop&q=80&w=600&h=400&random=${i}`, // Random reliable unsplash looking pattern
      modules: [
        { type: 'video', title: `Introduction to ${category}`, duration: '15:00', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { type: 'video', title: `Core Fundamentals of ${category}`, duration: '25:00', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { type: 'document', title: `${category} Cheatsheet & Setup Guide`, downloadable: true },
        { type: 'video', title: 'Advanced Techniques Part 1', duration: '30:00', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { type: 'quiz', title: `Module 1 Assessment: ${category}`, duration: '10 mins', question: `Which of the following is essential for ${category}?`, options: ['Consistency', 'Apathy', 'Randomness', 'Inaction'], answer: 0 }
      ]
    });
  }
  return courses;
};

export const initializeDb = () => {
  const existingCourses = localStorage.getItem('courses');
  // Re-generate database if it is missing or if it has the old 3-course structure
  if (!existingCourses || JSON.parse(existingCourses).length < 60) {
    const initialCourses = generateCourses();
    localStorage.setItem('courses', JSON.stringify(initialCourses));
  }
  
  if (!localStorage.getItem('enrollments')) {
    localStorage.setItem('enrollments', JSON.stringify([])); // { userId, courseId, progress: 0, completedLessons: [] }
  }
};

export const getCourses = () => JSON.parse(localStorage.getItem('courses') || '[]');
export const saveCourses = (courses) => localStorage.setItem('courses', JSON.stringify(courses));

export const getEnrollments = () => JSON.parse(localStorage.getItem('enrollments') || '[]');
export const saveEnrollments = (enrollments) => localStorage.setItem('enrollments', JSON.stringify(enrollments));

export const getUserEnrollment = (userId, courseId) => {
  const enrollments = getEnrollments();
  return enrollments.find(e => e.userId === userId && e.courseId === courseId);
};

export const enrollUser = (userId, courseId) => {
  const enrollments = getEnrollments();
  const existing = enrollments.find(e => e.userId === userId && e.courseId === courseId);
  if (!existing) {
    enrollments.push({ userId, courseId, progress: 0, completedLessons: [] });
    saveEnrollments(enrollments);
  }
};

export const updateProgress = (userId, courseId, lessonIndex) => {
    const enrollments = getEnrollments();
    const existing = enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (existing && !existing.completedLessons.includes(lessonIndex)) {
        existing.completedLessons.push(lessonIndex);
        
        // update progress
        const course = getCourses().find(c => c.id === courseId);
        if(course && course.modules.length > 0) {
            existing.progress = Math.round((existing.completedLessons.length / course.modules.length) * 100);
        }
        saveEnrollments(enrollments);
    }
}
