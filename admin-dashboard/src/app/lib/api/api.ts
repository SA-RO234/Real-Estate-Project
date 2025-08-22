import axios from "axios";
//  Fetch ALl Property
export const fetchAllProperties = async () => {
  const response = await fetch(`https://real-estate-clientside2.onrender.com`);
  const data = await response.json();
  return {
    data,
  };
};

//  Fetch Property for Ad
export const fetchPropertyForAd = async () => {
  const response = await fetch(`http://localhost:3000/app/api/index.php?ads`);
  const data = await response.json();
  return data;
};

export const fetchPropertyById = async (id: string) => {
  const response = await axios.get(
    `https://real-estate-clientside2.onrender.com?id=${id}`
  );
  return response.data;
};

//  fetch  all property Type
export const fetchAllPropertyType = async () => {
  const response = await axios.get(
    "https://real-estate-clientside2.onrender.com?propertyType"
  );

  return response.data;
};

// New============================================
const API_URL = "https://real-estate-clientside2.onrender.com";

export async function createProperty(property: any) {
  const res = await fetch(`${API_URL}/properties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(property),
  });
  if (!res.ok) {
    throw new Error("Failed to create property");
  }
  return res.json();
}

export async function updateProperty(id: number, property: any) {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(property),
  });
  if (!res.ok) {
    throw new Error("Failed to update property");
  }
  return res.json();
}

export async function deleteProperty(id: number) {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete property");
  }
  return true;
}

//  ============================================
export const fetchPropertyByCategory = async () => {
  const response = await fetch(
    "http://localhost:3000/app/api/index.php?typeCount"
  );
  const data = await response.json();
  return data;
};

// get Number of Each Propety in City

export const fetchPropertyOfEachCity = async () => {
  const response = await fetch(
    "http://localhost:3000/app/api/index.php?byCity"
  );
  const data = await response.json();
  return data;
};
