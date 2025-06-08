import { useState } from "react";

// Modal component for editing user
import { Button } from "@/components/ui/button";

function EditUserModal({ user, onSave, onClose }: any) {
  const [form, setForm] = useState({ ...user });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 w-full h-full top-0 left-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <img
        className="absolute inset-0 object-cover w-full h-full opacity-50 pointer-events-none"
        src="https://res.cloudinary.com/dnfahcxo3/image/upload/v1746073692/22492964-7a7a-49a1-8ce4-d431327299f9.png"
        alt=""
      />
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md min-w-[300px]"
        >
          <h2 className="font-bold mb-4">Edit User</h2>
          <input
            className="border p-2 mb-2 w-full"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            className="border p-2 mb-2 w-full"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            className="border p-2 mb-2 w-full"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
          />
          {/* Add more fields as needed */}
          <div className="flex gap-2 mt-4">
            <Button type="submit">Save</Button>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
