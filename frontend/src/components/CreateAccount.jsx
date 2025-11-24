//Create Account Component
import React from "react";

/**
 * =======================================================
 *                  CREATE ACCOUNT COMPONENT
 * ======================================================
 *
 * This component will be an endpoint for users to create a new account.
 * The fields will be username and password checking against the backend
 * for existing usernames. Successful account creation will redirect
 * to the login page and the username and password will be stored
 * in the database. The user will have the option to cancel account creation.
 *
 */
function CreateAccount({ onNavigateToLogin }) {
  // State variables for username and password
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("");

  // Handle username change and clear any existing error messages
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    // Clear the message when user starts typing a new username
    if (message === "Username already exists") {
      setMessage("");
    }
  };

  // Handle email change and clear validation messages
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear the message when user starts typing a new email
    if (message === "Email already exists") {
      setMessage("");
    } else if (message.includes("email")) {
      setMessage("");
    }
  };

  // Handle password change and clear validation messages
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear validation messages when user changes password
    if (message.includes("Please enter")) {
      setMessage("");
    }
  };

  // Function to handle account creation
  // Checks with backend if username already exists
  // If not, creates account and redirects to login page
  const handleCreateAccount = async () => {
    // Validate inputs
    if (!username.trim() || !email.trim() || !password.trim()) {
      setMessage("Please enter username, email, and password.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);

        // Redirect to login page on successful account creation
        if (data.message === "Account created successfully!") {
          setTimeout(() => {
            onNavigateToLogin();
          }, 1500); // Small delay to show success message
        }
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setMessage("Unable to connect to server. Please try again.");
    }
  };

  // Function to handle cancel action and return to login page
  const handleCancel = () => {
    onNavigateToLogin(); // Navigate back to login page
  };

  // Ensure that the username and password are not empty when trying to create an account
  const isFormValid = username.trim() !== "" && email.trim() !== "" && password.trim() !== "";

  // Check if the username or email is already taken based on the backend response
  const isUsernameTaken = message === "Username already exists";
  const isEmailTaken = message === "Email already exists";
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Create Account</h2> {/* Heading for the create account page */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          style={{ padding: "10px", fontSize: "16px", width: "200px" }}
        />
      </div>{" "}
      {/* Input field for username */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          style={{ padding: "10px", fontSize: "16px", width: "200px" }}
        />
      </div>{" "}
      {/* Input field for email */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          style={{ padding: "10px", fontSize: "16px", width: "200px" }}
        />
      </div>{" "}
      {/* Input field for password */}
      <div>
        <button
          onClick={handleCreateAccount}
          disabled={!isFormValid || isUsernameTaken || isEmailTaken}
          style={{
            margin: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: !isFormValid || isUsernameTaken || isEmailTaken ? "not-allowed" : "pointer",
          }}
        >
          Create Account
        </button>
        <button
          onClick={handleCancel}
          style={{
            margin: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>{" "}
      {/* Buttons for creating account and canceling */}
      {message && (
        <p
          style={{
            marginTop: "20px",
            fontSize: "18px",
            color:
              message === "Username already exists" || message === "Email already exists"
                ? "red"
                : message === "Account created successfully!"
                  ? "green"
                  : message.includes("Please enter") || message.includes("valid email")
                    ? "orange"
                    : "red",
          }}
        >
          {message}
        </p>
      )}{" "}
      {/* Display message from backend */}
    </div>
  );
}

export default CreateAccount;
