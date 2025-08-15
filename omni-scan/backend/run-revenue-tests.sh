#!/bin/bash

# 🛡️ OmniScan Revenue Protection Tests - Script d'exécution
# Protège les revenus OCR contre les abus et attaques

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Revenue protection banner
echo -e "${BLUE}🛡️  OmniScan Revenue Protection Test Suite${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${YELLOW}Protecting OCR revenues against abuse and attacks${NC}"
echo ""

# Function to run tests with proper error handling
run_tests() {
    local test_path="$1"
    local test_name="$2"
    local critical="$3"
    
    echo -e "${BLUE}Running ${test_name}...${NC}"
    
    if pytest "$test_path" -v --tb=short --timeout=300 2>/dev/null; then
        echo -e "${GREEN}✅ ${test_name} - PASSED${NC}"
        return 0
    else
        if [ "$critical" = "CRITICAL" ]; then
            echo -e "${RED}❌ ${test_name} - FAILED (CRITICAL - REVENUE AT RISK!)${NC}"
            return 1
        else
            echo -e "${YELLOW}⚠️  ${test_name} - FAILED (Non-critical)${NC}"
            return 0
        fi
    fi
}

# Check dependencies
echo -e "${BLUE}Checking dependencies...${NC}"
if ! command -v pytest &> /dev/null; then
    echo -e "${RED}❌ pytest not found. Install with: pip install pytest${NC}"
    exit 1
fi

if ! command -v redis-cli &> /dev/null; then
    echo -e "${YELLOW}⚠️  redis-cli not found. Some tests may fail.${NC}"
fi

echo -e "${GREEN}✅ Dependencies OK${NC}"
echo ""

# Parse command line arguments
QUICK_MODE=false
CRITICAL_ONLY=false
SECURITY_ONLY=false
PERFORMANCE_ONLY=false
COVERAGE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --quick|-q)
            QUICK_MODE=true
            shift
            ;;
        --critical|-c)
            CRITICAL_ONLY=true
            shift
            ;;
        --security|-s)
            SECURITY_ONLY=true
            shift
            ;;
        --performance|-p)
            PERFORMANCE_ONLY=true
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -q, --quick        Run only critical revenue protection tests (< 2min)"
            echo "  -c, --critical     Run all critical tests (< 5min)"
            echo "  -s, --security     Run only security tests"
            echo "  -p, --performance  Run only performance tests"
            echo "      --coverage     Generate coverage report"
            echo "  -h, --help         Show this help"
            echo ""
            echo "Examples:"
            echo "  $0                 # Run all tests"
            echo "  $0 --quick         # Quick critical tests only"
            echo "  $0 --security      # Security tests only"
            echo "  $0 --coverage      # All tests with coverage"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Set up environment
export ENVIRONMENT=testing
export SECRET_KEY=test-secret-key-revenue-protection
export JWT_SECRET_KEY=test-jwt-secret-revenue-protection
export REDIS_URL=redis://localhost:6379
export SUPABASE_URL=http://mock-supabase.test
export SUPABASE_ANON_KEY=mock-anon-key

echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo ""

# Test execution start
START_TIME=$(date +%s)
FAILED_TESTS=0
CRITICAL_FAILED=0

if [ "$QUICK_MODE" = true ]; then
    echo -e "${YELLOW}🚀 QUICK MODE: Critical revenue protection tests only${NC}"
    echo ""
    
    # Only the most critical tests for revenue protection
    run_tests "tests/business/test_quota_protection.py::TestQuotaProtection::test_free_user_over_quota_blocked" "Quota blocking (CRITICAL)" "CRITICAL" || ((CRITICAL_FAILED++))
    run_tests "tests/business/test_quota_protection.py::TestQuotaProtection::test_pro_user_unlimited_access" "Pro user access (CRITICAL)" "CRITICAL" || ((CRITICAL_FAILED++))
    run_tests "tests/business/test_stripe_integration.py::TestStripeWebhookSecurity::test_webhook_without_signature_rejected" "Stripe webhook security (CRITICAL)" "CRITICAL" || ((CRITICAL_FAILED++))
    run_tests "tests/business/test_auth_security.py::TestAuthenticationSecurity::test_token_manipulation_protection" "JWT security (CRITICAL)" "CRITICAL" || ((CRITICAL_FAILED++))
    
elif [ "$CRITICAL_ONLY" = true ]; then
    echo -e "${YELLOW}⚠️  CRITICAL MODE: All revenue-critical tests${NC}"
    echo ""
    
    run_tests "tests/business/test_quota_protection.py" "Quota Protection (CRITICAL)" "CRITICAL" || ((CRITICAL_FAILED++))
    run_tests "tests/business/test_stripe_integration.py" "Stripe Integration (CRITICAL)" "CRITICAL" || ((CRITICAL_FAILED++))
    run_tests "tests/business/test_auth_security.py" "Authentication Security (CRITICAL)" "CRITICAL" || ((CRITICAL_FAILED++))
    run_tests "tests/security/test_injection_attacks.py" "Injection Protection (CRITICAL)" "CRITICAL" || ((CRITICAL_FAILED++))
    
elif [ "$SECURITY_ONLY" = true ]; then
    echo -e "${YELLOW}🔒 SECURITY MODE: Security tests only${NC}"
    echo ""
    
    run_tests "tests/security/" "Security Tests" "CRITICAL" || ((CRITICAL_FAILED++))
    run_tests "tests/business/test_auth_security.py" "Authentication Security" "CRITICAL" || ((CRITICAL_FAILED++))
    run_tests "tests/business/test_file_validation.py" "File Security" "NORMAL" || ((FAILED_TESTS++))
    
elif [ "$PERFORMANCE_ONLY" = true ]; then
    echo -e "${YELLOW}⚡ PERFORMANCE MODE: Load and stress tests${NC}"
    echo ""
    
    run_tests "tests/performance/" "Performance Tests" "NORMAL" || ((FAILED_TESTS++))
    run_tests "tests/business/test_rate_limiting.py" "Rate Limiting" "NORMAL" || ((FAILED_TESTS++))
    
else
    echo -e "${YELLOW}🏛️  FULL MODE: Complete revenue protection test suite${NC}"
    echo ""
    
    # Phase 1: CRITICAL Revenue Protection Tests
    echo -e "${RED}Phase 1: CRITICAL Revenue Protection${NC}"
    run_tests "tests/business/test_quota_protection.py" "Quota Protection (CRITICAL)" "CRITICAL" || ((CRITICAL_FAILED++))
    run_tests "tests/business/test_stripe_integration.py" "Stripe Integration (CRITICAL)" "CRITICAL" || ((CRITICAL_FAILED++))
    run_tests "tests/business/test_auth_security.py" "Authentication Security (CRITICAL)" "CRITICAL" || ((CRITICAL_FAILED++))
    
    # Phase 2: Security Tests  
    echo -e "${YELLOW}Phase 2: Security & Injection Protection${NC}"
    run_tests "tests/security/test_injection_attacks.py" "Injection Protection (CRITICAL)" "CRITICAL" || ((CRITICAL_FAILED++))
    run_tests "tests/business/test_file_validation.py" "File Validation" "NORMAL" || ((FAILED_TESTS++))
    run_tests "tests/business/test_rate_limiting.py" "Rate Limiting" "NORMAL" || ((FAILED_TESTS++))
    
    # Phase 3: Resilience & Performance
    echo -e "${BLUE}Phase 3: Resilience & Performance${NC}"
    run_tests "tests/business/test_ocr_error_handling.py" "OCR Error Handling" "NORMAL" || ((FAILED_TESTS++))
    run_tests "tests/performance/test_load_testing.py" "Load Testing" "NORMAL" || ((FAILED_TESTS++))
    run_tests "tests/mocks/test_external_services.py" "External Services Mocks" "NORMAL" || ((FAILED_TESTS++))
fi

# Generate coverage if requested
if [ "$COVERAGE" = true ]; then
    echo ""
    echo -e "${BLUE}Generating coverage report...${NC}"
    
    if [ "$QUICK_MODE" = true ]; then
        pytest tests/business/test_quota_protection.py tests/business/test_stripe_integration.py \
            --cov=app --cov-report=html --cov-report=term-missing --quiet
    else
        pytest tests/business/ tests/security/ \
            --cov=app --cov-report=html --cov-report=term-missing --quiet
    fi
    
    echo -e "${GREEN}✅ Coverage report generated: htmlcov/index.html${NC}"
fi

# Calculate execution time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Final report
echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}🛡️  Revenue Protection Test Results${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

if [ $CRITICAL_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ CRITICAL TESTS: ALL PASSED - Revenues are PROTECTED${NC}"
else
    echo -e "${RED}❌ CRITICAL TESTS: ${CRITICAL_FAILED} FAILED - IMMEDIATE ACTION REQUIRED${NC}"
    echo -e "${RED}   Revenue streams are at RISK!${NC}"
fi

if [ $FAILED_TESTS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Non-critical tests: ${FAILED_TESTS} failed${NC}"
fi

echo -e "${BLUE}⏱️  Execution time: ${DURATION}s${NC}"

# Security recommendations
if [ $CRITICAL_FAILED -gt 0 ]; then
    echo ""
    echo -e "${RED}🚨 CRITICAL FAILURES DETECTED${NC}"
    echo -e "${RED}Immediate actions required:${NC}"
    echo -e "${RED}- Review failed tests above${NC}"
    echo -e "${RED}- Fix security vulnerabilities${NC}" 
    echo -e "${RED}- Verify Stripe webhook signatures${NC}"
    echo -e "${RED}- Check quota enforcement logic${NC}"
    echo ""
    echo -e "${RED}DO NOT DEPLOY TO PRODUCTION until fixed!${NC}"
fi

# Exit codes
if [ $CRITICAL_FAILED -gt 0 ]; then
    exit 2  # Critical failure
elif [ $FAILED_TESTS -gt 0 ]; then
    exit 1  # Non-critical failures
else
    echo -e "${GREEN}✅ All revenue protection measures are SECURE${NC}"
    echo -e "${GREEN}Safe to deploy to production${NC}"
    exit 0  # Success
fi