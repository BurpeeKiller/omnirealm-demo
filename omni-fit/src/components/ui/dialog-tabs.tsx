import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  premium?: boolean;
}

interface DialogTabsProps {
  tabs: readonly Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPremium?: boolean;
  activeColor?: string;
}

export const DialogTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  isPremium = false,
  activeColor = "rose"
}: DialogTabsProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 px-2 py-2">
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isLocked = tab.premium && !isPremium;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => {
                if (!isLocked) {
                  onTabChange(tab.id);
                }
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg",
                "font-medium transition-all duration-200",
                isActive 
                  ? `bg-white dark:bg-gray-900 text-${activeColor}-600 dark:text-${activeColor}-400 shadow-sm` 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
                isLocked && 'opacity-60 cursor-not-allowed'
              )}
              whileTap={{ scale: 0.95 }}
              disabled={isLocked}
            >
              {Icon && (
                <Icon className={cn(
                  "w-5 h-5",
                  isActive && `text-${activeColor}-600`
                )} />
              )}
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};