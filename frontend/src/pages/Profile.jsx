import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/authApi';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const Profile = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', address: { street: '', city: '', pincode: '' } });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getProfile();
      const user = res.data.user;
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || { street: '', city: '', pincode: '' },
      });
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Update failed.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-xl font-bold text-gray-800 mb-6">My Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <input
          type="text" placeholder="Name" value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          type="text" placeholder="Phone" value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          type="text" placeholder="Street" value={formData.address.street}
          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          type="text" placeholder="City" value={formData.address.city}
          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
          className="w-full border rounded-lg px-3 py-2"
        />
        {message && <p className="text-sm text-green-600">{message}</p>}
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
};

export default Profile;