'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Matrix Rain Component
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|;:<>?/\\~`アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const charArray = chars.split('')
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#00ff41'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Gradient effect for the characters
        const gradient = ctx.createLinearGradient(x, y - 20, x, y)
        gradient.addColorStop(0, 'rgba(0, 255, 65, 0)')
        gradient.addColorStop(1, '#00ff41')
        ctx.fillStyle = gradient

        ctx.fillText(text, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} id="matrix-canvas" />
}

// Typing Effect Hook
const useTypingEffect = (texts: string[], speed = 100, deleteSpeed = 50, pauseTime = 2000) => {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[textIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setTextIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? deleteSpeed : speed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, textIndex, texts, speed, deleteSpeed, pauseTime])

  return displayText
}

// 3D Tilt Card Component
const TiltCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    card.style.setProperty('--rotateX', `${-rotateX}deg`)
    card.style.setProperty('--rotateY', `${rotateY}deg`)
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--rotateX', '0deg')
    card.style.setProperty('--rotateY', '0deg')
  }, [])

  return (
    <div
      ref={cardRef}
      className={`card-3d ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

// Terminal Component
const Terminal = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="terminal">
    <div className="terminal-header">
      <div className="terminal-dot" style={{ background: '#ff5f56' }} />
      <div className="terminal-dot" style={{ background: '#ffbd2e' }} />
      <div className="terminal-dot" style={{ background: '#27ca40' }} />
      <span className="ml-4 text-xs text-gray-500">{title}</span>
    </div>
    <div className="terminal-body text-[#00ff41]">{children}</div>
  </div>
)

// Skill Bar Component
const SkillBar = ({ skill, percentage, delay = 0 }: { skill: string; percentage: number; delay?: number }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-2">
      <span className="text-sm font-mono">{skill}</span>
      <span className="text-sm text-[#00ffff]">{percentage}%</span>
    </div>
    <div className="skill-bar">
      <div
        className="skill-bar-fill"
        style={{ width: `${percentage}%`, animationDelay: `${delay}ms` }}
      />
    </div>
  </div>
)

// Circular Progress Component
const CircularProgress = ({ percentage, label, size = 100 }: { percentage: number; label: string; size?: number }) => {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ff41" />
            <stop offset="100%" stopColor="#00ffff" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute mt-8 text-lg font-bold">{percentage}%</span>
      <span className="mt-2 text-sm text-center">{label}</span>
    </div>
  )
}

// Project Card Component
const ProjectCard = ({ 
  title, 
  description, 
  tech, 
  period,
  highlights 
}: { 
  title: string; 
  description: string; 
  tech: string[]; 
  period: string;
  highlights: string[];
}) => (
  <TiltCard>
    <Card className="bg-[#0d0d0d] border-[#00ff4133] hover:border-[#00ff41] transition-all duration-500 overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-[#00ff41] group-hover:neon-text transition-all">{title}</h3>
          <span className="text-xs text-[#00ffff] font-mono">{period}</span>
        </div>
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="space-y-2 mb-4">
          {highlights.map((highlight, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="text-[#00ff41] mt-1">▹</span>
              <span>{highlight}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {tech.map((t, i) => (
            <Badge key={i} variant="outline" className="border-[#00ff4166] text-[#00ff41] text-xs">
              {t}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  </TiltCard>
)

// Experience Card Component
const ExperienceCard = ({ 
  role, 
  company, 
  period, 
  highlights 
}: { 
  role: string; 
  company: string; 
  period: string; 
  highlights: string[];
}) => (
  <div className="relative pl-8 pb-8 border-l-2 border-[#00ff4133] last:pb-0">
    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#00ff41] neon-border" />
    <div className="mb-2">
      <h3 className="text-xl font-bold text-[#00ff41]">{role}</h3>
      <p className="text-[#00ffff]">{company}</p>
      <p className="text-sm text-gray-500">{period}</p>
    </div>
    <ul className="space-y-2 mt-4">
      {highlights.map((h, i) => (
        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
          <span className="text-[#00ff41]">▹</span>
          <span>{h}</span>
        </li>
      ))}
    </ul>
  </div>
)

// Navigation Component
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'resume', 'contact']
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505ee] backdrop-blur-md border-b border-[#00ff4133]' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-[#00ff41] font-mono">
          <span className="text-[#00ffff]">&lt;</span>
          RAHMAN
          <span className="text-[#00ffff]">/&gt;</span>
        </div>
        <div className="hidden md:flex gap-6">
          {['About', 'Skills', 'Experience', 'Projects', 'Resume', 'Contact'].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className={`nav-link text-sm font-mono ${activeSection === item.toLowerCase() ? 'text-[#00ffff]' : ''}`}
            >
              {item}
            </button>
          ))}
        </div>
        <Button 
          variant="outline" 
          className="border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black"
          onClick={() => scrollTo('contact')}
        >
          Hire Me
        </Button>
      </div>
    </nav>
  )
}

// Main Portfolio Component
export default function Portfolio() {
  const typingText = useTypingEffect([
    'Full Stack Developer',
    'Software Engineer',
    'Cloud Enthusiast',
    'Problem Solver',
    'Tech Innovator'
  ], 80, 40, 1500)

  const skills = {
    languages: [
      { name: 'Python', level: 90 },
      { name: 'JavaScript', level: 85 },
      { name: 'Java', level: 80 },
      { name: 'C/C++', level: 75 },
      { name: 'SQL', level: 85 },
    ],
    frameworks: [
      { name: 'React.js', level: 85 },
      { name: 'Node.js', level: 90 },
      { name: 'Express.js', level: 85 },
      { name: 'REST APIs', level: 90 },
    ],
    tools: [
      { name: 'AWS', level: 80 },
      { name: 'MongoDB', level: 85 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'Git/GitHub', level: 90 },
    ]
  }

  const projects = [
    {
      title: 'Video Streaming Platform',
      description: 'A full-stack video streaming solution with real-time communication and adaptive streaming.',
      tech: ['JavaScript', 'Node.js', 'React.js', 'WebSockets', 'REST APIs', 'MongoDB'],
      period: 'Feb 2023 - Apr 2023',
      highlights: [
        'Architected full-stack video streaming with JWT authentication following OpenAPI standards',
        'Integrated Clerk for OAuth and Stream SDK for adaptive bitrate streaming',
        'Implemented WebSocket channels for low-latency real-time chat',
        'Optimized MongoDB indexing reducing query latency by 30%'
      ]
    },
    {
      title: 'PhotoCast - Image Repository',
      description: 'A responsive web application for image hosting and management with cloud deployment.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MongoDB', 'AWS S3', 'CloudFront'],
      period: 'Nov 2022 - Jan 2023',
      highlights: [
        'Developed CRUD REST APIs with proper HTTP status codes and error handling',
        'Engineered MongoDB schemas with efficient indexing for fast search',
        'Applied algorithmic optimizations reducing page load time by 40%',
        'Deployed on AWS S3 with CloudFront CDN integration'
      ]
    },
    {
      title: 'DSA Problem Solving',
      description: 'Active problem solving on LeetCode covering algorithms and data structures.',
      tech: ['Python', 'Java', 'LeetCode'],
      period: 'Ongoing',
      highlights: [
        'Solving problems covering arrays, linked lists, trees, graphs, dynamic programming',
        'Applying patterns like sliding window, two pointers, BFS/DFS, divide & conquer',
        'Focus on time/space complexity analysis and optimization'
      ]
    }
  ]

  const experiences = [
    {
      role: 'Software Development Engineer (Intern)',
      company: 'AICTE AWS Academy',
      period: 'April 2024 - June 2024',
      highlights: [
        'Designed and deployed cloud-native applications on AWS (EC2, S3, Lambda)',
        'Developed ML pipelines using supervised and unsupervised learning algorithms',
        'Built and consumed RESTful APIs following OpenAPI specifications',
        'Established Git workflows with feature branching, PRs, and code reviews',
        'Wrote unit and integration tests (PyTest) for ML models and API endpoints'
      ]
    }
  ]

  const certifications = [
    'Cisco Network Academy: PCAP - Programming Essentials in Python',
    'GUVI: Python Programming',
    'NextGen Employability Program: Building Data Analytics Applications with Cloud',
    'In Progress: AWS Certified Cloud Practitioner (CLF-C02)'
  ]

  // Scroll reveal effect
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal')
    
    const reveal = () => {
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight - 100) {
          el.classList.add('active')
        }
      })
    }

    window.addEventListener('scroll', reveal)
    reveal()
    
    return () => window.removeEventListener('scroll', reveal)
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-[#00ff41] overflow-x-hidden">
      <MatrixRain />
      <Navigation />

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative px-6 pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hacker-bg.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="mb-8 relative inline-block">
            <div className="w-40 h-40 mx-auto rounded-full border-4 border-[#00ff41] overflow-hidden neon-border">
              <img 
                src="/hacker-avatar.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <span className="bg-[#00ff41] text-black px-4 py-1 text-sm font-bold rounded-full">
                AVAILABLE FOR WORK
              </span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 glitch" data-text="MOHAMMED RAHIMAN BASHA">
            MOHAMMED RAHIMAN BASHA
          </h1>
          
          <div className="h-12 mb-6">
            <p className="text-2xl md:text-3xl text-[#00ffff] font-mono">
              <span className="text-[#00ff41]">&gt;</span> {typingText}
              <span className="typing-cursor text-[#00ff41]">|</span>
            </p>
          </div>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Software Engineer with strong full-stack development expertise, cloud computing skills, 
            and a passion for building scalable applications.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="btn-cyber"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Projects
            </Button>
            <a 
              href="/resume.pdf" 
              download="Mohammed_Rahiman_Resume.pdf"
              className="btn-cyber inline-block"
            >
              Download Resume
            </a>
          </div>
          
          <div className="mt-12 flex justify-center gap-6">
            <a href="mailto:rahmanmohd1108@gmail.com" className="text-gray-400 hover:text-[#00ff41] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </a>
            <a href="https://linkedin.com/in" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00ff41] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00ff41] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
            </a>
            <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00ff41] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.823-.662l-4.568-4.567c-.467-.467-.662-1.111-.662-1.823s.195-1.357.662-1.823l4.567-4.568c.467-.467 1.111-.662 1.823-.662s1.357.195 1.823.662l2.697 2.607c.553.553 1.451.553 2.004 0 .553-.553.553-1.451 0-2.004l-2.697-2.607c-1.211-1.211-2.866-1.846-4.547-1.846s-3.336.635-4.547 1.846l-4.568 4.568C3.635 11.594 3 13.249 3 14.93s.635 3.336 1.846 4.547l4.568 4.568c1.211 1.211 2.866 1.846 4.547 1.846s3.336-.635 4.547-1.846l2.697-2.607c.553-.553.553-1.451 0-2.004-.553-.553-1.451-.553-2.004 0zM22 14.5c0-.825-.675-1.5-1.5-1.5h-6c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5h6c.825 0 1.5-.675 1.5-1.5z"/></svg>
            </a>
          </div>
          
          <div className="mt-16 animate-bounce">
            <svg className="w-6 h-6 mx-auto text-[#00ff41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 reveal">
            <span className="text-[#00ffff]">&lt;</span>
            About Me
            <span className="text-[#00ffff]">/&gt;</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="reveal">
              <Terminal title="about.sh">
                <div className="terminal-line">whoami</div>
                <div className="ml-4 text-gray-400 mb-4">
                  Mohammed Rahiman Basha - Software Engineer
                </div>
                <div className="terminal-line">cat skills.txt</div>
                <div className="ml-4 text-gray-400 mb-4">
                  Full-Stack Development | Cloud Computing | DSA
                </div>
                <div className="terminal-line">echo $PASSION</div>
                <div className="ml-4 text-gray-400 mb-4">
                  Building scalable applications & solving complex problems
                </div>
                <div className="terminal-line">./current_status</div>
                <div className="ml-4 text-[#00ffff]">
                  Open to opportunities ✓
                </div>
              </Terminal>
            </div>
            
            <div className="reveal" style={{ animationDelay: '0.2s' }}>
              <TiltCard>
                <Card className="bg-[#0d0d0d] border-[#00ff4133] h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-[#00ff41] mb-4">Professional Summary</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Software Engineer with strong full-stack development expertise and a solid grounding 
                      in data structures & algorithms, cloud computing (AWS), RESTful API design, and 
                      software testing. Experienced in building scalable applications with Node.js and 
                      React.js, managing relational and NoSQL databases, and applying clean Git workflows 
                      in Agile environments.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
                        <div className="text-3xl font-bold text-[#00ff41]">8.7</div>
                        <div className="text-sm text-gray-400">CGPA</div>
                      </div>
                      <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
                        <div className="text-3xl font-bold text-[#00ffff]">92%</div>
                        <div className="text-sm text-gray-400">Intermediate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </div>
          </div>
          
          <div className="section-divider" />
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <TiltCard>
              <Card className="bg-[#0d0d0d] border-[#00ff4133] text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-[#00ff41] neon-text mb-2">3+</div>
                  <div className="text-gray-400">Major Projects</div>
                </CardContent>
              </Card>
            </TiltCard>
            <TiltCard>
              <Card className="bg-[#0d0d0d] border-[#00ff4133] text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-[#00ffff] neon-cyan mb-2">10+</div>
                  <div className="text-gray-400">Technologies</div>
                </CardContent>
              </Card>
            </TiltCard>
            <TiltCard>
              <Card className="bg-[#0d0d0d] border-[#00ff4133] text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-[#ff00ff] mb-2">4</div>
                  <div className="text-gray-400">Certifications</div>
                </CardContent>
              </Card>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 relative z-10 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 reveal">
            <span className="text-[#00ffff]">&lt;</span>
            Technical Skills
            <span className="text-[#00ffff]">/&gt;</span>
          </h2>
          
          <Tabs defaultValue="languages" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-[#0d0d0d] border border-[#00ff4133]">
              <TabsTrigger value="languages" className="data-[state=active]:bg-[#00ff41] data-[state=active]:text-black">Languages</TabsTrigger>
              <TabsTrigger value="frameworks" className="data-[state=active]:bg-[#00ff41] data-[state=active]:text-black">Frameworks</TabsTrigger>
              <TabsTrigger value="tools" className="data-[state=active]:bg-[#00ff41] data-[state=active]:text-black">Tools & Cloud</TabsTrigger>
            </TabsList>
            
            <TabsContent value="languages" className="reveal">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {skills.languages.map((skill, i) => (
                    <SkillBar key={skill.name} skill={skill.name} percentage={skill.level} delay={i * 100} />
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  <div className="code-block w-full">
                    <pre>
                      <span className="code-comment">{'// Core Programming Skills'}</span><br />
                      <span className="code-keyword">const</span> <span className="code-function">languages</span> = {'{'}
                      <br />
                      {'  '}<span className="code-string">"primary"</span>: [<span className="code-string">"Python"</span>, <span className="code-string">"JavaScript"</span>],
                      <br />
                      {'  '}<span className="code-string">"secondary"</span>: [<span className="code-string">"Java"</span>, <span className="code-string">"C++"</span>],
                      <br />
                      {'  '}<span className="code-string">"query"</span>: [<span className="code-string">"SQL"</span>, <span className="code-string">"MongoDB"</span>]
                      <br />
                      {'}'};
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="frameworks" className="reveal">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {skills.frameworks.map((skill, i) => (
                    <SkillBar key={skill.name} skill={skill.name} percentage={skill.level} delay={i * 100} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['React.js', 'Node.js', 'Express.js', 'REST APIs'].map((fw, i) => (
                    <TiltCard key={fw}>
                      <div className="bg-[#0d0d0d] border border-[#00ff4133] rounded-lg p-4 text-center hover:border-[#00ff41] transition-all">
                        <div className="text-[#00ff41] font-mono">{fw}</div>
                      </div>
                    </TiltCard>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tools" className="reveal">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {skills.tools.map((skill, i) => (
                    <SkillBar key={skill.name} skill={skill.name} percentage={skill.level} delay={i * 100} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 justify-center items-center">
                  {['AWS EC2', 'AWS S3', 'AWS Lambda', 'MongoDB', 'PostgreSQL', 'MySQL', 'Git', 'GitHub', 'Jest', 'PyTest'].map((tool) => (
                    <Badge key={tool} variant="outline" className="border-[#00ff41] text-[#00ff41] px-4 py-2 text-sm hover:bg-[#00ff41] hover:text-black transition-all cursor-pointer">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8 reveal">DSA Proficiency</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 reveal">
              {[
                { label: 'Arrays', percent: 90 },
                { label: 'Trees', percent: 80 },
                { label: 'Graphs', percent: 75 },
                { label: 'DP', percent: 70 },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center relative">
                  <CircularProgress percentage={item.percent} label={item.label} size={120} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 reveal">
            <span className="text-[#00ffff]">&lt;</span>
            Experience
            <span className="text-[#00ffff]">/&gt;</span>
          </h2>
          
          <div className="max-w-3xl mx-auto reveal">
            {experiences.map((exp, i) => (
              <ExperienceCard key={i} {...exp} />
            ))}
          </div>
          
          <div className="section-divider" />
          
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-8 reveal">Education</h3>
            <div className="grid md:grid-cols-2 gap-6 reveal">
              <TiltCard>
                <Card className="bg-[#0d0d0d] border-[#00ff4133]">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#00ff4133] flex items-center justify-center text-[#00ff41] text-xl">
                        🎓
                      </div>
                      <div>
                        <h4 className="font-bold text-[#00ff41]">B.Tech in Computer Science & Engineering</h4>
                        <p className="text-[#00ffff]">Vaagdevi College of Engineering</p>
                        <p className="text-sm text-gray-400">Warangal, Telangana | Aug 2021 – May 2025</p>
                        <p className="text-sm mt-2">CGPA: <span className="text-[#00ff41] font-bold">8.7/10.0</span></p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
              
              <TiltCard>
                <Card className="bg-[#0d0d0d] border-[#00ff4133]">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#00ff4133] flex items-center justify-center text-[#00ff41] text-xl">
                        📚
                      </div>
                      <div>
                        <h4 className="font-bold text-[#00ff41]">Intermediate (MPC)</h4>
                        <p className="text-[#00ffff]">TM Residential College</p>
                        <p className="text-sm text-gray-400">Warangal, Telangana | July 2019 – April 2021</p>
                        <p className="text-sm mt-2">Score: <span className="text-[#00ff41] font-bold">92%</span></p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 relative z-10 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 reveal">
            <span className="text-[#00ffff]">&lt;</span>
            Key Projects
            <span className="text-[#00ffff]">/&gt;</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <div key={i} className="reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section id="resume" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 reveal">
            <span className="text-[#00ffff]">&lt;</span>
            Resume
            <span className="text-[#00ffff]">/&gt;</span>
          </h2>
          
          <div className="reveal">
            <TiltCard>
              <Card className="bg-[#0d0d0d] border-[#00ff4133] cyber-border">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-full border-4 border-[#00ff41] overflow-hidden flex-shrink-0 neon-border">
                      <img 
                        src="/hacker-avatar.png" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-bold text-[#00ff41]">Mohammed Rahiman Basha</h3>
                      <p className="text-[#00ffff] mb-2">Software Engineer | Full-Stack Developer</p>
                      <p className="text-gray-400 text-sm mb-4">
                        📧 rahmanmohd1108@gmail.com | 📱 +91 9640361108
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                        <Badge variant="outline" className="border-[#00ff41] text-[#00ff41]">AWS</Badge>
                        <Badge variant="outline" className="border-[#00ffff] text-[#00ffff]">React.js</Badge>
                        <Badge variant="outline" className="border-[#ff00ff] text-[#ff00ff]">Node.js</Badge>
                        <Badge variant="outline" className="border-[#ffff00] text-[#ffff00]">Python</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-lg font-bold text-[#00ff41] mb-4">Certifications</h4>
                    <ul className="space-y-2">
                      {certifications.map((cert, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                          <span className="text-[#00ff41]">✓</span>
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                    <a 
                      href="/resume.pdf" 
                      download="Mohammed_Rahiman_Resume.pdf"
                      className="btn-cyber inline-flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Full Resume
                    </a>
                  </div>
                </CardContent>
              </Card>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 relative z-10 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 reveal">
            <span className="text-[#00ffff]">&lt;</span>
            Contact Me
            <span className="text-[#00ffff]">/&gt;</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="reveal">
              <Terminal title="contact.sh">
                <div className="terminal-line">echo "Let's connect!"</div>
                <div className="ml-4 text-gray-400 mb-2">
                  I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </div>
                <div className="terminal-line mt-4">cat contact.json</div>
                <div className="ml-4 text-gray-400">
                  <div className="mt-2">{'{'}</div>
                  <div className="ml-4">
                    <span className="text-[#00ffff]">"email"</span>: <span className="text-[#00ff41]">"rahmanmohd1108@gmail.com"</span>,
                  </div>
                  <div className="ml-4">
                    <span className="text-[#00ffff]">"phone"</span>: <span className="text-[#00ff41]">"+91 9640361108"</span>,
                  </div>
                  <div className="ml-4">
                    <span className="text-[#00ffff]">"location"</span>: <span className="text-[#00ff41]">"Warangal, Telangana"</span>
                  </div>
                  <div>{'}'}</div>
                </div>
              </Terminal>
            </div>
            
            <div className="reveal space-y-4">
              <TiltCard>
                <a 
                  href="mailto:rahmanmohd1108@gmail.com"
                  className="block p-4 bg-[#0d0d0d] border border-[#00ff4133] rounded-lg hover:border-[#00ff41] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#00ff4133] flex items-center justify-center text-[#00ff41] group-hover:bg-[#00ff41] group-hover:text-black transition-all">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    </div>
                    <div>
                      <div className="font-bold text-[#00ff41]">Email</div>
                      <div className="text-gray-400 text-sm">rahmanmohd1108@gmail.com</div>
                    </div>
                  </div>
                </a>
              </TiltCard>
              
              <TiltCard>
                <a 
                  href="https://linkedin.com/in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-[#0d0d0d] border border-[#00ff4133] rounded-lg hover:border-[#00ffff] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#00ffff33] flex items-center justify-center text-[#00ffff] group-hover:bg-[#00ffff] group-hover:text-black transition-all">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                    </div>
                    <div>
                      <div className="font-bold text-[#00ffff]">LinkedIn</div>
                      <div className="text-gray-400 text-sm">Connect professionally</div>
                    </div>
                  </div>
                </a>
              </TiltCard>
              
              <TiltCard>
                <a 
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-[#0d0d0d] border border-[#00ff4133] rounded-lg hover:border-[#ff00ff] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#ff00ff33] flex items-center justify-center text-[#ff00ff] group-hover:bg-[#ff00ff] group-hover:text-black transition-all">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                    </div>
                    <div>
                      <div className="font-bold text-[#ff00ff]">GitHub</div>
                      <div className="text-gray-400 text-sm">View my repositories</div>
                    </div>
                  </div>
                </a>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#00ff4133] relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-[#00ff41] font-mono mb-4">
            <span className="text-[#00ffff]">&lt;</span>
            /RAHMAN
            <span className="text-[#00ffff]">&gt;</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 Mohammed Rahiman Basha. Built with Next.js & ❤️
          </p>
          <p className="text-gray-600 text-xs mt-2 font-mono">
            {/* Simple terminal style footer */}
            <span className="text-[#00ff41]">$</span> echo &quot;Thanks for visiting!&quot; 🚀
          </p>
        </div>
      </footer>
    </div>
  )
}
