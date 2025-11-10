import { useState, useEffect } from "react";
import Heading from "../../components/UI/Heading";
import Button from "../../components/UI/Button";
import BackArrow from "../../assets/BackArrow";
import { API_BASE_URL } from "../../config/api";
import HomeTopBar from "../../components/customer/home/HomeTopBar";
import Footer from "../../components/customer/home/Footer";

interface TermsAndCondition {
  id: number;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const TermsAndConditionsPage = () => {
  const [terms, setTerms] = useState<TermsAndCondition | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTerms();
  }, []);

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

  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col">
      <HomeTopBar />
      <div className="bg-white dark:bg-gray-800 flex-grow">
        <div className="w-full xl:px-36 lg:px-12 md:px-12 xs:px-3">
          <div className="flex items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <Heading
              variant="bigTitle"
              text="Terms & Conditions"
              headingclassname="!font-bold !font-poppins-bold tracking-wide dark:text-darktextColor"
            />
          </div>
          
          <div className="px-6 pt-2 pb-8">
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
                  .quill-content [style*="font-size"] { }
                  .quill-content [style*="color"] { }
                  .quill-content [style*="background"] { }
                  .quill-content [style*="font-family"] { }
                  .quill-content .ql-size-small { font-size: 0.75em; }
                  .quill-content .ql-size-large { font-size: 1.5em; }
                  .quill-content .ql-size-huge { font-size: 2.5em; }
                  .quill-content .ql-align-center { text-align: center; }
                  .quill-content .ql-align-right { text-align: right; }
                  .quill-content .ql-align-justify { text-align: justify; }
                `}</style>
                <div className="mt-8 flex justify-center items-center gap-4">
                  <button
                    type="button"
                    className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none outline-none p-0"
                    onClick={() => {
                      window.close();
                    }}
                  >
                    <div className="flex-shrink-0">
                      <BackArrow color="black" />
                    </div>
                    <span className="text-textColor font-semibold tracking-wide dark:text-darktextColor text-sm">
                      Back
                    </span>
                  </button>
                  <Button
                    variant="filled"
                    color="primary"
                    onClick={() => {
                      localStorage.setItem("termsAgreed", "true");
                      window.close();
                    }}
                    buttonClassName="px-7 py-2 rounded-sm"
                  >
                    I Agree
                  </Button>
                </div>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage;

