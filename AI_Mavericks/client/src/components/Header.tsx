import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

export default function Header() {
  const { currentLanguage, setLanguage } = useLanguage();

  const handleLanguageChange = (language: string) => {
    setLanguage(language);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-seedling text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {getTranslation("FarmPrice", currentLanguage)}
              </h1>
              <p className="text-xs text-gray-500">
                {getTranslation("Intelligence Portal", currentLanguage)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={currentLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger 
                className="w-32 bg-gray-100 border-gray-300" 
                data-testid="language-selector"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{getTranslation("English", currentLanguage)}</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="bn">বাংলা</SelectItem>
                <SelectItem value="te">తెలుగు</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <i className="fas fa-map-marker-alt text-primary"></i>
              <span data-testid="user-location">Bangalore, Karnataka</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
