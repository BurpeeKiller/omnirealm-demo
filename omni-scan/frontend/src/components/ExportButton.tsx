import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileCode, Loader2, Check } from 'lucide-react';
import { api } from '../services/api';


interface ExportButtonProps {
  documentId: string;
  filename: string;
  isPremium?: boolean;
}

type ExportFormat = 'pdf' | 'excel' | 'json';

interface FormatOption {
  format: ExportFormat;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  premium: boolean;
}

const formatOptions: FormatOption[] = [
  {
    format: 'pdf',
    label: 'PDF',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-red-600',
    description: 'Document professionnel avec mise en forme',
    premium: false
  },
  {
    format: 'excel',
    label: 'Excel',
    icon: <FileSpreadsheet className="w-5 h-5" />,
    color: 'text-green-600',
    description: 'Tableur pour analyse de données',
    premium: true
  },
  {
    format: 'json',
    label: 'JSON',
    icon: <FileCode className="w-5 h-5" />,
    color: 'text-blue-600',
    description: 'Format technique pour développeurs',
    premium: true
  }
];

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  documentId, 
  filename,
  isPremium = false 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [exportedFormat, setExportedFormat] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setShowMenu(false);
    
    try {
      const response = await api.get(`/export/${documentId}?format=${format}`, {
        responseType: 'blob'
      });
      
      // Créer un lien de téléchargement
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename.split('.')[0]}_export.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Afficher le succès
      setExportedFormat(format);
      setTimeout(() => setExportedFormat(null), 3000);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Export en cours...</span>
          </>
        ) : exportedFormat ? (
          <>
            <Check className="w-5 h-5 text-green-300" />
            <span>Exporté !</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Exporter</span>
          </>
        )}
      </button>
      
      {showMenu && !isExporting && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
          <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Choisir le format d'export</h3>
          </div>
          
          <div className="p-2">
            {formatOptions.map((option) => {
              const isLocked = option.premium && !isPremium;
              
              return (
                <button
                  key={option.format}
                  onClick={() => !isLocked && handleExport(option.format)}
                  disabled={isLocked}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isLocked 
                      ? 'bg-gray-50 cursor-not-allowed opacity-60' 
                      : 'hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  <div className={`${option.color} ${isLocked ? 'opacity-50' : ''}`}>
                    {option.icon}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {option.label}
                      </span>
                      {option.premium && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-semibold rounded-full">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {option.description}
                    </p>
                  </div>
                  
                  {isLocked && (
                    <div className="text-yellow-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          {!isPremium && (
            <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-t border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Passez à Pro</strong> pour débloquer tous les formats d'export !
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};