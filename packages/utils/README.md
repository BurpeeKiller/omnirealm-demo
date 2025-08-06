# @omnirealm/utils

Shared utility functions for the OmniRealm ecosystem.

## Installation

```bash
pnpm add @omnirealm/utils
```

## Usage

### Class Names (cn)

```typescript
import { cn } from '@omnirealm/utils';

// Combine class names with Tailwind CSS conflict resolution
const className = cn(
  'px-2 py-1 text-red-500',
  condition && 'text-blue-500',
  'px-4' // This will override px-2
);
// Result: 'py-1 text-blue-500 px-4' (if condition is true)
```

### Date Utilities

```typescript
import { formatDate, formatRelativeTime, formatTime } from '@omnirealm/utils';

// Format date in French
formatDate(new Date()); // "18 janvier 2025"

// Format relative time
formatRelativeTime(new Date(Date.now() - 3600000)); // "il y a 1 heure"

// Format time for timer
formatTime(125); // "02:05"
```

### String Utilities

```typescript
import { capitalize, slugify, isEmail } from '@omnirealm/utils';

// Case transformations
capitalize('hello world'); // "Hello world"
slugify('Hello World!'); // "hello-world"

// Validations
isEmail('user@example.com'); // true
```

### Number Utilities

```typescript
import { formatCurrency, formatPercent, formatBytes } from '@omnirealm/utils';

// Format currency
formatCurrency(99.99); // "99,99 €"
formatCurrency(99.99, 'USD', 'en-US'); // "$99.99"

// Format percentage
formatPercent(0.85); // "85%"

// Format bytes
formatBytes(1024 * 1024 * 1.5); // "1.5 MB"
```

### Array Utilities

```typescript
import { unique, chunk, groupBy } from '@omnirealm/utils';

// Get unique values
unique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]

// Chunk array
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// Group by key
const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'admin' }
];
groupBy(users, 'role');
// { admin: [{name: 'Alice'...}, {name: 'Charlie'...}], user: [{name: 'Bob'...}] }
```

### React Hooks

```typescript
import { useDebounce, useLocalStorage, useWindowSize } from '@omnirealm/utils';

// Debounce a search value
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);

// Persist state to localStorage
const [theme, setTheme] = useLocalStorage('theme', 'light');

// Track window size
const { width, height } = useWindowSize();
```

## API Reference

### Class Names
- `cn(...inputs)` - Combine class names with conflict resolution
- `cnLite(...inputs)` - Lightweight version without dependencies

### Dates
- `formatDate(date, options?)` - Format date
- `formatDateTime(date)` - Format date and time
- `formatTime(seconds)` - Format time in MM:SS
- `formatDuration(milliseconds)` - Format duration
- `formatRelativeTime(date)` - Format relative time
- `isToday(date)` - Check if date is today
- `isYesterday(date)` - Check if date is yesterday
- `isTomorrow(date)` - Check if date is tomorrow

### Strings
- `capitalize(str)` - Capitalize first letter
- `toCamelCase(str)` - Convert to camelCase
- `toKebabCase(str)` - Convert to kebab-case
- `toSnakeCase(str)` - Convert to snake_case
- `toTitleCase(str)` - Convert to Title Case
- `truncate(str, maxLength, suffix?)` - Truncate with ellipsis
- `slugify(str)` - Create URL-friendly slug
- `isEmail(email)` - Validate email
- `isURL(url)` - Validate URL
- `isEmpty(str)` - Check if empty or whitespace

### Numbers
- `formatCurrency(amount, currency?, locale?)` - Format as currency
- `formatPercent(value, decimals?, assumeDecimal?)` - Format as percentage
- `formatNumber(num, locale?)` - Format with thousands separator
- `formatBytes(bytes, decimals?)` - Format bytes
- `round(num, decimals?)` - Round to decimal places
- `clamp(num, min, max)` - Clamp between min and max
- `random(min, max, integer?)` - Generate random number

### Arrays
- `unique(array, key?)` - Get unique values
- `chunk(array, size)` - Split into chunks
- `groupBy(array, key)` - Group by key
- `shuffle(array)` - Shuffle randomly
- `sample(array)` - Get random item
- `sampleSize(array, count)` - Get multiple random items
- `range(start, end, step?)` - Create number range
- `compact(array)` - Remove falsy values

### React Hooks
- `useDebounce(value, delay)` - Debounce a value
- `useThrottle(callback, delay)` - Throttle a function
- `usePrevious(value)` - Track previous value
- `useIsMounted()` - Check if mounted
- `useUpdateEffect(effect, deps?)` - Run effect on update only
- `useLocalStorage(key, defaultValue)` - Persist to localStorage
- `useWindowSize()` - Track window dimensions

## License

MIT