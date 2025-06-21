# My Diary - Personal Diary Writing Website 
A beautiful, modern, and feature-rich diary writing application with user authentication built with HTML, CSS, and JavaScript. Write your thoughts, track your mood, and organize your personal reflections in a clean and intuitive interface.

## ✨ Features

### 🔐 User Authentication
- **Secure Login/Signup**: Beautiful authentication pages with form validation
- **User Management**: Each user has their own private diary space
- **Password Security**: Password strength indicator and secure hashing
- **Remember Me**: Stay logged in across browser sessions
- **Social Login Ready**: Framework for Google and Facebook authentication

### 📝 Writing & Editing
- **Rich Text Editor**: Clean, distraction-free writing experience
- **Auto-save**: Your entries are automatically saved as you type
- **Word Count**: Track the length of your entries
- **Date Picker**: Choose any date for your entries
- **Mood Tracking**: Select your mood with emoji indicators

### 🔍 Organization & Search
- **Entry List**: View all your entries in a sidebar
- **Search Functionality**: Quickly find entries by title or content
- **Entry Preview**: See a preview of each entry before opening
- **Active Entry Highlighting**: Current entry is clearly marked

### 💾 Data Management
- **User-Specific Storage**: Each user's entries are stored separately
- **Local Storage**: All data is saved in your browser
- **No Account Required**: Start writing immediately after signup
- **Privacy First**: Your data stays on your device
- **Sample Entries**: Helpful examples for first-time users

### 🎨 User Experience
- **Modern Design**: Beautiful gradient backgrounds and smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + S`: Save entry
  - `Ctrl/Cmd + N`: New entry
  - `Escape`: Clear editor
- **Toast Notifications**: Helpful feedback for all actions
- **Welcome Modal**: Guided introduction for new users

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required!

### Installation
1. Download or clone this repository
2. Open `login.html` in your web browser
3. Create an account or sign in with existing credentials
4. Start writing your first diary entry!

### Alternative: Live Server
If you have VS Code with the Live Server extension:
1. Right-click on `login.html`
2. Select "Open with Live Server"
3. The authentication page will open in your default browser

## 📖 How to Use

### Creating an Account
1. Open `signup.html` or click "Sign up" from the login page
2. Fill in your personal information (first name, last name, email)
3. Create a strong password (minimum 6 characters)
4. Accept the Terms of Service
5. Click "Create Account"
6. You'll be automatically logged in and redirected to your diary

### Signing In
1. Open `login.html`
2. Enter your email and password
3. Optionally check "Remember me" to stay logged in
4. Click "Sign In"
5. You'll be redirected to your personal diary

### Creating Your First Entry
1. Click the "New Entry" button or press `Ctrl/Cmd + N`
2. Enter a title for your entry (optional)
3. Write your thoughts in the main text area
4. Select your mood from the dropdown (optional)
5. Choose a date (defaults to today)
6. Your entry will auto-save as you type, or click "Save Entry"

### Managing Your Entries
- **View Entries**: Click on any entry in the sidebar to open it
- **Search**: Use the search box to find specific entries
- **Delete**: Right-click on an entry and confirm deletion
- **Edit**: Open an entry and make changes - it will auto-save

### Logging Out
- Click the "Logout" button in the header
- Confirm the logout action
- You'll be redirected to the login page

## 🎯 Features in Detail

### User Authentication
- **Email Validation**: Ensures valid email format
- **Password Strength**: Visual indicator of password strength
- **Duplicate Prevention**: Prevents multiple accounts with same email
- **Secure Storage**: Passwords are hashed before storage
- **Session Management**: Automatic login/logout handling

### Sample Users (for testing)
The app comes with two sample users for testing:
- **Email**: john@example.com | **Password**: password123
- **Email**: jane@example.com | **Password**: password123

### Mood Tracking
Track your emotional state with these mood options:
- 😊 Happy
- 😔 Sad
- 😡 Angry
- 😌 Calm
- 🤔 Thoughtful
- 😴 Tired
- 😃 Excited
- 😢 Emotional

### Auto-save
- Entries are automatically saved every 2 seconds while typing
- No need to worry about losing your work
- Manual save button available for immediate saving

### Search Functionality
- Search through entry titles and content
- Real-time filtering as you type
- Case-insensitive search

### Data Persistence
- All entries are stored per user in browser's local storage
- Data persists between browser sessions
- No internet connection required after initial load

## 🛠️ Technical Details

### Built With
- **HTML5**: Semantic markup and modern structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **Vanilla JavaScript**: No frameworks, pure ES6+ JavaScript
- **Font Awesome**: Beautiful icons throughout the interface
- **Google Fonts**: Inter font family for clean typography

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### File Structure
```
dairy0.1/
├── index.html          # Main diary application
├── login.html          # User login page
├── signup.html         # User registration page
├── styles.css          # Main application styling
├── auth-styles.css     # Authentication pages styling
├── script.js           # Diary application logic
├── auth.js             # Authentication system logic
└── README.md           # This file
```

## 🔧 Customization

### Changing Colors
The main color scheme uses a purple gradient. To customize:
1. Open `styles.css` and `auth-styles.css`
2. Find the gradient definitions (around line 8)
3. Modify the color values to your preference

### Adding Features
The modular JavaScript structure makes it easy to add new features:
- Add new mood options in the HTML select element
- Extend the `DiaryApp` class with new methods
- Modify the `AuthManager` class for additional authentication features
- Modify the CSS for different styling

## 📱 Mobile Experience

The website is fully responsive and works great on mobile devices:
- Touch-friendly interface
- Optimized layout for small screens
- Sidebar collapses appropriately
- All functionality preserved
- Authentication forms work perfectly on mobile

## 🔒 Privacy & Security

- **Local Storage**: All data is stored locally in your browser
- **User Isolation**: Each user's data is completely separate
- **No Server**: No data is sent to external servers
- **No Tracking**: No analytics or tracking scripts
- **Offline Capable**: Works without internet connection
- **Password Hashing**: Passwords are hashed before storage

## 🤝 Contributing

Feel free to contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check that you're using a modern browser
2. Ensure JavaScript is enabled
3. Try clearing your browser cache
4. Check the browser console for any error messages
5. Make sure you're logged in before accessing the diary

## 🎉 Enjoy Writing!

Start your journey of self-reflection and personal growth with this beautiful diary application. Create your account, write freely, track your mood, and create a meaningful record of your thoughts and experiences.

---

*Built with ❤️ for personal reflection and growth* 