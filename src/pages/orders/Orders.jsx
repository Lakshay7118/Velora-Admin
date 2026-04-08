import { useEffect, useState } from "react";
import { 
  Eye, 
  Loader2,
  X,
  Package,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  MapPin,
  Phone,
  Mail,
  User
} from "lucide-react";
import { MoreHorizontal } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders
  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then(data => {
        // Transform backend data to frontend-friendly format
        const formatted = data.map((order) => ({
          id: order._id,
          orderId: "#" + order._id.slice(-4).toUpperCase(),
          customerName: order.user?.name || order.customer?.name || "Unknown",
          customerEmail: order.user?.email || order.customer?.email || "No email",
          customerPhone: order.shippingAddress?.phone || "N/A",
          shippingAddress: order.shippingAddress,
          date: new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric'
          }),
          status: order.status,
          amount: order.totalAmount || 0,
          items: order.items.map(item => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
            image: item.product.image, // Cloudinary URL
          })),
        }));
        setOrders(formatted);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // Update order status
  const updateStatus = async (id, newStatus) => {
    setStatusLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Status update failed");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: newStatus } : o
        )
      );
      setShowStatusModal(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setStatusLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered": return <CheckCircle className="w-4 h-4" />;
      case "Processing": return <Truck className="w-4 h-4" />;
      case "Pending": return <Clock className="w-4 h-4" />;
      case "Cancelled": return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 font-sans text-gray-900">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage customer orders.</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md text-sm">
                        {order.orderId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{order.customerName}</span>
                        <span className="text-xs text-gray-500">{order.customerEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Details */}
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>

                        {/* Change Status */}
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowStatusModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Change Status"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Package className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-900">No orders found</p>
                      <p className="text-sm">There are currently no orders in the system.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== MODAL: ORDER DETAILS (with product images) ==================== */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDetailsModal(false)}
          />
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Order Details
                  <span className="text-sm font-medium px-2 py-0.5 bg-gray-200 text-gray-700 rounded-md">
                    {selectedOrder.orderId}
                  </span>
                </h2>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      {selectedOrder.shippingAddress && (
                        <>
                          <p>{selectedOrder.shippingAddress.address}</p>
                          <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status}
                    </span>
                    <span className="text-xs text-gray-500">Ordered on {selectedOrder.date}</span>
                  </div>
                </div>
              </div>

              {/* Items List with Images */}
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                Order Items
              </h3>
              <div className="space-y-3 mb-6">
                {selectedOrder.items?.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image || "/api/placeholder/64/64"} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.src = "/api/placeholder/64/64"}
                        />
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className="text-xs text-gray-500 block">
                            Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No items found.</p>
                )}
              </div>
              
              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="font-medium text-gray-500">Total Amount</span>
                <span className="text-xl font-bold text-gray-900">₹{selectedOrder.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-5 py-2.5 bg-gray-900 text-white font-medium text-sm rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: CHANGE STATUS (centered + blur) ==================== */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowStatusModal(false)}
          />
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Change Order Status</h3>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                Order: <span className="font-medium text-gray-900">{selectedOrder.orderId}</span>
              </p>
              <div className="space-y-2">
                {["Pending", "Processing", "Delivered", "Cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedOrder.id, status)}
                    disabled={statusLoading}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                      selectedOrder.status === status 
                        ? "bg-blue-50 border border-blue-200 text-blue-700 font-medium" 
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-transparent hover:border-gray-200"
                    }`}
                  >
                    <span className="flex-shrink-0">
                      {status === "Pending" && <Clock className="w-5 h-5" />}
                      {status === "Processing" && <Truck className="w-5 h-5" />}
                      {status === "Delivered" && <CheckCircle className="w-5 h-5" />}
                      {status === "Cancelled" && <XCircle className="w-5 h-5" />}
                    </span>
                    <span className="flex-1">{status}</span>
                    {selectedOrder.status === status && (
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">Current</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Missing import for MoreHorizontal – add at top with other icons
