import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Template files for different project types
const TEMPLATES = {
  blank: {
    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Welcome to My Website</h1>
    <script src="script.js"></script>
</body>
</html>`,
    "style.css": `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    padding: 20px;
}

h1 {
    color: #333;
}`,
    "script.js": `// Your JavaScript code here
console.log('Welcome to your new project!');`,
  },
  landing: {
    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">YourBrand</div>
            <button class="cta-button">Get Started</button>
        </nav>
    </header>
    
    <section class="hero">
        <h1>Build Something Amazing</h1>
        <p>Your journey starts here with powerful tools and AI assistance</p>
        <button class="cta-button primary">Start Building</button>
    </section>
    
    <section class="features">
        <div class="feature">
            <h3>🚀 Fast</h3>
            <p>Lightning-fast performance</p>
        </div>
        <div class="feature">
            <h3>💡 Smart</h3>
            <p>AI-powered assistance</p>
        </div>
        <div class="feature">
            <h3>🎨 Beautiful</h3>
            <p>Modern design</p>
        </div>
    </section>
    
    <script src="script.js"></script>
</body>
</html>`,
    "style.css": `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.logo {
    font-size: 24px;
    font-weight: bold;
    color: #4f46e5;
}

.hero {
    text-align: center;
    padding: 100px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.hero h1 {
    font-size: 48px;
    margin-bottom: 20px;
}

.hero p {
    font-size: 20px;
    margin-bottom: 30px;
    opacity: 0.9;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    padding: 80px 40px;
    max-width: 1200px;
    margin: 0 auto;
}

.feature {
    text-align: center;
    padding: 30px;
}

.feature h3 {
    font-size: 32px;
    margin-bottom: 10px;
}

.cta-button {
    padding: 12px 30px;
    border: 2px solid #4f46e5;
    background: white;
    color: #4f46e5;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.cta-button:hover {
    background: #4f46e5;
    color: white;
}

.cta-button.primary {
    background: #4f46e5;
    color: white;
}

.cta-button.primary:hover {
    background: #4338ca;
}`,
    "script.js": `document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', () => {
        alert('Button clicked! Add your action here.');
    });
});`,
  },
  portfolio: {
    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>John Doe</h1>
        <p>Web Developer & Designer</p>
    </header>
    
    <section class="about">
        <h2>About Me</h2>
        <p>I create beautiful, functional websites that help businesses grow.</p>
    </section>
    
    <section class="projects">
        <h2>My Projects</h2>
        <div class="project-grid">
            <div class="project-card">
                <h3>Project 1</h3>
                <p>E-commerce website built with modern technologies</p>
            </div>
            <div class="project-card">
                <h3>Project 2</h3>
                <p>Mobile app design and development</p>
            </div>
            <div class="project-card">
                <h3>Project 3</h3>
                <p>Brand identity and marketing materials</p>
            </div>
        </div>
    </section>
    
    <footer>
        <p>Get in touch: hello@example.com</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`,
    "style.css": `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

header {
    text-align: center;
    padding: 80px 20px;
    background: #f8f9fa;
}

header h1 {
    font-size: 48px;
    margin-bottom: 10px;
}

section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 20px;
}

h2 {
    font-size: 32px;
    margin-bottom: 30px;
    text-align: center;
}

.about p {
    text-align: center;
    font-size: 18px;
    max-width: 600px;
    margin: 0 auto;
}

.project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.project-card {
    padding: 30px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    transition: transform 0.3s, box-shadow 0.3s;
}

.project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.project-card h3 {
    margin-bottom: 10px;
    color: #4f46e5;
}

footer {
    text-align: center;
    padding: 40px 20px;
    background: #f8f9fa;
    margin-top: 60px;
}`,
    "script.js": `// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});`,
  },
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    // Get or create demo user if no session
    let userId = session?.user?.id
    if (!userId) {
      let demoUser = await prisma.user.findUnique({
        where: { email: 'demo@aibuilder.local' }
      })
      
      if (!demoUser) {
        demoUser = await prisma.user.create({
          data: {
            email: 'demo@aibuilder.local',
            name: 'Demo User',
          }
        })
      }
      userId = demoUser.id
    }

    const body = await request.json()
    const { name, description, template = "blank" } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Get template files
    const templateFiles = TEMPLATES[template as keyof typeof TEMPLATES] || TEMPLATES.blank

    // Create project
    const project = await prisma.project.create({
      data: {
        userId,
        name,
        description: description || null,
        files: JSON.stringify(templateFiles),
        framework: "html",
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
