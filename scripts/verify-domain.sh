#!/bin/bash

# Domain Verification Script for empowerai.dev
# This script helps verify DNS configuration and domain setup

echo "🌐 Verifying domain configuration for empowerai.dev"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check DNS record
check_dns() {
    local domain=$1
    local record_type=$2
    
    echo -e "\n${BLUE}Checking $record_type record for $domain...${NC}"
    
    if command -v nslookup >/dev/null 2>&1; then
        nslookup -type=$record_type $domain
    elif command -v dig >/dev/null 2>&1; then
        dig $domain $record_type
    else
        echo -e "${RED}Neither nslookup nor dig found. Please install one of these tools.${NC}"
    fi
}

# Function to test HTTP response
test_http() {
    local url=$1
    echo -e "\n${BLUE}Testing HTTP response for $url...${NC}"
    
    if command -v curl >/dev/null 2>&1; then
        curl -I -s --connect-timeout 10 "$url" | head -5
    else
        echo -e "${RED}curl not found. Please install curl to test HTTP responses.${NC}"
    fi
}

echo -e "${YELLOW}Step 1: Checking DNS Records${NC}"
check_dns "empowerai.dev" "A"
check_dns "www.empowerai.dev" "CNAME"

echo -e "\n${YELLOW}Step 2: Testing HTTP Responses${NC}"
test_http "https://empowerai.dev"
test_http "https://www.empowerai.dev"

echo -e "\n${YELLOW}Step 3: SSL Certificate Check${NC}"
if command -v openssl >/dev/null 2>&1; then
    echo -e "${BLUE}Checking SSL certificate for empowerai.dev...${NC}"
    echo | openssl s_client -servername empowerai.dev -connect empowerai.dev:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo -e "${RED}SSL certificate check failed or not ready yet${NC}"
else
    echo -e "${RED}OpenSSL not found. Cannot check SSL certificate.${NC}"
fi

echo -e "\n${GREEN}Domain verification complete!${NC}"
echo -e "${BLUE}If you see any errors above, please:${NC}"
echo "1. Check your DNS records in Name.com dashboard"
echo "2. Wait for DNS propagation (can take up to 48 hours)"
echo "3. Verify domain configuration in Vercel dashboard"
echo "4. Contact support if issues persist"

echo -e "\n${YELLOW}Useful Links:${NC}"
echo "• Vercel Dashboard: https://vercel.com/adityadhimaanns-projects/empower-ai"
echo "• Name.com DNS Management: https://name.com"
echo "• DNS Propagation Checker: https://whatsmydns.net"
echo "• Your Live Site: https://empowerai.dev"
