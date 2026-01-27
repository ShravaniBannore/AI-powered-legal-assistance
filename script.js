
    // Default configuration
    const defaultConfig = {
      hero_title: 'AI-Powered Personalized Legal Assistant',
      hero_subtitle: 'Understand laws and legal rights in simple, human language. Get instant, personalized legal guidance powered by advanced AI.'
    };

    let config = { ...defaultConfig };
    let explanationLevel = 'basic';

    // Element SDK initialization
    if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig,
        onConfigChange: async (newConfig) => {
          config = { ...defaultConfig, ...newConfig };
          updateUI();
        },
        mapToCapabilities: (cfg) => ({
          recolorables: [],
          borderables: [],
          fontEditable: undefined,
          fontSizeable: undefined
        }),
        mapToEditPanelValues: (cfg) => new Map([
          ['hero_title', cfg.hero_title || defaultConfig.hero_title],
          ['hero_subtitle', cfg.hero_subtitle || defaultConfig.hero_subtitle]
        ])
      });
    }

    function updateUI() {
      const titleEl = document.getElementById('heroTitle');
      const subtitleEl = document.getElementById('heroSubtitle');
      
      if (titleEl) {
        const title = config.hero_title || defaultConfig.hero_title;
        const words = title.split(' ');
        const midPoint = Math.ceil(words.length / 2);
        const firstHalf = words.slice(0, midPoint).join(' ');
        const secondHalf = words.slice(midPoint).join(' ');
        titleEl.innerHTML = `
          <span class="bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent">${firstHalf}</span>
          <br>
          <span class="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">${secondHalf}</span>
        `;
      }
      
      if (subtitleEl) {
        subtitleEl.textContent = config.hero_subtitle || defaultConfig.hero_subtitle;
      }
    }

    // Initialize particles
    function createParticles() {
      const network = document.getElementById('neuralNetwork');
      
      // Create particles
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        network.appendChild(particle);
      }
      
      // Create floating 3D shapes
      create3DShapes();
    }
    
    function create3DShapes() {
      const container = document.getElementById('floating3DShapes');
      
      // Create multiple 3D geometric shapes at different positions
      const shapes = [
        { type: 'cube', top: '15%', left: '20%', delay: '0s' },
        { type: 'sphere', top: '45%', left: '75%', delay: '2s' },
        { type: 'pyramid', top: '70%', left: '15%', delay: '4s' },
        { type: 'cube', top: '25%', right: '10%', delay: '1s' },
        { type: 'sphere', top: '60%', left: '50%', delay: '3s' },
        { type: 'pyramid', top: '85%', right: '30%', delay: '5s' }
      ];
      
      shapes.forEach(shape => {
        const shapeDiv = document.createElement('div');
        shapeDiv.className = 'floating-3d-shape';
        shapeDiv.style.top = shape.top;
        if (shape.left) shapeDiv.style.left = shape.left;
        if (shape.right) shapeDiv.style.right = shape.right;
        shapeDiv.style.animationDelay = shape.delay;
        
        if (shape.type === 'cube') {
          shapeDiv.innerHTML = `
            <div class="cube-3d">
              <div class="cube-face" style="transform: rotateY(0deg) translateZ(40px);"></div>
              <div class="cube-face" style="transform: rotateY(90deg) translateZ(40px);"></div>
              <div class="cube-face" style="transform: rotateY(180deg) translateZ(40px);"></div>
              <div class="cube-face" style="transform: rotateY(-90deg) translateZ(40px);"></div>
              <div class="cube-face" style="transform: rotateX(90deg) translateZ(40px);"></div>
              <div class="cube-face" style="transform: rotateX(-90deg) translateZ(40px);"></div>
            </div>
          `;
        } else if (shape.type === 'sphere') {
          shapeDiv.innerHTML = '<div class="sphere-3d"></div>';
        } else if (shape.type === 'pyramid') {
          shapeDiv.innerHTML = '<div class="pyramid-3d"></div>';
        }
        
        container.appendChild(shapeDiv);
      });
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      menu.classList.toggle('hidden');
    }

    // Set explanation level
    function setLevel(level) {
      explanationLevel = level;
      const basicBtn = document.getElementById('levelBasic');
      const detailedBtn = document.getElementById('levelDetailed');
      
      if (level === 'basic') {
        basicBtn.classList.add('bg-indigo-600', 'text-white');
        basicBtn.classList.remove('text-gray-400');
        detailedBtn.classList.remove('bg-indigo-600', 'text-white');
        detailedBtn.classList.add('text-gray-400');
      } else {
        detailedBtn.classList.add('bg-indigo-600', 'text-white');
        detailedBtn.classList.remove('text-gray-400');
        basicBtn.classList.remove('bg-indigo-600', 'text-white');
        basicBtn.classList.add('text-gray-400');
      }
    }

    // Chat functionality
    const chatForm = document.getElementById('chatForm');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');

    const legalResponses = {
      'contract': {
        basic: 'A contract is a legally binding agreement between parties. Key elements include offer, acceptance, and consideration (something of value exchanged).',
        detailed: 'A contract is a legally enforceable agreement requiring: 1) Offer - a clear proposal, 2) Acceptance - unqualified agreement, 3) Consideration - exchange of value, 4) Capacity - legal ability to contract, 5) Legality - lawful purpose. Contracts can be written or oral, though some require writing under the Statute of Frauds.'
      },
      'employment': {
        basic: 'Employment law covers worker rights including fair wages, safe conditions, and protection from discrimination. Employers must follow labor laws.',
        detailed: 'Employment law encompasses: Fair Labor Standards Act (minimum wage, overtime), Title VII (anti-discrimination), OSHA (workplace safety), FMLA (family leave), ADA (disability accommodations), and at-will employment doctrine. Workers have rights to organize, file complaints, and seek remedies for violations.'
      },
      'tenant': {
        basic: 'Tenants have rights to habitable housing, privacy, and proper eviction procedures. Landlords must maintain the property and respect lease terms.',
        detailed: 'Tenant rights include: Implied warranty of habitability (functional utilities, structural safety), right to privacy (advance notice for entry), security deposit protections, anti-retaliation provisions, and due process for evictions. Remedies include rent withholding, repair-and-deduct, and lease termination for violations.'
      },
      'default': {
        basic: 'Based on your question, I recommend consulting specific legal resources or a qualified attorney for personalized guidance. Would you like me to explain any general legal concepts?',
        detailed: 'Your query touches on specialized legal matters. For accurate guidance, I recommend: 1) Reviewing relevant statutes and regulations, 2) Consulting case law precedents, 3) Seeking advice from a licensed attorney in your jurisdiction. Please provide more details for a more specific response.'
      }
    };

    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const question = chatInput.value.trim();
      if (!question) return;

      // Add user message
      addMessage(question, 'user');
      chatInput.value = '';

      // Show typing indicator
      showTyping();

      // Simulate AI response
      setTimeout(() => {
        hideTyping();
        const response = getAIResponse(question);
        addMessage(response, 'ai');
      }, 1500);
    });

    function addMessage(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'chat-bubble flex gap-3' + (sender === 'user' ? ' flex-row-reverse' : '');
      
      const avatar = sender === 'user' 
        ? '<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center flex-shrink-0"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div>'
        : '<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div>';
      
      const bubbleClass = sender === 'user' 
        ? 'bg-indigo-600 rounded-2xl rounded-tr-none'
        : 'glass-card rounded-2xl rounded-tl-none';
      
      messageDiv.innerHTML = `
        ${avatar}
        <div class="${bubbleClass} p-4 max-w-md">
          <p class="text-sm inter">${text}</p>
        </div>
      `;
      
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping() {
      const typingDiv = document.createElement('div');
      typingDiv.id = 'typingIndicator';
      typingDiv.className = 'chat-bubble flex gap-3';
      typingDiv.innerHTML = `
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <div class="glass-card rounded-2xl rounded-tl-none p-4">
          <div class="typing-indicator flex gap-1">
            <span class="w-2 h-2 bg-indigo-400 rounded-full"></span>
            <span class="w-2 h-2 bg-indigo-400 rounded-full"></span>
            <span class="w-2 h-2 bg-indigo-400 rounded-full"></span>
          </div>
        </div>
      `;
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTyping() {
      const typing = document.getElementById('typingIndicator');
      if (typing) typing.remove();
    }

    function getAIResponse(question) {
      const q = question.toLowerCase();
      let category = 'default';
      
      if (q.includes('contract') || q.includes('agreement') || q.includes('sign')) {
        category = 'contract';
      } else if (q.includes('employ') || q.includes('work') || q.includes('job') || q.includes('fired') || q.includes('wage')) {
        category = 'employment';
      } else if (q.includes('tenant') || q.includes('rent') || q.includes('landlord') || q.includes('lease') || q.includes('evict')) {
        category = 'tenant';
      }
      
      const role = document.getElementById('userRole').value;
      let rolePrefix = '';
      
      if (role === 'student') rolePrefix = 'As a student, ';
      else if (role === 'employee') rolePrefix = 'As an employee, ';
      else if (role === 'business') rolePrefix = 'As a business owner, ';
      
      return rolePrefix + legalResponses[category][explanationLevel];
    }

    // File upload functionality
    const uploadZone = document.getElementById('uploadZone');

    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      if (files.length) processFile(files[0]);
    });

    function handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) processFile(file);
    }

    function processFile(file) {
      const uploadedFiles = document.getElementById('uploadedFiles');
      const analysisResult = document.getElementById('analysisResult');
      
      uploadedFiles.innerHTML = `
        <div class="glass-card rounded-2xl p-4 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/30 to-indigo-400/30 flex items-center justify-center">
            <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-medium">${file.name}</p>
            <p class="text-sm text-gray-400">${(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <div class="relative w-10 h-10">
            <svg class="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(99, 102, 241, 0.2)" stroke-width="3"/>
              <circle id="progressCircle" cx="18" cy="18" r="16" fill="none" stroke="#6366f1" stroke-width="3" stroke-dasharray="100" stroke-dashoffset="100" class="progress-ring"/>
            </svg>
          </div>
        </div>
      `;
      
      uploadedFiles.classList.remove('hidden');
      
      // Animate progress
      let progress = 0;
      const progressCircle = document.getElementById('progressCircle');
      const interval = setInterval(() => {
        progress += 2;
        progressCircle.style.strokeDashoffset = 100 - progress;
        if (progress >= 100) {
          clearInterval(interval);
          showAnalysis();
        }
      }, 50);
    }

    function showAnalysis() {
      const analysisResult = document.getElementById('analysisResult');
      analysisResult.classList.remove('hidden');
      
      document.getElementById('docSummary').textContent = 'This document appears to be a standard service agreement containing terms of service, liability clauses, and user obligations. The agreement establishes the relationship between the service provider and the end user.';
      
      document.getElementById('keyPoints').innerHTML = `
        <li class="flex items-start gap-2 text-sm text-gray-300">
          <span class="text-green-400 mt-1">✓</span>
          <span>Service provider limits liability to subscription fees paid</span>
        </li>
        <li class="flex items-start gap-2 text-sm text-gray-300">
          <span class="text-green-400 mt-1">✓</span>
          <span>30-day notice required for termination</span>
        </li>
        <li class="flex items-start gap-2 text-sm text-gray-300">
          <span class="text-green-400 mt-1">✓</span>
          <span>Automatic renewal clause present</span>
        </li>
      `;
      
      document.getElementById('concerns').innerHTML = `
        <li class="flex items-start gap-2 text-sm text-gray-300">
          <span class="text-amber-400 mt-1">⚠</span>
          <span>Broad indemnification clause may expose user to significant liability</span>
        </li>
        <li class="flex items-start gap-2 text-sm text-gray-300">
          <span class="text-amber-400 mt-1">⚠</span>
          <span>Arbitration clause limits legal recourse options</span>
        </li>
      `;
      
      analysisResult.scrollIntoView({ behavior: 'smooth' });
    }

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.page-section').forEach(section => {
      observer.observe(section);
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          
          // Update active nav link
          document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
          this.classList.add('active');
          
          // Close mobile menu
          document.getElementById('mobileMenu').classList.add('hidden');
        }
      });
    });

    // Update nav on scroll
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
      
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });

    // Tilt effect for cards
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });

    // Initialize
    createParticles();
    updateUI();

  const cameraBtn = document.getElementById('cameraBtn');
  const cameraModal = document.getElementById('cameraModal');
  const closeCamera = document.getElementById('closeCamera');
  const captureBtn = document.getElementById('captureBtn');
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');

  let stream;

  cameraBtn.onclick = async () => {
    cameraModal.classList.remove('hidden');
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  };

  closeCamera.onclick = () => {
    cameraModal.classList.add('hidden');
    stream.getTracks().forEach(track => track.stop());
  };

  captureBtn.onclick = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    console.log("Captured Image:", imageData);
    cameraModal.classList.add('hidden');
    stream.getTracks().forEach(track => track.stop());
  };

  document.getElementById('fileUpload').onchange = (e) => {
    const file = e.target.files[0];
    console.log("Uploaded File:", file);
  };

  const cameraBtn = document.getElementById("cameraBtn");

  cameraBtn.addEventListener("click", () => {
    alert("Camera feature can be connected here (WebRTC)");
  });




  

