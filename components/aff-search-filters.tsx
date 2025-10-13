"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"

export function AffSearchFilters() {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Filters</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Network</Label>
          <Select>
            <SelectTrigger className="bg-transparent">
              <SelectValue placeholder="All networks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All networks</SelectItem>
              <SelectItem value="clickbank">ClickBank</SelectItem>
              <SelectItem value="maxbounty">MaxBounty</SelectItem>
              <SelectItem value="cj">CJ Affiliate</SelectItem>
              <SelectItem value="shareasale">ShareASale</SelectItem>
              <SelectItem value="impact">Impact</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Vertical</Label>
          <Select>
            <SelectTrigger className="bg-transparent">
              <SelectValue placeholder="All verticals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All verticals</SelectItem>
              <SelectItem value="health">Health & Fitness</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="ecom">E-commerce</SelectItem>
              <SelectItem value="software">Software/SaaS</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="dating">Dating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Payout Range</Label>
          <Select>
            <SelectTrigger className="bg-transparent">
              <SelectValue placeholder="Any payout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any payout</SelectItem>
              <SelectItem value="low">$1 - $50</SelectItem>
              <SelectItem value="medium">$50 - $200</SelectItem>
              <SelectItem value="high">$200 - $500</SelectItem>
              <SelectItem value="premium">$500+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Country</Label>
          <Select>
            <SelectTrigger className="bg-transparent">
              <SelectValue placeholder="All countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="global">Global</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Performance</Label>
          <Select>
            <SelectTrigger className="bg-transparent">
              <SelectValue placeholder="Any performance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any performance</SelectItem>
              <SelectItem value="high">High EPC &gt;$2</SelectItem>
              <SelectItem value="medium">Medium EPC $1-$2</SelectItem>
              <SelectItem value="low">Low EPC &lt;$1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" variant="secondary">
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
