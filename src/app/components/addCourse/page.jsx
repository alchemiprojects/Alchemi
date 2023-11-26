"use client"
import { useState } from 'react';
import styles from './Upload.module.css';
import {useRouter} from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';


export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [bookName, setBookName] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSyllabusSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const user = app.currentUser;
    const token = user ? user._accessToken : null;
    const response = await fetch('/api/uploadSyllabus', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Include other headers as needed, like 'Content-Type' if your API expects it
      },
      body: formData,
    });

    const data = await response.json();
    if (data.extractedData) {
      setDescription(data.extractedData.CourseDescription || '');
      setContent(data.extractedData.CourseContentAndLearningObjectives || '');
      setBookName(data.extractedData.RequiredLectureTextbook || '');
      setSummary(data.extractedData.Summary || '');
    }
    setFile(null);
    setIsLoading(false);

  };
  const router = useRouter();

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const courseData = { title, description, content, bookName, summary };
  
    try {
      setIsLoading(true);
      const user = app.currentUser;
      const token = user ? user._accessToken : null;
      const response = await fetch('/api/createCourse', { // Adjust the endpoint as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,

        },
        body: JSON.stringify(courseData),
      });
   
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Course created successfully:', result);
      router.push('/components/dashboard'); // Replace '/path-to-dashboard' with the actual path

      // Handle successful response here (e.g., show a success message, clear form, etc.)
    } catch (error) {
      console.error('Failed to create course:', error);
      // Handle errors here (e.g., show error message)
    }
    setIsLoading(false);

  };
  
  return (
    <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSyllabusSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        {isLoading ? (
            <CircularProgress />
          ) : (
            <button type="submit">Upload Syllabus</button>
            )}
      </form>
      
      <form className={styles.form} onSubmit={handleCourseSubmit}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Course Title" 
          required 
        />
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Description"
        />
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="Content"
        />
        <input 
          type="text" 
          value={bookName} 
          onChange={(e) => setBookName(e.target.value)} 
          placeholder="Book Name"
        />
        <textarea 
          value={summary} 
          onChange={(e) => setSummary(e.target.value)} 
          placeholder="Summary"
        />
        <button type="submit">Create Course</button>
      </form>
    </div>
  );
}