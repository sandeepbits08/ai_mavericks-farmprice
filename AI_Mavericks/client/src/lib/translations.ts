// Translation service for Hindi language support

export interface Translations {
  [key: string]: string;
}

export const hindiTranslations: Translations = {
  // Header
  "FarmPrice": "फार्मप्राइस",
  "Intelligence Portal": "इंटेलिजेंस पोर्टल",
  "English": "अंग्रेजी",
  "हिंदी": "हिंदी",
  "বাংলা": "বাংলা",
  "తెలుగు": "తెలుగు",
  
  // Greetings
  "Good Morning": "सुप्रभात",
  "Good Afternoon": "नमस्कार",
  "Good Evening": "शुभ संध्या",
  
  // Welcome Section
  "Here's today's market intelligence for your crops": "यहाँ आज की आपकी फसलों के लिए बाजार की जानकारी है",
  "Today's Best Price": "आज का सबसे अच्छा भाव",
  "Price Trend": "भाव की प्रवृत्ति",
  
  // Quick Actions
  "Quick Actions": "त्वरित क्रियाएं",
  "Select Crop": "फसल चुनें",
  "Choose your produce": "अपनी उपज चुनें",
  "Compare Markets": "बाजारों की तुलना करें",
  "Find best prices": "सबसे अच्छे भाव खोजें",
  "Price Trends": "भाव की प्रवृत्ति",
  "Historical data": "ऐतिहासिक डेटा",
  "AI Insights": "एआई अंतर्दृष्टि",
  "Smart recommendations": "स्मार्ट सुझाव",
  
  // AI Recommendations
  "AI Recommendations": "एआई सुझाव",
  "Optimal Selling Recommendation": "इष्टतम बिक्री सुझाव",
  "Recommended Action": "सुझावित कार्य",
  "high Confidence": "उच्च विश्वास",
  "medium Confidence": "मध्यम विश्वास",
  "low Confidence": "कम विश्वास",
  "Market Alert": "बाजार चेतावनी",
  "Last updated": "अंतिम अपडेट",
  
  // Market Prices
  "Today's Market Prices": "आज के बाजार भाव",
  "Refresh": "नवीनीकरण",
  "Current Price": "वर्तमान भाव",
  "Min-Max": "न्यूनतम-अधिकतम",
  "Market": "बाजार",
  "Per": "प्रति",
  "quintal": "क्विंटल",
  "Rising": "बढ़ रहा",
  "Falling": "गिर रहा",
  "Stable": "स्थिर",
  
  // Price Trends Chart
  "Price Trends (Last 14 Days)": "भाव की प्रवृत्ति (पिछले 14 दिन)",
  "Current Market Price": "वर्तमान बाजार भाव",
  "Average Price": "औसत भाव",
  "Predicted Price": "अनुमानित भाव",
  
  // Crops
  "Wheat": "गेहूं",
  "Rice": "चावल",
  "Sugarcane": "गन्ना",
  "Cotton": "कपास",
  "Maize": "मक्का",
  "Cereals": "अनाज",
  "Cash Crops": "नकदी फसलें",
  
  // Markets Comparison
  "Nearby Markets Comparison": "नजदीकी बाजारों की तुलना",
  "Distance": "दूरी",
  "Wheat Price": "गेहूं का भाव",
  "Rice Price": "चावल का भाव",
  "Trend": "प्रवृत्ति",
  "Action": "कार्य",
  "View Details": "विवरण देखें",
  
  // Data Sources
  "Trusted Data Sources": "विश्वसनीय डेटा स्रोत",
  "All market price data is sourced directly from official government portals to ensure accuracy and reliability.": "सभी बाजार भाव डेटा सटीकता और विश्वसनीयता सुनिश्चित करने के लिए सीधे आधिकारिक सरकारी पोर्टल से लिया गया है।",
  "Data last synced": "डेटा अंतिम बार सिंक किया गया",
  
  // Mobile Navigation
  "Home": "होम",
  "Prices": "भाव",
  "Markets": "बाजार",
  "Insights": "अंतर्दृष्टि",
  "Profile": "प्रोफ़ाइल",
  
  // Common terms
  "N/A": "उपलब्ध नहीं",
  "km": "किमी",
  "APMC": "एपीएमसी",
  "All Markets": "सभी बाजार",
  
  // Messages
  "Feature Coming Soon": "फीचर जल्द आ रहा है",
  "Prices Updated": "भाव अपडेट किए गए",
  "Market prices have been refreshed successfully.": "बाजार के भाव सफलतापूर्वक ताज़ा किए गए हैं।",
  "Update Failed": "अपडेट असफल",
  "Unable to refresh prices. Please try again.": "भावों को ताज़ा करने में असमर्थ। कृपया पुनः प्रयास करें।"
};

export const getTranslation = (key: string, language: string = "en"): string => {
  if (language === "hi" && hindiTranslations[key]) {
    return hindiTranslations[key];
  }
  return key; // Return original key if no translation found or language is English
};

// Helper function to translate crop names
export const getCropName = (englishName: string, hindiName: string | null, language: string = "en"): string => {
  if (language === "hi" && hindiName) {
    return hindiName;
  }
  return getTranslation(englishName, language);
};

// Helper function to format numbers in Indian numbering system
export const formatIndianNumber = (num: number): string => {
  return num.toLocaleString('hi-IN');
};

// Helper function to get currency symbol based on language
export const getCurrencySymbol = (language: string = "en"): string => {
  return "₹"; // Rupee symbol is same for both languages
};