"use client";

import React, { useState } from 'react';

export type ProviderConfig = 'default' | 'bedrock';

interface ProviderSelectorProps {
  selectedProvider: ProviderConfig;
  onProviderChange: (provider: ProviderConfig) => void;
  className?: string;
  isLoading?: boolean;
}

const providerOptions = [
  { value: 'default' as ProviderConfig, label: 'Default'},
  { value: 'bedrock' as ProviderConfig, label: 'Bedrock'}
];

export default function ProviderSelector({ 
  selectedProvider, 
  onProviderChange, 
  className = "",
  isLoading = false
}: ProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = providerOptions.find(option => option.value === selectedProvider) || providerOptions[0];

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className={`relative w-full cursor-pointer rounded-md bg-gray-800 py-2 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-gray-700 hover:ring-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${isLoading ? 'opacity-75 pointer-events-none' : ''}`}
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        <span className="flex items-center">
          <span className="block truncate text-sm">
            <div className="font-medium">
              {isLoading ? 'Switching Provider...' : (selectedOption?.label || 'Default')}
            </div>
          </span>
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {providerOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-700 ${
                option.value === selectedProvider ? 'bg-gray-700 text-white' : 'text-gray-200'
              }`}
              onClick={() => {
                onProviderChange(option.value);
                setIsOpen(false);
              }}
            >
              <div className="flex flex-col">
                <span className={`block truncate font-medium ${
                  option.value === selectedProvider ? 'text-white' : 'text-gray-200'
                }`}>
                  {option.label}
                </span>
              </div>
              
              {option.value === selectedProvider && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Backdrop to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[5]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
