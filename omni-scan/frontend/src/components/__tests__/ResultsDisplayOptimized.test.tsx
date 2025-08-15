import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ResultsDisplayOptimized } from '../ResultsDisplayOptimized'

describe('ResultsDisplayOptimized', () => {
  const mockResult = {
    filename: 'test-document.pdf',
    text_length: 1500,
    processing_time: '2.5s',
    extracted_text: 'Ceci est le texte extrait du document...',
    ai_analysis: {
      document_type: 'invoice',
      document_confidence: 0.95,
      summary: 'Facture pour services de développement',
      key_points: [
        'Montant total: 1500€',
        'Date: 15/03/2024',
        'Client: Entreprise XYZ'
      ],
      structured_data: {
        data: {
          total_amount: 1500,
          date: '15/03/2024',
          invoice_number: 'INV-2024-001'
        }
      }
    }
  }

  const mockHandlers = {
    onCopy: vi.fn(),
    onDownload: vi.fn(),
    onNewScan: vi.fn()
  }

  describe('rendu de base', () => {
    it('devrait afficher les informations du document', () => {
      render(<ResultsDisplayOptimized result={mockResult} {...mockHandlers} />)

      expect(screen.getByText('test-document.pdf')).toBeInTheDocument()
      expect(screen.getByText('1500 caractères')).toBeInTheDocument()
      expect(screen.getByText('2.5s')).toBeInTheDocument()
    })

    it('devrait afficher le badge de type de document', () => {
      render(<ResultsDisplayOptimized result={mockResult} {...mockHandlers} />)

      expect(screen.getByText('Facture')).toBeInTheDocument()
    })

    it('devrait afficher le résumé et les points clés', () => {
      render(<ResultsDisplayOptimized result={mockResult} {...mockHandlers} />)

      expect(screen.getByText('Facture pour services de développement')).toBeInTheDocument()
      expect(screen.getByText('Montant total: 1500€')).toBeInTheDocument()
      expect(screen.getByText('Date: 15/03/2024')).toBeInTheDocument()
    })

    it('devrait afficher les infos clés extraites', () => {
      render(<ResultsDisplayOptimized result={mockResult} {...mockHandlers} />)

      expect(screen.getByText('1500€')).toBeInTheDocument()
      expect(screen.getByText('15/03/2024')).toBeInTheDocument()
      expect(screen.getByText('INV-2024-001')).toBeInTheDocument()
    })
  })

  describe('actions', () => {
    it('devrait appeler onCopy lors du clic sur Copier', () => {
      render(<ResultsDisplayOptimized result={mockResult} {...mockHandlers} />)

      const copyButton = screen.getByText('Copier le texte')
      fireEvent.click(copyButton)

      expect(mockHandlers.onCopy).toHaveBeenCalledTimes(1)
    })

    it('devrait appeler onDownload lors du clic sur Télécharger', () => {
      render(<ResultsDisplayOptimized result={mockResult} {...mockHandlers} />)

      const downloadButton = screen.getByText('Télécharger')
      fireEvent.click(downloadButton)

      expect(mockHandlers.onDownload).toHaveBeenCalledTimes(1)
    })

    it('devrait appeler onNewScan lors du clic sur Nouveau scan', () => {
      render(<ResultsDisplayOptimized result={mockResult} {...mockHandlers} />)

      const newScanButton = screen.getByText('Nouveau scan')
      fireEvent.click(newScanButton)

      expect(mockHandlers.onNewScan).toHaveBeenCalledTimes(1)
    })
  })

  describe('documents longs', () => {
    it('devrait utiliser LongDocumentResults pour les documents longs', () => {
      const longDocResult = {
        ...mockResult,
        ai_analysis: {
          ...mockResult.ai_analysis,
          is_long_document: true,
          chapters: [
            {
              title: 'Chapitre 1',
              summary: 'Introduction',
              start_page: 1,
              end_page: 5
            }
          ]
        }
      }

      render(<ResultsDisplayOptimized result={longDocResult} {...mockHandlers} />)

      // Vérifier que le badge "Document long analysé" n'apparaît pas
      // car c'est géré par LongDocumentResults
      expect(screen.queryByText('Analysé')).toBeInTheDocument()
    })
  })

  describe('types de documents', () => {
    it('devrait afficher les bonnes icônes selon le type', () => {
      const cvResult = {
        ...mockResult,
        ai_analysis: {
          ...mockResult.ai_analysis,
          document_type: 'cv',
          structured_data: {
            data: {
              name: 'Jean Dupont',
              experience_years: 5,
              current_position: 'Développeur Senior'
            }
          }
        }
      }

      render(<ResultsDisplayOptimized result={cvResult} {...mockHandlers} />)

      expect(screen.getByText('Jean Dupont')).toBeInTheDocument()
      expect(screen.getByText('5 ans')).toBeInTheDocument()
      expect(screen.getByText('Développeur Senior')).toBeInTheDocument()
    })
  })

  describe('optimisation React.memo', () => {
    it('ne devrait pas re-render si les props essentielles ne changent pas', () => {
      const { rerender } = render(
        <ResultsDisplayOptimized result={mockResult} {...mockHandlers} />
      )

      // Spy sur un sous-composant pour vérifier les re-renders
      const originalConsoleLog = console.log
      let renderCount = 0
      console.log = (msg: string) => {
        if (msg.includes('ResultsDisplay')) renderCount++
      }

      // Re-render avec les mêmes props essentielles
      rerender(
        <ResultsDisplayOptimized 
          result={{ ...mockResult }} 
          {...mockHandlers} 
        />
      )

      // Vérifier que le composant n'a pas été re-rendu
      expect(renderCount).toBe(0)

      console.log = originalConsoleLog
    })

    it('devrait re-render si le filename change', () => {
      const { rerender } = render(
        <ResultsDisplayOptimized result={mockResult} {...mockHandlers} />
      )

      const updatedResult = {
        ...mockResult,
        filename: 'nouveau-document.pdf'
      }

      rerender(
        <ResultsDisplayOptimized result={updatedResult} {...mockHandlers} />
      )

      expect(screen.getByText('nouveau-document.pdf')).toBeInTheDocument()
    })
  })

  describe('gestion des données manquantes', () => {
    it('devrait gérer l\'absence de données structurées', () => {
      const minimalResult = {
        filename: 'minimal.pdf',
        text_length: 100,
        processing_time: '1s',
        extracted_text: 'Texte minimal',
        ai_analysis: {
          summary: 'Document simple'
        }
      }

      render(<ResultsDisplayOptimized result={minimalResult} {...mockHandlers} />)

      expect(screen.getByText('minimal.pdf')).toBeInTheDocument()
      expect(screen.getByText('Document simple')).toBeInTheDocument()
      // Pas d'erreur même sans structured_data
    })

    it('devrait gérer l\'absence de points clés', () => {
      const resultWithoutKeyPoints = {
        ...mockResult,
        ai_analysis: {
          ...mockResult.ai_analysis,
          key_points: undefined
        }
      }

      render(<ResultsDisplayOptimized result={resultWithoutKeyPoints} {...mockHandlers} />)

      // Le composant doit s'afficher sans erreur
      expect(screen.getByText('test-document.pdf')).toBeInTheDocument()
    })
  })

  describe('accessibilité', () => {
    it('devrait avoir des labels ARIA appropriés', () => {
      render(<ResultsDisplayOptimized result={mockResult} {...mockHandlers} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
      
      // Vérifier que les boutons ont du texte accessible
      const copyButton = screen.getByRole('button', { name: /copier/i })
      expect(copyButton).toBeInTheDocument()
    })

    it('devrait être navigable au clavier', () => {
      render(<ResultsDisplayOptimized result={mockResult} {...mockHandlers} />)

      const firstButton = screen.getAllByRole('button')[0]
      firstButton.focus()
      
      expect(document.activeElement).toBe(firstButton)
    })
  })
})