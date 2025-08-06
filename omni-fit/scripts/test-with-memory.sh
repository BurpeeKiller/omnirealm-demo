#!/bin/bash

echo "🧪 Running tests with increased memory..."

# Augmenter la limite de mémoire à 4GB
export NODE_OPTIONS="--max-old-space-size=4096"

# Lancer les tests
pnpm vitest "$@"