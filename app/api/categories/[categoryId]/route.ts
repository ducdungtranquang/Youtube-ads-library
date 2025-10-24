import { NextResponse } from 'next/server'
import categoriesData from '@/data/categories.json'

// Build flattened map at module level for quick lookup
const flattened: Record<number, { categoryId: number; name: string }> = {}

;(function buildFlattened() {
  const parents = categoriesData.data.categories || []
  
  function addToFlattened(category: any) {
    if (category.categoryId) {
      flattened[category.categoryId] = { 
        categoryId: category.categoryId, 
        name: category.name 
      }
    }
    
    // Recursively add children
    if (Array.isArray(category.children)) {
      category.children.forEach(addToFlattened)
    }
  }
  
  parents.forEach(addToFlattened)
  
  console.log(`Loaded ${Object.keys(flattened).length} categories`)
})()

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const id = parseInt(params.categoryId)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid category id' }, { status: 400 })
    }

    const cat = flattened[id]
    if (!cat) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: cat })
  } catch (err) {
    console.error('Category by id error', err)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}
