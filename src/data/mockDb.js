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
        thumbnail: `https://picsum.photos/seed/course_${i + 1}/600/400`,
        sections: [
          {
            id: 's0',
            title: 'Basics',
            lessons: [
              { id: 's0l0', type: 'video', title: `Introduction to ${category}`, duration: '15:00', videoUrl: 'https://www.youtube.com/watch?v=O5nskjZ_GoI' }, // CrashCourse CS
              { id: 's0l1', type: 'video', title: `Setup and Installation`, duration: '25:00', videoUrl: 'https://www.youtube.com/watch?v=WPqXP_kLzpo' } // VSCode Setup
            ]
          },
          {
            id: 's1',
            title: 'Variables',
            lessons: [
              { id: 's1l0', type: 'document', title: `${category} Cheatsheet & Setup Guide`, downloadable: true, duration: '5 mins' },
              { id: 's1l1', type: 'video', title: 'Core Variables and Data Types', duration: '30:00', videoUrl: 'https://www.youtube.com/watch?v=PkZNo7MFOUg' } // freeCodeCamp Variables/Basics
            ]
          },
          {
            id: 's2',
            title: 'OOP',
            lessons: [
              { id: 's2l0', type: 'video', title: 'Object Oriented Programming', duration: '45:00', videoUrl: 'https://www.youtube.com/watch?v=PFmuCDHHpwk' }, // Mosh OOP
              { id: 's2l1', type: 'quiz', title: `Module Assessment: ${category}`, duration: '10 mins', question: `Which of the following is essential for ${category}?`, options: ['Consistency', 'Apathy', 'Randomness', 'Inaction'], answer: 0 }
            ]
          }
        ]
      });
  }
  return courses;
};

export const initializeDb = () => {
  const existingCourses = localStorage.getItem('courses');
  // Re-generate database if it is missing, has the old 3-course structure, or if we need to force update for new YouTube URLs
  if (true || !existingCourses || JSON.parse(existingCourses).length < 60) {
    const initialCourses = generateCourses();
    localStorage.setItem('courses', JSON.stringify(initialCourses));
  }
  
  if (!localStorage.getItem('enrollments')) {
    localStorage.setItem('enrollments', JSON.stringify([])); // { userId, courseId, progress: 0, completedLessons: [], enrollmentDate, lastWatchedLesson }
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
    enrollments.push({ 
        userId, 
        courseId, 
        progress: 0, 
        completedLessons: [], 
        enrollmentDate: new Date().toISOString(),
        lastWatchedLesson: null
    });
    saveEnrollments(enrollments);
  }
};

export const updateProgress = (userId, courseId, lessonId) => {
    const enrollments = getEnrollments();
    const existing = enrollments.find(e => e.userId === userId && e.courseId === courseId);
    
    if (existing) {
        if (!existing.completedLessons.includes(lessonId)) {
            existing.completedLessons.push(lessonId);
            
            // update progress
            const course = getCourses().find(c => c.id === courseId);
            if(course && course.sections) {
                let totalLessons = 0;
                course.sections.forEach(s => totalLessons += s.lessons.length);
                existing.progress = Math.round((existing.completedLessons.length / totalLessons) * 100);
            }
        }
        
        // Track last watched lesson securely per student flow
        existing.lastWatchedLesson = lessonId;
        saveEnrollments(enrollments);
    }
}
