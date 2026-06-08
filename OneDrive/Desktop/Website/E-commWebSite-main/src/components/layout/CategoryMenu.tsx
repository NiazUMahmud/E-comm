import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { categories } from '../../data/mockData';

export default function CategoryMenu() {
  return (
    <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-4 z-50">
      <div className="grid grid-cols-1 gap-1">
        {categories.map((category) => {
          const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<any>;
          
          return (
            <div key={category.id} className="px-4 py-2 hover:bg-gray-50 group">
              <Link
                to={`/products?category=${category.slug}`}
                className="flex items-center space-x-3 text-sm"
              >
                <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">
                    {category.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.subcategories.slice(0, 2).map(sub => sub.name).join(', ')}
                    {category.subcategories.length > 2 && '...'}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}