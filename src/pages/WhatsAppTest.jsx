import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sendWhatsappMessage } from '@/api/functions';
import { MessageCircle, Send } from 'lucide-react';

export default function WhatsAppTest() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('Hello! This is a test message from WhatsTask.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await sendWhatsappMessage(phoneNumber, message);

      setResult({
        success: true,
        message: 'Test message sent successfully!',
        details: response
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to send test message',
        details: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            WhatsApp Integration Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertDescription>
              Use this page to test your WhatsApp integration. Make sure you have a valid phone number with WhatsApp.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleTest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Test Message</label>
              <Textarea
                placeholder="Enter your test message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={3}
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Test Message
                </>
              )}
            </Button>
          </form>

          {result && (
            <Alert className={`mt-6 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <AlertDescription>
                <strong>{result.success ? 'Success!' : 'Error:'}</strong> {result.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}