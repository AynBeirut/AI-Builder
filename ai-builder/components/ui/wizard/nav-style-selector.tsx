"use client"

import { NAV_STYLE_OPTIONS } from "@/lib/wizard-config"

interface NavStyleSelectorProps {
  selectedNavType: string
  onChange: (navType: string) => void
}

export function NavStyleSelector({ selectedNavType, onChange }: NavStyleSelectorProps) {
  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="text-base font-bold text-gray-900 mb-1">🧭 Navigation Style</h3>
      <p className="text-sm text-gray-500 mb-3">How visitors navigate between sections of your site</p>
      <div className="flex flex-wrap gap-2">
        {NAV_STYLE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            title={option.desc}
            className={`px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-1.5 ${
              selectedNavType === option.id
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-gray-200 text-gray-600 hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
