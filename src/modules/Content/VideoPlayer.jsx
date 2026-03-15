import React from 'react';
import { PlayCircle } from 'lucide-react';

/**
 * Content Module - Video Player
 * High performance video rendering wrapper
 */
const VideoPlayer = ({ activeLesson, onComplete }) => {
  return (
    <div className="video-wrapper fade-in">
      <img
        src={`https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1280&h=720&random=${activeLesson}`}
        alt="Video Placeholder"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        loading="lazy" /* Performance optimization */
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '50%',
          padding: '20px',
          cursor: 'pointer'
        }}
        onClick={() => {
          // Simulate completing video watch
          if (onComplete) onComplete();
        }}
      >
        <PlayCircle size={64} color="var(--primary)" />
      </div>
    </div>
  );
};

export default VideoPlayer;
