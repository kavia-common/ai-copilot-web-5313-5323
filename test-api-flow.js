/**
 * Test script to verify the complete API flow
 * Run with: node test-api-flow.js
 */

const BASE_URL = process.env.BACKEND_URL || 'https://vscode-internal-13141-beta.beta01.cloud.kavia.ai:3001';

async function testHealthCheck() {
  console.log('\n🏥 Testing health check...');
  try {
    const response = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    console.log('✅ Health check passed:', data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testCreateSession() {
  console.log('\n📝 Testing session creation...');
  try {
    const response = await fetch(`${BASE_URL}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    console.log('✅ Session created:', data);
    return data.session_id;
  } catch (error) {
    console.error('❌ Session creation failed:', error.message);
    return null;
  }
}

async function testSendMessage(sessionId, message) {
  console.log('\n💬 Testing message send...');
  try {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, message }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Message send failed:', error);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ Message sent successfully');
    console.log('🤖 AI Reply:', data.reply.substring(0, 100) + '...');
    return true;
  } catch (error) {
    console.error('❌ Message send error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting API flow tests...');
  console.log('📍 Backend URL:', BASE_URL);
  
  // Test 1: Health Check
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.error('\n❌ Cannot proceed - backend is not healthy');
    process.exit(1);
  }
  
  // Test 2: Create Session
  const sessionId = await testCreateSession();
  if (!sessionId) {
    console.error('\n❌ Cannot proceed - session creation failed');
    process.exit(1);
  }
  
  // Test 3: Send Message
  const messageOk = await testSendMessage(sessionId, 'Hello, this is a test message');
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results:');
  console.log('  Health Check:', healthOk ? '✅' : '❌');
  console.log('  Session Creation:', sessionId ? '✅' : '❌');
  console.log('  Message Send:', messageOk ? '✅' : '❌');
  console.log('='.repeat(50));
  
  if (healthOk && sessionId && messageOk) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some tests failed - check errors above');
    process.exit(1);
  }
}

runTests();
