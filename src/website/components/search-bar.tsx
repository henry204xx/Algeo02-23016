import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input 
        className="pl-10 bg-white" 
        placeholder="Search" 
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}

