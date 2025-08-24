import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, ArrowRight, Calendar, MapPin, Users, Zap, Check, AlertCircle } from 'lucide-react';
import { eventStorage, showToast } from '../utils/eventStorage';

const categories = [
  'Cleanup',
  'Tree-planting', 
  'Workshop',
  'Community Garden',
  'Recycling Drive',
  'Educational Tour',
  'Sustainability Fair',
  'Other'
];

const EventProposalModal = ({ isOpen, onClose, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    category: '',
    dateISO: '',
    startTime: '09:00',
    endTime: '10:00',
    location: {
      address: '',
      lat: null,
      lng: null
    },
    capacity: 50,
    hostName: '',
    contact: '',
    imageUrl: '',
    expectedImpact: {
      co2_kg: 0,
      water_l: 0,
      money_aud: 0
    },
    tags: [],
    status: 'draft',
    createdByEmail: '',
    createdAtISO: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen && user) {
      const newId = eventStorage.generateId();
      setFormData(prev => ({
        ...prev,
        id: newId,
        hostName: user.username || user.email?.split('@')[0] || '',
        contact: user.email || '',
        createdByEmail: user.email || '',
        createdAtISO: new Date().toISOString(),
        dateISO: new Date().toISOString().split('T')[0]
      }));
      setCurrentStep(1);
      setErrors({});
      
      // Focus first input
      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, user]);

  // Handle escape key and backdrop click
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.description.length > 280) newErrors.description = 'Description must be 280 characters or less';
        break;
      case 2:
        if (!formData.dateISO) newErrors.dateISO = 'Date is required';
        if (!formData.startTime) newErrors.startTime = 'Start time is required';
        if (!formData.endTime) newErrors.endTime = 'End time is required';
        if (formData.startTime >= formData.endTime) newErrors.endTime = 'End time must be after start time';
        if (!formData.location.address.trim()) newErrors['location.address'] = 'Location is required';
        break;
      case 3:
        if (!formData.hostName.trim()) newErrors.hostName = 'Host name is required';
        if (!formData.contact.trim()) newErrors.contact = 'Contact information is required';
        if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const saveDraft = async () => {
    try {
      const proposal = { ...formData, status: 'draft' };
      eventStorage.saveProposal(proposal);
      showToast('Draft saved successfully');
      onClose();
    } catch (error) {
      showToast('Error saving draft', 'error');
    }
  };

  const submitProposal = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const proposal = { ...formData, status: 'submitted' };
      eventStorage.saveProposal(proposal);
      
      // Auto-approve for demo (simulate moderation)
      setTimeout(() => {
        proposal.status = 'approved';
        eventStorage.saveProposal(proposal);
        eventStorage.publishProposal(proposal);
      }, 1000);
      
      showToast('Proposal submitted successfully!');
      onClose();
    } catch (error) {
      showToast('Error submitting proposal', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Basics', icon: Calendar },
    { number: 2, title: 'Time & Place', icon: MapPin },
    { number: 3, title: 'Impact & Safety', icon: Users },
    { number: 4, title: 'Review', icon: Check }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900">
            Submit Event Proposal
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted ? 'bg-emerald-600 text-white' :
                    isActive ? 'bg-emerald-100 text-emerald-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <IconComponent className="h-4 w-4" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-emerald-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-px mx-4 ${
                      isCompleted ? 'bg-emerald-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Basics */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  ref={firstInputRef}
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.title ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="e.g., Community Park Cleanup"
                />
                {errors.title && (
                  <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.title}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.category ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.category}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description * ({formData.description.length}/280)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  maxLength={280}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
                    errors.description ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Describe your event and its environmental impact..."
                />
                {errors.description && (
                  <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.description}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          )}

          {/* Step 2: Time & Place */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.dateISO}
                  onChange={(e) => handleInputChange('dateISO', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.dateISO ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.dateISO && (
                  <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.dateISO}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.startTime ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {errors.startTime && (
                    <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.startTime}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.endTime ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {errors.endTime && (
                    <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.endTime}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => handleInputChange('location.address', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors['location.address'] ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="e.g., Central Park, Melbourne VIC"
                />
                {errors['location.address'] && (
                  <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors['location.address']}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Impact & Safety */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Host Name *
                  </label>
                  <input
                    type="text"
                    value={formData.hostName}
                    onChange={(e) => handleInputChange('hostName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.hostName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Your name or organization"
                  />
                  {errors.hostName && (
                    <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.hostName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact *
                  </label>
                  <input
                    type="email"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.contact ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="contact@email.com"
                  />
                  {errors.contact && (
                    <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.contact}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.capacity ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="50"
                />
                {errors.capacity && (
                  <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.capacity}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Expected Environmental Impact
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">CO₂ Reduced (kg)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.expectedImpact.co2_kg}
                      onChange={(e) => handleInputChange('expectedImpact.co2_kg', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Water Saved (L)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.expectedImpact.water_l}
                      onChange={(e) => handleInputChange('expectedImpact.water_l', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Money Saved ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.expectedImpact.money_aud}
                      onChange={(e) => handleInputChange('expectedImpact.money_aud', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Preview</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-emerald-600 text-xl">{formData.title}</h4>
                    <p className="text-gray-600 mt-1">{formData.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="ml-2 text-gray-600">{formData.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Host:</span>
                      <span className="ml-2 text-gray-600">{formData.hostName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Date:</span>
                      <span className="ml-2 text-gray-600">{new Date(formData.dateISO).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Time:</span>
                      <span className="ml-2 text-gray-600">{formData.startTime} - {formData.endTime}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">Location:</span>
                      <span className="ml-2 text-gray-600">{formData.location.address}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Capacity:</span>
                      <span className="ml-2 text-gray-600">{formData.capacity} people</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Contact:</span>
                      <span className="ml-2 text-gray-600">{formData.contact}</span>
                    </div>
                  </div>

                  {(formData.expectedImpact.co2_kg > 0 || formData.expectedImpact.water_l > 0 || formData.expectedImpact.money_aud > 0) && (
                    <div>
                      <span className="font-medium text-gray-700">Expected Impact:</span>
                      <div className="flex space-x-4 mt-1 text-sm">
                        {formData.expectedImpact.co2_kg > 0 && (
                          <span className="text-emerald-600">{formData.expectedImpact.co2_kg}kg CO₂</span>
                        )}
                        {formData.expectedImpact.water_l > 0 && (
                          <span className="text-blue-600">{formData.expectedImpact.water_l}L water</span>
                        )}
                        {formData.expectedImpact.money_aud > 0 && (
                          <span className="text-green-600">${formData.expectedImpact.money_aud}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}
            <button
              onClick={saveDraft}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Save Draft
            </button>
          </div>

          <div className="flex space-x-3">
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={submitProposal}
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Submit Proposal</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventProposalModal;