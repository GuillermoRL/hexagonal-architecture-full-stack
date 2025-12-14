import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (query: string) => void;
}

export const SearchBar = ({ query, isLoading, onQueryChange }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(query);

  // Sync input with URL query when it changes externally
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleSearch = () => {
    onQueryChange(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="flex gap-3">
        <Input
          type="text"
          placeholder="Buscar productos..."
          className="h-12 flex-1 text-base"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <Button
          size="lg"
          className="h-12"
          onClick={handleSearch}
          disabled={isLoading}
        >
          <Search className="mr-2 size-5" />
          {isLoading ? "Buscando..." : "Buscar"}
        </Button>
      </CardContent>
    </Card>
  );
};
