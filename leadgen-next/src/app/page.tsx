'use client';

import { useState, useEffect } from 'react';
import { LeadForm } from '@/components/LeadForm';
import { LeadTracking } from '@/components/LeadTracking';
import { LeadFormData } from '@/types/lead';
import InstallPrompt from '@/components/InstallPrompt';
import { registerServiceWorker } from './swRegistration';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'form' | 'tracking'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSalesPerson, setCurrentSalesPerson] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Register service worker on component mount
  useEffect(() => {
    registerServiceWorker();
  }, []);

  const handleSubmitLead = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setNotification(null);

    try {
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to send lead');
      }

      // Set the current salesperson
      setCurrentSalesPerson(data.sentBy);

      // Send notification after successful lead submission
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lead: result.lead,
            salespersonName: data.sentBy,
            demoEnvironment: data.destination
          }),
        });
      } catch (error) {
        console.error('Error sending notification:', error);
        // Don't throw here, as the lead was still submitted successfully
      }

      setNotification({
        type: 'success',
        message: 'Lead sent successfully!',
      });
      
      // Switch to tracking tab after successful submission
      setActiveTab('tracking');
    } catch (error: unknown) {
      const err = error as Error;
      setNotification({
        type: 'error',
        message: err.message || 'An error occurred while sending the lead',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center bg-white p-6 shadow-md rounded-lg">
          <img src="/logo.svg" alt="Lead Generator" className="h-14 md:h-18 mx-auto" style={{ maxWidth: '100%' }} />
        </div>

        {notification && (
          <div
            className={`mb-4 p-4 rounded ${
              notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {notification.message}
            <button
              onClick={() => setNotification(null)}
              className="float-right text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        )}

        <div className="mb-6 flex border-b border-gray-200">
          <button
            className={`py-2 px-4 text-center ${
              activeTab === 'form'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('form')}
          >
            Generate Lead
          </button>
          <button
            className={`py-2 px-4 text-center ${
              activeTab === 'tracking'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('tracking')}
          >
            Track Leads
          </button>
        </div>

        {activeTab === 'form' ? (
          <LeadForm onSubmit={handleSubmitLead} isSubmitting={isSubmitting} />
        ) : (
          <LeadTracking salesPerson={currentSalesPerson} />
        )}
        
        {/* Footer with About and Privacy links */}
        <footer className="mt-10 text-center text-sm text-gray-500">
          <div className="flex justify-center space-x-6">
            <a 
              href="#about" 
              onClick={(e) => {
                e.preventDefault();
                window.alert('About Us: This is a tool to submit internet leads to CDK CRM Demo Environments for CDK Global Sales and Demo teams.');
              }}
              className="hover:text-blue-600 hover:underline"
            >
              About Us
            </a>
            <a 
              href="#privacy" 
              onClick={(e) => {
                e.preventDefault();
                window.alert('Privacy: Any information submitted is used only for demonstration purposes in CDK\'s CRM Demo environments. All data is purged periodically.');
              }}
              className="hover:text-blue-600 hover:underline"
            >
              Privacy Policy
            </a>
          </div>
          <p className="mt-2">© {new Date().getFullYear()} Blockhead Solutions</p>
        </footer>

        <InstallPrompt />
      </div>
    </main>
  );
}
