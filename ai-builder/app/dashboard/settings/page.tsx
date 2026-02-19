import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 mb-8">
          Manage your account settings and preferences
        </p>

        {/* Profile Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue={session.user.name || ""}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={session.user.email || ""}
                disabled
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500">
                Email cannot be changed
              </p>
            </div>
            <Button disabled>Save Changes (Coming Soon)</Button>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Credits</CardTitle>
            <CardDescription>Your current credit balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{session.user.credits || 0}</p>
                <p className="text-sm text-gray-500">Available Credits</p>
              </div>
              <Button variant="outline">Purchase Credits</Button>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your AI provider API keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deepseek">DeepSeek API Key</Label>
              <Input
                id="deepseek"
                type="password"
                placeholder="sk-..."
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openai">OpenAI API Key</Label>
              <Input
                id="openai"
                type="password"
                placeholder="sk-..."
                disabled
              />
            </div>
            <p className="text-sm text-gray-500">
              Custom API keys coming soon. Currently using platform keys.
            </p>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates about your projects</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-500">Switch to dark theme</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" disabled>
              Delete Account (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
