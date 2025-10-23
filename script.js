// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 60;
        this.mouse = { x: 0, y: 0 };
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 2,
                opacity: Math.random() * 0.7 + 0.3,
                attached: false
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const isLight = document.body.classList.contains('light');
        const particleColor = isLight ? '0, 0, 0' : '255, 255, 255';
        
        this.particles.forEach(particle => {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Attach to mouse if close enough
            if (distance < 80) {
                particle.attached = true;
            }
            
            // Detach if mouse moves far away
            if (distance > 200) {
                particle.attached = false;
            }
            
            if (particle.attached) {
                // Move slowly toward mouse
                particle.vx += dx * 0.02;
                particle.vy += dy * 0.02;
                particle.vx *= 0.9;
                particle.vy *= 0.9;
            } else {
                // Normal floating movement
                particle.vx *= 0.99;
                particle.vy *= 0.99;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            }
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${particleColor}, ${particle.attached ? particle.opacity * 1.5 : particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Auto-sync theme with parent window
function syncTheme() {
    const savedTheme = localStorage.getItem('mainTheme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        document.getElementById('theme-toggle').textContent = '☀️';
    } else {
        document.body.classList.remove('light');
        document.getElementById('theme-toggle').textContent = '🌙';
    }
}

// Load theme on page load
window.addEventListener('load', () => {
    syncTheme();
    // Initialize particle system
    new ParticleSystem();
    // Ensure theme toggle button exists and is working
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        console.log('Theme toggle button found and initialized');
    }
});

// Listen for theme changes from parent
window.addEventListener('storage', (e) => {
    if (e.key === 'mainTheme') {
        syncTheme();
    }
});

// Also listen for messages from parent window
window.addEventListener('message', (e) => {
    if (e.data.type === 'themeChange') {
        syncTheme();
    }
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
    }) + ' ' + now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    document.getElementById('date-time').textContent = dateTimeString;
}

updateDateTime();
setInterval(updateDateTime, 1000);

// Theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    document.getElementById('theme-toggle').textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('mainTheme', isLight ? 'light' : 'dark');
    
    // Notify iframe about theme change
    const gamesFrame = document.querySelector('#games-window iframe');
    if (gamesFrame) {
        gamesFrame.contentWindow.postMessage({type: 'themeChange'}, '*');
    }
}

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Window management
let activeWindow = null;
let minimizedWindows = new Set();
let openWindows = new Set();

function updateDockIndicators() {
    document.querySelectorAll('.dock-item').forEach(item => {
        const app = item.dataset.app;
        const windowId = getWindowId(app);
        
        if (openWindows.has(windowId) || minimizedWindows.has(windowId)) {
            item.classList.add('open');
        } else {
            item.classList.remove('open');
        }
    });
}

function getWindowId(app) {
    const mapping = {
        'finder': 'finder-window',
        'terminal': 'terminal-window',
        'whatsapp': 'whatsapp-window',
        'resume': 'resume-window'
    };
    return mapping[app] || app + '-window';
}

function openWindow(windowId) {
    const window = document.getElementById(windowId);
    
    // If window is minimized, restore it
    if (minimizedWindows.has(windowId)) {
        restoreWindow(windowId);
        return;
    }
    
    // Close any open window
    if (activeWindow && activeWindow !== window) {
        activeWindow.style.display = 'none';
    }
    
    // Open new window
    window.style.display = 'block';
    window.classList.remove('minimized', 'maximized');
    activeWindow = window;
    openWindows.add(windowId);
    updateDockIndicators();
}

function closeWindow() {
    if (activeWindow) {
        const windowId = activeWindow.id;
        const desktop = document.querySelector('.desktop');
        
        // Reset VM state if closing Linux window
        if (windowId === 'linux-window') {
            resetVMState();
        }
        
        activeWindow.style.display = 'none';
        activeWindow.classList.remove('minimized', 'maximized');
        desktop.classList.remove('fullscreen');
        minimizedWindows.delete(windowId);
        openWindows.delete(windowId);
        updateMinimizedBar();
        updateDockIndicators();
        activeWindow = null;
    }
}

function minimizeWindow() {
    if (activeWindow) {
        const windowId = activeWindow.id;
        const desktop = document.querySelector('.desktop');
        
        // Exit fullscreen if window is maximized
        if (activeWindow.classList.contains('maximized')) {
            desktop.classList.remove('fullscreen');
        }
        
        activeWindow.classList.add('minimized');
        minimizedWindows.add(windowId);
        openWindows.add(windowId);
        updateMinimizedBar();
        updateDockIndicators();
        
        setTimeout(() => {
            activeWindow.style.display = 'none';
            activeWindow = null;
        }, 300);
    }
}

function maximizeWindow() {
    if (activeWindow) {
        const desktop = document.querySelector('.desktop');
        
        if (activeWindow.classList.contains('maximized')) {
            activeWindow.classList.remove('maximized');
            desktop.classList.remove('fullscreen');
        } else {
            activeWindow.classList.add('maximized');
            desktop.classList.add('fullscreen');
        }
    }
}

function restoreWindow(windowId) {
    const window = document.getElementById(windowId);
    window.style.display = 'block';
    window.classList.remove('minimized');
    minimizedWindows.delete(windowId);
    openWindows.add(windowId);
    updateMinimizedBar();
    updateDockIndicators();
    activeWindow = window;
}

function updateMinimizedBar() {
    const container = document.getElementById('minimized-windows');
    container.innerHTML = '';
    
    minimizedWindows.forEach(windowId => {
        const window = document.getElementById(windowId);
        const title = window.querySelector('.window-title').textContent;
        
        const minimizedItem = document.createElement('div');
        minimizedItem.className = 'minimized-window';
        minimizedItem.textContent = title;
        minimizedItem.addEventListener('click', () => restoreWindow(windowId));
        
        container.appendChild(minimizedItem);
    });
}

function getWindowTitle(windowId) {
    const titles = {
        'resume-window': 'Resume.pdf',
        'chrome-window': 'Chrome',
        'finder-window': 'Finder',
        'intellij-window': 'IntelliJ',
        'vscode-window': 'VS Code'
    };
    return titles[windowId] || 'Window';
}

// App handlers
const appHandlers = {
    resume: () => openWindow('resume-window'),
    finder: () => openWindow('finder-window'),
    terminal: () => openTerminal(),
    tawk: () => openWindow('tawk-window'),
    games: () => openWindow('games-window'),
    linux: () => openLinuxOS(),
    wikipedia: () => openWindow('wikipedia-window'),
    linkedin: () => {
        const linkedinContact = portfolioData.contact.find(item => item.includes('LinkedIn:'));
        const linkedinUrl = linkedinContact ? 'https://' + linkedinContact.split('LinkedIn: ')[1] : 'https://linkedin.com';
        window.open(linkedinUrl, '_blank');
    }
};

function openLinuxOS() {
    openWindow('linux-window');
    setupVMBoot();
}

function setupVMBoot() {
    const powerBtn = document.getElementById('vm-power-btn');
    const bootScreen = document.getElementById('vm-boot-screen');
    const loadingScreen = document.getElementById('vm-loading');
    const terminal = document.getElementById('vm-terminal');
    const progressBar = document.getElementById('boot-progress');
    const bootText = document.getElementById('boot-text');
    
    powerBtn.addEventListener('click', () => {
        bootScreen.style.display = 'none';
        loadingScreen.style.display = 'flex';
        
        const bootMessages = [
            'Initializing...',
            'Loading kernel modules...',
            'Starting system services...',
            'Mounting filesystems...',
            'Configuring network...',
            'Starting Parrot Security OS...',
            'Loading terminal environment...'
        ];
        
        let progress = 0;
        let messageIndex = 0;
        
        const bootInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            
            if (progress > 100) progress = 100;
            
            progressBar.style.width = progress + '%';
            
            if (messageIndex < bootMessages.length) {
                bootText.textContent = bootMessages[messageIndex];
                messageIndex++;
            }
            
            if (progress >= 100) {
                clearInterval(bootInterval);
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    terminal.style.display = 'block';
                }, 500);
            }
        }, 800);
    });
}

function resetVMState() {
    const bootScreen = document.getElementById('vm-boot-screen');
    const loadingScreen = document.getElementById('vm-loading');
    const terminal = document.getElementById('vm-terminal');
    const progressBar = document.getElementById('boot-progress');
    const bootText = document.getElementById('boot-text');
    
    // Reset to initial state
    bootScreen.style.display = 'flex';
    loadingScreen.style.display = 'none';
    terminal.style.display = 'none';
    progressBar.style.width = '0%';
    bootText.textContent = 'Initializing...';
}









function openTerminal() {
    openWindow('terminal-window');
    setupTerminal();
}

function setupTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    // Update login date
    const loginLine = terminalOutput.querySelector('.terminal-line');
    if (loginLine && loginLine.textContent.includes('${new Date().toDateString()}')) {
        loginLine.textContent = `Last login: ${new Date().toDateString()} on console`;
    }
    
    // Initialize shared terminal commands
    const terminalCommands = new TerminalCommands();
    
    // Auto-focus terminal input
    terminalInput.focus();
    
    // Smart auto-focus - only focus when clicking outside of terminal output
    document.getElementById('terminal-window').addEventListener('click', (e) => {
        if (!e.target.closest('.window-controls') && !e.target.closest('#terminal-output')) {
            terminalInput.focus();
        }
    });
    
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            
            // Add command to output
            const commandLine = document.createElement('div');
            commandLine.className = 'terminal-line';
            commandLine.textContent = `arun@macbook-pro ~ % ${command}`;
            terminalOutput.appendChild(commandLine);
            
            // Execute command using shared terminal commands
            if (command) {
                terminalCommands.addToHistory(command);
                const result = terminalCommands.executeCommand(command);
                
                if (result === 'CLEAR_TERMINAL') {
                    terminalOutput.innerHTML = '';
                    terminalInput.value = '';
                    return;
                } else {
                    result.split('\n').forEach(line => {
                        if (line.trim()) {
                            const outputLine = document.createElement('div');
                            outputLine.className = 'terminal-line terminal-success';
                            outputLine.textContent = line;
                            terminalOutput.appendChild(outputLine);
                            // Scroll after each line
                            terminalOutput.scrollTop = terminalOutput.scrollHeight;
                        }
                    });
                }
            }
            
            // Clear input
            terminalInput.value = '';
            
            // Final scroll to ensure we're at bottom
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const input = terminalInput.value;
            const result = terminalCommands.autoComplete(input);
            
            terminalInput.value = result.completed;
            
            if (result.showSuggestions && result.suggestions) {
                // Show suggestions
                const commandLine = document.createElement('div');
                commandLine.className = 'terminal-line';
                commandLine.textContent = `arun@macbook-pro ~ % ${input}`;
                terminalOutput.appendChild(commandLine);
                
                const suggestionsLine = document.createElement('div');
                suggestionsLine.className = 'terminal-line terminal-success';
                suggestionsLine.textContent = result.suggestions.join('  ');
                terminalOutput.appendChild(suggestionsLine);
                
                // Don't add prompt for tab completion suggestions
                
                requestAnimationFrame(() => {
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                });
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevCommand = terminalCommands.getPreviousCommand();
            if (prevCommand) {
                terminalInput.value = prevCommand;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextCommand = terminalCommands.getNextCommand();
            terminalInput.value = nextCommand;
        }
    });
}



// Desktop icon clicks
document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('click', () => {
        const app = icon.dataset.app;
        if (appHandlers[app]) {
            appHandlers[app]();
        }
    });
});

// Dock item clicks
document.querySelectorAll('.dock-item').forEach(item => {
    item.addEventListener('click', () => {
        const app = item.dataset.app;
        if (appHandlers[app]) {
            appHandlers[app]();
        }
    });
});

// Window controls
document.querySelectorAll('.control.close').forEach(control => {
    control.addEventListener('click', closeWindow);
});

document.querySelectorAll('.control.minimize').forEach(control => {
    control.addEventListener('click', minimizeWindow);
});

document.querySelectorAll('.control.maximize').forEach(control => {
    control.addEventListener('click', maximizeWindow);
});

// Finder file clicks
document.querySelectorAll('.file-item').forEach(item => {
    item.addEventListener('click', () => {
        const file = item.dataset.file;
        if (file === 'resume') {
            openWindow('resume-window');
        }
    });
});





// Make windows draggable
document.querySelectorAll('.window').forEach(window => {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const header = window.querySelector('.window-header');
    
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        if (e.target.classList.contains('control')) return;
        
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === header || header.contains(e.target)) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            window.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
});

// Dock magnification effect
const dock = document.querySelector('.dock');
const dockItems = document.querySelectorAll('.dock-item');

dock.addEventListener('mousemove', (e) => {
    const dockRect = dock.getBoundingClientRect();
    const mouseX = e.clientX - dockRect.left;
    
    dockItems.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2 - dockRect.left;
        const distance = Math.abs(mouseX - itemCenterX);
        
        // Calculate scale based on distance (closer = bigger)
        const maxDistance = 100;
        const maxScale = 1.6;
        const minScale = 1.0;
        
        let scale = minScale;
        if (distance < maxDistance) {
            scale = maxScale - (distance / maxDistance) * (maxScale - minScale);
        }
        
        // Apply transform to dock item and icon
        const translateY = (scale - 1) * -20;
        item.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        item.style.zIndex = Math.round(scale * 10);
        
        // Also scale the icon inside
        const icon = item.querySelector('.app-icon');
        if (icon) {
            const iconScale = 1 + (scale - 1) * 0.3; // Less aggressive scaling for icon
            icon.style.transform = `scale(${iconScale})`;
        }
    });
});

dock.addEventListener('mouseleave', () => {
    dockItems.forEach(item => {
        item.style.transform = 'scale(1) translateY(0px)';
        item.style.zIndex = '1';
        
        // Reset icon scale
        const icon = item.querySelector('.app-icon');
        if (icon) {
            icon.style.transform = 'scale(1)';
        }
    });
});

function openTawk() {
    openWindow('tawk-window');
}

function startLiveChat() {
    // Start of Tawk.to Live Chat
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/643bb48131ebfa0fe7f8920b/1gu4ji76n';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
    })();
    // End of Tawk.to Live Chat
    
    // Show confirmation
    alert('Live chat is loading! The chat widget will appear shortly.');
}

// Populate contact options from portfolio data
function populateContactOptions() {
    const contactContainer = document.getElementById('contact-options');
    if (!contactContainer || !portfolioData) return;
    
    // Keep the live chat button
    const liveChatBtn = contactContainer.querySelector('button[onclick="startLiveChat()"]');
    contactContainer.innerHTML = '';
    if (liveChatBtn) {
        contactContainer.appendChild(liveChatBtn);
    }
    
    // Parse contact data and create buttons
    portfolioData.contact.forEach(contact => {
        if (contact.includes('Email:')) {
            const email = contact.split('Email: ')[1];
            const emailBtn = document.createElement('a');
            emailBtn.href = `mailto:${email}`;
            emailBtn.className = 'contact-btn';
            emailBtn.innerHTML = '📧 Email';
            contactContainer.appendChild(emailBtn);
        } else if (contact.includes('Phone:')) {
            const phone = contact.split('Phone: ')[1].replace(/[^\d+]/g, '');
            const phoneBtn = document.createElement('a');
            phoneBtn.href = `tel:${phone}`;
            phoneBtn.className = 'contact-btn';
            phoneBtn.innerHTML = '📞 Phone';
            contactContainer.appendChild(phoneBtn);
        } else if (contact.includes('LinkedIn:')) {
            const linkedin = contact.split('LinkedIn: ')[1];
            const linkedinBtn = document.createElement('a');
            linkedinBtn.href = `https://${linkedin}`;
            linkedinBtn.target = '_blank';
            linkedinBtn.className = 'contact-btn';
            linkedinBtn.innerHTML = '🔗 LinkedIn';
            contactContainer.appendChild(linkedinBtn);
        } else if (contact.includes('GitHub:')) {
            const github = contact.split('GitHub: ')[1];
            const githubBtn = document.createElement('a');
            githubBtn.href = `https://github.com/${github}`;
            githubBtn.target = '_blank';
            githubBtn.className = 'contact-btn';
            githubBtn.innerHTML = '🐙 GitHub';
            contactContainer.appendChild(githubBtn);
        }
    });
}

// Initialize contact options when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateContactOptions();
});

// OS Switcher functionality
document.getElementById('linux-switch').addEventListener('click', () => {
    window.location.href = 'linux/index.html';
});

document.getElementById('macos-switch').addEventListener('click', () => {
    // Already on macOS, do nothing
    console.log('Already on macOS');
});