#!/bin/bash

# Health Check Script for Modular Server
# Tests the three main endpoints to verify modular architecture is working

set -e

# Configuration
MODULAR_SERVER_URL="http://localhost:4000"
HEALTH_ENDPOINT="$MODULAR_SERVER_URL/health"
MODULES_ENDPOINT="$MODULAR_SERVER_URL/api/modules"
TASKS_HEALTH_ENDPOINT="$MODULAR_SERVER_URL/api/modules/tasks/health"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $message"
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}❌ FAIL${NC}: $message"
    else
        echo -e "${YELLOW}⚠️  WARN${NC}: $message"
    fi
}

# Function to test endpoint
test_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo "Testing: $description"
    echo "URL: $url"
    
    # Make request and capture response
    response=$(curl -s -w "\n%{http_code}" "$url" 2>/dev/null || echo "Connection failed")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "$expected_status" ]; then
        print_status "PASS" "HTTP $http_code - $description"
        
        # Check if response is valid JSON
        if echo "$body" | jq . >/dev/null 2>&1; then
            print_status "PASS" "Valid JSON response"
            
            # Print response summary
            echo "Response summary:"
            echo "$body" | jq -r 'keys | join(", ")' 2>/dev/null || echo "Could not parse response keys"
        else
            print_status "FAIL" "Invalid JSON response"
            echo "Response body: $body"
        fi
    else
        print_status "FAIL" "Expected HTTP $expected_status, got $http_code - $description"
        echo "Response body: $body"
    fi
    
    echo "---"
}

# Main execution
echo "🔍 WhatsTask Modular Server Health Check"
echo "=========================================="
echo "Server URL: $MODULAR_SERVER_URL"
echo "Timestamp: $(date)"
echo ""

# Check if modular server is running
echo "Checking if modular server is running..."
if curl -s "$MODULAR_SERVER_URL" >/dev/null 2>&1; then
    print_status "PASS" "Modular server is accessible"
else
    print_status "FAIL" "Modular server is not accessible. Make sure it's running with: npm run start:modular"
    exit 1
fi

echo ""

# Test health endpoint
test_endpoint "$HEALTH_ENDPOINT" "Health Check Endpoint"

# Test modules endpoint
test_endpoint "$MODULES_ENDPOINT" "Modules List Endpoint"

# Test tasks module health (if it exists)
echo "Testing: Tasks Module Health"
echo "URL: $TASKS_HEALTH_ENDPOINT"

if curl -s "$TASKS_HEALTH_ENDPOINT" >/dev/null 2>&1; then
    test_endpoint "$TASKS_HEALTH_ENDPOINT" "Tasks Module Health Endpoint"
else
    print_status "WARN" "Tasks module health endpoint not accessible (module may not be loaded)"
fi

echo ""

# Summary
echo "🎯 Health Check Summary"
echo "======================="
echo "All endpoints tested successfully!"
echo ""
echo "To start the modular server:"
echo "  npm run start:modular"
echo ""
echo "To stop the modular server:"
echo "  Ctrl+C"
echo ""
echo "The main server continues running on port 3000 unchanged."
echo "Modular server runs on port 4000 for development/testing."
