import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/orderApi';
import Loader from '../../components/common/Loader';

const statusFlow = ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered'];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getAllOrders(filterStatus);
    setOrders(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h1>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="border rounded-lg px-3 py-2 mb-6"
      >
        <option value="">All Statuses</option>
        {statusFlow.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
        <option value="Cancelled">Cancelled</option>
      </select>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-3">#{order._id.slice(-6).toUpperCase()}</td>
                <td className="p-3">{order.user?.name} <br /><span className="text-xs text-gray-500">{order.user?.email}</span></td>
                <td className="p-3">₹{order.totalAmount}</td>
                <td className="p-3">
                  <span className={order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border rounded-lg px-2 py-1 text-sm"
                  >
                    {[...statusFlow, 'Cancelled'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;