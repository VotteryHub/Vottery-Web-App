import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const TaxDocumentUpload = ({ onUpload }) => {
  const [taxClassification, setTaxClassification] = useState('us_individual'); // 'us_individual' | 'us_business' | 'international'
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [uploading, setUploading] = useState({});
  const [verificationStatus, setVerificationStatus] = useState({});

  const taxForms = {
    us_individual: {
      form: 'W-9',
      title: 'W-9 Form (US Individuals)',
      description: 'Required for US citizens and residents. Used for tax reporting.',
      fields: ['Full Legal Name', 'SSN or EIN', 'Address', 'Tax Classification']
    },
    us_business: {
      form: 'W-9',
      title: 'W-9 Form (US Business)',
      description: 'Required for US businesses and LLCs.',
      fields: ['Business Name', 'EIN', 'Business Address', 'Entity Type']
    },
    international: {
      form: 'W-8BEN',
      title: 'W-8BEN Form (International)',
      description: 'Required for non-US creators. Certifies foreign status for tax withholding.',
      fields: ['Full Name', 'Country of Citizenship', 'Permanent Address', 'Tax Treaty Benefits']
    }
  };

  const currentForm = taxForms?.[taxClassification];

  const handleFileUpload = async (docType, file) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [docType]: true }));
    try {
      await new Promise(r => setTimeout(r, 1500));
      setUploadedDocs(prev => ({ ...prev, [docType]: { name: file?.name, size: file?.size, uploadedAt: new Date() } }));
      setVerificationStatus(prev => ({ ...prev, [docType]: 'pending' }));
      onUpload?.(docType, file);
    } finally {
      setUploading(prev => ({ ...prev, [docType]: false }));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
      approved: { label: 'Verified', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
    };
    return badges?.[status] || null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
          <Icon name="FileText" size={20} className="text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tax Document Upload</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Required for payment processing compliance</p>
        </div>
      </div>
      {/* Tax Classification */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tax Classification</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'us_individual', label: 'US Individual', icon: 'User', desc: 'W-9 Form' },
            { id: 'us_business', label: 'US Business', icon: 'Building2', desc: 'W-9 Form' },
            { id: 'international', label: 'International', icon: 'Globe', desc: 'W-8BEN Form' }
          ]?.map(opt => (
            <button
              key={opt?.id}
              onClick={() => setTaxClassification(opt?.id)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                taxClassification === opt?.id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon name={opt?.icon} size={16} className={taxClassification === opt?.id ? 'text-green-600' : 'text-gray-500'} />
                <span className={`text-sm font-medium ${taxClassification === opt?.id ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>{opt?.label}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{opt?.desc}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Form Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">{currentForm?.title}</p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">{currentForm?.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {currentForm?.fields?.map(f => (
                <span key={f} className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Upload Area */}
      <div className="space-y-4">
        {[{ id: 'tax_form', label: `${currentForm?.form} Form`, required: true }, { id: 'id_document', label: 'Government ID (Passport/Driver\'s License)', required: true }]?.map(doc => (
          <div key={doc?.id} className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name={uploadedDocs?.[doc?.id] ? 'CheckCircle' : 'Upload'} size={20} className={uploadedDocs?.[doc?.id] ? 'text-green-500' : 'text-gray-400'} />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {doc?.label} {doc?.required && <span className="text-red-500">*</span>}
                  </p>
                  {uploadedDocs?.[doc?.id] ? (
                    <p className="text-xs text-gray-500">{uploadedDocs?.[doc?.id]?.name}</p>
                  ) : (
                    <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {verificationStatus?.[doc?.id] && (() => {
                  const badge = getStatusBadge(verificationStatus?.[doc?.id]);
                  return badge ? <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge?.color}`}>{badge?.label}</span> : null;
                })()}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleFileUpload(doc?.id, e?.target?.files?.[0])}
                    disabled={uploading?.[doc?.id]}
                  />
                  <span className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    {uploading?.[doc?.id] ? <Icon name="Loader" size={14} className="animate-spin" /> : <Icon name="Upload" size={14} />}
                    {uploading?.[doc?.id] ? 'Uploading...' : uploadedDocs?.[doc?.id] ? 'Replace' : 'Upload'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <Icon name="Lock" size={12} className="inline mr-1" />
          Documents are encrypted and stored securely. Used only for tax compliance purposes.
        </p>
      </div>
    </div>
  );
};

export default TaxDocumentUpload;
