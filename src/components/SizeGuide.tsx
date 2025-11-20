import { memo } from "react";
import { Ruler, X } from "lucide-react";

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

const SizeGuide = memo(({ isOpen, onClose, category = "general" }: SizeGuideProps) => {
  if (!isOpen) return null;

  const menSizes = [
    { size: "S", chest: "36-38", waist: "30-32", hips: "36-38" },
    { size: "M", chest: "38-40", waist: "32-34", hips: "38-40" },
    { size: "L", chest: "40-42", waist: "34-36", hips: "40-42" },
    { size: "XL", chest: "42-44", waist: "36-38", hips: "42-44" },
    { size: "XXL", chest: "44-46", waist: "38-40", hips: "44-46" },
  ];

  const womenSizes = [
    { size: "XS", chest: "32-34", waist: "24-26", hips: "34-36" },
    { size: "S", chest: "34-36", waist: "26-28", hips: "36-38" },
    { size: "M", chest: "36-38", waist: "28-30", hips: "38-40" },
    { size: "L", chest: "38-40", waist: "30-32", hips: "40-42" },
    { size: "XL", chest: "40-42", waist: "32-34", hips: "42-44" },
  ];

  const sizes = category.toLowerCase().includes("women") ? womenSizes : menSizes;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <Ruler className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-bold">Size Guide</h2>
              <p className="text-sm text-purple-100">Find your perfect fit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Size Chart */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Size Chart (inches)</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white/10 backdrop-blur-xl">
                    <th className="border border-white/20 px-4 py-3 text-left text-white font-semibold">
                      Size
                    </th>
                    <th className="border border-white/20 px-4 py-3 text-left text-white font-semibold">
                      Chest
                    </th>
                    <th className="border border-white/20 px-4 py-3 text-left text-white font-semibold">
                      Waist
                    </th>
                    <th className="border border-white/20 px-4 py-3 text-left text-white font-semibold">
                      Hips
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((size, index) => (
                    <tr
                      key={size.size}
                      className={`${
                        index % 2 === 0 ? "bg-white/5" : "bg-white/10"
                      } hover:bg-white/20 transition-colors`}
                    >
                      <td className="border border-white/20 px-4 py-3 text-white font-bold">
                        {size.size}
                      </td>
                      <td className="border border-white/20 px-4 py-3 text-slate-300">
                        {size.chest}"
                      </td>
                      <td className="border border-white/20 px-4 py-3 text-slate-300">
                        {size.waist}"
                      </td>
                      <td className="border border-white/20 px-4 py-3 text-slate-300">
                        {size.hips}"
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Measurement Guide */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">How to Measure</h3>
            <div className="space-y-4 text-slate-300">
              <div>
                <h4 className="font-semibold text-white mb-2">👔 Chest</h4>
                <p className="text-sm">
                  Measure around the fullest part of your chest, keeping the tape parallel to
                  the floor.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">📏 Waist</h4>
                <p className="text-sm">
                  Measure around your natural waistline, keeping the tape comfortably loose.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">👖 Hips</h4>
                <p className="text-sm">
                  Measure around the fullest part of your hips, keeping the tape parallel to
                  the floor.
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-bold text-white mb-3">💡 Fitting Tips</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Always refer to the size chart before purchasing</li>
              <li>• If between sizes, we recommend sizing up for a comfortable fit</li>
              <li>• Different brands may have slight variations in sizing</li>
              <li>• Contact our support team if you need assistance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

SizeGuide.displayName = "SizeGuide";

export default SizeGuide;
