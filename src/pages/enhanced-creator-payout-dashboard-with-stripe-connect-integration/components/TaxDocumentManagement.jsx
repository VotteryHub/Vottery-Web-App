import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TaxDocumentManagement = ({ userId }) => {
  const [taxType, setTaxType] = useState('W-9');
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    legalName: '',
    taxId: '',
    address: '',
    country: 'US',
    businessType: 'individual'
  });

  const handleFileUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUploadedDocs(prev => [...prev, {
        id: Date.now(),
        name: file?.name,
        type: taxType,
        size: `${(file?.size / 1024)?.toFixed(1)} KB`,
        status: 'pending_review',
        uploadedAt: new Date()?.toISOString()
      }]);
    } finally {
      setUploading(false);
    }
  };

  const jurisdictions = [
    { country: 'US', form: 'W-9', deadline: 'Jan 31', description: 'For US persons and entities' },
    { country: 'International', form: 'W-8BEN', deadline: 'Dec 31', description: 'For non-US individuals' },
    { country: 'International Entity', form: 'W-8BEN-E', deadline: 'Dec 31', description: 'For non-US entities' }
  ];

  return (
    <div className="space-y-6">
      {/* Tax Classification */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="FileText" size={20} className="text-blue-500" />
          Tax Document Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {jurisdictions?.map(j => (
            <button
              key={j?.form}
              onClick={() => setTaxType(j?.form)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                taxType === j?.form
                  ? 'border-primary bg-primary/5' :'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
            >
              <p className="font-bold text-lg text-foreground">{j?.form}</p>
              <p className="text-sm text-muted-foreground mt-1">{j?.description}</p>
              <p className="text-xs text-orange-600 mt-2">Deadline: {j?.deadline}</p>
            </button>
          ))}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Legal Name</label>
            <input
              type="text"
              value={formData?.legalName}
              onChange={e => setFormData(p => ({ ...p, legalName: e?.target?.value }))}
              placeholder="As it appears on tax documents"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {taxType === 'W-9' ? 'SSN / EIN' : 'Foreign Tax ID'}
            </label>
            <input
              type="text"
              value={formData?.taxId}
              onChange={e => setFormData(p => ({ ...p, taxId: e?.target?.value }))}
              placeholder={taxType === 'W-9' ? 'XXX-XX-XXXX' : 'Foreign tax identification number'}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Business Type</label>
            <select
              value={formData?.businessType}
              onChange={e => setFormData(p => ({ ...p, businessType: e?.target?.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="individual">Individual</option>
              <option value="sole_proprietor">Sole Proprietor</option>
              <option value="llc">LLC</option>
              <option value="corporation">Corporation</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Country</label>
            <select
              value={formData?.country}
              onChange={e => setFormData(p => ({ ...p, country: e?.target?.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
      {/* Document Upload */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Upload" size={20} className="text-green-500" />
          Upload {taxType} Document
        </h3>
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 hover:border-primary transition-colors text-center">
            {uploading ? (
              <Icon name="Loader" size={32} className="animate-spin text-primary mx-auto mb-2" />
            ) : (
              <Icon name="FileUp" size={32} className="text-muted-foreground mx-auto mb-2" />
            )}
            <p className="font-medium text-foreground">{uploading ? 'Uploading...' : `Upload ${taxType} Form`}</p>
            <p className="text-sm text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
          </div>
          <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileUpload} className="hidden" disabled={uploading} />
        </label>

        {/* Uploaded Documents */}
        {uploadedDocs?.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedDocs?.map(doc => (
              <div key={doc?.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Icon name="FileText" size={20} className="text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{doc?.name}</p>
                  <p className="text-xs text-muted-foreground">{doc?.type} · {doc?.size} · {new Date(doc.uploadedAt)?.toLocaleDateString()}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Pending Review</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxDocumentManagement;
