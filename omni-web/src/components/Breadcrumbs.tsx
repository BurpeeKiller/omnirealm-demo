import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs = ({ items, className = '' }: BreadcrumbsProps) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6 ${className}`}>
      <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-50">
        Accueil
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="text-gray-400">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-900 dark:hover:text-gray-50">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-gray-50 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
