/* ========================================
   AFRITUTOR AI - MAIN JAVASCRIPT
   Chat, Quiz, Settings, Navigation, 3D Background
   ======================================== */

// ========================================
// THREE.JS 3D BACKGROUND
// ========================================

import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

function init3DBackground() {
    const container = document.getElementById('canvas-container');
    if (!container) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1a);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 18;
    camera.position.y = 2;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // African flag colors: Green, Gold, Red, Blue
    const colors = [0x4CAF50, 0xFFC107, 0xE53935, 0x2196F3];
    
    // Floating Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
        posArray[i * 3] = (Math.random() - 0.5) * 50;
        posArray[i * 3 + 1] = (Math.random() - 0.5) * 30;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 40 - 15;
        
        const col = colors[Math.floor(Math.random() * colors.length)];
        const colorObj = new THREE.Color(col);
        colorArray[i * 3] = colorObj.r;
        colorArray[i * 3 + 1] = colorObj.g;
        colorArray[i * 3 + 2] = colorObj.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Floating Rings
    const ringGeo = new THREE.TorusGeometry(4, 0.06, 64, 300);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x4CAF50, emissive: 0x1a4a1a });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1;
    scene.add(ring);
    
    const ring2Geo = new THREE.TorusGeometry(5.5, 0.04, 64, 300);
    const ring2Mat = new THREE.MeshStandardMaterial({ color: 0x2196F3, emissive: 0x0a2a4a });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.z = Math.PI / 3;
    ring2.rotation.x = Math.PI / 3;
    ring2.position.y = 1;
    scene.add(ring2);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x4CAF50, 0.8);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x2196F3, 0.6);
    pointLight2.position.set(-5, 3, 6);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0xFFC107, 0.4);
    pointLight3.position.set(3, -2, 8);
    scene.add(pointLight3);
    
    // Animation
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.008;
        
        particlesMesh.rotation.y += 0.0003;
        particlesMesh.rotation.x = Math.sin(time * 0.2) * 0.1;
        
        ring.rotation.z += 0.003;
        ring.rotation.x = Math.PI / 2 + Math.sin(time * 0.5) * 0.1;
        ring2.rotation.x += 0.002;
        ring2.rotation.y += 0.003;
        
        pointLight1.intensity = 0.7 + Math.sin(time) * 0.2;
        pointLight2.intensity = 0.5 + Math.cos(time * 0.8) * 0.2;
        
        renderer.render(scene, camera);
    }
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ========================================
// KNOWLEDGE BASE (Curriculum-Aligned)
// ========================================

const knowledgeBase = {
    // Biology Topics
    "photosynthesis": "🌿 Photosynthesis is how plants make their own food using sunlight, water, and carbon dioxide.\n\nበቀላል አነጋገር (In simple Amharic): ተክሎች ፀሐይን፣ ውሃን እና አየርን ተጠቅመው ምግባቸውን ያመርታሉ።\n\nKwa Kiswahili: Mimea hutumia mwanga wa jua, maji, na hewa kutengeneza chakula chao. Example: Maize 🌽 and Teff ቴፍ use this process to grow.",
    
    "cell": "🔬 A cell is the smallest unit of life. All living things are made of cells.\n\nበአማርኛ: ሴል የሕይወት መሠረታዊ ክፍል ነው። ሁሉም ሕይወት ያላቸው ነገሮች በሴሎች የተሠሩ ናቸው።\n\nKiswahili: Seli ni kitu kidogo zaidi chenye uhai. Vitu vyote vilivyo hai vinaundwa na seli.",
    
    "mitosis": "🧬 Mitosis is cell division that creates two identical daughter cells. It's how your body grows and repairs itself.\n\nበአማርኛ: ሚቶሲስ ሁለት ተመሳሳይ ሴሎችን የሚፈጥር የሴል ክፍፍል ነው።",
    
    "chlorophyll": "🍃 Chlorophyll is the green pigment in plants that captures sunlight for photosynthesis.\n\nKiswahili: Klorofili ni rangi ya kijani katika mimea inayonasa mwanga wa jua kwa usanisinuru.",
    
    "ecosystem": "🌍 An ecosystem is a community of living organisms interacting with their environment.\n\nExample: The Maasai Mara ecosystem includes lions, zebras, grass, soil, and water.",
    
    // Agriculture Topics
    "soil": "🌱 Soil is the upper layer of earth where plants grow. It contains minerals, water, air, and organic matter.\n\nKenyan example: Volcanic soils around Mount Kenya are very fertile for coffee and tea farming.",
    
    "crop rotation": "🌾 Crop rotation means planting different crops in the same field each season. This prevents soil exhaustion and reduces pests.\n\nEthiopian example: Farmers rotate teff with legumes to maintain soil fertility.",
    
    "maize": "🌽 Maize (corn) is a major food crop in Kenya and across Africa. It requires well-drained soil and moderate rainfall.\n\nSwahili: Mahindi ni chakula kikuu nchini Kenya na Afrika nzima.",
    
    "teff": "🌾 Teff (ቴፍ) is Ethiopia's most important grain. It's used to make injera and grows well in Ethiopia's highlands.",
    
    "irrigation": "💧 Irrigation is the artificial application of water to soil. It helps farmers grow crops during dry seasons.\n\nExample: The Gezira Scheme in Sudan uses irrigation from the Nile River."
};

// Expanded responses for common questions
function getBotResponse(question) {
    const lowerQ = question.toLowerCase();
    
    // Check for greetings
    if (lowerQ.match(/hello|hi|hey|selam|jambo|ሰላም/)) {
        return "Hello! 👋 Welcome to AfriTutor AI. I'm here to help you learn Biology and Agriculture. What would you like to learn about today?";
    }
    
    // Check for thanks
    if (lowerQ.match(/thank|thanks|አመሰግናለሁ|asante/)) {
        return "You're welcome! 😊 Keep learning. Any other questions?";
    }
    
    // Check knowledge base
    for (let [key, value] of Object.entries(knowledgeBase)) {
        if (lowerQ.includes(key)) {
            return value;
        }
    }
    
    // Default response with suggestions
    return "📚 Great question! I'm here to help with Grade 10 Biology and Agriculture.\n\nTry asking about:\n• Photosynthesis 🌿\n• Cells 🔬\n• Soil science 🌱\n• Crop rotation 🌾\n• Irrigation 💧\n\nማንኛውም ጥያቄ አለህ? (Any question?) Una swali lolote?";
}

// ========================================
// CHAT FUNCTIONALITY
// ========================================

function initChat() {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    
    if (!chatMessages || !chatInput || !sendBtn) return;
    
    function addMessage(role, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        const avatarIcon = role === 'user' ? '👤' : '🤖';
        const avatarClass = role === 'user' ? 'fas fa-user' : 'fas fa-robot';
        
        messageDiv.innerHTML = `
            <div class="message-avatar"><i class="${avatarClass}"></i></div>
            <div class="message-bubble">${text.replace(/\n/g, '<br>')}</div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-bubble"><div class="loading-dots"><span></span><span></span><span></span></div></div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function hideTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }
    
    async function sendMessage() {
        const question = chatInput.value.trim();
        if (!question) return;
        
        addMessage('user', question);
        chatInput.value = '';
        showTyping();
        
        // Simulate AI thinking (real app would call API)
        setTimeout(() => {
            hideTyping();
            const response = getBotResponse(question);
            addMessage('assistant', response);
            
            // Auto-suggest quiz after learning topic
            if (question.toLowerCase().includes('photosynthesis') || 
                question.toLowerCase().includes('cell')) {
                setTimeout(() => {
                    addMessage('assistant', "📝 Want to test your understanding? Click the Quiz tab above for a quick quiz!");
                }, 1500);
            }
        }, 800);
    }
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// ========================================
// QUIZ FUNCTIONALITY
// ========================================

function initQuiz() {
    const submitBtn = document.getElementById('submitQuizBtn');
    const quizResult = document.getElementById('quizResult');
    
    if (!submitBtn || !quizResult) return;
    
    // Track selected answers
    const selectedAnswers = {};
    const correctAnswers = {
        q1: 'B',
        q2: 'C',
        q3: 'B'
    };
    
    // Add click handlers to quiz options
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            const qId = this.dataset.q;
            const answer = this.dataset.ans;
            
            // Remove selected class from siblings
            const parent = this.parentElement;
            parent.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            selectedAnswers[`q${qId}`] = answer;
        });
    });
    
    submitBtn.addEventListener('click', () => {
        let score = 0;
        const results = [];
        
        for (let i = 1; i <= 3; i++) {
            const userAnswer = selectedAnswers[`q${i}`];
            const correct = correctAnswers[`q${i}`];
            const isCorrect = userAnswer === correct;
            if (isCorrect) score++;
            results.push({
                question: i,
                correct: isCorrect,
                userAnswer: userAnswer || 'Not answered',
                correctAnswer: correct
            });
        }
        
        const percentage = (score / 3) * 100;
        let feedback = '';
        if (percentage === 100) {
            feedback = '🎉 Perfect! Excellent work! You really understand the material.';
        } else if (percentage >= 66) {
            feedback = '👍 Good job! You got ' + score + '/3 correct. Review the ones you missed.';
        } else {
            feedback = '📚 Keep studying! You got ' + score + '/3 correct. Let me explain the answers:';
        }
        
        let details = '';
        results.forEach(r => {
            if (!r.correct) {
                details += `<p><strong>Question ${r.question}:</strong> Correct answer is ${r.correctAnswer}. ${r.question === 1 ? 'Photosynthesis is plants making food from sunlight.' : r.question === 2 ? 'Leaves capture sunlight for photosynthesis.' : 'Photosynthesis (ፎቶሲንተሲስ) is the correct answer.'}</p>`;
            }
        });
        
        quizResult.style.display = 'block';
        quizResult.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${percentage >= 70 ? '🎓' : '📖'}</div>
                <div style="font-weight: 600; margin-bottom: 0.5rem;">Score: ${score}/3 (${percentage}%)</div>
                <div style="margin-bottom: 1rem;">${feedback}</div>
                ${details}
                <button id="retryQuizBtn" style="margin-top: 1rem; background: #4CAF50; border: none; padding: 0.5rem 1.5rem; border-radius: 20px; color: white; cursor: pointer;">Try Again</button>
            </div>
        `;
        
        document.getElementById('retryQuizBtn')?.addEventListener('click', () => {
            quizResult.style.display = 'none';
            document.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            Object.keys(selectedAnswers).forEach(key => delete selectedAnswers[key]);
        });
        
        quizResult.scrollIntoView({ behavior: 'smooth' });
    });
}

// ========================================
// SETTINGS FUNCTIONALITY
// ========================================

function initSettings() {
    // Language Select
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            let message = '';
            switch(lang) {
                case 'english': message = "Language set to English. I'll respond in English."; break;
                case 'amharic': message = "ቋንቋ ወደ አማርኛ ተቀይሯል። በአማርኛ እመልሳለሁ።"; break;
                case 'swahili': message = "Lugha imebadilishwa hadi Kiswahili. Nitajibu kwa Kiswahili."; break;
                default: message = "Language set to Mixed mode. I'll use code-switching!";
            }
            addSystemMessage(message);
        });
    }
    
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.remove('light-mode');
                addSystemMessage("Dark mode enabled. 🌙");
            } else {
                document.body.classList.add('light-mode');
                addSystemMessage("Light mode enabled. ☀️");
            }
        });
    }
    
    // Data Saver Mode
    const dataSaverToggle = document.getElementById('dataSaverToggle');
    if (dataSaverToggle) {
        dataSaverToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                addSystemMessage("Low data mode ON. I'll use minimal bandwidth and shorter responses.");
            } else {
                addSystemMessage("Low data mode OFF. Enjoy detailed explanations!");
            }
        });
    }
    
    // Notifications
    const notifToggle = document.getElementById('notifToggle');
    if (notifToggle) {
        notifToggle.addEventListener('change', (e) => {
            if (e.target.checked && Notification.permission === 'default') {
                Notification.requestPermission();
            }
            addSystemMessage(e.target.checked ? "Notifications enabled." : "Notifications disabled.");
        });
    }
}

function addSystemMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant';
        messageDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-cog"></i></div>
            <div class="message-bubble" style="background: rgba(76, 175, 80, 0.2);">⚙️ ${message}</div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// ========================================
// PAGE NAVIGATION
// ========================================

function initNavigation() {
    const pages = document.querySelectorAll('.page');
    const navBtns = document.querySelectorAll('.nav-btn');
    
    if (!pages.length || !navBtns.length) return;
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const pageId = btn.dataset.page;
            pages.forEach(page => page.classList.remove('active-page'));
            const targetPage = document.getElementById(pageId);
            if (targetPage) targetPage.classList.add('active-page');
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// ========================================
// SAVE USER PREFERENCES (Local Storage)
// ========================================

function savePreferences() {
    const darkMode = document.getElementById('darkModeToggle')?.checked || true;
    const dataSaver = document.getElementById('dataSaverToggle')?.checked || true;
    const language = document.getElementById('languageSelect')?.value || 'mixed';
    
    localStorage.setItem('afritutor_darkmode', darkMode);
    localStorage.setItem('afritutor_datasaver', dataSaver);
    localStorage.setItem('afritutor_language', language);
}

function loadPreferences() {
    const darkMode = localStorage.getItem('afritutor_darkmode') === 'true';
    const dataSaver = localStorage.getItem('afritutor_datasaver') === 'true';
    const language = localStorage.getItem('afritutor_language') || 'mixed';
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    const dataSaverToggle = document.getElementById('dataSaverToggle');
    const languageSelect = document.getElementById('languageSelect');
    
    if (darkModeToggle && !darkMode) {
        darkModeToggle.checked = false;
        document.body.classList.add('light-mode');
    }
    if (dataSaverToggle) dataSaverToggle.checked = dataSaver;
    if (languageSelect) languageSelect.value = language;
}

// ========================================
// VOICE INPUT (Beta)
// ========================================

function initVoiceInput() {
    const voiceToggle = document.getElementById('voiceToggle');
    const chatInput = document.getElementById('chatInput');
    
    if (!voiceToggle || !chatInput) return;
    
    let recognition = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            addSystemMessage(`🎤 Voice input: "${transcript}"`);
        };
        
        recognition.onerror = () => {
            addSystemMessage("🎤 Voice recognition error. Please try again.");
        };
    }
    
    voiceToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            if (recognition) {
                addSystemMessage("🎤 Voice input enabled. Click the mic button to speak.");
            } else {
                addSystemMessage("🎤 Voice input not supported in your browser. Try Chrome or Edge.");
                voiceToggle.checked = false;
            }
        } else {
            addSystemMessage("🎤 Voice input disabled.");
        }
    });
}

// ========================================
// INITIALIZE ALL MODULES
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Load saved preferences
    loadPreferences();
    
    // Initialize all components
    init3DBackground();
    initNavigation();
    initChat();
    initQuiz();
    initSettings();
    initVoiceInput();
    
    // Save preferences on change
    const settingsElements = ['darkModeToggle', 'dataSaverToggle', 'languageSelect'];
    settingsElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', savePreferences);
        }
    });
    
    console.log('AfriTutor AI - Ready to help you learn! 🚀');
});