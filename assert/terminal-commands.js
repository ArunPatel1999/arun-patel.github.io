// Shared Terminal Commands Module
// This module provides common terminal functionality for Linux, macOS, and future Windows interfaces

class TerminalCommands {
    constructor() {
        this.commandHistory = [];
        this.historyIndex = -1;
    }

    // Execute command and return output
    executeCommand(command) {
        const cmd = command.trim().toLowerCase();
        const args = command.trim().split(' ');
        
        switch (cmd) {
            case 'help':
                return this.getHelp();
            case 'about':
                return this.getAbout();
            case 'skills':
                return this.getSkills();
            case 'experience':
                return this.getExperience();
            case 'education':
                return this.getEducation();
            case 'projects':
                return this.getProjects();
            case 'contact':
                return this.getContact();
            case 'resume':
                return this.getResume();
            case 'clear':
                return 'CLEAR_TERMINAL';
            case 'ls':
                return this.getDirectoryListing();
            case 'pwd':
                return '/Users/arun/portfolio';
            case 'whoami':
                return 'arun';
            case 'date':
                return new Date().toString();
            case 'theme':
                return this.getThemeInfo();
            default:
                if (cmd.startsWith('cd ')) {
                    return this.changeDirectory(args.slice(1));
                }
                return `Command not found: ${command}. Type 'help' for available commands.`;
        }
    }

    getHelp() {
        return `Available commands:
┌─────────────┬──────────────────────────────────┐
│ Command     │ Description                      │
├─────────────┼──────────────────────────────────┤
│ help        │ Show this help message           │
│ about       │ About Arun Patel                 │
│ skills      │ Technical skills                 │
│ experience  │ Work experience                  │
│ education   │ Educational background           │
│ projects    │ Portfolio projects               │
│ contact     │ Contact information              │
│ resume      │ View/download resume             │
│ clear       │ Clear terminal                   │
│ ls          │ List directory contents          │
│ pwd         │ Print working directory          │
│ whoami      │ Current user                     │
│ date        │ Current date and time            │
│ theme       │ Theme information                │
└─────────────┴──────────────────────────────────┘`;
    }

    getAbout() {
        if (typeof portfolioData !== 'undefined') {
            return `About ${portfolioData.name}
${'═'.repeat(80)}

👨💻 ${portfolioData.title}

${portfolioData.bio}

${'═'.repeat(80)}`;
        }
        
        return 'About information not available';
    }

    getSkills() {
        if (typeof portfolioData !== 'undefined' && portfolioData.skills) {
            let output = `Technical Skills\n${'═'.repeat(80)}\n\n`;
            
            portfolioData.skills.forEach(skill => {
                output += `🔧 ${skill}\n`;
            });
            
            return output + '\n' + '═'.repeat(80);
        }
        
        return 'Skills data not available';
    }

    getExperience() {
        if (typeof portfolioData !== 'undefined' && portfolioData.experience) {
            let output = `Work Experience\n${'═'.repeat(80)}\n\n`;
            
            portfolioData.experience.forEach((exp, index) => {
                output += `💼 ${exp.company} | ${exp.position}\n`;
                output += `📅 ${exp.period} | 📍 ${exp.location}\n\n`;
                
                exp.description.forEach(desc => {
                    output += `   • ${desc}\n`;
                });
                
                if (index < portfolioData.experience.length - 1) {
                    output += `\n${'-'.repeat(80)}\n\n`;
                }
            });
            
            return output + `\n${'═'.repeat(80)}`;
        }
        
        return 'Experience data not available';
    }

    getEducation() {
        if (typeof portfolioData !== 'undefined' && portfolioData.education) {
            let output = `Education\n${'═'.repeat(80)}\n\n`;
            
            portfolioData.education.forEach((edu, index) => {
                output += `🎓 ${edu.institution}\n`;
                output += `📚 ${edu.degree}\n`;
                output += `📅 ${edu.period} | 🏛️ ${edu.university}\n`;
                output += `📊 ${edu.grade}\n`;
                
                if (index < portfolioData.education.length - 1) {
                    output += `\n${'-'.repeat(80)}\n\n`;
                }
            });
            
            return output + `\n${'═'.repeat(80)}`;
        }
        
        return 'Education data not available';
    }

    getProjects() {
        if (typeof portfolioData !== 'undefined' && portfolioData.projects) {
            let output = `Portfolio Projects\n${'═'.repeat(80)}\n\n`;
            
            portfolioData.projects.forEach(project => {
                output += `🚀 ${project}\n`;
            });
            
            return output + `\n${'═'.repeat(80)}`;
        }
        
        return 'Projects data not available';
    }

    getContact() {
        if (typeof portfolioData !== 'undefined' && portfolioData.contact) {
            let output = `Contact Information\n${'═'.repeat(80)}\n\n`;
            
            portfolioData.contact.forEach(contact => {
                output += `📞 ${contact}\n`;
            });
            
            output += `\n💬 Let's connect and discuss opportunities!`;
            return output + `\n${'═'.repeat(80)}`;
        }
        
        return 'Contact data not available';
    }

    getResume() {
        // Try to show resume viewer if function exists
        if (typeof showResumeViewer === 'function') {
            showResumeViewer();
            return 'Opening resume viewer...';
        }
        return `Resume
${'═'.repeat(80)}

📄 Resume is available for viewing and download.

Commands:
• Type 'experience' to view work history
• Type 'education' to view educational background  
• Type 'skills' to view technical skills
• Type 'contact' to view contact information

💡 Tip: Click on Resume.pdf icon to open in viewer
${'═'.repeat(80)}`;
    }

    getDirectoryListing() {
        return `Available sections:
about/         education/      projects/
contact/       experience/     skills/
certificates/  achievements/   resume.pdf`;
    }

    getThemeInfo() {
        return `Theme System
${'═'.repeat(80)}

🌙 Current theme: Auto-detected based on system preference
🔄 Synchronized across Linux and macOS interfaces
🎨 Supports both dark and light modes

Toggle theme using the theme button in the menu bar.
${'═'.repeat(80)}`;
    }

    // Get available commands for autocompletion
    changeDirectory(args) {
        const directories = ['about', 'experience', 'education', 'skills', 'projects', 'contact', 'certificates', 'achievements'];
        
        if (!args || args.length === 0) {
            return 'Changed to home directory';
        }
        
        let target = args[0];
        
        // Remove trailing slash if present
        if (target.endsWith('/')) {
            target = target.slice(0, -1);
        }
        
        if (target === '..' || target === '~') {
            return 'Changed to home directory';
        }
        
        if (directories.includes(target)) {
            // Execute the command to show content
            const result = this.executeCommand(target);
            return `Changed to ${target} directory\n\n${result}`;
        }
        
        return `cd: ${args[0]}: No such directory\nAvailable directories: ${directories.join(', ')}`;
    }

    getAvailableCommands() {
        return ['help', 'about', 'skills', 'experience', 'education', 'projects', 'contact', 'resume', 'clear', 'ls', 'pwd', 'whoami', 'date', 'theme', 'cd'];
    }

    // Auto-complete command
    autoComplete(input) {
        const parts = input.split(' ');
        
        if (parts.length === 1) {
            // Complete command
            const commands = this.getAvailableCommands();
            const matches = commands.filter(cmd => cmd.startsWith(input.toLowerCase()));
            
            if (matches.length === 1) {
                return { completed: matches[0], showSuggestions: false };
            } else if (matches.length > 1) {
                const commonPrefix = this.getCommonPrefix(matches);
                return { 
                    completed: commonPrefix.length > input.length ? commonPrefix : input,
                    showSuggestions: true,
                    suggestions: matches
                };
            }
        } else if (parts[0] === 'cd' && parts.length === 2) {
            // Complete directory for cd command
            const directories = ['about', 'experience', 'education', 'skills', 'projects', 'contact', 'certificates', 'achievements'];
            const dirInput = parts[1];
            const matches = directories.filter(dir => dir.startsWith(dirInput));
            
            if (matches.length === 1) {
                return { completed: `cd ${matches[0]}`, showSuggestions: false };
            } else if (matches.length > 1) {
                const commonPrefix = this.getCommonPrefix(matches);
                return {
                    completed: commonPrefix.length > dirInput.length ? `cd ${commonPrefix}` : input,
                    showSuggestions: true,
                    suggestions: matches
                };
            }
        }
        return { completed: input, showSuggestions: false };
    }

    getCommonPrefix(strings) {
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

    // Command history management
    addToHistory(command) {
        if (command.trim() && this.commandHistory[this.commandHistory.length - 1] !== command) {
            this.commandHistory.push(command);
        }
        this.historyIndex = this.commandHistory.length;
    }

    getPreviousCommand() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            return this.commandHistory[this.historyIndex];
        }
        return '';
    }

    getNextCommand() {
        if (this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            return this.commandHistory[this.historyIndex];
        } else {
            this.historyIndex = this.commandHistory.length;
            return '';
        }
    }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TerminalCommands;
} else {
    window.TerminalCommands = TerminalCommands;
}