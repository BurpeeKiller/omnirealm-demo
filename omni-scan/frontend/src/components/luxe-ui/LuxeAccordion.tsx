import React from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { cn } from '@/lib/utils';

export const LuxeAccordion = RadixAccordion.Root;

type AccordionItemProps = React.ComponentProps<typeof RadixAccordion.Item>;

export function LuxeAccordionItem({
  children,
  value,
  className,
  ...props
}: AccordionItemProps) {
  return (
    <RadixAccordion.Item
      value={value}
      className={cn(
        'mt-px w-full overflow-hidden border-b border-gray-200 last:border-none focus-within:relative focus-within:z-10',
        className,
      )}
      {...props}
    >
      {children}
    </RadixAccordion.Item>
  );
}

type AccordionTriggerProps = React.ComponentProps<typeof RadixAccordion.Trigger>;

export function LuxeAccordionTrigger({
  children,
  className,
  ...props
}: AccordionTriggerProps) {
  return (
    <RadixAccordion.Header className="flex">
      <RadixAccordion.Trigger
        className={cn(
          'group flex h-11 w-full items-center justify-between px-3.5 text-base text-gray-900 outline-none',
          'transition-all duration-300 ease-out hover:bg-gray-50',
          '[&[data-state=open]>svg]:rotate-45',
          className,
        )}
        {...props}
      >
        {children}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          className="text-gray-500 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  );
}

type AccordionContentProps = React.ComponentProps<typeof RadixAccordion.Content>;

export function LuxeAccordionContent({
  children,
  className,
  ...props
}: AccordionContentProps) {
  return (
    <RadixAccordion.Content
      className={cn(
        'overflow-hidden text-sm',
        'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        className,
      )}
      {...props}
    >
      <div className="px-3.5 pb-3 pt-1 text-gray-600">
        {children}
      </div>
    </RadixAccordion.Content>
  );
}