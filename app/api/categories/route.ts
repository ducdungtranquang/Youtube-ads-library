import { NextRequest, NextResponse } from 'next/server';
import categoriesData from '@/data/categories.json';

interface Category {
  categoryId: number;
  name: string;
  children?: any[];
}

interface CategoriesResponse {
  categories: Category[];
  total: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get categories from JSON data
    const parentCategories = categoriesData.data.categories;

    // Flatten categories to include both parent and children with hierarchy display
    const flattenedCategories: Category[] = [];
    
    // Add "All Categories" option at the beginning
    flattenedCategories.push({ categoryId: 0, name: 'All Categories' });

    // Process each parent category and its children
    parentCategories.forEach(parent => {
      // Add parent category
      flattenedCategories.push({
        categoryId: parent.categoryId,
        name: parent.name,
      });

      // Add children categories with indentation
      if (parent.children && parent.children.length > 0) {
        parent.children.forEach(child => {
          flattenedCategories.push({
            categoryId: child.categoryId,
            name: `  ↳ ${child.name}`, // Add visual hierarchy with indentation and arrow
          });
        });
      }
    });

    // Filter categories based on search
    let filteredCategories = flattenedCategories;
    if (search) {
      filteredCategories = flattenedCategories.filter(category =>
        category.name.toLowerCase().includes(search)
      );
    }

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

    const response: CategoriesResponse = {
      categories: paginatedCategories,
      total: filteredCategories.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}