# Plain HTML, CSS & JavaScript - Elite Auto Services

This folder contains a **clean, simple version** of the Elite Auto Services website built with **vanilla HTML, CSS, and JavaScript** - **no frameworks, no dependencies!**

## 📁 Folder Structure

```
plain/
├── index.html          # Home page
├── about.html          # About page
├── vehicles.html       # Vehicles listing page
├── css/
│   └── styles.css      # All styling (fully commented)
├── js/
│   └── main.js         # All JavaScript (fully commented)
└── assets/
    └── images/         # All image files
```

## 🚀 How to Run

### Option 1: Using Python (recommended)
```bash
cd /home/majunko/Documents/projects/code_nextjs/plain
python -m http.server 8000
```
Then open: **http://localhost:8000**

### Option 2: Using Node.js serve
```bash
cd /home/majunko/Documents/projects/code_nextjs/plain
npx serve .
```

### Option 3: Using any local server
```bash
cd /home/majunko/Documents/projects/code_nextjs/plain
# Use your preferred local server (PHP, Ruby, etc.)
```

## 📝 Files Explained

### HTML Files
- **index.html** - Main landing page with hero section, services, and contact
- **about.html** - About company page with experience and reasons to choose
- **vehicles.html** - Vehicle inventory listing with cards

All HTML is:
- ✅ **Semantic** - Uses proper HTML5 tags (header, nav, main, section, footer)
- ✅ **Accessible** - Includes proper ARIA labels and semantic structure
- ✅ **Clean** - Easy to read and understand
- ✅ **Responsive** - Works on mobile, tablet, and desktop

### CSS (styles.css)
The stylesheet includes:
- **Reset & Global Styles** - Base styles for all elements
- **Layout Components** - Container, spacing, grid system
- **Navigation** - Sticky navbar with mobile menu
- **Buttons** - Primary and secondary button styles
- **Sections** - Hero, services, footer, etc.
- **Responsive Design** - Media queries for mobile (768px) and small phones (480px)

All CSS is:
- ✅ **Well-organized** - Grouped by sections with clear comments
- ✅ **Mobile-first** - Responsive design that works everywhere
- ✅ **No Preprocessor** - Pure vanilla CSS, easy to understand
- ✅ **Customizable** - Easy to modify colors, spacing, fonts

### JavaScript (main.js)
The JavaScript file includes:
- **Mobile Menu Toggle** - Opens/closes navigation on mobile
- **Smooth Scrolling** - Smooth anchor link navigation
- **Scroll Animations** - Elements animate in as you scroll
- **Lazy Loading** - Images load only when needed
- **Active Navigation Link** - Highlights current page
- **Utility Functions** - Helper functions for common tasks

All JavaScript is:
- ✅ **Vanilla** - Pure JavaScript, no libraries
- ✅ **Well-commented** - Every function has a description
- ✅ **Modular** - Organized into logical sections
- ✅ **Optional** - Works even with JavaScript disabled (progressive enhancement)

## 🎨 Customization Guide

### Change Colors
Edit `css/styles.css` and look for these variables:

```css
/* Primary brand color */
color: #1a73e8;  /* Change this to your color */

/* Primary button */
background-color: #1a73e8;

/* Hero gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Change Fonts
Edit the font-family in `css/styles.css`:

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Add New Pages
1. Create a new `.html` file (e.g., `contact.html`)
2. Copy the structure from `index.html`
3. Update the navigation links to include the new page
4. Add a link to the new page in all other HTML files

### Modify Content
Simply edit the text in the HTML files. All content is in plain text - no build process needed!

## 🔍 Key Features

### Responsive Design
- Mobile menu with hamburger button
- Flexible grid layouts
- Touch-friendly buttons and links
- Optimized for all screen sizes

### Performance
- No unnecessary dependencies
- Lazy loading for images
- Minimal CSS and JavaScript
- Fast page loads

### Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- High contrast colors

### Search Engine Friendly
- Proper meta tags
- Semantic HTML
- Fast load times
- Mobile responsive

## 📚 Learning Resources

### Understanding the Code

**HTML Structure:**
- `<header>` - Top navigation bar
- `<main>` - Main content area
- `<section>` - Content sections
- `<footer>` - Bottom information

**CSS Layout:**
- `.container` - Max-width container for content
- `.services-grid` - CSS Grid for responsive layouts
- Media queries `@media` - Responsive breakpoints

**JavaScript Concepts:**
- `addEventListener()` - Listening to user interactions
- `querySelector()` - Finding elements in the DOM
- `classList` - Managing CSS classes with JS
- `IntersectionObserver` - Detecting when elements enter viewport

## 🐛 Troubleshooting

### Images not loading?
Make sure you're running from the correct directory and the `assets/images/` folder has all the images.

### Styles not applying?
Check that `css/styles.css` path is correct in the HTML files.

### JavaScript not working?
Make sure `js/main.js` is linked in the HTML, and check the browser console for errors.

## 📄 License

This is a learning project. Feel free to use it for your own projects!

---

**Happy Learning!** 🚀

This is a perfect starting point for learning how web development works before diving into frameworks like React, Vue, or Next.js.
