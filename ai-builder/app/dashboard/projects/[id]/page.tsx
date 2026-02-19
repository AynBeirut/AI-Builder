"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AIChat } from "@/components/ai/ai-chat"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Sparkles, Eye, Code, Settings, Share2, Undo, Redo, Cloud, Server, RefreshCw, ExternalLink, Monitor, Tablet, Smartphone, Github, ChevronLeft, ChevronRight } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string | null
  files: Record<string, string>
  framework: string
}

export default function ProjectEditorPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [files, setFiles] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [initialPrompt, setInitialPrompt] = useState<string>("")
  const [screenSize, setScreenSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isChatVisible, setIsChatVisible] = useState(true)
  const [showHostingModal, setShowHostingModal] = useState<'cloud' | 'server' | null>(null)

  // Load project
  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`)
        if (!res.ok) throw new Error("Failed to load project")
        
        const data = await res.json()
        setProject(data)
        setFiles(data.files)
        
        // Check if this is a new project that needs initial AI generation
        // If the HTML doesn't contain the project name, it's still using the generic template
        const html = data.files?.['index.html'] || ''
        const isGenericTemplate = !html.includes(data.name) && 
                                   (html.includes('Welcome to My Website') || 
                                    html.includes('YourBrand') ||
                                    html.includes('Build Something Amazing'))
        
        if (isGenericTemplate) {
          const prompt = `Build a complete, professional website for "${data.name}".

${data.description ? `Requirements: ${data.description}` : ''}

Create a modern, responsive website with a professional header, navigation, hero section, content sections, and footer. Output the complete HTML code now.`
          
          setInitialPrompt(prompt)
        }
      } catch (error) {
        console.error("Error loading project:", error)
        alert("Failed to load project")
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [projectId, router])

  // Handle AI code updates
  const handleCodeGenerated = async (code: string, filename: string = "index.html") => {
    const updatedFiles = { ...files, [filename]: code }
    setFiles(updatedFiles)
    
    // Auto-save the generated code
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: updatedFiles }),
      })
    } catch (error) {
      console.error("Error saving:", error)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-white">Project not found</h2>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  // Generate preview HTML
  const getPreviewHtml = () => {
    const html = files["index.html"] || ""
    const css = files["style.css"] || ""
    const js = files["script.js"] || ""
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${css}</style>
        </head>
        <body>
          ${html.replace(/<html[^>]*>|<\/html>|<head[^>]*>.*?<\/head>|<body[^>]*>|<\/body>/gis, '')}
          <script>${js}</script>
        </body>
      </html>
    `
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Hosting Plans Modal */}
      {showHostingModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowHostingModal(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {showHostingModal === 'cloud' ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Cloud className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Cloud Hosting</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-1">$5<span className="text-lg text-gray-500">/month</span></p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-600 mb-4">
                    Perfect for small to medium websites. Fast, reliable, and easy to scale.
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-gray-900">What's included:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                        10 GB SSD Storage
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                        100 GB Bandwidth
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                        Free SSL Certificate
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                        99.9% Uptime Guarantee
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                        24/7 Support
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-900">🎉 Special Offer</p>
                    <p className="text-sm text-blue-700 mt-1">Get 2 months free when you pay annually!</p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => setShowHostingModal(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Choose Plan
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Server className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Server Hosting</h3>
                    <p className="text-3xl font-bold text-purple-600 mt-1">$10<span className="text-lg text-gray-500">/month</span></p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-600 mb-4">
                    Premium performance for high-traffic websites and applications. Maximum control and resources.
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-gray-900">What's included:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                        50 GB SSD Storage
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                        Unlimited Bandwidth
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                        Free SSL Certificate
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                        99.99% Uptime Guarantee
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                        Priority 24/7 Support
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                        Daily Backups
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                        CDN Integration
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-purple-900">🎉 Special Offer</p>
                    <p className="text-sm text-purple-700 mt-1">Get 3 months free when you pay annually!</p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => setShowHostingModal(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Choose Plan
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between py-2 bg-white border-b border-gray-200">
        {/* Left Section */}
        <div className="flex items-center gap-3 pl-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Button>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">
              {project.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-900">{project.name}</span>
          </div>
        </div>

        {/* Center Section - Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
          
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          
          {/* Screen Size Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
            <Button
              variant={screenSize === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setScreenSize('desktop')}
              className={`h-7 w-7 p-0 ${screenSize === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="Desktop View"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={screenSize === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setScreenSize('tablet')}
              className={`h-7 w-7 p-0 ${screenSize === 'tablet' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="Tablet View"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={screenSize === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setScreenSize('mobile')}
              className={`h-7 w-7 p-0 ${screenSize === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="Mobile View"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2"
            title="Refresh Preview"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm">Refresh</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2"
            title="View on Web"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm">View</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2"
          >
            <Code className="h-4 w-4" />
            <span className="text-sm">Code</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/projects/${projectId}/edit`)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2"
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">Settings</span>
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 pr-4">
          {/* Hosting Plans */}
          <div className="flex items-center gap-2 mr-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHostingModal('cloud')}
              className="gap-2 border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
              title="Cloud Hosting"
            >
              <Cloud className="h-4 w-4" />
              <span className="font-medium">Cloud</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHostingModal('server')}
              className="gap-2 border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100"
              title="Server Hosting"
            >
              <Server className="h-4 w-4" />
              <span className="font-medium">Server</span>
            </Button>
          </div>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 ml-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            title="Export to GitHub Repository"
          >
            <Github className="h-4 w-4" />
            <span>Export to GitHub</span>
          </Button>
          
          <Button
            size="sm"
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <span>Publish</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* AI Assistant Panel */}
        {isChatVisible && (
          <div className="w-[500px] border-r border-slate-800 bg-slate-900 flex flex-col relative">
            <div className="px-6 py-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatVisible(false)}
                  className="text-slate-400 hover:text-white hover:bg-slate-800 -mr-2"
                  title="Hide Chat"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-slate-400 mt-1">
              Describe what you want to add or change
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            <AIChat 
              projectId={projectId} 
              onCodeGenerated={handleCodeGenerated}
              initialMessage={initialPrompt}
            />
          </div>
        </div>
        )}

        {/* Show Chat Button (when hidden) */}
        {!isChatVisible && (
          <Button
            onClick={() => setIsChatVisible(true)}
            className="fixed left-4 bottom-4 gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg z-50"
            title="Show AI Assistant"
          >
            <ChevronRight className="h-5 w-5" />
            <Sparkles className="h-5 w-5" />
            <span>Show AI Assistant</span>
          </Button>
        )}

        {/* Preview Area */}
        <div className="flex-1 flex flex-col">
          <div className="py-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4">
            <h2 className="text-lg font-medium text-white">Live Preview</h2>
            <div className="text-sm text-slate-400">
              {screenSize === 'desktop' && '100% Width'}
              {screenSize === 'tablet' && '768px Width'}
              {screenSize === 'mobile' && '375px Width'}
            </div>
          </div>
          <div className={screenSize === 'desktop' ? 'flex-1 bg-white' : 'flex-1 flex items-center justify-center bg-slate-100'}>
            {screenSize === 'desktop' ? (
              <iframe
                srcDoc={getPreviewHtml()}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div 
                className={`overflow-hidden shadow-2xl rounded-lg bg-white transition-all duration-300 ${
                  screenSize === 'tablet' ? 'w-[768px] h-full' : 'w-[375px] h-full'
                }`}
              >
                <iframe
                  srcDoc={getPreviewHtml()}
                  className="w-full h-full border-0"
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
