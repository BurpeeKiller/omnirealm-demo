import React, { useState, useCallback } from 'react';
import { Upload, FileStack, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface BatchFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  documentId?: string;
}

interface BatchUploadProps {
  isPremium?: boolean;
  onBatchComplete?: (results: any[]) => void;
}

export const BatchUpload: React.FC<BatchUploadProps> = ({ 
  isPremium = false,
  onBatchComplete 
}) => {
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [batchId, setBatchId] = useState<string | null>(null);

  const maxFiles = isPremium ? 50 : 10;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['pdf', 'jpg', 'jpeg', 'png', 'tiff', 'bmp'].includes(extension || '');
    });

    const remainingSlots = maxFiles - files.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    const newBatchFiles: BatchFile[] = filesToAdd.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newBatchFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadBatch = async () => {
    if (files.length === 0) return;

    setIsUploading(true);

    // Préparer les fichiers pour l'upload
    const formData = new FormData();
    files.forEach(({ file }) => {
      formData.append('files', file);
    });

    // Mettre à jour le statut des fichiers
    setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' })));

    try {
      const response = await api.post('/batch/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          setFiles(prev => prev.map(f => ({ 
            ...f, 
            progress: f.status === 'uploading' ? percentCompleted : f.progress 
          })));
        }
      });

      setBatchId(response.data.batch_id);

      // Mettre à jour les statuts avec les résultats
      const results = response.data.results;
      setFiles(prev => prev.map((file, index) => ({
        ...file,
        status: results[index].status === 'queued' ? 'processing' : 'error',
        documentId: results[index].document_id,
        error: results[index].error
      })));

      // Vérifier le statut périodiquement
      checkBatchStatus(response.data.batch_id);

    } catch (error) {
      console.error('Batch upload error:', error);
      setFiles(prev => prev.map(f => ({ 
        ...f, 
        status: 'error',
        error: 'Erreur lors de l\'upload'
      })));
    } finally {
      setIsUploading(false);
    }
  };

  const checkBatchStatus = async (batchId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/batch/${batchId}/status`);
        const { documents, progress_percentage } = response.data;

        // Mettre à jour les statuts
        setFiles(prev => prev.map(file => {
          const docStatus = documents.find((d: any) => d.document_id === file.documentId);
          if (docStatus && docStatus.status === 'completed') {
            return { ...file, status: 'completed', progress: 100 };
          }
          return file;
        }));

        // Si tous les documents sont traités, arrêter la vérification
        if (progress_percentage === 100) {
          clearInterval(interval);
          if (onBatchComplete) {
            onBatchComplete(documents);
          }
        }
      } catch (error) {
        console.error('Status check error:', error);
        clearInterval(interval);
      }
    }, 2000); // Vérifier toutes les 2 secondes
  };

  const getStatusIcon = (status: BatchFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (file: BatchFile) => {
    switch (file.status) {
      case 'pending':
        return 'En attente';
      case 'uploading':
        return `Upload ${file.progress}%`;
      case 'processing':
        return 'Traitement OCR...';
      case 'completed':
        return 'Terminé';
      case 'error':
        return file.error || 'Erreur';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Zone de drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.tiff,.bmp"
          onChange={handleFileSelect}
          className="hidden"
          id="batch-file-input"
        />
        
        <label htmlFor="batch-file-input" className="cursor-pointer">
          <FileStack className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Glissez vos fichiers ici
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            ou cliquez pour sélectionner jusqu'à {maxFiles} fichiers
          </p>
          <p className="text-xs text-gray-400">
            Formats acceptés : PDF, JPG, PNG, TIFF, BMP
          </p>
        </label>

        {!isPremium && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Compte gratuit :</strong> 10 fichiers maximum par batch.
              Passez à Pro pour traiter jusqu'à 50 fichiers !
            </p>
          </div>
        )}
      </div>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700">
              {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
            </h4>
            <button
              onClick={uploadBatch}
              disabled={isUploading || files.every(f => f.status === 'completed')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Lancer le traitement
                </>
              )}
            </button>
          </div>

          <div className="space-y-2">
            {files.map(file => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                {getStatusIcon(file.status)}
                
                <div className="flex-1">
                  <p className="font-medium text-gray-800 truncate">
                    {file.file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB • {getStatusText(file)}
                  </p>
                </div>

                {file.status === 'pending' && !isUploading && (
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}

                {(file.status === 'uploading' || file.status === 'processing') && (
                  <div className="w-24">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                        style={{ width: `${file.status === 'processing' ? 75 : file.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};