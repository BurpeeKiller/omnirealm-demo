#!/bin/bash

# 🔍 Security Scan Script for OmniScan Revenue Protection
# Comprehensive security analysis to protect OCR revenues

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${RED}🔍 OmniScan Security Scan - Revenue Protection${NC}"
echo -e "${RED}═══════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Scanning for vulnerabilities that could impact revenue...${NC}"
echo ""

# Initialize counters
CRITICAL_ISSUES=0
WARNINGS=0
SCANS_RUN=0

# Function to run a security tool with error handling
run_security_tool() {
    local tool_name="$1"
    local command="$2"
    local critical="$3"
    
    echo -e "${BLUE}Running ${tool_name}...${NC}"
    ((SCANS_RUN++))
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ ${tool_name} - No critical issues${NC}"
        return 0
    else
        local exit_code=$?
        if [ "$critical" = "CRITICAL" ]; then
            echo -e "${RED}❌ ${tool_name} - CRITICAL ISSUES FOUND${NC}"
            ((CRITICAL_ISSUES++))
        else
            echo -e "${YELLOW}⚠️  ${tool_name} - Warnings found${NC}"
            ((WARNINGS++))
        fi
        return $exit_code
    fi
}

# Check if tools are installed
echo -e "${YELLOW}Checking security tools...${NC}"

TOOLS_AVAILABLE=true

if ! command -v safety &> /dev/null; then
    echo -e "${YELLOW}⚠️  Safety not installed (pip install safety)${NC}"
    TOOLS_AVAILABLE=false
fi

if ! command -v bandit &> /dev/null; then
    echo -e "${YELLOW}⚠️  Bandit not installed (pip install bandit)${NC}"
    TOOLS_AVAILABLE=false
fi

if ! command -v semgrep &> /dev/null; then
    echo -e "${YELLOW}⚠️  Semgrep not installed (pip install semgrep)${NC}"
    TOOLS_AVAILABLE=false
fi

if [ "$TOOLS_AVAILABLE" = false ]; then
    echo -e "${YELLOW}Installing missing security tools...${NC}"
    pip install safety bandit semgrep --quiet 2>/dev/null || echo -e "${YELLOW}Could not install tools automatically${NC}"
fi

echo ""

# 1. Safety - Check for known vulnerabilities in dependencies
echo -e "${RED}1. Vulnerability Scan (Safety)${NC}"
echo -e "${BLUE}Checking for known security vulnerabilities in dependencies...${NC}"

if command -v safety &> /dev/null; then
    safety check --short-report 2>/dev/null || {
        echo -e "${RED}❌ CRITICAL: Known vulnerabilities found in dependencies!${NC}"
        echo -e "${RED}   This could allow attackers to compromise the revenue system.${NC}"
        ((CRITICAL_ISSUES++))
        
        echo -e "${YELLOW}Detailed vulnerability report:${NC}"
        safety check 2>/dev/null || true
    }
    
    # Generate JSON report for CI/CD
    safety check --json --output safety-report.json 2>/dev/null || true
    
    if [ -f "safety-report.json" ] && [ -s "safety-report.json" ]; then
        VULN_COUNT=$(python3 -c "import json; data=json.load(open('safety-report.json')); print(len(data.get('vulnerabilities', [])))" 2>/dev/null || echo "0")
        if [ "$VULN_COUNT" != "0" ]; then
            echo -e "${RED}Found $VULN_COUNT vulnerabilities${NC}"
        else
            echo -e "${GREEN}✅ No known vulnerabilities in dependencies${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Safety not available, skipping dependency check${NC}"
fi

echo ""

# 2. Bandit - Security linting for Python code
echo -e "${RED}2. Code Security Analysis (Bandit)${NC}"
echo -e "${BLUE}Scanning Python code for security issues...${NC}"

if command -v bandit &> /dev/null; then
    # Focus on critical security issues for revenue protection
    bandit -r app/ -ll -f json -o bandit-report.json 2>/dev/null || {
        echo -e "${RED}❌ CRITICAL: Security issues found in code!${NC}"
        ((CRITICAL_ISSUES++))
    }
    
    # Show summary
    if [ -f "bandit-report.json" ]; then
        BANDIT_HIGH=$(python3 -c "
import json
try:
    with open('bandit-report.json') as f:
        data = json.load(f)
        high_issues = [r for r in data.get('results', []) if r.get('issue_severity') == 'HIGH']
        print(len(high_issues))
except:
    print(0)
" 2>/dev/null || echo "0")
        
        if [ "$BANDIT_HIGH" != "0" ]; then
            echo -e "${RED}Found $BANDIT_HIGH high-severity security issues${NC}"
            ((CRITICAL_ISSUES++))
        else
            echo -e "${GREEN}✅ No high-severity security issues${NC}"
        fi
    fi
    
    # Show readable report
    bandit -r app/ -ll 2>/dev/null || true
else
    echo -e "${YELLOW}⚠️  Bandit not available, skipping code analysis${NC}"
fi

echo ""

# 3. Semgrep - Advanced static analysis
echo -e "${RED}3. Advanced Security Analysis (Semgrep)${NC}"
echo -e "${BLUE}Running advanced security patterns detection...${NC}"

if command -v semgrep &> /dev/null; then
    # Use security-focused rulesets
    semgrep --config=auto app/ --json --output=semgrep-report.json --quiet 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Some Semgrep rules failed, but continuing...${NC}"
    }
    
    if [ -f "semgrep-report.json" ]; then
        SEMGREP_CRITICAL=$(python3 -c "
import json
try:
    with open('semgrep-report.json') as f:
        data = json.load(f)
        critical = [r for r in data.get('results', []) if r.get('extra', {}).get('severity') in ['ERROR', 'HIGH']]
        print(len(critical))
except:
    print(0)
" 2>/dev/null || echo "0")
        
        if [ "$SEMGREP_CRITICAL" != "0" ]; then
            echo -e "${RED}Found $SEMGREP_CRITICAL critical security patterns${NC}"
            ((CRITICAL_ISSUES++))
        else
            echo -e "${GREEN}✅ No critical security patterns detected${NC}"
        fi
    fi
    
    # Show readable summary
    semgrep --config=auto app/ --quiet 2>/dev/null | head -20 || true
else
    echo -e "${YELLOW}⚠️  Semgrep not available, skipping advanced analysis${NC}"
fi

echo ""

# 4. Custom Revenue Protection Checks
echo -e "${RED}4. Revenue Protection Custom Checks${NC}"
echo -e "${BLUE}Checking for revenue-specific security issues...${NC}"

# Check for hardcoded secrets
echo -e "${YELLOW}Checking for hardcoded secrets...${NC}"
if grep -r -i "sk_live_" app/ 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: Live Stripe keys found in code!${NC}"
    ((CRITICAL_ISSUES++))
fi

if grep -r -i "password.*=.*[\"'][^\"']*[\"']" app/ 2>/dev/null | grep -v "test" | grep -v "example"; then
    echo -e "${RED}❌ CRITICAL: Hardcoded passwords found!${NC}"
    ((CRITICAL_ISSUES++))
fi

# Check for insecure configurations
echo -e "${YELLOW}Checking for insecure configurations...${NC}"
if grep -r "SECRET_KEY.*=.*[\"']test[\"']" app/ 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Test secret keys found in production code${NC}"
    ((WARNINGS++))
fi

# Check for missing security headers
echo -e "${YELLOW}Checking security implementations...${NC}"
if ! grep -r "stripe.*webhook.*signature" app/ 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: Stripe webhook signature verification missing!${NC}"
    echo -e "${RED}   This allows fake webhooks to upgrade users to Pro for free!${NC}"
    ((CRITICAL_ISSUES++))
fi

if ! grep -r "rate.limit" app/ 2>/dev/null && ! find app/ -name "*rate*" -type f | grep -q .; then
    echo -e "${YELLOW}⚠️  No rate limiting detected - could allow OCR abuse${NC}"
    ((WARNINGS++))
fi

echo ""

# 5. File Permission Check
echo -e "${RED}5. File Security Check${NC}"
echo -e "${BLUE}Checking file permissions and sensitive files...${NC}"

# Check for world-writable files
WRITABLE_FILES=$(find . -type f -perm -002 2>/dev/null | wc -l)
if [ "$WRITABLE_FILES" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $WRITABLE_FILES world-writable files${NC}"
    ((WARNINGS++))
fi

# Check for .env files in version control
if git ls-files | grep -E "\.env$" 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: .env files tracked in git!${NC}"
    ((CRITICAL_ISSUES++))
fi

# Check for sensitive files
SENSITIVE_PATTERNS=("*.key" "*.pem" "*.p12" "*secret*" "*password*")
for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if find . -name "$pattern" -not -path "./.git/*" -not -path "./venv/*" 2>/dev/null | grep -q .; then
        echo -e "${YELLOW}⚠️  Found potential sensitive files: $pattern${NC}"
        ((WARNINGS++))
    fi
done

echo ""

# Generate comprehensive report
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}🛡️  Security Scan Results${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

echo -e "${YELLOW}Scans performed: ${SCANS_RUN}${NC}"
echo -e "${RED}Critical issues: ${CRITICAL_ISSUES}${NC}"
echo -e "${YELLOW}Warnings: ${WARNINGS}${NC}"

if [ $CRITICAL_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ NO CRITICAL SECURITY ISSUES FOUND${NC}"
    echo -e "${GREEN}Revenue protection measures are secure${NC}"
else
    echo -e "${RED}❌ ${CRITICAL_ISSUES} CRITICAL SECURITY ISSUES FOUND${NC}"
    echo -e "${RED}IMMEDIATE ACTION REQUIRED TO PROTECT REVENUES${NC}"
    echo ""
    echo -e "${RED}Priority actions:${NC}"
    echo -e "${RED}1. Fix all critical vulnerabilities before deployment${NC}"
    echo -e "${RED}2. Implement Stripe webhook signature verification${NC}"
    echo -e "${RED}3. Remove any hardcoded secrets${NC}"
    echo -e "${RED}4. Review file permissions${NC}"
    echo ""
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  ${WARNINGS} warnings found - review recommended${NC}"
fi

# Generate security report summary
cat > security-scan-summary.md << EOF
# Security Scan Summary - $(date)

## Overview
- **Critical Issues**: ${CRITICAL_ISSUES}
- **Warnings**: ${WARNINGS}
- **Status**: $([ $CRITICAL_ISSUES -eq 0 ] && echo "SECURE ✅" || echo "AT RISK ❌")

## Tools Used
- Safety (dependency vulnerabilities)
- Bandit (code security analysis)  
- Semgrep (advanced patterns)
- Custom revenue protection checks

## Files Generated
- safety-report.json
- bandit-report.json
- semgrep-report.json

## Recommendations
$([ $CRITICAL_ISSUES -gt 0 ] && echo "🚨 DO NOT DEPLOY - Critical issues must be fixed first" || echo "✅ Safe for deployment")

*Generated by OmniScan Security Scanner*
EOF

echo -e "${BLUE}Security report saved: security-scan-summary.md${NC}"

# Exit with appropriate code
if [ $CRITICAL_ISSUES -gt 0 ]; then
    echo -e "${RED}Exiting with error due to critical security issues${NC}"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}Exiting with warnings${NC}"
    exit 0
else
    echo -e "${GREEN}All security checks passed!${NC}"
    exit 0
fi