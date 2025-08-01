#!/bin/bash

# WhatsTask Backend API Endpoint Testing Script
# Run this after backend is deployed and accessible

BASE_URL="https://vitan-task-backend.up.railway.app"

echo "🧪 Testing WhatsTask Backend API Endpoints"
echo "=========================================="
echo ""

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/health" | jq '.' 2>/dev/null || curl -s "$BASE_URL/health"
echo ""

# Test 2: Tasks API
echo "2. Testing Tasks API..."
curl -s "$BASE_URL/api/tasks" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/tasks"
echo ""

# Test 3: Users API
echo "3. Testing Users API..."
curl -s "$BASE_URL/api/users" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/users"
echo ""

# Test 4: Analytics API
echo "4. Testing Analytics API..."
curl -s "$BASE_URL/api/analytics/activities" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/analytics/activities"
echo ""

# Test 5: Projects API
echo "5. Testing Projects API..."
curl -s "$BASE_URL/api/projects" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/projects"
echo ""

# Test 6: Templates API
echo "6. Testing Templates API..."
curl -s "$BASE_URL/api/templates" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/templates"
echo ""

# Test 7: WhatsApp Test Endpoint
echo "7. Testing WhatsApp API Configuration..."
curl -s "$BASE_URL/api/auth/whatsapp-test" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/auth/whatsapp-test"
echo ""

# Test 8: Database Test Endpoint
echo "8. Testing Database Connection..."
curl -s "$BASE_URL/api/auth/db-test" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/auth/db-test"
echo ""

echo "✅ API Testing Complete!"
echo ""
echo "📊 Expected Results:"
echo "- Health Check: Should return status OK"
echo "- Tasks API: Should return tasks array (may be empty)"
echo "- Users API: Should return users array (may be empty)"
echo "- Analytics API: Should return activities array (may be empty)"
echo "- Projects API: Should return projects array (may be empty)"
echo "- Templates API: Should return templates array (may be empty)"
echo "- WhatsApp Test: Should return Meta API configuration status"
echo "- Database Test: Should return database connection status"
echo ""
echo "🔧 If any endpoint fails, check:"
echo "1. Backend deployment status"
echo "2. Environment variables configuration"
echo "3. Database connection"
echo "4. Railway service logs" 