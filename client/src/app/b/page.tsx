"use client"
import { useEffect, useRef, useState } from 'react';

export default function FadeScrollSection() {
  // Sample sections for demonstration
  const sections = [
    { id: 1, title: "Section 1", content: "This is the content for section 1" },
    { id: 2, title: "Section 2", content: "This is the content for section 2" },
    { id: 3, title: "Section 3", content: "This is the content for section 3" },
    { id: 4, title: "Section 4", content: "This is the content for section 4" },
    { id: 5, title: "Section 5", content: "This is the content for section 5" }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Scroll Animation Demo</h1>
      <p className="text-center mb-8 text-gray-600">Scroll down to see sections fade in and out</p>
      
      <div className="space-y-32 mb-96">
        {sections.map(section => (
          <ScrollSection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

interface Section {
  id: number;
  title: string;
  content: string;
}

function ScrollSection({ section }: { section: Section }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [direction, setDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const newDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      setDirection(newDirection);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update visibility state
        setIsVisible(entry.isIntersecting);
        
        // Track if the element has ever been visible
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Determine which classes to apply
  const getClasses = () => {
    // If scrolling up, element should be immediately visible without animation
    if (direction === 'up') {
      return isVisible ? 'opacity-100' : 'opacity-0';
    }
    
    // When scrolling down, apply fade in/out animation
    return isVisible 
      ? 'opacity-100 transition-opacity duration-1000' 
      : 'opacity-0 transition-opacity duration-1000';
  };

  return (
    <div 
      ref={sectionRef} 
      className={`p-6 bg-white rounded-lg shadow-md ${getClasses()}`}
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-600">{section.title}</h2>
      <p className="text-gray-700">{section.content}</p>
      <div className="mt-4 p-4 bg-gray-200 rounded">
        <p className="text-sm text-gray-600">
          Current state: {isVisible ? 'Visible' : 'Not visible'}, 
          Scroll direction: {direction}
        </p>
      </div>
    </div>
  );
}