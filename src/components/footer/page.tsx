import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer className="bg-stone-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <Image
                src="https://res.cloudinary.com/dn3jc0m8s/image/upload/v1750235529/logo_short_white_qhkbqc.png"
                className="h-8 me-3"
                alt="Dark & Dusky Logo"
                width={60}
                height={40}
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                Dark & Dusky
              </span>
            </Link>
            <p className="text-white my-2 mt-4">
              Dark & Dusky is a fashion brand that offers a wide range of
              genuine leather products.
            </p>
            <p className="text-white my-2">Email: dzinternational7@gmail.com</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Shopping
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link href="/product" className="hover:underline">
                    All Products
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/product" className="hover:underline">
                    Women's
                  </Link>
                </li>
                <li>
                  <Link href="/product" className="hover:underline">
                    Men's
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Account
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link href="/profile" className="hover:underline">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/order" className="hover:underline">
                    Orders
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Legal
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link href="/privacypolicy.html" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="/termsncondition.html"
                    className="hover:underline"
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            &copy; {year + ' '}
            <Link href="/" className="hover:underline">
              Dark and Dusky
            </Link>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
