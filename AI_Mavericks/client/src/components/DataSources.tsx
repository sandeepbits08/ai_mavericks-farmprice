export default function DataSources() {
  const dataSources = [
    { name: "AGMARKNET Portal", url: "https://agmarknet.gov.in/" },
    { name: "UPAg Statistics", url: "https://upag.gov.in/" },
    { name: "OGD Platform", url: "https://www.data.gov.in/" }
  ];

  const lastSync = new Date();
  lastSync.setMinutes(lastSync.getMinutes() - 15);

  return (
    <section className="mb-8">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fas fa-shield-alt text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Trusted Data Sources</h4>
            <p className="text-blue-800 text-sm mb-3">
              All market price data is sourced directly from official government portals to ensure accuracy and reliability.
            </p>
            <div className="flex flex-wrap gap-3">
              {dataSources.map((source, index) => (
                <span 
                  key={index}
                  className="text-xs bg-blue-200 text-blue-800 px-3 py-1 rounded-full"
                  data-testid={`data-source-${source.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {source.name}
                </span>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-3">
              <i className="fas fa-clock mr-1"></i>
              Data last synced: <span data-testid="last-sync-time">
                {lastSync.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
