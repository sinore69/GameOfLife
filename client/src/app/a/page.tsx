"use client";
import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/a.module.css'; // <- import CSS module

export default function FadeScrollSection() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Scroll Animation Demo</h1>
      <p className={styles.subtitle}>Scroll down to see sections fade in and out</p>
      
      <div className={styles.sectionList}>
        <ScrollSection 
          section={{
            id: 1,
            title: "Section 1",
            content: "This is the content for section 1"
          }}
        />
        <ScrollSection 
          section={{
            id: 2,
            title: "Section 2",
            content: "This is the content for section 2"
          }}
        />
        <ScrollSection 
          section={{
            id: 3,
            title: "Section 3",
            content: "This is the content for section 3"
          }}
        />
        <ScrollSection 
          section={{
            id: 4,
            title: "Section 4",
            content: "This is the content for section 4"
          }}
        />
        <ScrollSection 
          section={{
            id: 5,
            title: "Section 5",
            content: "This is the content for section 5"
          }}
        />
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
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
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
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

  const getClasses = () => {
    if (direction === 'up') {
      return isVisible ? styles.fadeVisible : styles.fadeHidden;
    }
    return isVisible 
      ? `${styles.fadeVisible} ${styles.fadeTransition}` 
      : `${styles.fadeHidden} ${styles.fadeTransition}`;
  };

  return (
    <div 
      ref={sectionRef} 
      className={`${styles.section} ${getClasses()}`}
    >
      <h2 className={styles.sectionTitle}>{section.title}</h2>
      <p className={styles.sectionContent}>{section.content}</p>
      <div className={styles.stateBox}>
        <p className={styles.stateText}>
          Current state: {isVisible ? 'Visible' : 'Not visible'}, 
          Scroll direction: {direction}
        </p>
      </div>
    </div>
  );
}
