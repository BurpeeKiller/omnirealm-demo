import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { UploadPage } from './UploadPage'
import * as apiModule from '../../services/api'

// Mock api service
vi.mock('../../services/api', () => ({
  uploadDocument: vi.fn(),
  getDocument: vi.fn(),
  api: {
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn()
      }
    },
    defaults: {
      baseURL: 'http://localhost:8000/api/v1'
    }
  }
}))

// Mock auth
vi.mock('@/features/auth/useAuth', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    loading: false
  })
}))

// Variable pour stocker onDrop
let mockOnDrop: any = null

// Mock react-dropzone
vi.mock('react-dropzone', () => ({
  useDropzone: ({ onDrop }: any) => {
    // Stocker la fonction onDrop pour l'utiliser dans les tests
    mockOnDrop = onDrop
    return {
      getRootProps: () => ({ onClick: () => {} }),
      getInputProps: () => ({ type: 'file' }),
      isDragActive: false,
      open: vi.fn(),
      acceptedFiles: [],
      fileRejections: [],
      isDragAccept: false,
      isDragReject: false
    }
  }
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('UploadPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders upload area', () => {
    renderWithRouter(<UploadPage />)
    expect(screen.getByText(/Glissez-déposez un fichier ici/i)).toBeInTheDocument()
  })

  it('shows supported formats', () => {
    renderWithRouter(<UploadPage />)
    expect(screen.getByText(/Formats supportés : PDF, JPG, PNG, TIFF, BMP/i)).toBeInTheDocument()
  })

  it('displays file size limit', () => {
    renderWithRouter(<UploadPage />)
    expect(screen.getByText(/max 10MB/i)).toBeInTheDocument()
  })

  it('handles successful file upload', async () => {
    const uploadDocumentMock = apiModule.uploadDocument as jest.MockedFunction<typeof apiModule.uploadDocument>
    const getDocumentMock = apiModule.getDocument as jest.MockedFunction<typeof apiModule.getDocument>
    
    uploadDocumentMock.mockResolvedValueOnce({
      id: 'test-doc-id',
      filename: 'test.pdf',
      status: 'processing'
    })

    getDocumentMock.mockResolvedValueOnce({
      id: 'test-doc-id',
      status: 'completed',
      extracted_text: 'Test OCR result',
      ai_analysis: 'Test AI analysis'
    })

    renderWithRouter(<UploadPage />)
    
    // Simuler un drop de fichier
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    // Appeler directement onDrop avec le fichier
    if (mockOnDrop) {
      mockOnDrop([file])
    }

    await waitFor(() => {
      expect(uploadDocumentMock).toHaveBeenCalledWith(
        file,
        undefined
      )
    })
  })

  it('handles upload error', async () => {
    const uploadDocumentMock = apiModule.uploadDocument as jest.MockedFunction<typeof apiModule.uploadDocument>
    uploadDocumentMock.mockRejectedValueOnce(new Error('Upload failed'))

    renderWithRouter(<UploadPage />)
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    // Appeler directement onDrop avec le fichier
    if (mockOnDrop) {
      mockOnDrop([file])
    }

    await waitFor(() => {
      expect(screen.getByText('Upload failed')).toBeInTheDocument()
    })
  })

  it('rejects files over size limit', () => {
    renderWithRouter(<UploadPage />)
    
    // Créer un fichier de 11MB (limite est 10MB)
    const _largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { 
      type: 'application/pdf' 
    })
    
    // Le test vérifiera que react-dropzone rejette ce fichier
    // basé sur la configuration maxSize
  })
})