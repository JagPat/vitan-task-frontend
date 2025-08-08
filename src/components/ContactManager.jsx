import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Phone, 
  Mail, 
  MessageSquare, 
  Upload, 
  Send,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { whatsTaskClient } from '@/api/whatsTaskClient';

export default function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('whatsapp');

  // Load data on component mount
  useEffect(() => {
    loadContactStats();
    loadPendingInvitations();
  }, []);

  const loadContactStats = async () => {
    try {
      const data = await whatsTaskClient.request('/api/contacts/stats');
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error loading contact stats:', error);
    }
  };

  const loadPendingInvitations = async () => {
    try {
      const data = await whatsTaskClient.request('/api/contacts/pending-invitations');
      if (data.success) {
        setPendingInvitations(data.data);
      }
    } catch (error) {
      console.error('Error loading pending invitations:', error);
    }
  };

  const handleFileUpload = (event, source) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        let contacts = [];
        
        if (source === 'whatsapp') {
          // Parse WhatsApp contacts (JSON format)
          contacts = JSON.parse(e.target.result);
        } else if (source === 'phone') {
          // Parse phone contacts (CSV format)
          const csv = e.target.result;
          const lines = csv.split('\n');
          contacts = lines.slice(1).map(line => {
            const [name, phone, email] = line.split(',');
            return { name, phone, email };
          }).filter(contact => contact.name && contact.phone);
        } else if (source === 'email') {
          // Parse email contacts (CSV format)
          const csv = e.target.result;
          const lines = csv.split('\n');
          contacts = lines.slice(1).map(line => {
            const [name, email, phone] = line.split(',');
            return { name, email, phone };
          }).filter(contact => contact.name && contact.email);
        }

        await processContacts(contacts, source);
      } catch (error) {
        console.error('Error processing file:', error);
        setMessage('Error processing file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const processContacts = async (contacts, source) => {
    setLoading(true);
    try {
      const data = await whatsTaskClient.request(`/api/contacts/${source}`, {
        method: 'POST',
        body: JSON.stringify({ contacts })
      });
      if (data.success) {
        setMessage(`Successfully processed ${data.data.created} new contacts from ${data.data.total} total contacts.`);
        loadContactStats();
        loadPendingInvitations();
      } else {
        setMessage('Error processing contacts: ' + data.error);
      }
    } catch (error) {
      console.error('Error processing contacts:', error);
      setMessage('Error processing contacts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendBulkInvitations = async () => {
    if (selectedContacts.length === 0) {
      setMessage('Please select contacts to invite.');
      return;
    }

    setLoading(true);
    try {
      const data = await whatsTaskClient.request('/api/contacts/invite-bulk', {
        method: 'POST',
        body: JSON.stringify({ 
          userIds: selectedContacts,
          message: '🎉 Welcome to WhatsTask Team! You\'ve been invited to join our task management platform. Send "help" to see available commands.'
        })
      });
      if (data.success) {
        setMessage(`Successfully sent ${data.data.successful} invitations.`);
        setSelectedContacts([]);
        loadPendingInvitations();
        loadContactStats();
      } else {
        setMessage('Error sending invitations: ' + data.error);
      }
    } catch (error) {
      console.error('Error sending invitations:', error);
      setMessage('Error sending invitations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleContactSelection = (userId) => {
    setSelectedContacts(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending_invitation':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'invited':
        return <Send className="h-4 w-4 text-blue-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      pending_invitation: 'bg-yellow-100 text-yellow-800',
      invited: 'bg-blue-100 text-blue-800',
      inactive: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={variants[status] || variants.inactive}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contact Management</h2>
        <Button 
          onClick={sendBulkInvitations}
          disabled={selectedContacts.length === 0 || loading}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Send Invitations ({selectedContacts.length})
        </Button>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total_users}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.active_users}</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.pending_invitations}</div>
                <div className="text-sm text-gray-500">Pending Invitations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.sources?.whatsapp || 0}</div>
                <div className="text-sm text-gray-500">WhatsApp Contacts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Import */}
      <Card>
        <CardHeader>
          <CardTitle>Import Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
            </TabsList>

            <TabsContent value="whatsapp" className="space-y-4">
              <div>
                <Label htmlFor="whatsapp-file">Upload WhatsApp Contacts (JSON)</Label>
                <Input
                  id="whatsapp-file"
                  type="file"
                  accept=".json"
                  onChange={(e) => handleFileUpload(e, 'whatsapp')}
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Export your WhatsApp contacts and upload the JSON file
                </p>
              </div>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4">
              <div>
                <Label htmlFor="phone-file">Upload Phone Contacts (CSV)</Label>
                <Input
                  id="phone-file"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload(e, 'phone')}
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Export your phone contacts as CSV: Name, Phone, Email
                </p>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <div>
                <Label htmlFor="email-file">Upload Email Contacts (CSV)</Label>
                <Input
                  id="email-file"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload(e, 'email')}
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Export your email contacts as CSV: Name, Email, Phone
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingInvitations.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending invitations</p>
          ) : (
            <div className="space-y-2">
              {pendingInvitations.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(user.id)}
                      onChange={() => toggleContactSelection(user.id)}
                      className="rounded"
                    />
                    <div>
                      <div className="font-medium">{user.full_name}</div>
                      <div className="text-sm text-gray-500">
                        {user.whatsapp_number} • {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(user.status)}
                    {getStatusBadge(user.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 