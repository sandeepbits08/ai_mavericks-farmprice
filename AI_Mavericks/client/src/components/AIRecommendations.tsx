import type { AIRecommendation } from "@shared/schema";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
}

export default function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  const { currentLanguage } = useLanguage();

  if (!recommendations.length) {
    return (
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <i className="fas fa-lightbulb text-accent mr-2"></i>
          {getTranslation("AI Recommendations", currentLanguage)}
        </h3>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-center text-gray-500">
            <i className="fas fa-robot text-4xl mb-4 text-gray-300"></i>
            <p>No recommendations available at the moment.</p>
            <p className="text-sm mt-2">Check back later for AI-powered selling advice.</p>
          </div>
        </div>
      </section>
    );
  }

  const primaryRecommendation = recommendations[0];

  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <i className="fas fa-lightbulb text-accent mr-2"></i>
        {getTranslation("AI Recommendations", currentLanguage)}
      </h3>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fas fa-robot text-purple-600"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-2">{getTranslation("Optimal Selling Recommendation", currentLanguage)}</h4>
            <div className="space-y-3">
              <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-success">{getTranslation("Recommended Action", currentLanguage)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${
                    primaryRecommendation.confidence === 'high' ? 'bg-success' :
                    primaryRecommendation.confidence === 'medium' ? 'bg-warning' : 'bg-gray-500'
                  }`}>
                    {getTranslation(`${primaryRecommendation.confidence} Confidence`, currentLanguage)}
                  </span>
                </div>
                <p className="text-gray-700" data-testid="recommendation-text">
                  {primaryRecommendation.recommendation}
                </p>
              </div>
              
              {primaryRecommendation.alert && (
                <div className={`border rounded-lg p-4 ${
                  primaryRecommendation.alertType === 'warning' ? 'bg-warning/5 border-warning/20' :
                  primaryRecommendation.alertType === 'success' ? 'bg-success/5 border-success/20' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${
                      primaryRecommendation.alertType === 'warning' ? 'text-warning' :
                      primaryRecommendation.alertType === 'success' ? 'text-success' :
                      'text-blue-600'
                    }`}>
                      Market Alert
                    </span>
                    <i className={`fas fa-exclamation-triangle ${
                      primaryRecommendation.alertType === 'warning' ? 'text-warning' :
                      primaryRecommendation.alertType === 'success' ? 'text-success' :
                      'text-blue-600'
                    }`}></i>
                  </div>
                  <p className="text-gray-700" data-testid="alert-text">
                    {primaryRecommendation.alert}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <i className="fas fa-clock mr-1"></i>
                Last updated: <span data-testid="last-updated">
                  {new Date(primaryRecommendation.createdAt).toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
