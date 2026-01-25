interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeChartModal({
  isOpen,
  onClose,
}: SizeChartModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full text-black">
        <h2 className="text-xl font-bold mb-4 text-center">Belt Size Chart</h2>
        <table className="w-full text-left border-collapse ">
          <thead>
            <tr className="border-b">
              <th className="p-2">Size</th>
              <th className="p-2">Waist Size (Inches)</th>
              <th className="p-2">Waist Size (CM)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b even:bg-white odd:bg-gray-100">
              <td className="p-2">XS</td>
              <td className="p-2">26-28</td>
              <td className="p-2">67-72</td>
            </tr>
            <tr className="border-b even:bg-white odd:bg-gray-100">
              <td className="p-2">S</td>
              <td className="p-2">30-32</td>
              <td className="p-2">77-82</td>
            </tr>
            <tr className="border-b even:bg-white odd:bg-gray-100">
              <td className="p-2">M</td>
              <td className="p-2">34-36</td>
              <td className="p-2">87-92</td>
            </tr>
            <tr className="border-b even:bg-white odd:bg-gray-100">
              <td className="p-2">L</td>
              <td className="p-2">38-40</td>
              <td className="p-2">97-102</td>
            </tr>
            <tr className="border-b even:bg-white odd:bg-gray-100">
              <td className="p-2">XL</td>
              <td className="p-2">42</td>
              <td className="p-2">107</td>
            </tr>
            <tr className="border-b even:bg-white odd:bg-gray-100">
              <td className="p-2">2XL</td>
              <td className="p-2">44</td>
              <td className="p-2">112</td>
            </tr>
            <tr className="border-b even:bg-white odd:bg-gray-100">
              <td className="p-2">3XL</td>
              <td className="p-2">46</td>
              <td className="p-2">117</td>
            </tr>
            <tr className="border-b even:bg-white odd:bg-gray-100">
              <td className="p-2">4XL</td>
              <td className="p-2">48</td>
              <td className="p-2">122</td>
            </tr>
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-800 text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
