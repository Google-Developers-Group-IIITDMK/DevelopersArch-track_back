const API_BASE_URL = "http://localhost:5000/api";

export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return await response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return await response.json();
  },

  getMe: async () => {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return response.json();
  },
};

export const itemsAPI = {
  getItems: async () => {
    const response = await fetch(`${API_BASE_URL}/items`);

    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }

    return response.json();
  },

  getMyItems: async () => {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_BASE_URL}/items/my-items`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user items");
    }

    return response.json();
  },

  createItem: async (itemData) => {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_BASE_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create item");
    }

    return response.json();
  },

  updateItem: async (id, itemData) => {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update item");
    }

    return response.json();
  },

  deleteItem: async (id) => {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete item");
    }

    return response.json();
  },
};

export const storage = {
  setToken: (token) => localStorage.setItem("authToken", token),
  getToken: () => localStorage.getItem("authToken"),
  removeToken: () => localStorage.removeItem("authToken"),
};