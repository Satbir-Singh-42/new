import { Link } from "wouter";
import { LucideIcon } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  link: string;
}

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {categories.map((category) => (
        <Link key={category.id} href={category.link}>
          <button className="text-center group">
            <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-2 mx-auto group-hover:scale-105 transition-transform`}>
              <category.icon className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-600 font-medium">{category.name}</p>
          </button>
        </Link>
      ))}
    </div>
  );
}
