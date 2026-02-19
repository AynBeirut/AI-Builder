"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    template: "blank",
    brandName: "",
    logo: "",
    images: [] as string[],
    mission: "",
    vision: "",
    aboutUs: "",
    phone: "",
    email: "",
    location: "",
    primaryColor: "#0056b3",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    numberOfPages: "1",
    pageNames: "",
  })

  const templates = {
    ecommerce: [
      { id: "online-store", name: "Online Store", icon: "🏪", description: "Full-featured online store with product catalog, shopping cart, and checkout" },
      { id: "fashion-store", name: "Fashion Store", icon: "👗", description: "Elegant fashion e-commerce with lookbook gallery and size guides" },
      { id: "electronics-shop", name: "Electronics Shop", icon: "📱", description: "Tech store with product comparisons, specifications, and reviews" },
      { id: "marketplace", name: "Marketplace", icon: "🌐", description: "Multi-vendor marketplace with seller profiles and commission system" },
      { id: "digital-products", name: "Digital Products", icon: "💾", description: "Sell digital downloads, courses, and software with instant delivery" },
      { id: "subscription-box", name: "Subscription Box", icon: "📦", description: "Recurring subscription service with membership tiers and plans" },
      { id: "grocery-store", name: "Grocery Store", icon: "🛒", description: "Online grocery with categories, fresh produce, and home delivery" },
      { id: "jewelry-shop", name: "Jewelry Shop", icon: "💍", description: "Luxury jewelry store with high-res galleries and custom orders" },
      { id: "bookstore", name: "Bookstore", icon: "📚", description: "Online bookstore with author pages, reviews, and recommendations" },
      { id: "furniture-store", name: "Furniture Store", icon: "🛋️", description: "Furniture e-commerce with 3D previews and room planners" },
      { id: "pet-store", name: "Pet Store", icon: "🐾", description: "Pet supplies shop with product categories and care guides" },
      { id: "toy-store", name: "Toy Store", icon: "🧸", description: "Children's toy shop with age categories and gift guides" },
    ],
    business: [
      { id: "restaurant", name: "Restaurant", icon: "🍽️", description: "Restaurant website with menu, online ordering, and reservations" },
      { id: "salon-spa", name: "Salon & Spa", icon: "💇", description: "Beauty salon with service booking, staff profiles, and gallery" },
      { id: "real-estate", name: "Real Estate", icon: "🏡", description: "Property listings with search filters, virtual tours, and agent contact" },
      { id: "gym-fitness", name: "Gym & Fitness", icon: "💪", description: "Fitness center with class schedules, membership plans, and trainers" },
      { id: "medical-clinic", name: "Medical Clinic", icon: "🏥", description: "Healthcare website with appointment booking and doctor profiles" },
      { id: "law-firm", name: "Law Firm", icon: "⚖️", description: "Professional law firm with practice areas, case studies, and consultation" },
      { id: "construction", name: "Construction Company", icon: "🏗️", description: "Construction and contracting with project portfolios, services, and quotes" },
      { id: "dental-clinic", name: "Dental Clinic", icon: "🦷", description: "Dental practice with services, team bios, and online booking" },
      { id: "auto-repair", name: "Auto Repair", icon: "🔧", description: "Auto service shop with maintenance schedules and repair quotes" },
      { id: "photography", name: "Photography Studio", icon: "📸", description: "Photographer portfolio with booking calendar and pricing packages" },
      { id: "accounting", name: "Accounting Firm", icon: "💼", description: "Professional accounting services with client portal and resources" },
      { id: "hotel", name: "Hotel & Resort", icon: "🏨", description: "Hotel booking with room listings, amenities, and reservations" },
      { id: "consulting", name: "Business Consulting", icon: "📊", description: "Consulting firm with expertise areas, case studies, and contact" },
      { id: "cleaning-service", name: "Cleaning Service", icon: "🧹", description: "Professional cleaning with service packages and online booking" },
      { id: "catering", name: "Catering Service", icon: "🍱", description: "Event catering with menu options, packages, and inquiry forms" },
      { id: "moving-company", name: "Moving Company", icon: "🚚", description: "Moving services with quotes calculator and service areas" },
    ],
    general: [
      { id: "landing-page", name: "Landing Page", icon: "📄", description: "Clean landing page with hero, features, and call-to-action" },
      { id: "portfolio", name: "Portfolio", icon: "🎨", description: "Creative portfolio with project gallery and about section" },
      { id: "blog", name: "Blog", icon: "📝", description: "Personal or company blog with articles, categories, and comments" },
      { id: "agency", name: "Digital Agency", icon: "🎯", description: "Creative agency with services, team, and portfolio" },
      { id: "saas", name: "SaaS Landing", icon: "☁️", description: "Software product landing page with pricing and features" },
      { id: "event", name: "Event", icon: "🎉", description: "Event website with schedule, speakers, and ticket registration" },
      { id: "nonprofit", name: "Non-Profit", icon: "❤️", description: "Charity organization with donation forms and impact stories" },
      { id: "education", name: "Online Learning", icon: "🎓", description: "Educational platform with courses, instructors, and enrollment" },
      { id: "podcast", name: "Podcast", icon: "🎙️", description: "Podcast website with episodes, player, and subscription options" },
      { id: "resume", name: "Resume/CV", icon: "📋", description: "Professional resume with experience, skills, and contact info" },
      { id: "wedding", name: "Wedding", icon: "💒", description: "Wedding website with RSVP, registry, and event details" },
      { id: "news", name: "News Portal", icon: "📰", description: "News website with articles, categories, and breaking news" },
      { id: "magazine", name: "Online Magazine", icon: "📖", description: "Digital magazine with featured articles and subscriptions" },
      { id: "community", name: "Community Forum", icon: "👥", description: "Community platform with discussions, members, and events" },
      { id: "directory", name: "Business Directory", icon: "📍", description: "Local business directory with listings and reviews" },
      { id: "coming-soon", name: "Coming Soon", icon: "⏰", description: "Launch page with countdown timer and email signup" },
    ],
  }

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`)
        if (!res.ok) throw new Error("Failed to load project")
        
        const data = await res.json()
        
        // Load existing project data into form
        setFormData({
          name: data.name || "",
          description: data.description || "",
          template: data.template || "blank",
          brandName: data.brandName || "",
          logo: data.logo || "",
          images: data.images || [],
          mission: data.mission || "",
          vision: data.vision || "",
          aboutUs: data.aboutUs || "",
          phone: data.phone || "",
          email: data.email || "",
          location: data.location || "",
          primaryColor: data.primaryColor || "#0056b3",
          facebook: data.facebook || "",
          twitter: data.twitter || "",
          linkedin: data.linkedin || "",
          instagram: data.instagram || "",
          numberOfPages: data.numberOfPages || "1",
          pageNames: data.pageNames || "",
        })

        // Detect category from template
        setSelectedTemplate(data.template || "")
        const allTemplates = [...templates.ecommerce, ...templates.business, ...templates.general]
        const templateObj = allTemplates.find(t => t.id === data.template)
        if (templateObj) {
          if (templates.ecommerce.find(t => t.id === data.template)) setSelectedCategory("ecommerce")
          else if (templates.business.find(t => t.id === data.template)) setSelectedCategory("business")
          else setSelectedCategory("general")
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const readers = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
    })
    
    Promise.all(readers).then(results => {
      setFormData({ ...formData, images: [...formData.images, ...results] })
    })
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setCurrentStep(3)
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setFormData({ ...formData, template: templateId })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to update project")

      alert("Project updated successfully!")
      router.push(`/dashboard/projects/${projectId}`)
    } catch (error) {
      console.error("Error updating project:", error)
      alert("Failed to update project. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push(`/dashboard/projects/${projectId}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Button>
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground mt-2">
            Update your project information, images, and template
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`flex items-center ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
            1
          </div>
          <span className="ml-2 font-medium">Info & Upload</span>
        </div>
        <div className={`w-16 h-1 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"}`}></div>
        <div className={`flex items-center ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
            2
          </div>
          <span className="ml-2 font-medium">Category</span>
        </div>
        <div className={`w-16 h-1 ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-300"}`}></div>
        <div className={`flex items-center ${currentStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
            3
          </div>
          <span className="ml-2 font-medium">Template</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Project Info & Uploads */}
        {currentStep === 1 && (
          <>
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Update your project name and description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    placeholder="My Awesome Website"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="A brief description of your project..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Brand Information */}
            <Card>
              <CardHeader>
                <CardTitle>Brand Information</CardTitle>
                <CardDescription>Update your brand and business information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input
                      id="brandName"
                      placeholder="Your Company Name"
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Brand Color *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        placeholder="#0056b3"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="logo">Brand Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="cursor-pointer"
                  />
                  {formData.logo && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={formData.logo}
                        alt="Logo preview"
                        className="h-20 w-auto border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logo: "" })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Images Upload */}
                <div className="space-y-2">
                  <Label htmlFor="images">Portfolio Images</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500">Upload multiple images for your portfolio or gallery</p>
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img}
                            alt={`Image ${index + 1}`}
                            className="h-20 w-20 object-cover border rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mission">Mission</Label>
                    <Textarea
                      id="mission"
                      placeholder="What is your company's mission?"
                      value={formData.mission}
                      onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vision">Vision</Label>
                    <Textarea
                      id="vision"
                      placeholder="What is your company's vision?"
                      value={formData.vision}
                      onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aboutUs">About Us</Label>
                    <Textarea
                      id="aboutUs"
                      placeholder="Tell us about your company, history, values, and what makes you unique..."
                      value={formData.aboutUs}
                      onChange={(e) => setFormData({ ...formData, aboutUs: e.target.value })}
                      rows={5}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Update contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Business Location</Label>
                  <Input
                    id="location"
                    placeholder="123 Main St, City, Country"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Update your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook URL</Label>
                    <Input
                      id="facebook"
                      placeholder="https://facebook.com/yourpage"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter URL</Label>
                    <Input
                      id="twitter"
                      placeholder="https://twitter.com/yourhandle"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/company/yourcompany"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram URL</Label>
                    <Input
                      id="instagram"
                      placeholder="https://instagram.com/yourhandle"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 1 Navigation */}
            <div className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push(`/dashboard/projects/${projectId}`)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                size="lg" 
                onClick={() => setCurrentStep(2)}
              >
                Continue to Category →
              </Button>
            </div>
          </>
        )}

        {/* Step 2: Category Selection */}
        {currentStep === 2 && (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Choose Your Business Category</CardTitle>
                    <CardDescription>Select the category that best fits your business</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(1)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    ✏️ Edit Info
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div
                    onClick={() => handleCategorySelect("ecommerce")}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedCategory === "ecommerce" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-5xl mb-4">🛒</div>
                    <h3 className="text-xl font-semibold mb-2">E-Commerce</h3>
                    <p className="text-gray-600 text-sm">
                      Online stores, marketplaces, and digital product sales
                    </p>
                  </div>

                  <div
                    onClick={() => handleCategorySelect("business")}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedCategory === "business" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-5xl mb-4">💼</div>
                    <h3 className="text-xl font-semibold mb-2">Business & Merchant</h3>
                    <p className="text-gray-600 text-sm">
                      Restaurants, salons, real estate, clinics, and services
                    </p>
                  </div>

                  <div
                    onClick={() => handleCategorySelect("general")}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedCategory === "general" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-5xl mb-4">🚀</div>
                    <h3 className="text-xl font-semibold mb-2">General</h3>
                    <p className="text-gray-600 text-sm">
                      Portfolios, blogs, agencies, and landing pages
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 Navigation */}
            <div className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setCurrentStep(1)}
              >
                ← Back to Info
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push(`/dashboard/projects/${projectId}`)}
              >
                Cancel
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Template Selection */}
        {currentStep === 3 && (
          <>
            {/* Project Summary Card */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {formData.logo && (
                    <img src={formData.logo} alt="Logo" className="h-12 w-12 object-contain rounded border" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{formData.name || "Your Project"}</h3>
                    <p className="text-sm text-gray-600">
                      {formData.brandName && `${formData.brandName} • `}
                      Category: <span className="font-medium capitalize">{selectedCategory}</span>
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                >
                  ✏️ Edit Details
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Choose Your Template & Theme</h2>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    Browse and select from our {selectedCategory} templates
                  </p>
                  {selectedCategory && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentStep(2)
                        setSelectedTemplate("")
                      }}
                    >
                      Change Category
                    </Button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="mb-6 border-b">
                <div className="flex space-x-6">
                  <button type="button" className="pb-3 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">
                    Popular
                  </button>
                  <button type="button" className="pb-3 text-gray-600 hover:text-gray-900 font-medium text-sm">
                    Latest
                  </button>
                  <button type="button" className="pb-3 text-gray-600 hover:text-gray-900 font-medium text-sm">
                    Featured
                  </button>
                </div>
              </div>

              {/* Templates Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {selectedCategory && templates[selectedCategory as keyof typeof templates]?.map((template, index) => {
                  const gradients = [
                    'from-blue-100 to-blue-200',
                    'from-purple-100 to-purple-200',
                    'from-green-100 to-green-200',
                    'from-orange-100 to-orange-200',
                    'from-pink-100 to-pink-200',
                    'from-teal-100 to-teal-200',
                  ]
                  return (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`group cursor-pointer transition-all duration-200 ${
                        selectedTemplate === template.id ? "scale-[1.02]" : "hover:scale-[1.02]"
                      }`}
                    >
                      {/* Preview Image */}
                      <div className={`relative rounded-lg overflow-hidden shadow-md border-2 ${
                        selectedTemplate === template.id ? "border-blue-600 shadow-blue-200" : "border-gray-200 group-hover:border-gray-300 group-hover:shadow-lg"
                      }`}>
                        <div className={`aspect-[4/3] bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center relative`}>
                          <div className="text-7xl opacity-80">{template.icon}</div>
                          
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-white px-4 py-2 rounded-full shadow-lg font-medium text-sm">
                                {selectedTemplate === template.id ? "✓ Selected" : "Click to Select"}
                              </div>
                            </div>
                          </div>

                          {selectedTemplate === template.id && (
                            <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span>SELECTED</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step 3 Navigation */}
            <div className="flex justify-between items-center gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setCurrentStep(2)}
                className="px-8"
              >
                ← Back to Categories
              </Button>
              <div className="flex items-center gap-3">
                {selectedTemplate && (
                  <span className="text-sm text-gray-600">
                    Template selected: <span className="font-semibold text-blue-600">
                      {Object.values(templates).flat().find(t => t.id === selectedTemplate)?.name}
                    </span>
                  </span>
                )}
                <Button 
                  type="submit" 
                  size="lg"
                  className="px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
