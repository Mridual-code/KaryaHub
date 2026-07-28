import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  email: "",
  password: "",

  designation: "",
  department: "",

  employmentType: "Full-Time",

  joiningDate: "",

  salary: "",

  phone: "",

  dateOfBirth: "",

  gender: "Prefer Not to Say",

  profileImage: "",

  address: {
    street: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
  },

  emergencyContact: {
    name: "",
    relationship: "",
    phone: "",
  },
};

function EmployeeModal({
    open,
    onClose,
    onSave,
    employee,
    departments,
}) {
  const [form, setForm] =
    useState(initialForm);

  useEffect(() => {
  if (employee) {
    setForm({
      name: employee.user?.name || "",

      email: employee.user?.email || "",

      password: "",

      designation: employee.designation || "",

      department:
        employee.department?._id || "",

      employmentType:
        employee.employmentType ||
        "Full-Time",

      joiningDate:
        employee.joiningDate?.substring(0, 10) ||
        "",

      salary: employee.salary || "",

      phone: employee.phone || "",

      dateOfBirth:
        employee.dateOfBirth?.substring(0, 10) ||
        "",

      gender:
        employee.gender ||
        "Prefer Not to Say",

      profileImage:
        employee.profileImage || "",

      address: {
        street:
          employee.address?.street || "",

        city:
          employee.address?.city || "",

        state:
          employee.address?.state || "",

        country:
          employee.address?.country ||
          "India",

        postalCode:
          employee.address?.postalCode ||
          "",
      },

      emergencyContact: {
        name:
          employee.emergencyContact?.name ||
          "",

        relationship:
          employee.emergencyContact
            ?.relationship || "",

        phone:
          employee.emergencyContact?.phone ||
          "",
      },
    });
  } else {
    setForm(initialForm);
  }
}, [employee]);

  if (!open) return null;

  const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};
const handleAddressChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    address: {
      ...prev.address,
      [name]: value,
    },
  }));
};

const handleEmergencyChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    emergencyContact: {
      ...prev.emergencyContact,
      [name]: value,
    },
  }));
};

  const handleSubmit = (e) => {
  e.preventDefault();

  const payload = {
    ...form,

    salary: Number(form.salary),

    address: {
      ...form.address,
    },

    emergencyContact: {
      ...form.emergencyContact,
    },
  };

  if (employee) {
    delete payload.password;
  }

  onSave(payload);
};
  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

    <h2>
        {employee ? "Edit Employee" : "Add Employee"}
    </h2>

    <button
        type="button"
        className="close-btn"
        onClick={onClose}
    >
        ×
    </button>

</div>

        <form onSubmit={handleSubmit}>

          {/* ================= Account Information ================= */}

<h3>Account Information</h3>

<input
  type="text"
  name="name"
  placeholder="Full Name"
  value={form.name}
  onChange={handleChange}
  required
/>

<input
  type="email"
  name="email"
  placeholder="Email"
  value={form.email}
  onChange={handleChange}
  required
/>

{!employee && (
  <input
    type="password"
    name="password"
    placeholder="Temporary Password"
    value={form.password}
    onChange={handleChange}
    required
  />
)}

<hr />

{/* ================= Employment ================= */}

<h3>Employment Details</h3>

<input
  type="text"
  name="designation"
  placeholder="Designation"
  value={form.designation}
  onChange={handleChange}
  required
/>

<select
    name="department"
    value={form.department}
    onChange={handleChange}
    required
>
    <option value="">
        Select Department
    </option>

    {departments?.map((dept) => (
        <option
            key={dept._id}
            value={dept._id}
        >
            {dept.name}
        </option>
    ))}
</select>

<select
  name="employmentType"
  value={form.employmentType}
  onChange={handleChange}
>
  <option value="Full-Time">
    Full-Time
  </option>

  <option value="Part-Time">
    Part-Time
  </option>

  <option value="Intern">
    Intern
  </option>

  <option value="Contract">
    Contract
  </option>
</select>

<input
  type="date"
  name="joiningDate"
  value={form.joiningDate}
  onChange={handleChange}
  required
/>

<input
  type="number"
  name="salary"
  placeholder="Salary"
  value={form.salary}
  onChange={handleChange}
/>

<hr />

{/* ================= Personal ================= */}

<h3>Personal Details</h3>

<input
  type="text"
  name="phone"
  placeholder="Phone Number"
  value={form.phone}
  onChange={handleChange}
/>

<input
  type="date"
  name="dateOfBirth"
  value={form.dateOfBirth}
  onChange={handleChange}
/>

<select
  name="gender"
  value={form.gender}
  onChange={handleChange}
>
  <option value="Male">
    Male
  </option>

  <option value="Female">
    Female
  </option>

  <option value="Other">
    Other
  </option>

  <option value="Prefer Not to Say">
    Prefer Not to Say
  </option>
</select>

<input
  type="text"
  name="profileImage"
  placeholder="Profile Image URL"
  value={form.profileImage}
  onChange={handleChange}
/>

<hr />
{/* ================= Address ================= */}

<h3>Address</h3>

<input
  type="text"
  name="street"
  placeholder="Street"
  value={form.address.street}
  onChange={handleAddressChange}
/>

<input
  type="text"
  name="city"
  placeholder="City"
  value={form.address.city}
  onChange={handleAddressChange}
/>

<input
  type="text"
  name="state"
  placeholder="State"
  value={form.address.state}
  onChange={handleAddressChange}
/>

<input
  type="text"
  name="country"
  placeholder="Country"
  value={form.address.country}
  onChange={handleAddressChange}
/>

<input
  type="text"
  name="postalCode"
  placeholder="Postal Code"
  value={form.address.postalCode}
  onChange={handleAddressChange}
/>

<hr />

{/* ================= Emergency Contact ================= */}

<h3>Emergency Contact</h3>

<input
  type="text"
  name="name"
  placeholder="Emergency Contact Name"
  value={form.emergencyContact.name}
  onChange={handleEmergencyChange}
/>

<input
  type="text"
  name="relationship"
  placeholder="Relationship"
  value={form.emergencyContact.relationship}
  onChange={handleEmergencyChange}
/>

<input
  type="text"
  name="phone"
  placeholder="Emergency Phone"
  value={form.emergencyContact.phone}
  onChange={handleEmergencyChange}
/>

<div className="modal-actions">

  <button
    type="button"
    onClick={onClose}
  >
    Cancel
  </button>

  <button
    className="primary-btn"
    type="submit"
  >
    {employee ? "Update Employee" : "Create Employee"}
  </button>

</div>
        </form>

      </div>

    </div>
  );
}

export default EmployeeModal;