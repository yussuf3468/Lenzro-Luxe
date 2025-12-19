import { useState } from "react";
import { X, ShoppingCart, Printer, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Product } from "../types";

interface SaleFormProps {
  products: Product[];
  onClose: () => void;
  onSuccess: () => void;
}

interface SaleItem {
  id: string;
  product: Product;
  quantity: number;
}

export default function SaleForm({
  products,
  onClose,
  onSuccess,
}: SaleFormProps) {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [soldBy, setSoldBy] = useState("Yussuf");
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  const addItem = () => {
    if (!selectedProductId || quantity < 1) return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    if (product.quantity_in_stock < quantity) {
      alert(`Only ${product.quantity_in_stock} items available in stock`);
      return;
    }

    const existingItem = saleItems.find(
      (item) => item.product.id === selectedProductId
    );
    if (existingItem) {
      setSaleItems(
        saleItems.map((item) =>
          item.product.id === selectedProductId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setSaleItems([
        ...saleItems,
        {
          id: crypto.randomUUID(),
          product,
          quantity,
        },
      ]);
    }

    setSelectedProductId("");
    setQuantity(1);
  };

  const removeItem = (id: string) => {
    setSaleItems(saleItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = saleItems.find((item) => item.id === id);
    if (!item) return;

    if (item.product.quantity_in_stock < newQuantity) {
      alert(`Only ${item.product.quantity_in_stock} items available in stock`);
      return;
    }

    setSaleItems(
      saleItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return saleItems.reduce((total, item) => {
      return total + item.product.selling_price * item.quantity;
    }, 0);
  };

  const calculateProfit = () => {
    return saleItems.reduce((profit, item) => {
      const itemProfit =
        (item.product.selling_price - item.product.buying_price) *
        item.quantity;
      return profit + itemProfit;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (saleItems.length === 0) {
      alert("Please add at least one item");
      return;
    }

    if (!soldBy) {
      alert("Please enter staff name");
      return;
    }

    setSubmitting(true);

    try {
      const salesData = saleItems.map((item) => ({
        product_id: item.product.id,
        quantity_sold: item.quantity,
        selling_price: item.product.selling_price,
        buying_price: item.product.buying_price,
        total_sale: item.product.selling_price * item.quantity,
        profit:
          (item.product.selling_price - item.product.buying_price) *
          item.quantity,
        payment_method: paymentMethod,
        sold_by: soldBy,
      }));

      // Insert sales
      const { error: salesError } = await supabase
        .from("sales")
        .insert(salesData);

      if (salesError) throw salesError;

      // Update stock
      for (const item of saleItems) {
        const newStock = item.product.quantity_in_stock - item.quantity;
        const { error: stockError } = await supabase
          .from("products")
          .update({ quantity_in_stock: newStock })
          .eq("id", item.product.id);

        if (stockError) throw stockError;
      }

      // Create receipt
      setReceipt({
        items: saleItems,
        total: calculateTotal(),
        profit: calculateProfit(),
        paymentMethod,
        soldBy,
        date: new Date(),
      });

      onSuccess();
    } catch (error) {
      console.error("Error recording sale:", error);
      alert("Failed to record sale. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const closeReceipt = () => {
    setReceipt(null);
    setSaleItems([]);
    setSelectedProductId("");
    setQuantity(1);
    setPaymentMethod("Cash");
    setSoldBy("Yussuf");
  };

  if (receipt) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 space-y-4 print:p-8">
            <div className="text-center border-b pb-4">
              <h1 className="text-2xl font-black text-slate-900">
                LENZRO LUXE
              </h1>
              <p className="text-sm text-slate-600">Fashion & Luxury</p>
              <p className="text-xs text-slate-500 mt-2">
                {new Date(receipt.date).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Sold By:</span>
                <span className="font-semibold">{receipt.soldBy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Payment:</span>
                <span className="font-semibold">{receipt.paymentMethod}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-slate-900 mb-3">Items</h3>
              {receipt.items.map((item: SaleItem) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm mb-2"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.quantity} x KES{" "}
                      {item.product.selling_price.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900">
                    KES{" "}
                    {(
                      item.product.selling_price * item.quantity
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-emerald-600">
                  KES {receipt.total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Profit:</span>
                <span className="text-amber-600 font-semibold">
                  KES {receipt.profit.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2 print:hidden mt-6">
              <button
                onClick={printReceipt}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={closeReceipt}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                New Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-rose-600 px-6 py-4 flex items-center justify-between border-b border-white/20 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Record Sale</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Add Item Section */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-4">Add Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="col-span-1 md:col-span-2 bg-slate-800/50 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - KES{" "}
                    {product.selling_price.toLocaleString()} (Stock:{" "}
                    {product.quantity_in_stock})
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  placeholder="Qty"
                  className="flex-1 bg-slate-800/50 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Sale Items */}
          {saleItems.length > 0 && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-4">Sale Items</h3>
              <div className="space-y-2">
                {saleItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-slate-800/50 border border-white/10 rounded-xl p-3"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-slate-400">
                        KES {item.product.selling_price.toLocaleString()} each
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-20 bg-slate-700 border border-white/20 text-white rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <p className="text-white font-bold min-w-[100px] text-right">
                        KES{" "}
                        {(
                          item.product.selling_price * item.quantity
                        ).toLocaleString()}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sale Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Cash">Cash</option>
                <option value="Mpesa">Mpesa</option>
                <option value="Till Number">Till Number</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Sold By
              </label>
              <input
                type="text"
                value={soldBy}
                onChange={(e) => setSoldBy(e.target.value)}
                placeholder="Staff name"
                className="w-full bg-slate-800/50 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Summary */}
          {saleItems.length > 0 && (
            <div className="bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/30 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-300 text-sm">Total Amount</p>
                  <p className="text-3xl font-bold text-white">
                    KES {calculateTotal().toLocaleString()}
                  </p>
                  <p className="text-sm text-emerald-300 mt-1">
                    Profit: KES {calculateProfit().toLocaleString()}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={submitting || saleItems.length === 0}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Processing..." : "Complete Sale"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
