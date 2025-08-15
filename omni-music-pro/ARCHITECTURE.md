# 🏗️ Architecture OmniMusic Pro

## Vue d'ensemble

OmniMusic Pro suit les principes de l'**Architecture Hexagonale** (Clean Architecture), assurant une séparation claire des responsabilités et une haute testabilité.

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│                    (GUI, CLI, REST API)                     │
└─────────────────┬───────────────────────┬──────────────────┘
                  │                       │
                  ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│                      (Use Cases)                            │
└─────────────────┬───────────────────────┬──────────────────┘
                  │                       │
                  ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                           │
│              (Entities, Services, Ports)                    │
└─────────────────┬───────────────────────┬──────────────────┘
                  │                       │
                  ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                        │
│            (Adapters, External Services)                    │
└─────────────────────────────────────────────────────────────┘
```

## Couches

### 1. Domain Layer (Cœur métier)
- **Localisation** : `src/omni_music/domain/`
- **Responsabilité** : Logique métier pure
- **Contient** :
  - Entités (Track, Playlist, Album, Artist)
  - Value Objects (AudioFormat)
  - Interfaces de repositories (ports)
  - Services du domaine
  - Exceptions métier

### 2. Application Layer (Cas d'usage)
- **Localisation** : `src/omni_music/application/`
- **Responsabilité** : Orchestration des cas d'usage
- **Contient** :
  - Use Cases (DownloadTrack, CreatePlaylist, etc.)
  - DTOs de requête/réponse
  - Logique d'orchestration

### 3. Infrastructure Layer (Adaptateurs)
- **Localisation** : `src/omni_music/infrastructure/`
- **Responsabilité** : Implémentation des ports
- **Contient** :
  - Repositories concrets (SQLite, JSON)
  - Clients externes (YouTube, Deezer)
  - Services techniques (FFmpeg, etc.)

### 4. Presentation Layer (Interface)
- **Localisation** : `src/omni_music/presentation/`
- **Responsabilité** : Interface utilisateur
- **Contient** :
  - GUI (CustomTkinter)
  - CLI (optionnel)
  - REST API (futur)

## Principes appliqués

### 1. Dependency Inversion
- Les couches internes ne dépendent pas des couches externes
- Utilisation d'interfaces (ABC) pour l'inversion de dépendance

### 2. Single Responsibility
- Chaque classe a une seule raison de changer
- Séparation claire des responsabilités

### 3. Open/Closed
- Extensible via l'ajout de nouveaux adaptateurs
- Pas de modification du domaine pour ajouter des features

### 4. Interface Segregation
- Interfaces spécifiques et focalisées
- Pas d'interfaces "fourre-tout"

### 5. Liskov Substitution
- Les implémentations respectent les contrats des interfaces
- Substituabilité garantie

## Flux de données

### Exemple : Télécharger une piste

```
GUI (Presentation)
    ↓
DownloadTrackUseCase (Application)
    ↓
MusicService (Domain)
    ↓
YouTubeRepository (Infrastructure)
    ↓
yt-dlp (External)
```

## Tests

### Structure des tests
```
tests/
├── unit/          # Tests du domaine (pur)
├── integration/   # Tests des adaptateurs
└── e2e/          # Tests end-to-end
```

### Stratégie de test
- **Unit** : Domain layer (100% coverage visé)
- **Integration** : Infrastructure adapters
- **E2E** : Workflows complets

## Évolutivité

### Ajouter une nouvelle source musicale
1. Créer un adaptateur dans `infrastructure/`
2. Implémenter l'interface `MusicSourceRepository`
3. L'injecter dans le container de dépendances

### Ajouter un nouveau format audio
1. Ajouter l'enum dans `AudioFormat`
2. Implémenter la conversion dans l'adaptateur
3. Aucune modification du domaine nécessaire

### Ajouter une nouvelle interface
1. Créer un module dans `presentation/`
2. Utiliser les Use Cases existants
3. Aucune modification des autres couches