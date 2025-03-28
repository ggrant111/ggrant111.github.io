import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { VehicleSelector } from '@/components/VehicleSelector';
import { LeadFormData, VehicleInfo, Salesperson } from '@/types/lead';

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const LeadForm = ({ onSubmit, isSubmitting }: LeadFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [salespeople, setSalespeople] = useState<Salesperson[]>([]);
  const [isLoadingSalespeople, setIsLoadingSalespeople] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LeadFormData>();
  
  const selectedVehicle = watch('vehicle');
  const selectedSalesperson = watch('sentBy');
  
  const comments = [
    'What is the availability of this vehicle?',
    'Can I get more information on financing?',
    'Are there any ongoing promotions?',
    'Can I schedule a test drive?',
    'What is the warranty coverage?',
    'Do you offer trade-in evaluations?',
    'What are your current interest rates?',
    'Is there a military/first responder discount available?',
    'Do you have any other colors available?',
    'Can you provide a detailed list of features on this model?',
    'What additional packages or options can be added?',
    'Are there any manufacturer rebates or incentives?',
    'What is your best out-the-door price?',
    'Do you offer home delivery services?',
    'Can I get information about certified pre-owned options?',
    'What documentation do I need to bring for financing?',
    'Do you have any vehicles with similar features at a lower price point?'
  ];
  
  const destinations = [
    { name: 'Excellence Motors', email: 'excellencemotors@eleadtrack.net' },
    { name: 'Universal Motors', email: 'excellencegm@eleadtrack.net' },
    { name: 'Excellence Ford', email: 'excellenceford@eleadtrack.net' },
  ];
  
  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);
  
  // Load salespeople from Supabase on component mount
  useEffect(() => {
    const fetchSalespeople = async () => {
      setIsLoadingSalespeople(true);
      setApiError(null);
      
      try {
        const response = await fetch('/api/salespeople');
        const result = await response.json();
        
        if (result.success) {
          setSalespeople(result.data);
        } else {
          setApiError(result.error || 'Failed to fetch salespeople from API');
          setSalespeople([]);
        }
      } catch (error) {
        console.error('Error fetching salespeople:', error);
        setApiError(error instanceof Error ? error.message : 'Unknown error fetching salespeople');
        setSalespeople([]);
      } finally {
        setIsLoadingSalespeople(false);
      }
    };
    
    fetchSalespeople();
  }, []);
  
  // Save salesperson to Supabase when form is submitted
  const handleSaveAndSubmit: SubmitHandler<LeadFormData> = async (data) => {
    try {
      setApiError(null);
      
      if (data.sentBy && data.sentBy !== 'new') {
        try {
          // Try to save the salesperson name to Supabase
          const response = await fetch('/api/salespeople', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: data.sentBy }),
          });
          
          const result = await response.json();
          
          if (!result.success) {
            setApiError(result.error || 'Failed to save salesperson');
            return;
          }
        } catch (error) {
          console.error('Failed to save salesperson:', error);
          setApiError(error instanceof Error ? error.message : 'Failed to save salesperson');
          return;
        }
      }
      
      // Submit the lead data
      await onSubmit(data);
    } catch (error) {
      console.error('Error in form submission:', error);
      setApiError(error instanceof Error ? error.message : 'Error during form submission');
    }
  };
  
  const generateRandomData = async () => {
    try {
      const response = await fetch('https://randomuser.me/api/?nat=us');
      const data = await response.json();
      const lead = data.results[0];
      
      setValue('firstName', lead.name.first);
      setValue('lastName', lead.name.last);
      setValue('email', lead.email);
      setValue('phone', lead.phone);
      setValue('address.street', `${lead.location.street.number} ${lead.location.street.name}`);
      setValue('address.city', lead.location.city);
      setValue('address.state', lead.location.state.slice(0, 2).toUpperCase());
      setValue('address.postalCode', lead.location.postcode.toString());
    } catch (error) {
      console.error('Error fetching random user data:', error);
    }
  };
  
  // Update the input field styling to add more contrast
  const inputClassName = "mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm py-2 px-3 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const selectClassName = "mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm py-2 px-3 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  
  const formSubmit: SubmitHandler<LeadFormData> = async (data) => {
    await handleSaveAndSubmit(data);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white px-6 py-5">
        {/* <div className="flex justify-center items-center">
          <img src="/logo.svg" alt="Lead Generator" className="h-8 md:h-10" />
        </div> */}
        <div className="flex mt-6">
          {[1, 2, 3, 4].map((step) => (
            <div 
              key={step} 
              className={`flex-1 border-b-2 pb-2 ${currentStep >= step ? 'border-white' : 'border-blue-400'}`}
            >
              <span className={`font-medium ${currentStep >= step ? 'text-white' : 'text-blue-300'}`}>
                Step {step}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-6 mt-4" role="alert">
          <strong className="font-bold">API Error: </strong>
          <span className="block sm:inline">{apiError}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit(formSubmit)} className="p-6 bg-gray-50">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Customer Information</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  className={inputClassName}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  className={inputClassName}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Please enter a valid email'
                  }
                })}
                className={inputClassName}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                {...register('phone', { required: 'Phone is required' })}
                className={inputClassName}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={generateRandomData}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Generate Random Data
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Address Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Street</label>
              <input
                type="text"
                {...register('address.street', { required: 'Street is required' })}
                className={inputClassName}
              />
              {errors.address?.street && (
                <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
              )}
            </div>
            
            <div className="flex flex-col space-y-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  {...register('address.city', { required: 'City is required' })}
                  className={inputClassName}
                />
                {errors.address?.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
                )}
              </div>
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    {...register('address.state', { 
                      required: 'State is required',
                      maxLength: { value: 2, message: 'Use 2-letter abbreviation' }
                    })}
                    className={inputClassName}
                  />
                  {errors.address?.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>
                  )}
                </div>
                <div className="w-2/3">
                  <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                  <input
                    type="text"
                    {...register('address.postalCode', { required: 'Zip code is required' })}
                    className={inputClassName}
                  />
                  {errors.address?.postalCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.postalCode.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Vehicle Information</h3>
            <VehicleSelector 
              value={selectedVehicle} 
              onChange={(vehicle: VehicleInfo | undefined) => setValue('vehicle', vehicle)} 
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Comment or Question</label>
              <select
                {...register('comment', { required: 'Please select a comment' })}
                className={selectClassName}
              >
                <option value="">Please select a comment or question</option>
                {comments.map((comment, index) => (
                  <option key={index} value={comment}>{comment}</option>
                ))}
              </select>
              {errors.comment && (
                <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Send Lead</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Destination</label>
              <select
                {...register('destination', { required: 'Please select a destination' })}
                className={selectClassName}
              >
                <option value="">Select destination</option>
                {destinations.map((destination, index) => (
                  <option key={index} value={destination.email}>{destination.name}</option>
                ))}
              </select>
              {errors.destination && (
                <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Sales Person</label>
              <div className="flex space-x-2">
                {isLoadingSalespeople ? (
                  <div className="w-full py-2 text-gray-500">Loading salespeople...</div>
                ) : salespeople.length > 0 ? (
                  <select
                    {...register('sentBy', { required: 'Sales person name is required' })}
                    className={`${selectClassName} flex-grow`}
                    onChange={(e) => {
                      if (e.target.value === 'new') {
                        setValue('sentBy', '');
                      }
                    }}
                  >
                    <option value="">Select a salesperson</option>
                    {salespeople.map((sp) => (
                      <option key={sp.id} value={sp.name}>{sp.name}</option>
                    ))}
                    <option value="new">Enter a new name</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    {...register('sentBy', { required: 'Sales person name is required' })}
                    className={`${inputClassName} flex-grow`}
                    placeholder="Your name"
                  />
                )}
              </div>
              {selectedSalesperson === 'new' && (
                <input
                  type="text"
                  {...register('sentBy', { required: 'Sales person name is required' })}
                  className={`${inputClassName} mt-2`}
                  placeholder="Enter your name"
                />
              )}
              {errors.sentBy && (
                <p className="mt-1 text-sm text-red-600">{errors.sentBy.message}</p>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:bg-green-300"
              >
                {isSubmitting ? 'Sending...' : 'Send Lead'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}; 