// Diary Application JavaScript
class DiaryApp {
    constructor() {
        this.currentUser = AuthManager.getCurrentUser();
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        this.entries = AuthManager.getUserEntries(this.currentUser.id) || [];
        this.currentEntry = null;
        this.isEditing = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadEntries();
        this.setCurrentDate();
        this.showWelcomeModal();
        this.updateUserInfo();
    }

    initializeElements() {
        // Main elements
        this.newEntryBtn = document.getElementById('newEntryBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.entriesList = document.getElementById('entriesList');
        this.searchInput = document.getElementById('searchInput');
        
        // Editor elements
        this.entryDate = document.getElementById('entryDate');
        this.moodSelect = document.getElementById('moodSelect');
        this.entryTitle = document.getElementById('entryTitle');
        this.entryContent = document.getElementById('entryContent');
        this.wordCount = document.getElementById('wordCount');
        this.saveEntryBtn = document.getElementById('saveEntryBtn');
        this.clearBtn = document.getElementById('clearBtn');
        
        // Modal elements
        this.welcomeModal = document.getElementById('welcomeModal');
        this.closeModal = document.getElementById('closeModal');
        this.startWritingBtn = document.getElementById('startWritingBtn');
        
        // Toast container
        this.toastContainer = document.getElementById('toastContainer');
    }

    updateUserInfo() {
        // Update header with user info
        const logo = document.querySelector('.logo');
        if (logo && this.currentUser) {
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info';
            userInfo.innerHTML = `
                <span class="user-name">Welcome, ${this.currentUser.firstName}!</span>
            `;
            logo.appendChild(userInfo);
        }
    }

    bindEvents() {
        // Button events
        this.newEntryBtn.addEventListener('click', () => this.createNewEntry());
        this.saveEntryBtn.addEventListener('click', () => this.saveEntry());
        this.clearBtn.addEventListener('click', () => this.clearEditor());
        
        // Input events
        this.entryContent.addEventListener('input', () => this.updateWordCount());
        this.searchInput.addEventListener('input', () => this.filterEntries());
        
        // Modal events
        this.closeModal.addEventListener('click', () => this.hideWelcomeModal());
        this.startWritingBtn.addEventListener('click', () => this.hideWelcomeModal());
        
        // Auto-save on content change
        this.entryTitle.addEventListener('input', () => this.autoSave());
        this.entryContent.addEventListener('input', () => this.autoSave());
        this.moodSelect.addEventListener('change', () => this.autoSave());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    showWelcomeModal() {
        if (!localStorage.getItem(`diaryFirstVisit_${this.currentUser.id}`)) {
            this.welcomeModal.classList.add('show');
            localStorage.setItem(`diaryFirstVisit_${this.currentUser.id}`, 'true');
        }
    }

    hideWelcomeModal() {
        this.welcomeModal.classList.remove('show');
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        this.entryDate.value = today;
    }

    createNewEntry() {
        this.currentEntry = null;
        this.isEditing = false;
        this.clearEditor();
        this.setCurrentDate();
        this.entryTitle.focus();
        this.showToast('New entry created!', 'success');
    }

    clearEditor() {
        this.entryTitle.value = '';
        this.entryContent.value = '';
        this.moodSelect.value = '';
        this.updateWordCount();
        this.currentEntry = null;
        this.isEditing = false;
    }

    updateWordCount() {
        const content = this.entryContent.value;
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        this.wordCount.textContent = `${words} words`;
    }

    saveEntry() {
        const title = this.entryTitle.value.trim();
        const content = this.entryContent.value.trim();
        const date = this.entryDate.value;
        const mood = this.moodSelect.value;

        if (!title && !content) {
            this.showToast('Please write something before saving!', 'error');
            return;
        }

        const entry = {
            id: this.currentEntry ? this.currentEntry.id : Date.now(),
            title: title || 'Untitled Entry',
            content,
            date,
            mood,
            timestamp: new Date().toISOString(),
            wordCount: content.trim() ? content.trim().split(/\s+/).length : 0
        };

        if (this.currentEntry) {
            // Update existing entry
            const index = this.entries.findIndex(e => e.id === this.currentEntry.id);
            if (index !== -1) {
                this.entries[index] = entry;
            }
        } else {
            // Add new entry
            this.entries.unshift(entry);
        }

        this.saveToLocalStorage();
        this.loadEntries();
        this.currentEntry = entry;
        this.isEditing = true;
        
        this.showToast('Entry saved successfully!', 'success');
    }

    autoSave() {
        // Debounced auto-save
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            if (this.entryTitle.value.trim() || this.entryContent.value.trim()) {
                this.saveEntry();
            }
        }, 2000);
    }

    loadEntries() {
        this.entriesList.innerHTML = '';
        
        if (this.entries.length === 0) {
            this.entriesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <p>No entries yet. Start writing your first diary entry!</p>
                </div>
            `;
            return;
        }

        this.entries.forEach(entry => {
            const entryElement = this.createEntryElement(entry);
            this.entriesList.appendChild(entryElement);
        });
    }

    createEntryElement(entry) {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-item';
        if (this.currentEntry && this.currentEntry.id === entry.id) {
            entryDiv.classList.add('active');
        }

        const date = new Date(entry.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        const preview = entry.content.length > 100 
            ? entry.content.substring(0, 100) + '...' 
            : entry.content;

        entryDiv.innerHTML = `
            <div class="entry-header">
                <span class="entry-date">${date}</span>
                ${entry.mood ? `<span class="entry-mood">${entry.mood}</span>` : ''}
            </div>
            <div class="entry-title">${entry.title}</div>
            <div class="entry-preview">${preview}</div>
        `;

        entryDiv.addEventListener('click', () => this.loadEntry(entry));
        
        // Add delete functionality
        entryDiv.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.deleteEntry(entry.id);
        });

        return entryDiv;
    }

    loadEntry(entry) {
        this.currentEntry = entry;
        this.isEditing = true;
        
        this.entryDate.value = entry.date;
        this.entryTitle.value = entry.title;
        this.entryContent.value = entry.content;
        this.moodSelect.value = entry.mood || '';
        this.updateWordCount();
        
        // Update active state
        document.querySelectorAll('.entry-item').forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        this.entryTitle.focus();
    }

    deleteEntry(entryId) {
        if (confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
            this.entries = this.entries.filter(entry => entry.id !== entryId);
            this.saveToLocalStorage();
            this.loadEntries();
            
            if (this.currentEntry && this.currentEntry.id === entryId) {
                this.clearEditor();
            }
            
            this.showToast('Entry deleted successfully!', 'success');
        }
    }

    filterEntries() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const entryItems = this.entriesList.querySelectorAll('.entry-item');
        
        entryItems.forEach(item => {
            const title = item.querySelector('.entry-title').textContent.toLowerCase();
            const preview = item.querySelector('.entry-preview').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || preview.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    saveToLocalStorage() {
        AuthManager.saveUserEntries(this.currentUser.id, this.entries);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 
                    type === 'error' ? 'fas fa-exclamation-circle' : 
                    'fas fa-info-circle';
        
        toast.innerHTML = `
            <div class="toast-content">
                <i class="${icon}"></i>
                <span>${message}</span>
            </div>
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveEntry();
        }
        
        // Ctrl/Cmd + N for new entry
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.createNewEntry();
        }
        
        // Escape to clear
        if (e.key === 'Escape') {
            this.clearEditor();
        }
    }

    // Export functionality
    exportEntries() {
        const dataStr = JSON.stringify(this.entries, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `diary-entries-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Entries exported successfully!', 'success');
    }

    // Import functionality
    importEntries(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedEntries = JSON.parse(e.target.result);
                if (Array.isArray(importedEntries)) {
                    this.entries = [...this.entries, ...importedEntries];
                    this.saveToLocalStorage();
                    this.loadEntries();
                    this.showToast('Entries imported successfully!', 'success');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                this.showToast('Error importing entries. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated
    if (!AuthManager.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    const diaryApp = new DiaryApp();
    
    // Make app globally accessible for debugging
    window.diaryApp = diaryApp;
});

// Add CSS for user info and empty state
const style = document.createElement('style');
style.textContent = `
    .user-info {
        margin-left: 1rem;
        font-size: 0.9rem;
        color: #666;
        font-weight: 500;
    }
    
    .user-name {
        color: #667eea;
    }
    
    .empty-state {
        text-align: center;
        padding: 2rem;
        color: #666;
    }
    
    .empty-state i {
        font-size: 3rem;
        color: #ccc;
        margin-bottom: 1rem;
    }
    
    .empty-state p {
        font-size: 0.9rem;
        line-height: 1.5;
    }
`;
document.head.appendChild(style);

// Add some additional utility functions
const DiaryUtils = {
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    getMoodEmoji(mood) {
        const moodMap = {
            '😊': 'Happy',
            '😔': 'Sad',
            '😡': 'Angry',
            '😌': 'Calm',
            '🤔': 'Thoughtful',
            '😴': 'Tired',
            '😃': 'Excited',
            '😢': 'Emotional'
        };
        return moodMap[mood] || 'Unknown';
    },
    
    generateEntryStats(entries) {
        const totalEntries = entries.length;
        const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
        const averageWords = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;
        
        const moodCounts = {};
        entries.forEach(entry => {
            if (entry.mood) {
                moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
            }
        });
        
        const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
            moodCounts[a] > moodCounts[b] ? a : b, null);
        
        return {
            totalEntries,
            totalWords,
            averageWords,
            mostCommonMood
        };
    }
}; 