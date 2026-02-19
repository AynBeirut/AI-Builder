'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles, Folder, FileCode, Play, Bot } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { AIChat } from '@/components/ai/ai-chat'

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-slate-400">Loading editor...</div>
})

const initialFiles = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Builder Demo</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Welcome to AI Builder Demo</h1>
  <p>Use the AI Assistant to generate code!</p>
  <script src="script.js"></script>
</body>
</html>`,
  'style.css': `body {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 100vh;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}`,
  'script.js': `console.log('AI Builder Demo Ready!');

// Add your JavaScript here`
}

const demoExamples = [
  "Create a hero section with a gradient background and a call-to-action button",
  "Build a pricing card with three tiers: Basic, Pro, and Enterprise",
  "Create a contact form with name, email, and message fields",
  "Design a navigation bar with logo and menu items",
  "Build a feature showcase section with icons and descriptions"
]

export default function DemoPage() {
  const [files, setFiles] = useState(initialFiles)
  const [currentFile, setCurrentFile] = useState('index.html')
  const [showAIChat, setShowAIChat] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [demoCredits, setDemoCredits] = useState(10)
  const [showCode, setShowCode] = useState(false)

  const handleEditorWillMount = (monaco: any) => {
    // Configure Monaco environment to use CDN for workers
    if (typeof window !== 'undefined') {
      (window as any).MonacoEnvironment = {
        getWorkerUrl: function (_moduleId: any, label: string) {
          if (label === 'json') {
            return '_next/static/vs/language/json/json.worker.js'
          }
          if (label === 'css' || label === 'scss' || label === 'less') {
            return '_next/static/vs/language/css/css.worker.js'
          }
          if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return '_next/static/vs/language/html/html.worker.js'
          }
          if (label === 'typescript' || label === 'javascript') {
            return '_next/static/vs/language/typescript/ts.worker.js'
          }
          return '_next/static/vs/editor/editor.worker.js'
        }
      }
    }
  }

  const handleCodeGenerated = (code: string) => {
    const updatedCode = files[currentFile] + '\n\n' + code
    setFiles(prev => ({
      ...prev,
      [currentFile]: updatedCode
    }))
    setPreviewKey(prev => prev + 1)
    setDemoCredits(prev => Math.max(0, prev - 1))
  }

  const generatePreviewHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${files['style.css'] || ''}</style>
        </head>
        <body>
          ${files['index.html']?.replace(/<link.*?>/g, '').replace(/<script.*?<\/script>/g, '') || ''}
          <script>${files['script.js'] || ''}</script>
        </body>
      </html>
    `
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="border-b border-slate-700 bg-slate-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Exit Demo
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span className="font-semibold">AI Builder Demo</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm bg-slate-700 px-3 py-1 rounded-full">
              Demo Credits: {demoCredits}
            </div>
            <Link href="/auth/signin">
              <Button size="sm">Sign Up for Full Access</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-57px)]">
        <div className="w-64 border-r border-slate-700 bg-slate-800 p-4">
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
            <Folder className="h-4 w-4" />
            <span>Files (Demo Mode)</span>
          </div>
          <div className="space-y-1">
            {Object.keys(files).map((filename) => (
              <button
                key={filename}
                onClick={() => setCurrentFile(filename)}
                className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors ${
                  currentFile === filename ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <FileCode className="h-4 w-4" />
                {filename}
              </button>
            ))}
          </div>

          <div className="mt-6 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-xs">
            <p className="text-blue-300 mb-2">💡 Demo Mode Features:</p>
            <ul className="text-slate-400 space-y-1">
              <li>✓ Full AI Code Generation</li>
              <li>✓ Live Preview</li>
              <li>✓ Code Editor</li>
              <li>✗ Project Saving</li>
              <li>✗ Deployment</li>
            </ul>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-800">
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant={!showCode ? "default" : "outline"}
                onClick={() => setShowCode(false)}
              >
                Preview
              </Button>
              <Button 
                size="sm" 
                variant={showCode ? "default" : "outline"}
                onClick={() => setShowCode(true)}
              >
                Code
              </Button>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowAIChat(!showAIChat)}>
              <Bot className="mr-2 h-4 w-4" />
              {showAIChat ? 'Hide' : 'Show'} AI Assistant
            </Button>
          </div>

          <div className="flex-1 flex">
            {showCode ? (
              <div className={showAIChat ? 'flex-1' : 'w-full'}>
                <Editor
                  height="100%"
                  defaultLanguage={
                    currentFile.endsWith('.html') ? 'html' :
                    currentFile.endsWith('.css') ? 'css' : 'javascript'
                  }
                  defaultValue={files[currentFile]}
                  value={files[currentFile]}
                  onChange={(value) => {
                    setFiles(prev => ({
                      ...prev,
                      [currentFile]: value || ''
                    }))
                    setPreviewKey(prev => prev + 1)
                  }}
                  theme="vs-dark"
                  beforeMount={handleEditorWillMount}
                  onMount={(editor) => {
                    console.log('Monaco Editor mounted successfully')
                    editor.focus()
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    tabSize: 2,
                  }}
                />
              </div>
            ) : (
              <div className={showAIChat ? 'flex-1' : 'w-full'}>
                <iframe
                  key={previewKey}
                  srcDoc={generatePreviewHTML()}
                  className="w-full h-full bg-white"
                  title="Preview"
                  sandbox="allow-scripts"
                />
              </div>
            )}

            {showAIChat && (
              <div className="w-96 border-l border-slate-700 bg-slate-800 flex flex-col">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-400" />
                    AI Assistant
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {demoCredits > 0 ? 'Ask AI to generate code for you' : 'Demo credits exhausted'}
                  </p>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <div className="space-y-3 mb-4">
                    <p className="text-sm text-slate-400">Try these prompts:</p>
                    {demoExamples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const textarea = document.querySelector('textarea') as HTMLTextAreaElement
                          if (textarea) textarea.value = example
                        }}
                        className="w-full text-left p-3 text-xs bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
                {demoCredits > 0 ? (
                  <AIChat onCodeGenerated={handleCodeGenerated} projectId="demo" />
                ) : (
                  <div className="p-4 bg-slate-700 text-center">
                    <p className="text-sm text-slate-300 mb-3">Demo credits used up!</p>
                    <Link href="/auth/signin">
                      <Button size="sm" className="w-full">Sign Up for Unlimited Access</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
