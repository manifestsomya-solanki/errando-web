import icon1 from "../../../assets/Instagram.svg";
import icon2 from "../../../assets/Linkdin.svg";
import icon3 from "../../../assets/Twitter.svg";
import icon4 from "../../../assets/Facebook.svg";

function Footer() {
  return (
    <footer className="bg-[#F6F6F6] dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-5">
          <div>
            <h2 className="mb-6 text-md font-bold text-primaryYellow uppercase dark:text-white">
              ERRANDO
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Blog
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-md font-bold text-gray-900 uppercase dark:text-white">
              Customer
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  How it works
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Category
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-md font-bold text-gray-900 uppercase dark:text-white">
              Pro's
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  How it works
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Pricing
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-md font-bold text-gray-900 uppercase dark:text-white">
              Privacy
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Privacy
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Terms
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-md font-bold text-gray-900 uppercase dark:text-white">
              Contact Us
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  +013212 131212
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  info@erranddo.com
                </a>
              </li>
              <div className="px-auto">
                <ul className="flex space-x-4">
                  <li>
                    <a href="#" className="hover:text-primaryYellow">
                      <img src={icon1} />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primaryYellow">
                      <img src={icon2} />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primaryYellow">
                      <img src={icon3} />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primaryYellow">
                      <img src={icon4} />
                    </a>
                  </li>
                </ul>
              </div>
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-center px-auto py-6 ">
          <span className="text-sm text-gray-500 dark:text-gray-300">
            © {new Date().getFullYear()} <a href="/errando.com">Errando.com</a>.
            All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
