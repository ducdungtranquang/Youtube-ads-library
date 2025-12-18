import { NextResponse } from 'next/server'
import countriesList from '@/data/countries.json'

// Cache the processed data at module level
const countriesData = countriesList.map(country => ({
  countryId: country.countryId,
  alpha2Code: country.alpha2Code,
  name: country.name,
  googleId: country.googleId
}))

export async function GET(
  request: Request,
  { params }: { params: Promise<{ countryId: string }> }
) {
  const { countryId } = await params;

  try {
    const id = parseInt(countryId)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid country ID' },
        { status: 400 }
      )
    }

    // Handle special case: countryId = 0 means "Worldwide"
    if (id === 0) {
      return NextResponse.json({
        success: true,
        data: {
          countryId: 0,
          alpha2Code: 'WW',
          name: 'Worldwide',
          googleId: 0
        }
      })
    }

    // Find country by countryId
    const country = countriesData.find(c => c.countryId === id)
    
    if (!country) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: country
    })
  } catch (error) {
    console.error('Country API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch country data' },
      { status: 500 }
    )
  }
}