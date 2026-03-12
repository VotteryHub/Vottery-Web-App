import React, { useRef } from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ContractManagementPanel = ({ formData, onChange, errors }) => {
  const signatureCanvasRef = useRef(null);

  const contractTypes = [
    { value: '', label: 'Select Contract Type' },
    { value: 'standard', label: 'Standard Advertising Agreement' },
    { value: 'premium', label: 'Premium Partnership Agreement' },
    { value: 'enterprise', label: 'Enterprise Custom Agreement' }
  ];

  const handleSignatureCapture = () => {
    // Simulate signature capture
    const signatureData = `data:image/png;base64,signature_${Date.now()}`;
    onChange('digitalSignature', signatureData);
    onChange('signatureDate', new Date()?.toISOString());
  };

  const clearSignature = () => {
    onChange('digitalSignature', null);
    onChange('signatureDate', '');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">
          Contract Management
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Review and sign the advertising agreement to complete registration
        </p>
      </div>

      <Select
        label="Contract Type"
        value={formData?.contractType}
        onChange={(e) => onChange('contractType', e?.target?.value)}
        options={contractTypes}
        error={errors?.contractType}
        required
      />

      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-heading font-semibold text-foreground">
            Advertising Agreement
          </h4>
          <Button variant="outline" size="sm" iconName="Download">
            Download PDF
          </Button>
        </div>

        <div className="bg-muted/30 rounded-lg p-4 max-h-[400px] overflow-y-auto text-sm text-muted-foreground space-y-3">
          <h5 className="font-semibold text-foreground">BRAND ADVERTISER AGREEMENT</h5>
          
          <p>
            This Brand Advertiser Agreement ("Agreement") is entered into between Vottery Platform ("Platform") and the advertiser ("Advertiser") as identified in the registration information.
          </p>

          <h6 className="font-semibold text-foreground mt-4">1. ADVERTISING SERVICES</h6>
          <p>
            The Platform agrees to provide advertising services including sponsored elections, participatory campaigns, and targeted voter engagement opportunities as outlined in the service specifications.
          </p>

          <h6 className="font-semibold text-foreground mt-4">2. PAYMENT TERMS</h6>
          <p>
            Advertiser agrees to pay all fees associated with advertising campaigns according to the pricing structure selected. Payment is due within 30 days of invoice date. Late payments may incur additional fees.
          </p>

          <h6 className="font-semibold text-foreground mt-4">3. CONTENT STANDARDS</h6>
          <p>
            All advertising content must comply with Platform content policies, applicable laws, and industry standards. The Platform reserves the right to reject or remove content that violates these standards.
          </p>

          <h6 className="font-semibold text-foreground mt-4">4. DATA PROTECTION</h6>
          <p>
            Both parties agree to comply with all applicable data protection laws including GDPR, CCPA, and other regional privacy regulations. Advertiser data will be processed according to our Privacy Policy.
          </p>

          <h6 className="font-semibold text-foreground mt-4">5. INTELLECTUAL PROPERTY</h6>
          <p>
            Advertiser retains ownership of all advertising content and brand materials. Platform retains ownership of the platform technology and analytics tools.
          </p>

          <h6 className="font-semibold text-foreground mt-4">6. TERMINATION</h6>
          <p>
            Either party may terminate this Agreement with 30 days written notice. Termination does not relieve Advertiser of payment obligations for services already rendered.
          </p>

          <h6 className="font-semibold text-foreground mt-4">7. LIABILITY AND INDEMNIFICATION</h6>
          <p>
            Platform's liability is limited to the amount paid by Advertiser in the preceding 12 months. Advertiser agrees to indemnify Platform against claims arising from Advertiser's content or campaigns.
          </p>

          <h6 className="font-semibold text-foreground mt-4">8. GOVERNING LAW</h6>
          <p>
            This Agreement shall be governed by the laws of the jurisdiction in which the Platform operates, without regard to conflict of law principles.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-heading font-semibold text-foreground">Agreement Acceptance</h4>
        
        <label className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors">
          <Checkbox
            checked={formData?.agreedToTerms}
            onCheckedChange={(checked) => onChange('agreedToTerms', checked)}
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">
              I agree to the Terms and Conditions *
            </p>
            <p className="text-xs text-muted-foreground">
              I have read, understood, and agree to be bound by the terms of this Advertising Agreement.
            </p>
          </div>
        </label>
        {errors?.agreedToTerms && (
          <p className="text-sm text-destructive">{errors?.agreedToTerms}</p>
        )}

        <label className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors">
          <Checkbox
            checked={formData?.agreedToPrivacyPolicy}
            onCheckedChange={(checked) => onChange('agreedToPrivacyPolicy', checked)}
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">
              I agree to the Privacy Policy *
            </p>
            <p className="text-xs text-muted-foreground">
              I acknowledge that my data will be processed according to the Platform's Privacy Policy and applicable data protection laws.
            </p>
          </div>
        </label>
        {errors?.agreedToPrivacyPolicy && (
          <p className="text-sm text-destructive">{errors?.agreedToPrivacyPolicy}</p>
        )}
      </div>

      <div className="pt-6 border-t border-border">
        <h4 className="text-base font-heading font-semibold text-foreground mb-4">Digital Signature</h4>
        
        {!formData?.digitalSignature ? (
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg border-2 border-dashed border-border p-8 text-center">
              <Icon name="PenTool" size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground mb-2">
                Sign the agreement digitally
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Your digital signature will be legally binding
              </p>
              <Button onClick={handleSignatureCapture} iconName="Edit">
                Capture Signature
              </Button>
            </div>
            {errors?.digitalSignature && (
              <p className="text-sm text-destructive">{errors?.digitalSignature}</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                  <span className="text-sm font-medium text-foreground">Signature Captured</span>
                </div>
                <Button variant="outline" size="sm" iconName="Trash2" onClick={clearSignature}>
                  Clear
                </Button>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Calendar" size={16} />
                  <span>Signed on {new Date(formData?.signatureDate)?.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Icon name="User" size={16} />
                  <span>{formData?.representativeName}</span>
                </div>
              </div>
            </div>

            <div className="bg-success/5 rounded-lg p-4 border border-success/20">
              <div className="flex items-start gap-3">
                <Icon name="Shield" size={20} className="text-success mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-success mb-1">Legally Binding Signature</p>
                  <p className="text-xs text-muted-foreground">
                    Your digital signature has been securely recorded and is legally binding under electronic signature laws.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractManagementPanel;