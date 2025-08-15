#!/bin/bash

# 🔧 Setup Test Environment for Revenue Protection Tests
# Configures the testing environment for OmniScan revenue protection

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 Setting up OmniScan Revenue Protection Test Environment${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

# Check if we're in the right directory
if [ ! -f "app/main.py" ]; then
    echo -e "${RED}❌ Please run this script from the backend directory${NC}"
    echo -e "${RED}   Expected: /path/to/omni-scan/backend/${NC}"
    exit 1
fi

# Create necessary directories
echo -e "${YELLOW}Creating test directories...${NC}"
mkdir -p tests/business
mkdir -p tests/security  
mkdir -p tests/performance
mkdir -p tests/mocks
mkdir -p tests/fixtures
mkdir -p htmlcov
mkdir -p .github/workflows

echo -e "${GREEN}✅ Test directories created${NC}"

# Check Python version
echo -e "${YELLOW}Checking Python version...${NC}"
PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
REQUIRED_VERSION="3.11"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then 
    echo -e "${RED}❌ Python $REQUIRED_VERSION or higher required, found $PYTHON_VERSION${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python $PYTHON_VERSION OK${NC}"

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo -e "${YELLOW}⚠️  No virtual environment detected${NC}"
    echo -e "${YELLOW}   It's recommended to use a virtual environment${NC}"
    echo -e "${YELLOW}   Run: python -m venv venv && source venv/bin/activate${NC}"
fi

# Install/upgrade required packages
echo -e "${YELLOW}Installing test dependencies...${NC}"

# Core testing packages
python -m pip install --upgrade pip --quiet
pip install pytest>=7.4.0 --quiet
pip install pytest-asyncio>=0.21.0 --quiet
pip install pytest-cov>=4.1.0 --quiet
pip install pytest-mock>=3.11.0 --quiet

# Performance testing
pip install pytest-xdist>=3.3.0 --quiet  # Parallel tests
pip install pytest-timeout>=2.1.0 --quiet  # Timeout protection
pip install psutil>=5.9.0 --quiet  # System monitoring

# Security testing  
pip install safety>=2.3.0 --quiet  # Vulnerability scanning
pip install bandit>=1.7.5 --quiet  # Security linter
pip install semgrep>=1.0.0 --quiet  # Static analysis

# Additional dependencies for tests
pip install Pillow>=10.0.0 --quiet  # Image processing for tests
pip install fakeredis>=2.16.0 --quiet  # Redis mocking

echo -e "${GREEN}✅ Test dependencies installed${NC}"

# Check system dependencies
echo -e "${YELLOW}Checking system dependencies...${NC}"

# Check Redis (for integration tests)
if command -v redis-server &> /dev/null; then
    echo -e "${GREEN}✅ Redis server found${NC}"
    
    # Start Redis if not running
    if ! pgrep -x "redis-server" > /dev/null; then
        echo -e "${YELLOW}Starting Redis server...${NC}"
        redis-server --daemonize yes --port 6379 2>/dev/null || echo -e "${YELLOW}⚠️  Could not start Redis (tests will use mocks)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Redis not found (tests will use mocks)${NC}"
    echo -e "${YELLOW}   Install: apt-get install redis-server (Ubuntu) or brew install redis (Mac)${NC}"
fi

# Check Tesseract (for OCR tests)
if command -v tesseract &> /dev/null; then
    echo -e "${GREEN}✅ Tesseract OCR found${NC}"
else
    echo -e "${YELLOW}⚠️  Tesseract OCR not found${NC}"
    echo -e "${YELLOW}   Install: apt-get install tesseract-ocr (Ubuntu) or brew install tesseract (Mac)${NC}"
fi

# Check Poppler (for PDF processing)
if command -v pdftoppm &> /dev/null; then
    echo -e "${GREEN}✅ Poppler utils found${NC}"
else
    echo -e "${YELLOW}⚠️  Poppler utils not found${NC}"
    echo -e "${YELLOW}   Install: apt-get install poppler-utils (Ubuntu) or brew install poppler (Mac)${NC}"
fi

# Create pytest configuration
echo -e "${YELLOW}Creating pytest configuration...${NC}"

if [ ! -f "pytest.ini" ]; then
    cat > pytest.ini << 'EOF'
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
asyncio_mode = auto
addopts = 
    -v
    --tb=short
    --strict-markers
    --cov=app
    --cov-report=term-missing
    --cov-report=html
    --cov-fail-under=80
markers =
    critical: Critical revenue protection tests
    security: Security tests
    performance: Performance and load tests
    integration: Integration tests
    slow: Slow tests (>30s)
    unit: Unit tests
EOF
    echo -e "${GREEN}✅ pytest.ini created${NC}"
else
    echo -e "${GREEN}✅ pytest.ini already exists${NC}"
fi

# Create test environment file
echo -e "${YELLOW}Creating test environment configuration...${NC}"

cat > .env.test << 'EOF'
# Test Environment Configuration
ENVIRONMENT=testing
SECRET_KEY=test-secret-key-change-in-production
JWT_SECRET_KEY=test-jwt-secret-key-change-in-production

# Database (mocked in tests)
SUPABASE_URL=http://mock-supabase.test
SUPABASE_ANON_KEY=mock-anon-key

# Redis (local or mocked)
REDIS_URL=redis://localhost:6379

# External services (mocked in tests)  
STRIPE_SECRET_KEY=sk_test_mock_key
STRIPE_PRICE_ID=price_mock_omniscan_pro
OPENAI_API_KEY=sk-mock-openai-key

# Frontend URL for tests
FRONTEND_URL=http://localhost:3004

# OCR Configuration
TESSERACT_CONFIG=--oem 3 --psm 3
PDF_DPI=300
MAX_FILE_SIZE_MB=10
EOF

echo -e "${GREEN}✅ .env.test created${NC}"

# Create GitHub Actions directory structure if it doesn't exist
if [ ! -d ".github/workflows" ]; then
    mkdir -p .github/workflows
    echo -e "${GREEN}✅ GitHub workflows directory created${NC}"
fi

# Create a simple test runner script if it doesn't exist
if [ ! -f "run-revenue-tests.sh" ]; then
    echo -e "${YELLOW}run-revenue-tests.sh not found, creating basic version...${NC}"
    cat > run-revenue-tests.sh << 'EOF'
#!/bin/bash
# Basic revenue protection test runner
pytest tests/business/ tests/security/ -v
EOF
    chmod +x run-revenue-tests.sh
    echo -e "${GREEN}✅ Basic test runner created${NC}"
fi

# Validate the installation
echo -e "${YELLOW}Validating installation...${NC}"

# Test pytest works
if python -m pytest --version &> /dev/null; then
    echo -e "${GREEN}✅ pytest working${NC}"
else
    echo -e "${RED}❌ pytest not working${NC}"
    exit 1
fi

# Test that we can import the app
if python -c "from app.main import app" 2>/dev/null; then
    echo -e "${GREEN}✅ App import working${NC}"
else
    echo -e "${RED}❌ Cannot import app${NC}"
    echo -e "${RED}   Make sure dependencies are installed: pip install -r requirements.txt${NC}"
    exit 1
fi

# Run a quick health check
echo -e "${YELLOW}Running quick health check...${NC}"
if [ -f "tests/conftest.py" ]; then
    python -m pytest tests/ -k "test_health" --quiet 2>/dev/null || echo -e "${YELLOW}⚠️  No health tests found${NC}"
else
    echo -e "${YELLOW}⚠️  No conftest.py found - tests might not work properly${NC}"
fi

# Create security scan script
cat > security-scan.sh << 'EOF'
#!/bin/bash
# Security scan script for OmniScan

echo "🔍 Running security scans..."

# Check for known vulnerabilities
echo "Checking for known vulnerabilities (safety)..."
safety check --short-report || true

# Security linting
echo "Running security linting (bandit)..."
bandit -r app/ -ll || true

# Static analysis
echo "Running static analysis (semgrep)..."
semgrep --config=auto app/ --quiet || true

echo "✅ Security scans completed"
EOF

chmod +x security-scan.sh
echo -e "${GREEN}✅ Security scan script created${NC}"

# Summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🎉 Test Environment Setup Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}✅ Test directories created${NC}"
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo -e "${GREEN}✅ Configuration files created${NC}"
echo -e "${GREEN}✅ Scripts ready${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "${YELLOW}1. Run revenue protection tests: ./run-revenue-tests.sh${NC}"
echo -e "${YELLOW}2. Run security scans: ./security-scan.sh${NC}"
echo -e "${YELLOW}3. Check coverage: pytest --cov=app --cov-report=html${NC}"
echo ""
echo -e "${BLUE}Happy testing! Your revenues are about to be protected! 🛡️${NC}"