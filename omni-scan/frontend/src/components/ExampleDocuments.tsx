import { FileText, User, Mail, Sparkles } from 'lucide-react'


interface ExampleDocumentsProps {
  onSelectExample: (file: File) => void
}

export function ExampleDocuments({ onSelectExample }: ExampleDocumentsProps) {
  const examples = [
    {
      id: 'invoice',
      title: 'Facture exemple',
      description: 'Facture avec montants et TVA',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
      path: '/examples/facture-exemple.txt'
    },
    {
      id: 'cv',
      title: 'CV exemple',
      description: 'CV développeur avec expériences',
      icon: User,
      color: 'bg-green-100 text-green-600',
      path: '/examples/cv-exemple.txt'
    },
    {
      id: 'email',
      title: 'Email exemple',
      description: 'Email professionnel avec actions',
      icon: Mail,
      color: 'bg-yellow-100 text-yellow-600',
      path: '/examples/email-exemple.txt'
    }
  ]

  const loadExample = async (example: typeof examples[0]) => {
    try {
      const response = await fetch(example.path)
      const text = await response.text()
      const file = new File([text], `${example.id}-exemple.txt`, { type: 'text/plain' })
      onSelectExample(file)
    } catch (error) {
      console.error('Erreur chargement exemple:', error)
    }
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-800">
          Essayez avec nos exemples
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {examples.map((example) => {
          const Icon = example.icon
          return (
            <button
              key={example.id}
              onClick={() => loadExample(example)}
              className="group relative overflow-hidden rounded-lg border-2 border-gray-200 p-4 text-left transition-all hover:border-blue-400 hover:shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-lg p-2 ${example.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                    {example.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {example.description}
                  </p>
                </div>
              </div>
              
              {/* Effet de hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )
        })}
      </div>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        Cliquez sur un exemple pour le tester instantanément
      </p>
    </div>
  )
}