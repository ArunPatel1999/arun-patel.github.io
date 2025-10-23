const output = document.getElementById('output');
const input = document.getElementById('command-input');

let currentDirectory = 'portfolio';

// Initialize shared terminal commands
const terminalCommands = new TerminalCommands();

const availableCommands = ['help', 'about', 'experience', 'education', 'skills', 'projects', 'contact', 'certificates', 'achievements', 'clear', 'main', 'ls', 'whoami', 'pwd', 'date', 'neofetch', 'cd', 'resume', 'download'];
const directories = ['about', 'experience', 'education', 'skills', 'projects', 'contact', 'certificates', 'achievements'];

// Linux-specific commands only
const commands = {
    main: () => {
        return [
            "=== MAIN MENU ===",
            "",
            "Welcome to my interactive portfolio!",
            "",
            "Quick Navigation:",
            "  → Type 'about' to learn about me",
            "  → Type 'experience' for work history",
            "  → Type 'education' for academic background",
            "  → Type 'skills' for technical expertise",
            "  → Type 'projects' to see my work",
            "  → Type 'contact' to get in touch",
            "",
            "Type any command to explore!"
        ];
    },
    
    neofetch: () => {
        return [
            "                     .,,.",
            "                   .,;;;;;,.",
            "                 .,;;;;;;;;,.",
            "               .;;;;;;;;;;;;;,",
            "              ;;;;;;;;;;;;;;;;,",
            "             ;;;;;;;;;;;;;;;;;",
            "            .;;;;;;;;;;;;;;;;;",
            "           .;;;;;;;;;;;;;;;;;.",
            "          .;;;;;;;;;;;;;;;;;",
            "         .;;;;;;;;;;;;;;;;",
            "        .;;;;;;;;;;;;;;;",
            "       .;;;;;;;;;;;;;;",
            "      .;;;;;;;;;;;;;",
            "     .;;;;;;;;;;;",
            "    .;;;;;;;;;",
            "   .;;;;;;;",
            "  .;;;;;",
            " .;;;",
            ".;",
            "",
            `OS: Parrot Security ${new Date().getFullYear()}`,
            "Host: Portfolio Terminal",
            `User: ${portfolioData.name}`,
            "Shell: portfolio-shell",
            "Terminal: web-terminal",
            "CPU: JavaScript Engine",
            "Memory: Unlimited"
        ];
    },
    
    resume: () => {
        if (portfolioData.resumeFile) {
            showResumeViewer();
            return [`Opening resume viewer...`, `Type any command to continue or use the X button to close.`];
        } else {
            return [`Resume file not found. Please add resume.pdf to the project folder.`];
        }
    },
    
    download: () => {
        if (portfolioData.resumeFile) {
            const link = document.createElement('a');
            link.href = `../assert/${portfolioData.resumeFile}`;
            link.download = `${portfolioData.name.replace(' ', '_')}_Resume.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return [`Downloading ${portfolioData.name}'s resume...`];
        } else {
            return [`Resume file not found. Please add resume.pdf to the project folder.`];
        }
    },
    
    help: (args) => {
        if (args && args.length > 0) {
            const cmd = args[0];
            const helpText = {
                about: "about - Display information about me",
                experience: "experience - Show my work experience and career history",
                education: "education - Display my educational background and certifications",
                skills: "skills - List my technical skills and expertise",
                projects: "projects - Show my portfolio projects and achievements",
                contact: "contact - Display my contact information",
                clear: "clear - Clear the terminal screen",
                main: "main - Show the main menu with navigation options",
                ls: "ls - List available sections (similar to Unix ls command)",
                whoami: "whoami - Display current user information",
                pwd: "pwd - Print working directory",
                date: "date - Display current date and time"
            };
            return helpText[cmd] ? [helpText[cmd]] : [`No manual entry for ${cmd}`];
        }
        return [
            "Portfolio Terminal Help",
            "Usage: command [options]",
            "",
            "Available commands:",
            "  help [command]  - Show help for specific command or all commands",
            "  about          - About me",
            "  experience     - Work experience",
            "  education      - Educational background",
            "  skills         - Technical skills",
            "  projects       - My projects",
            "  contact        - Contact information",
            "  resume         - View resume in new tab",
            "  download       - Download resume PDF",
            "  cd <dir>       - Change directory (about, skills, etc.)",
            "  clear          - Clear terminal",
            "  main           - Show main menu",
            "  ls             - List sections",
            "  whoami         - Current user",
            "  pwd            - Working directory",
            "  date           - Current date",
            "",
            "Tips:",
            "  - Use Tab for command completion",
            "  - Use Up/Down arrows for command history",
            "  - Type 'help <command>' for specific help"
        ];
    },
    
    about: () => {
        return [
            `Hi! I'm ${portfolioData.name}`,
            `${portfolioData.title}`,
            "",
            portfolioData.bio || "Passionate developer with expertise in full-stack development."
        ];
    },
    
    experience: () => {
        const lines = ["Work Experience:", ""];
        portfolioData.experience.forEach((job, index) => {
            // Company header line
            lines.push(`\x1b[1m${job.position} at ${job.company} | ${job.location} | ${job.period}\x1b[0m`);
            
            // Job description bullets
            job.description.forEach(desc => {
                lines.push(`  • ${desc}`);
            });
            
            // Add separator between jobs (not after last job)
            if (index < portfolio.experience.length - 1) {
                lines.push("");
                lines.push("─────────────────────────────────────────────────────────────────");
                lines.push("");
            }
        });
        return lines;
    },
    
    education: () => {
        const lines = ["Education:", ""];
        portfolioData.education.forEach((edu, index) => {
            // Education header line
            lines.push(`\x1b[1m${edu.degree} (${edu.period})\x1b[0m`);
            lines.push(`  • ${edu.institution} – ${edu.university}`);
            lines.push(`  • ${edu.grade}`);
            
            // Add separator between education entries (not after last one)
            if (index < portfolio.education.length - 1) {
                lines.push("");
                lines.push("─────────────────────────────────────────────────────────────────");
                lines.push("");
            }
        });
        return lines;
    },
    
    skills: () => {
        const lines = ["Technical Skills:"];
        portfolioData.skills.forEach(skill => lines.push(`  • ${skill}`));
        return lines;
    },
    
    projects: () => {
        const lines = ["Projects:"];
        portfolioData.projects.forEach(project => lines.push(`  • ${project}`));
        return lines;
    },
    
    contact: () => {
        const lines = ["Contact Information:"];
        portfolioData.contact.forEach(info => lines.push(`  • ${info}`));
        return lines;
    },
    
    certificates: () => {
        const lines = ["Certificates:"];
        portfolioData.certificates.forEach(cert => lines.push(`  • ${cert}`));
        return lines;
    },
    
    achievements: () => {
        const lines = ["Achievements:"];
        portfolioData.achievements.forEach(achievement => lines.push(`  • ${achievement}`));
        return lines;
    },
    
    main: () => {
        return [
            "=== MAIN MENU ===",
            "",
            "Welcome to my interactive portfolio!",
            "",
            "Quick Navigation:",
            "  → Type 'about' to learn about me",
            "  → Type 'experience' for work history",
            "  → Type 'education' for academic background",
            "  → Type 'skills' for technical expertise",
            "  → Type 'projects' to see my work",
            "  → Type 'contact' to get in touch",
            "",
            "Type any command to explore!"
        ];
    },
    
    clear: () => {
        output.innerHTML = '';
        return [];
    },
    
    ls: () => {
        return [
            "Available sections:",
            "about/         education/      projects/",
            "contact/       experience/     skills/",
            "certificates/  achievements/"
        ];
    },
    
    whoami: () => {
        return [`${portfolioData.name} (${portfolioData.title})`];
    },
    
    pwd: () => {
        return [`/home/user/${currentDirectory}`];
    },
    
    cd: (args) => {
        if (!args || args.length === 0) {
            currentDirectory = 'portfolio';
            updatePrompt();
            return ['Changed to home directory'];
        }
        
        const target = args[0];
        
        if (target === '..' || target === '~') {
            currentDirectory = 'portfolio';
            updatePrompt();
            return ['Changed to home directory'];
        }
        
        if (directories.includes(target)) {
            currentDirectory = target;
            updatePrompt();
            const result = commands[target] ? commands[target]() : [`Entered ${target} directory`];
            return [`Changed to ${target} directory`, ''].concat(result);
        }
        
        return [`cd: ${target}: No such directory`, 'Available directories: ' + directories.join(', ')];
    },
    
    date: () => {
        return [new Date().toString()];
    },
    
    neofetch: () => {
        return [
            "                     .,,.",
            "                   .,;;;;;,.",
            "                 .,;;;;;;;;,.",
            "               .;;;;;;;;;;;;;,",
            "              ;;;;;;;;;;;;;;;;,",
            "             ;;;;;;;;;;;;;;;;;",
            "            .;;;;;;;;;;;;;;;;;",
            "           .;;;;;;;;;;;;;;;;;.",
            "          .;;;;;;;;;;;;;;;;;",
            "         .;;;;;;;;;;;;;;;;",
            "        .;;;;;;;;;;;;;;;",
            "       .;;;;;;;;;;;;;;",
            "      .;;;;;;;;;;;;;",
            "     .;;;;;;;;;;;",
            "    .;;;;;;;;;",
            "   .;;;;;;;",
            "  .;;;;;",
            " .;;;",
            ".;",
            "",
            `OS: Parrot Security ${new Date().getFullYear()}`,
            "Host: Portfolio Terminal",
            `User: ${portfolioData.name}`,
            "Shell: portfolio-shell",
            "Terminal: web-terminal",
            "CPU: JavaScript Engine",
            "Memory: Unlimited"
        ];
    },
    

    
    resume: () => {
        if (portfolioData.resumeFile) {
            showResumeViewer();
            return [`Opening resume viewer...`, `Type any command to continue or use the X button to close.`];
        } else {
            return [`Resume file not found. Please add resume.pdf to the project folder.`];
        }
    },
    
    download: () => {
        if (portfolioData.resumeFile) {
            const link = document.createElement('a');
            link.href = `../assert/${portfolioData.resumeFile}`;
            link.download = `${portfolioData.name.replace(' ', '_')}_Resume.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return [`Downloading ${portfolioData.name}'s resume...`];
        } else {
            return [`Resume file not found. Please add resume.pdf to the project folder.`];
        }
    }
};

// Auto-sync theme with parent window
function syncTheme() {
    const savedTheme = localStorage.getItem('mainTheme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
    } else {
        document.body.classList.remove('light');
    }
}

// Load theme on page load
window.addEventListener('load', syncTheme);

// Listen for theme changes from parent
window.addEventListener('storage', (e) => {
    if (e.key === 'mainTheme') {
        syncTheme();
    }
});





function addLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `line ${className}`;
    
    // Handle ANSI bold formatting
    if (text.includes('\x1b[1m') && text.includes('\x1b[0m')) {
        const boldText = text.replace(/\x1b\[1m/g, '').replace(/\x1b\[0m/g, '');
        line.textContent = boldText;
        line.classList.add('company-line');
    } else {
        line.textContent = text;
    }
    
    output.appendChild(line);
}

function updatePrompt() {
    const titleElement = document.querySelector('.title');
    const promptElement = document.querySelector('.prompt');
    
    titleElement.textContent = `┌──(user㉿arun)-[~/${currentDirectory}]`;
    promptElement.textContent = '└─$ ';
}

function executeCommand(cmd) {
    addLine(`┌──(user㉿arun)-[~/${currentDirectory}]`);
    addLine(`└─$ ${cmd}`);
    
    if (cmd.trim()) {
        terminalCommands.addToHistory(cmd);
    }
    
    const parts = cmd.toLowerCase().trim().split(' ');
    const command = parts[0];
    const args = parts.slice(1);
    
    if (command === '') {
        // Do nothing for empty command
        return;
    }
    
    // Try shared terminal commands first
    const sharedResult = terminalCommands.executeCommand(cmd);
    if (sharedResult === 'CLEAR_TERMINAL') {
        output.innerHTML = '';
        return;
    } else if (!sharedResult.includes('Command not found:')) {
        // Shared command found and executed
        sharedResult.split('\n').forEach(line => {
            if (line.trim()) {
                addLine(line, 'success');
            }
        });
        // Auto-scroll to bottom
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        return;
    }
    
    // Try Linux-specific commands
    if (commands[command]) {
        const result = commands[command](args);
        result.forEach(line => addLine(line, 'success'));
        // Auto-scroll to bottom
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        return;
    }
    
    // Command not found
    const suggestions = getSuggestions(command);
    addLine(`Command not found: ${cmd}`, 'error');
    if (suggestions.length > 0) {
        addLine(`Did you mean: ${suggestions.join(', ')}?`, 'info');
    }
    addLine("Type 'help' for available commands.", 'info');
    
    addLine('');
    
    // Auto-scroll to bottom
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

function getSuggestions(input) {
    return availableCommands.filter(cmd => 
        cmd.startsWith(input) || 
        cmd.includes(input) ||
        levenshteinDistance(input, cmd) <= 2
    ).slice(0, 3);
}

function levenshteinDistance(str1, str2) {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[str2.length][str1.length];
}

function autoComplete() {
    const inputValue = input.value.toLowerCase();
    const parts = inputValue.split(' ');
    
    if (parts.length === 1) {
        // Complete command
        const matches = availableCommands.filter(cmd => cmd.startsWith(inputValue));
        
        if (matches.length === 1) {
            input.value = matches[0];
        } else if (matches.length > 1) {
            const commonPrefix = getCommonPrefix(matches);
            if (commonPrefix.length > inputValue.length) {
                input.value = commonPrefix;
            } else {
                addLine(`┌──(user㉿parrot)-[~/${currentDirectory}]`);
                addLine(`└─$ ${inputValue}`);
                addLine(matches.join('  '), 'info');
                addLine('');
                output.scrollTop = output.scrollHeight;
            }
        }
    } else if (parts[0] === 'cd' && parts.length === 2) {
        // Complete directory for cd command
        const dirInput = parts[1];
        const matches = directories.filter(dir => dir.startsWith(dirInput));
        
        if (matches.length === 1) {
            input.value = `cd ${matches[0]}`;
        } else if (matches.length > 1) {
            const commonPrefix = getCommonPrefix(matches);
            if (commonPrefix.length > dirInput.length) {
                input.value = `cd ${commonPrefix}`;
            } else {
                addLine(`┌──(user㉿parrot)-[~/${currentDirectory}]`);
                addLine(`└─$ ${inputValue}`);
                addLine(matches.join('  '), 'info');
                addLine('');
                output.scrollTop = output.scrollHeight;
            }
        }
    }
}

function getCommonPrefix(strings) {
    if (strings.length === 0) return '';
    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
        while (strings[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix === '') return '';
        }
    }
    return prefix;
}



input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = input.value;
        executeCommand(command);
        input.value = '';
    } else if (e.key === 'Tab') {
        e.preventDefault();
        autoComplete();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevCommand = terminalCommands.getPreviousCommand();
        if (prevCommand) {
            input.value = prevCommand;
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextCommand = terminalCommands.getNextCommand();
        input.value = nextCommand;
    }
});

// Auto-focus input
input.focus();
document.addEventListener('click', (e) => {
    // Only focus input if clicking outside of terminal output
    if (!e.target.closest('#output')) {
        input.focus();
    }
});



// Resume viewer functions
function showResumeViewer() {
    const resumeViewer = document.getElementById('resume-viewer');
    const resumeFrame = document.getElementById('resume-frame');
    
    // Use direct PDF path
    const pdfUrl = '../assert/Arun Patel.pdf#toolbar=1&navpanes=0&scrollbar=1&page=1&view=FitH';
    resumeFrame.src = pdfUrl;
    resumeViewer.style.display = 'block';
}

function hideResumeViewer() {
    const resumeViewer = document.getElementById('resume-viewer');
    const resumeFrame = document.getElementById('resume-frame');
    
    resumeViewer.style.display = 'none';
    resumeFrame.src = '';
    
    // Focus back to input
    input.focus();
}

// Close resume viewer button
document.getElementById('close-resume').addEventListener('click', hideResumeViewer);

