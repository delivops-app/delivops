export default function AppLayout({ children }) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 px-4 sm:px-8 md:px-12 py-6">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    );
  }
  