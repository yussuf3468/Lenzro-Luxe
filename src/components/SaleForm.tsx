import { useState, useMemo } from "react";
import {
  X,
  ShoppingCart,
  Printer,
  Trash2,
  Search,
  Plus,
  Minus,
} from "lucide-react";
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
  discount: number;
}

type DiscountType = "none" | "percentage" | "amount";

export default function SaleForm({
  products,
  onClose,
  onSuccess,
}: SaleFormProps) {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [soldBy, setSoldBy] = useState("Yussuf");
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [overallDiscountType, setOverallDiscountType] =
    useState<DiscountType>("none");
  const [overallDiscountValue, setOverallDiscountValue] = useState(0);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term)
      )
      .slice(0, 10);
  }, [searchTerm, products]);

  const addItem = (product: Product) => {
    if (!product || quantity < 1) return;

    if (product.quantity_in_stock < quantity) {
      alert(`Only ${product.quantity_in_stock} items available in stock`);
      return;
    }

    const existingItem = saleItems.find(
      (item) => item.product.id === product.id
    );
    if (existingItem) {
      setSaleItems(
        saleItems.map((item) =>
          item.product.id === product.id
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
          discount: 0,
        },
      ]);
    }

    setSearchTerm("");
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

  const updateItemDiscount = (id: string, discount: number) => {
    if (discount < 0) return;
    setSaleItems(
      saleItems.map((item) =>
        item.id === id ? { ...item, discount: Math.max(0, discount) } : item
      )
    );
  };

  const calculateSubtotal = () => {
    return saleItems.reduce((total, item) => {
      const itemTotal = item.product.selling_price * item.quantity;
      return total + itemTotal - item.discount;
    }, 0);
  };

  const calculateOverallDiscount = () => {
    const subtotal = calculateSubtotal();
    if (overallDiscountType === "percentage") {
      return (subtotal * overallDiscountValue) / 100;
    } else if (overallDiscountType === "amount") {
      return Math.min(overallDiscountValue, subtotal);
    }
    return 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateOverallDiscount();
  };

  const calculateProfit = () => {
    return (
      saleItems.reduce((profit, item) => {
        const itemProfit =
          (item.product.selling_price - item.product.buying_price) *
            item.quantity -
          item.discount;
        return profit + itemProfit;
      }, 0) - calculateOverallDiscount()
    );
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
    setSearchTerm("");
    setQuantity(1);
    setPaymentMethod("Cash");
    setSoldBy("Yussuf");
    setOverallDiscountType("none");
    setOverallDiscountValue(0);
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
          {/* Search & Add Item Section */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-4">Search Product</h3>
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by product name or category..."
                    className="w-full bg-slate-800/50 border border-white/20 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-slate-700 text-white p-3 rounded-xl hover:bg-slate-600 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-16 bg-slate-800/50 border border-white/20 text-white rounded-xl px-3 py-3 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-slate-700 text-white p-3 rounded-xl hover:bg-slate-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search Results Dropdown */}
              {searchTerm && filteredProducts.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-white/20 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        addItem(product);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 border-b border-white/10 last:border-0 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {product.category} • Stock:{" "}
                            {product.quantity_in_stock}
                          </p>
                        </div>
                        <p className="text-emerald-400 font-bold">
                          KES {product.selling_price.toLocaleString()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchTerm && filteredProducts.length === 0 && (
                <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-white/20 rounded-xl shadow-2xl p-4 text-center">
                  <p className="text-slate-400">No products found</p>
                </div>
              )}
            </div>
          </div>

          {/* Sale Items */}
          {saleItems.length > 0 && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-4">Sale Items</h3>
              <div className="space-y-3">
                {saleItems.map((item) => {
                  const itemTotal =
                    item.product.selling_price * item.quantity - item.discount;
                  return (
                    <div
                      key={item.id}
                      className="bg-slate-800/50 border border-white/10 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-white font-medium text-lg">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-slate-400">
                            KES {item.product.selling_price.toLocaleString()}{" "}
                            each
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-full bg-slate-700 border border-white/20 text-white rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-400 block mb-1">
                            Discount (KES)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={item.discount}
                            onChange={(e) =>
                              updateItemDiscount(
                                item.id,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full bg-slate-700 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div className="md:text-right">
                          <label className="text-xs text-slate-400 block mb-1">
                            Total
                          </label>
                          <p className="text-white font-bold text-lg">
                            KES {itemTotal.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Overall Discount & Payment Details */}
          {saleItems.length > 0 && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-4">Sale Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Overall Discount
                  </label>
                  <select
                    value={overallDiscountType}
                    onChange={(e) => {
                      setOverallDiscountType(e.target.value as DiscountType);
                      setOverallDiscountValue(0);
                    }}
                    className="w-full bg-slate-800/50 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2"
                  >
                    <option value="none">No Discount</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="amount">Fixed Amount (KES)</option>
                  </select>
                  {overallDiscountType !== "none" && (
                    <input
                      type="number"
                      min="0"
                      value={overallDiscountValue}
                      onChange={(e) =>
                        setOverallDiscountValue(parseFloat(e.target.value) || 0)
                      }
                      placeholder={
                        overallDiscountType === "percentage"
                          ? "0-100%"
                          : "Amount"
                      }
                      className="w-full bg-slate-800/50 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  )}
                </div>

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
            </div>
          )}

          {/* Summary */}
          {saleItems.length > 0 && (
            <div className="bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/30 rounded-xl p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    KES {calculateSubtotal().toLocaleString()}
                  </span>
                </div>
                {overallDiscountType !== "none" &&
                  calculateOverallDiscount() > 0 && (
                    <div className="flex justify-between text-rose-300">
                      <span>
                        Discount (
                        {overallDiscountType === "percentage"
                          ? `${overallDiscountValue}%`
                          : "Fixed"}
                        ):
                      </span>
                      <span className="font-semibold">
                        - KES {calculateOverallDiscount().toLocaleString()}
                      </span>
                    </div>
                  )}
                <div className="border-t border-white/20 pt-3 flex justify-between items-center">
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
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
