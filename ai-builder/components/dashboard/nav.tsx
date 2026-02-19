"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { User } from "next-auth"
import Link from "next/link"
import { Coins, LogOut, Settings } from "lucide-react"

interface DashboardNavProps {
  user: User & { credits?: number }
}

export function DashboardNav({ user }: DashboardNavProps) {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="text-xl font-bold">
            AI Builder
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/dashboard" className="text-sm hover:text-primary">
              Projects
            </Link>
            <Link href="/dashboard/templates" className="text-sm hover:text-primary">
              Templates
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/dashboard/credits">
            <Button variant="outline" size="sm">
              <Coins className="mr-2 h-4 w-4" />
              {user.credits || 0} Credits
            </Button>
          </Link>
          
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
