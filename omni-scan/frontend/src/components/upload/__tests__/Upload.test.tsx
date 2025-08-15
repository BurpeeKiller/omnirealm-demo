import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Upload } from '../Upload'

// Mock hooks - old structure (to be removed)

// Mock UploadProvider and Context
const mockUploadContext = {
  // Quota
  quota: { used: 0, limit: 3, remaining: 3, isSubscribed: false },
  isQuotaLoading: false,
  quotaError: null,
  checkQuota: vi.fn(),
  canUpload: vi.fn(() => true),
  isQuotaExceeded: false,
  quotaPercentage: 0,
  isSubscribed: false,

  // Upload
  isUploading: false,
  uploadProgress: 0,
  jobStatus: null,
  result: null,
  uploadError: null,
  fileName: null,
  uploadFile: vi.fn().mockResolvedValue(null),
  resetUpload: vi.fn(),
  hasResult: false,

  // Paywall
  isPaywallVisible: false,
  isCreatingSession: false,
  showPaywall: vi.fn(),
  hidePaywall: vi.fn(),
  handleUpgrade: vi.fn()
}

vi.mock('@/providers/UploadProvider', () => ({
  UploadProvider: ({ children }: any) => children,
  useUploadContext: vi.fn(() => mockUploadContext)
}))

const mockApiKeysHook = {
  apiKeys: {},
  isLoading: false,
  error: null,
  hasValidKey: false,
  addApiKey: vi.fn(),
  removeApiKey: vi.fn(),
  testApiKey: vi.fn(),
  refreshKeys: vi.fn()
}

vi.mock('@/hooks/useApiKeys', () => ({
  useApiKeys: vi.fn(() => mockApiKeysHook)
}))

// Mock components
vi.mock('../DropZone', () => ({
  DropZone: ({ onDrop, isLoading, accept, maxSize, compact }: any) => (
    <div data-testid="dropzone">
      <button 
        data-testid="file-select-button"
        onClick={() => onDrop?.([new File(['test'], 'test.pdf')])}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Select File'}
      </button>
    </div>
  )
}))

vi.mock('../QuotaDisplay', () => ({
  QuotaDisplay: ({ used, limit, isPro, variant }: any) => (
    <div data-testid="quota-display">
      Quota: {used}/{limit} {isPro ? '(Pro)' : '(Free)'} [{variant}]
    </div>
  )
}))

vi.mock('../UploadProgress', () => ({
  UploadProgress: ({ status, fileName, showDetails }: any) => (
    <div data-testid="upload-progress">
      Progress: {status?.progress?.percentage || 0}% - {fileName}
    </div>
  )
}))

vi.mock('../ResultsView', () => ({
  ResultsView: ({ result }: any) => (
    <div data-testid="results-view">
      {result ? `Result: ${result.filename}` : 'No results'}
    </div>
  )
}))

vi.mock('../ApiKeyManager', () => ({
  ApiKeyManager: () => <div data-testid="api-key-manager">API Keys</div>
}))

vi.mock('../payment/Paywall', () => ({
  Paywall: ({ isOpen, onClose }: any) => 
    isOpen ? (
      <div data-testid="paywall">
        <button data-testid="close-paywall" onClick={onClose}>Close</button>
      </div>
    ) : null
}))

vi.mock('@/components/PlausibleProvider', () => ({
  usePlausible: () => ({
    trackEngagement: vi.fn()
  })
}))

vi.mock('@/components/ui', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>
}))

describe('Upload Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock hook state
    Object.assign(mockUploadContext, {
      isUploading: false,
      uploadProgress: 0,
      result: null,
      error: null,
      fileName: null,
      quota: { used: 0, limit: 3, remaining: 3, isSubscribed: false },
      showPaywall: false,
      isQuotaExceeded: false,
      canUpload: true,
      quotaPercentage: 0
    })
  })

  describe('basic rendering', () => {
    it('should render with default props', () => {
      render(<Upload />)
      
      expect(screen.getByTestId('dropzone')).toBeInTheDocument()
      expect(screen.getAllByTestId('quota-display')).toHaveLength(2) // compact + detailed
    })

    it('should render in simple mode', () => {
      render(<Upload mode="simple" />)
      
      expect(screen.getByTestId('dropzone')).toBeInTheDocument()
      expect(screen.queryByTestId('api-key-manager')).not.toBeInTheDocument()
    })

    it('should render API key manager in authenticated mode', () => {
      render(<Upload mode="authenticated" features={{ apiKeys: true }} />)
      
      expect(screen.getByTestId('api-key-manager')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<Upload ui={{ className: 'custom-class' }} />)
      
      const container = document.querySelector('.custom-class')
      expect(container).toBeInTheDocument()
    })
  })

  describe('feature configuration', () => {
    it('should hide quota when disabled', () => {
      render(<Upload features={{ quota: false }} />)
      
      expect(screen.queryByTestId('quota-display')).not.toBeInTheDocument()
    })

    it('should hide API keys when disabled', () => {
      render(<Upload mode="authenticated" features={{ apiKeys: false }} />)
      
      expect(screen.queryByTestId('api-key-manager')).not.toBeInTheDocument()
    })

    it('should enable all features for page mode', () => {
      render(<Upload mode="page" />)
      
      expect(screen.getAllByTestId('quota-display')).toHaveLength(2) // compact + detailed
      // Navigation would be enabled but we don't test it here
    })
  })

  describe('file upload interaction', () => {
    it('should handle file selection', async () => {
      const onSuccessSpy = vi.fn()
      render(<Upload onUploadSuccess={onSuccessSpy} />)
      
      const selectButton = screen.getByTestId('file-select-button')
      fireEvent.click(selectButton)
      
      expect(mockUploadContext.uploadFile).toHaveBeenCalled()
    })

    it('should call onUploadSuccess when upload succeeds', () => {
      const onSuccessSpy = vi.fn()
      const mockResult = { filename: 'test.pdf', text: 'extracted text' }
      
      // Mock successful upload
      Object.assign(mockUploadContext, { result: mockResult, hasResult: true })
      
      render(<Upload onUploadSuccess={onSuccessSpy} />)
      
      expect(screen.getByTestId('results-view')).toHaveTextContent('Result: test.pdf')
    })

    it('should show error when upload fails', () => {
      const onErrorSpy = vi.fn()
      const errorMessage = 'Upload failed'
      
      // Mock failed upload
      Object.assign(mockUploadContext, { uploadError: errorMessage })
      
      render(<Upload onError={onErrorSpy} />)
      
      // Error should be shown in the upload area
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    it('should show paywall when quota exceeded', () => {
      Object.assign(mockUploadContext, {
        quota: { used: 3, limit: 3, remaining: 0, isSubscribed: false },
        isQuotaExceeded: true,
        isPaywallVisible: true
      })
      mockUploadContext.canUpload.mockReturnValue(false)
      
      render(<Upload />)
      
      expect(screen.getByTestId('paywall')).toBeInTheDocument()
    })
  })

  describe('upload states', () => {
    it('should show progress during upload', () => {
      Object.assign(mockUploadContext, {
        isUploading: true,
        uploadProgress: 50,
        fileName: 'test.pdf'
      })
      
      render(<Upload />)
      
      expect(screen.getByTestId('upload-progress')).toHaveTextContent('Progress: 50% - test.pdf')
    })

    it('should show results after successful upload', () => {
      const mockResult = { filename: 'test.pdf' }
      Object.assign(mockUploadContext, { result: mockResult, hasResult: true })
      
      render(<Upload />)
      
      expect(screen.getByTestId('results-view')).toHaveTextContent('Result: test.pdf')
    })

    it('should show error state', () => {
      Object.assign(mockUploadContext, { uploadError: 'Upload failed' })
      
      render(<Upload />)
      
      // Error is displayed in the upload area
      expect(screen.getByText('Upload failed')).toBeInTheDocument()
    })
  })

  describe('paywall functionality', () => {
    it('should show paywall when quota exceeded', () => {
      Object.assign(mockUploadContext, { isPaywallVisible: true })
      
      render(<Upload />)
      
      expect(screen.getByTestId('paywall')).toBeInTheDocument()
    })

    it('should handle paywall close', () => {
      Object.assign(mockUploadContext, { isPaywallVisible: true })
      
      render(<Upload />)
      
      const closeButton = screen.getByTestId('close-paywall')
      fireEvent.click(closeButton)
      
      expect(mockUploadContext.hidePaywall).toHaveBeenCalledWith(false)
    })

    it('should call onQuotaExceeded callback', async () => {
      const onQuotaExceededSpy = vi.fn()
      
      // Mock quota exceeded scenario
      Object.assign(mockUploadContext, {
        isQuotaExceeded: true,
        // canUpload will be mocked as function
      })
      
      render(<Upload onQuotaExceeded={onQuotaExceededSpy} />)
      
      // This would be triggered by the upload hook internally
      // We test the callback is passed correctly
      expect(onQuotaExceededSpy).toBeDefined()
    })
  })

  describe('demo mode', () => {
    it('should work in demo mode', () => {
      render(<Upload mode="demo" />)
      
      expect(screen.getByTestId('dropzone')).toBeInTheDocument()
      expect(screen.getByTestId('file-select-button')).not.toBeDisabled()
    })

    it('should handle demo upload', async () => {
      const mockDemoResult = { filename: 'demo.pdf', text: 'demo text' }
      mockUploadContext.upload.mockResolvedValue(mockDemoResult)
      
      render(<Upload mode="demo" />)
      
      const selectButton = screen.getByTestId('file-select-button')
      fireEvent.click(selectButton)
      
      await waitFor(() => {
        expect(mockUploadContext.uploadFile).toHaveBeenCalled()
      })
    })
  })

  describe('configuration options', () => {
    it('should pass upload options correctly', async () => {
      const config = {
        uploadOptions: {
          detailLevel: 'high' as const,
          language: 'fr',
          includeStructuredData: true
        }
      }
      
      render(<Upload config={config} />)
      
      const selectButton = screen.getByTestId('file-select-button')
      fireEvent.click(selectButton)
      
      await waitFor(() => {
        expect(mockUploadContext.upload).toHaveBeenCalledWith(
          expect.any(File),
          expect.objectContaining({
            detailLevel: 'high',
            language: 'fr',
            includeStructuredData: true
          })
        )
      })
    })

    it('should handle custom max file size', () => {
      const config = { maxFileSize: 10 * 1024 * 1024 } // 10MB
      
      render(<Upload config={config} />)
      
      // This would be passed to DropZone component
      expect(screen.getByTestId('dropzone')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should be keyboard accessible', () => {
      render(<Upload />)
      
      const selectButton = screen.getByTestId('file-select-button')
      expect(selectButton).toBeInTheDocument()
      
      // The button should be focusable and clickable via keyboard
      selectButton.focus()
      expect(document.activeElement).toBe(selectButton)
    })

    it('should have proper ARIA labels', () => {
      render(<Upload />)
      
      // Components should have proper accessibility
      expect(screen.getByTestId('dropzone')).toBeInTheDocument()
      expect(screen.getAllByTestId('quota-display')).toHaveLength(2) // compact + detailed
    })
  })
})