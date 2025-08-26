import { PrismaClient } from '@prisma/client'
import { getAllExercises } from '../src/data/exercises'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  const allExercises = getAllExercises()
  for (const exercise of allExercises) {
    const {
      id,
      name,
      icon,
      description,
      category,
      difficulty,
      isPremium,
      duration,
      instructions,
      benefits,
      muscles,
      equipment,
      level,
      calories,
    } = exercise

    // On utilise `upsert` pour éviter les doublons si le script est lancé plusieurs fois
    // et pour faciliter les mises à jour. L'ID du fichier statique devient notre clé.
    await prisma.exerciseTemplate.upsert({
      where: { name: name }, // Utiliser un champ unique pour la recherche
      update: {}, // Pas de mise à jour si l'exercice existe déjà
      create: {
        name,
        emoji: icon,
        description,
        category,
        difficulty,
        targetArea: muscles.join(', '),
        isPremium,
        duration,
        restDuration: 10,
        sets: 1,
        reps: duration,
        instructions,
        tips: benefits,
        benefits,
        muscles,
        equipment,
        basePoints: calories || 10,
      },
    })
    console.log(`Created/updated exercise: ${name}`)
  }

  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
