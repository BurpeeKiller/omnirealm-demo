#!/usr/bin/env node

/**
 * Script de debug pour vérifier les variables d'environnement
 * Utile pour diagnostiquer les problèmes de build Docker
 */

console.log('=== DEBUG ENVIRONMENT VARIABLES ===')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('Build time:', new Date().toISOString())
console.log('')

console.log('=== NEXT_PUBLIC_* VARIABLES ===')
const nextPublicVars = Object.entries(process.env)
  .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
  .sort(([a], [b]) => a.localeCompare(b))

if (nextPublicVars.length === 0) {
  console.log('❌ NO NEXT_PUBLIC_* variables found!')
} else {
  nextPublicVars.forEach(([key, value]) => {
    // Masquer partiellement les valeurs sensibles
    const maskedValue = value 
      ? value.length > 10 
        ? value.substring(0, 10) + '...' + value.substring(value.length - 5)
        : value
      : '(undefined)'
    console.log(`✅ ${key}: ${maskedValue}`)
  })
}

console.log('')
console.log('=== OTHER IMPORTANT VARIABLES ===')
const otherVars = ['SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY', 'PORT', 'HOSTNAME']
otherVars.forEach(key => {
  const value = process.env[key]
  const status = value ? '✅' : '❌'
  const displayValue = value ? '(set)' : '(not set)'
  console.log(`${status} ${key}: ${displayValue}`)
})

console.log('')
console.log('=== END DEBUG ===')