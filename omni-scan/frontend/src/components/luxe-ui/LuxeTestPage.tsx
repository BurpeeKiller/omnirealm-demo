import React from 'react';
import { LuxeButton } from './LuxeButton';
import { 
  LuxeAccordion, 
  LuxeAccordionItem, 
  LuxeAccordionTrigger, 
  LuxeAccordionContent 
} from './LuxeAccordion';

export function LuxeTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Luxe UI Components Test
          </h1>
          <p className="text-gray-600">
            Testing Luxe UI components integration with TailwindCSS v3
          </p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Buttons</h2>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <LuxeButton variant="default">Default Button</LuxeButton>
              <LuxeButton variant="outline">Outline Button</LuxeButton>
              <LuxeButton variant="success">Success Button</LuxeButton>
              <LuxeButton variant="destructive">Destructive Button</LuxeButton>
            </div>

            <div className="flex flex-wrap gap-4">
              <LuxeButton variant="default" size="sm">Small</LuxeButton>
              <LuxeButton variant="default" size="md">Medium</LuxeButton>
              <LuxeButton variant="default" size="lg">Large</LuxeButton>
            </div>

            <div className="flex flex-wrap gap-4">
              <LuxeButton variant="outline" disabled>Disabled</LuxeButton>
              <LuxeButton 
                variant="success" 
                onClick={() => alert('Clicked!')}
              >
                Interactive
              </LuxeButton>
            </div>
          </div>
        </section>

        {/* Accordion Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Accordion</h2>
          
          <div className="bg-white rounded-lg shadow-sm border">
            <LuxeAccordion 
              type="single" 
              collapsible 
              className="w-full"
            >
              <LuxeAccordionItem value="item-1">
                <LuxeAccordionTrigger>
                  What is Luxe UI?
                </LuxeAccordionTrigger>
                <LuxeAccordionContent>
                  Luxe UI is a collection of elegant and sophisticated UI components 
                  built with React, TailwindCSS, and Radix UI. It focuses on providing 
                  beautiful animations and interactions.
                </LuxeAccordionContent>
              </LuxeAccordionItem>

              <LuxeAccordionItem value="item-2">
                <LuxeAccordionTrigger>
                  How does it compare to our existing components?
                </LuxeAccordionTrigger>
                <LuxeAccordionContent>
                  Luxe UI components offer more sophisticated animations and visual 
                  effects compared to our current @omnirealm/ui components. They're 
                  designed with a focus on elegance and user experience.
                </LuxeAccordionContent>
              </LuxeAccordionItem>

              <LuxeAccordionItem value="item-3">
                <LuxeAccordionTrigger>
                  Integration with OmniScan
                </LuxeAccordionTrigger>
                <LuxeAccordionContent>
                  These components can be integrated into OmniScan to enhance the 
                  user interface, particularly for settings panels, upload interfaces, 
                  and document processing results display.
                </LuxeAccordionContent>
              </LuxeAccordionItem>
            </LuxeAccordion>
          </div>
        </section>

        {/* Live Demo Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Live Demo</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-4">Interactive Example</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <LuxeButton 
                  variant="default"
                  onClick={() => console.log('Processing document...')}
                >
                  Process Document
                </LuxeButton>
                <LuxeButton 
                  variant="outline"
                  onClick={() => console.log('Settings opened')}
                >
                  Settings
                </LuxeButton>
              </div>
              
              <p className="text-sm text-gray-600">
                Open browser console to see click events
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Visual Comparison
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-4 text-center">
                Luxe UI Buttons
              </h3>
              <div className="space-y-3">
                <LuxeButton variant="default" className="w-full">
                  Luxe Default
                </LuxeButton>
                <LuxeButton variant="success" className="w-full">
                  Luxe Success
                </LuxeButton>
                <LuxeButton variant="outline" className="w-full">
                  Luxe Outline
                </LuxeButton>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-4 text-center">
                Standard Buttons
              </h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Standard Default
                </button>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Standard Success
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  Standard Outline
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}