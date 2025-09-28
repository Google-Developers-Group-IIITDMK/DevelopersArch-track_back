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

  createItem: async (formData) => {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_BASE_URL}/items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create item");
    }

    return response.json();
  },

  updateItem: async (id, formData) => {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
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
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        try {
          const text = await response.text();
          console.error("Server response (non-JSON):", text.substring(0, 200));
        } catch (textError) {
          console.error("Could not read response text:", textError);
        }
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  },
};

export const messagesAPI = {
  getMessages: async (reportId) => {
    const response = await fetch(`${API_BASE_URL}/messages/report/${reportId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    return response.json();
  },

  sendMessage: async (reportId, messageData) => {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(
      `${API_BASE_URL}/messages/report/${reportId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send message");
    }

    return response.json();
  },

  deleteMessage: async (messageId) => {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete message");
    }

    return response.json();
  },
};

export const storage = {
  setToken: (token) => localStorage.setItem("authToken", token),
  getToken: () => localStorage.getItem("authToken"),
  removeToken: () => localStorage.removeItem("authToken"),
};