import React from 'react';
import { PlayCircle, CheckCircle } from 'lucide-react';

/**
 * Content Module - Video Player
 * High performance video rendering wrapper
 */
const VideoPlayer = ({ activeLesson, onComplete, videoUrl }) => {
  // Extract YouTube ID from URL if provided, otherwise fallback to a default video
  let youtubeId = 'dQw4w9WgXcQ'; // Default placeholder video
  
  if (videoUrl) {
    // Handle standard watch URLs and embed URLs
    try {
      if (videoUrl.includes('youtube.com/embed/')) {
        youtubeId = videoUrl.split('youtube.com/embed/')[1].split('?')[0];
      } else if (videoUrl.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(videoUrl).search);
        youtubeId = urlParams.get('v') || youtubeId;
      } else if (videoUrl.includes('youtu.be/')) {
        youtubeId = videoUrl.split('youtu.be/')[1].split('?')[0];
      }
    } catch (e) {
      console.error("Failed to parse YouTube URL:", videoUrl);
    }
  }

  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?rel=0`;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="video-wrapper" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <iframe
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      {/* Mark complete button for LMS progress tracking */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <button 
          className="btn btn-success" 
          onClick={() => { if (onComplete) onComplete(); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px' }}
        >
          <CheckCircle size={20} />
          Mark Lesson Complete
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
