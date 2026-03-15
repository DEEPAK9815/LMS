export const initializeDb = () => {
  if (!localStorage.getItem('courses')) {
    const initialCourses = [
      {
        id: 'c1',
        title: 'Full-Stack Web Development',
        description: 'Master the art of building scalable web apps with modern technologies from frontend to backend.',
        instructor: 'Sarah Drasner',
        price: 49.99,
        discount: 10,
        thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=600&h=400',
        modules: [
          { type: 'video', title: 'Introduction to HTML & CSS', duration: '15:00', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { type: 'document', title: 'CSS Flexbox Guide', downloadable: true },
          { type: 'video', title: 'JavaScript Basics', duration: '25:00', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        ]
      },
      {
        id: 'c2',
        title: 'Advanced React patterns',
        description: 'Take your React skills to the next level by learning advanced patterns, performance optimization, and internals.',
        instructor: 'Kent C. Dodds',
        price: 79.99,
        discount: 0,
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600&h=400',
        modules: [
          { type: 'video', title: 'React Performance', duration: '20:00' },
          { type: 'document', title: 'Hooks Cheatsheet', downloadable: true },
        ]
      },
      {
        id: 'c3',
        title: 'Data Science with Python',
        description: 'Learn data analysis, visualization, and machine learning using Python and popular libraries.',
        instructor: 'Jose Portilla',
        price: 89.99,
        discount: 20,
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600&h=400',
        modules: [
          { type: 'video', title: 'Intro to Pandas', duration: '30:00' },
        ]
      }
    ];
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
