import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Search } from "lucide-react";
import { sortedCountryCodes, getDefaultCountryCode } from "@/utils/countryCodes";

export default function PhoneNumberInput({ 
  value, 
  onChange, 
  placeholder = "Enter phone number",
  label = "Phone Number",
  error,
  disabled = false 
}) {
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountryCode());
  const [searchQuery, setSearchQuery] = useState("");
  const [localInputValue, setLocalInputValue] = useState("");

  // Extract local number from full value for display
  const getLocalNumber = (fullNumber) => {
    if (!fullNumber) return "";
    const countryCodeDigits = selectedCountry.code.replace('+', '');
    if (fullNumber.startsWith('+')) {
      return fullNumber.substring(1).replace(countryCodeDigits, '');
    }
    return fullNumber.replace(countryCodeDigits, '');
  };

  // Update local input when value changes externally
  React.useEffect(() => {
    setLocalInputValue(getLocalNumber(value));
  }, [value, selectedCountry.code]);

  const handleCountryChange = (countryCode) => {
    const country = sortedCountryCodes.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      // Reformat the current number with new country code
      if (localInputValue) {
        const fullNumber = country.code + localInputValue;
        onChange(fullNumber);
      }
    }
  };

  const handlePhoneNumberChange = (inputValue) => {
    // Remove any non-digit characters
    const cleaned = inputValue.replace(/[^\d]/g, '');
    
    // Update local input value
    setLocalInputValue(cleaned);
    
    // If user enters a local number, add country code
    if (cleaned.length > 0) {
      const fullNumber = selectedCountry.code + cleaned;
      onChange(fullNumber);
    } else {
      onChange('');
    }
  };

  const filteredCountries = sortedCountryCodes
    .filter(country => 
      country.code && 
      country.code.trim() !== '' && 
      country.country && 
      country.country.trim() !== ''
    )
    .filter(country =>
      country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.includes(searchQuery)
    );

  return (
    <div className="space-y-2">
      <Label htmlFor="phone-number">{label}</Label>
      <div className="flex gap-2">
        {/* Country Code Dropdown */}
        <Select 
          value={selectedCountry.code} 
          onValueChange={handleCountryChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span>{selectedCountry.flag}</span>
                <span className="text-sm">{selectedCountry.code}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {filteredCountries
                .filter(country => country.code && country.code.trim() !== '')
                .map((country, index) => (
                  <SelectItem key={`${country.code}-${country.country}-${index}`} value={country.code}>
                    <div className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span className="text-sm">{country.code}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {country.country}
                      </span>
                    </div>
                  </SelectItem>
                ))}
            </div>
          </SelectContent>
        </Select>

        {/* Phone Number Input */}
        <div className="flex-1">
          <Input
            id="phone-number"
            type="tel"
            placeholder={placeholder}
            value={localInputValue}
            onChange={(e) => handlePhoneNumberChange(e.target.value)}
            disabled={disabled}
            className={error ? "border-red-500" : ""}
          />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      <p className="text-xs text-muted-foreground">
        Enter your phone number (e.g., 8320303515 for India - system will add +91 automatically)
      </p>
    </div>
  );
} 