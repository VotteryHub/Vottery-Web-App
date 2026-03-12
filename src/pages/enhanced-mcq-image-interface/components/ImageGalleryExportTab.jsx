import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import mcqService from '../../../services/mcqService';

const ImageGalleryExportTab = ({ electionId, questions = [] }) => {
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState(null);

  const allImages = [];
  questions?.forEach((q, qIdx) => {
    if (q?.questionImageUrl) {
      allImages?.push({ type: 'question', questionIdx: qIdx + 1, url: q?.questionImageUrl, label: `Q${qIdx + 1} Header` });
    }
    Object.entries(q?.optionImages || {})?.forEach(([optIdx, url]) => {
      allImages?.push({ type: 'option', questionIdx: qIdx + 1, optionIdx: Number(optIdx) + 1, url, label: `Q${qIdx + 1} Option ${Number(optIdx) + 1}` });
    });
  });

  const handleExport = async () => {
    if (!electionId?.trim()) {
      setExportResult({ error: 'Please provide an Election ID' });
      return;
    }
    setExporting(true);
    try {
      const { data, error } = await mcqService?.exportImageGallery(electionId);
      if (error) {
        setExportResult({ error: error?.message });
      } else {
        setExportResult({ success: true, count: allImages?.length });
      }
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadPreview = () => {
    const exportData = {
      election_id: electionId || 'preview',
      exported_at: new Date()?.toISOString(),
      total_images: allImages?.length,
      images: allImages
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcq_image_gallery_${electionId || 'preview'}.json`;
    a?.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
            <Icon name="Download" size={20} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Image Gallery Export</h3>
            <p className="text-sm text-muted-foreground">{allImages?.length} images available for export</p>
          </div>
        </div>

        {exportResult && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            exportResult?.error ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {exportResult?.error || `✅ Exported ${exportResult?.count} images to mcq_image_gallery_exports table`}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            disabled={exporting || allImages?.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {exporting ? <Icon name="Loader" size={16} className="animate-spin" /> : <Icon name="Database" size={16} />}
            Export to Supabase
          </button>
          <button
            onClick={handleDownloadPreview}
            disabled={allImages?.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 text-foreground rounded-lg text-sm font-medium transition-colors"
          >
            <Icon name="FileJson" size={16} />
            Download JSON
          </button>
        </div>
      </div>

      {/* Image Grid */}
      {allImages?.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h4 className="font-semibold text-foreground mb-4">Gallery Preview ({allImages?.length} images)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allImages?.map((img, idx) => (
              <div key={idx} className="group relative">
                <img
                  src={img?.url}
                  alt={img?.label}
                  className="w-full h-32 object-cover rounded-xl border border-gray-200 group-hover:border-primary transition-colors"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-xl transition-all flex items-end">
                  <div className="w-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium truncate">{img?.label}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      img?.type === 'question' ? 'bg-blue-500' : 'bg-purple-500'
                    } text-white`}>
                      {img?.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <Icon name="Images" size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-muted-foreground">No images uploaded yet</p>
          <p className="text-sm text-muted-foreground mt-1">Upload images in the Image Option Builder tab</p>
        </div>
      )}
    </div>
  );
};

export default ImageGalleryExportTab;
