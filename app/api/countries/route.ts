import { NextResponse } from 'next/server'
import countriesList from '@/data/countries.json'

// Cache the processed data at module level
const countriesData = countriesList.map(country => ({
  countryId: country.countryId,
  alpha2Code: country.alpha2Code,
  name: country.name,
  googleId: country.googleId
}))

const languagesData = (() => {
  const uniqueLanguages = countriesList.reduce((acc, country) => {
    if (!acc.some(lang => lang.code === country.alpha2Code)) {
      acc.push({
        code: country.alpha2Code,
        name: country.name
      })
    }
    return acc
  }, [{ code: "all", name: "All Languages" }])
  
  return [
    uniqueLanguages[0], // "All Languages"
    ...uniqueLanguages.slice(1).sort((a, b) => a.name.localeCompare(b.name))
  ]
})()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'countries' or 'languages'
  const search = searchParams.get('search') || ''
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    let data: any[] = []
    
    if (type === 'countries') {
      data = countriesData
    } else if (type === 'languages') {
      data = languagesData
    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

    // Filter by search term if provided
    if (search && search.trim() !== '') {
      const searchTerm = search.toLowerCase().trim()
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        (item.alpha2Code && item.alpha2Code.toLowerCase().includes(searchTerm))
      )
    }

    // Apply pagination
    const total = data.length
    const paginatedData = data.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedData,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Countries API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}