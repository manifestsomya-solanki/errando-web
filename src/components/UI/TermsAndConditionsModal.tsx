import { useState, useEffect } from "react";
import Button from "./Button";
import Heading from "./Heading";
import { API_BASE_URL } from "../../config/api";

interface TermsAndCondition {
  id: number;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsAndConditionsModal = ({ isOpen, onClose }: TermsAndConditionsModalProps) => {
  const [terms, setTerms] = useState<TermsAndCondition | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTerms();
    }
  }, [isOpen]);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/terms-and-conditions`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTerms(data.data);
      } else {
        console.error("Failed to fetch terms and conditions");
      }
    } catch (error) {
      console.error("Error fetching terms and conditions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden mt-4 rounded-sm mb-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <Heading
            variant="bigTitle"
            text="Terms & Conditions"
            headingclassname="!font-bold !font-poppins-bold tracking-wide dark:text-darktextColor"
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryBlue"></div>
            </div>
          ) : terms ? (
            <>
              <div 
                className="quill-content max-w-none text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: terms.content }}
              />
              <style>{`
                .quill-content {
                  line-height: 1.6;
                }
                
                /* Preserve Quill's exact formatting */
                .quill-content h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
                .quill-content h2 { font-size: 1.5em; font-weight: bold; margin: 0.83em 0; }
                .quill-content h3 { font-size: 1.17em; font-weight: bold; margin: 1em 0; }
                .quill-content h4 { font-size: 1em; font-weight: bold; margin: 1.33em 0; }
                .quill-content h5 { font-size: 0.83em; font-weight: bold; margin: 1.67em 0; }
                .quill-content h6 { font-size: 0.67em; font-weight: bold; margin: 2.33em 0; }
                
                .quill-content p { margin-bottom: 1em; }
                .quill-content strong, .quill-content b { font-weight: bold; }
                .quill-content em, .quill-content i { font-style: italic; }
                .quill-content u { text-decoration: underline; }
                .quill-content s { text-decoration: line-through; }
                
                .quill-content ul { list-style-type: disc; margin: 1em 0; padding-left: 2em; }
                .quill-content ol { list-style-type: decimal; margin: 1em 0; padding-left: 2em; }
                .quill-content li { margin-bottom: 0.5em; }
                
                .quill-content blockquote {
                  border-left: 4px solid #ccc;
                  margin: 1em 0;
                  padding-left: 1em;
                  font-style: italic;
                }
                
                .quill-content a { color: #06c; text-decoration: underline; }
                
                /* Preserve inline styles (font-size, color, etc.) */
                .quill-content [style*="font-size"] { }
                .quill-content [style*="color"] { }
                .quill-content [style*="background"] { }
                .quill-content [style*="font-family"] { }
                
                /* Quill size classes */
                .quill-content .ql-size-small { font-size: 0.75em; }
                .quill-content .ql-size-large { font-size: 1.5em; }
                .quill-content .ql-size-huge { font-size: 2.5em; }
                
                /* Text alignment */
                .quill-content .ql-align-center { text-align: center; }
                .quill-content .ql-align-right { text-align: right; }
                .quill-content .ql-align-justify { text-align: justify; }
              `}</style>
            </>
          ) : (
            <div className="text-center py-8">
              <Heading
                variant="headingTitle"
                text="Terms & Conditions not available"
                headingclassname="text-gray-500 dark:text-gray-400"
              />
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Please contact support for more information.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="filled"
            color="primary"
            onClick={onClose}
            buttonClassName="px-7 py-2 rounded-sm"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
