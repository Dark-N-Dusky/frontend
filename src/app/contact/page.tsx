import Link from 'next/link';

export default function ContactUs() {
  const cardClass =
    'border rounded-md py-2 px-4 bg-neutral-900 w-full md:min-w-1/5 md:m-4 my-4 hover:bg-neutral-800';

  return (
    <div className="bg-black text-white">
      <h2 className="text-center text-3xl p-3">Contact Us</h2>
      <div className="flex flex-col justify-center md:flex-row p-4">
        <div className={cardClass}>
          <p className="font-semibold">Email address</p>
          <Link
            href="mailto:contactus@darkanddusky.com"
            className="hover:underline-offset-2 hover:underline"
          >
            contactus@darkanddusky.com
          </Link>
        </div>
        <div className={cardClass}>
          <p className="font-semibold">Contact Number</p>
          <Link
            href="tel:9389626822"
            className="hover:underline-offset-2 hover:underline"
          >
            9389626822
          </Link>
        </div>
        <div className={cardClass}>
          <p className="font-semibold">Write to</p>
          <p>Tad Bagiya, Kanpur - 208010</p>
        </div>
      </div>
    </div>
  );
}
