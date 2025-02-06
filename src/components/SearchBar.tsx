import { useState } from "react"

export default function SearchBar() {
  const [query, setQuery] = useState<string | null>()

  return (
    <input
      className="bg-neutral-200 basis-full rounded-md items-center gap-2 flex-wrap text-neutral-600 p-2 min-w-0 overflow-hidden"
      placeholder="Search"
    />
  )
}