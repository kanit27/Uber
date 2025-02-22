🚀 User Registration Process

## 📌 Overview
This document provides a detailed guide on the **User Registration Process**, covering:
- 🔹 API Endpoints
- 🔹 Request & Response Format
- 🔹 Validation Rules
- 🔹 Backend Flow
- 🔹 Project Structure

-------------------------------------------------------------------------------------------------

## 🔗 API Endpoint
### **🔹 POST /users/register**
This endpoint allows new users to register and receive an authentication token for future access.

-------------------------------------------------------------------------------------------------

## 📥 Request & 📤 Response
### **📌 Request Process**
✅ The client submits a request with the user’s **full name, email, and password**.
✅ The system **hashes** the password before storing it securely.

### ✅ **Success Response (201 Created)**
✔️ Returns user details (**excluding password**) and a **JWT authentication token**.
✔️ The token can be used for future authenticated requests.

### ❌ **Error Handling**
⚠️ **400 Bad Request:** Invalid input (e.g., incorrect email format, short password).
⚠️ **409 Conflict:** Email already exists in the system.
⚠️ **500 Internal Server Error:** Unexpected server issue.

-------------------------------------------------------------------------------------------------

## ✅ Validation Rules
To ensure data integrity, the following validation is enforced:
- 📧 **Email:** Must be a valid format.
- 🔤 **First Name:** At least **3 characters long**.
- 🔑 **Password:** Must contain **at least 6 characters**.

If validation fails, the system responds with an error message, preventing incorrect data entry.

-------------------------------------------------------------------------------------------------

## 🔄 Backend Flow
### **📌 Step-by-Step Execution**
1️⃣ **Incoming Request** → User data is sent to the `/register` endpoint.
2️⃣ **Validation Checks** → Ensures compliance with input rules.
3️⃣ **Password Encryption** → Securely hashes the password before storing.
4️⃣ **Database Entry** → User record is saved in MongoDB.
5️⃣ **Token Generation** → A JWT token is issued for authentication.
6️⃣ **Response Sent** → Returns user details and authentication token.

-------------------------------------------------------------------------------------------------

## 📂 Project Structure
### **Key Components & Responsibilities**
🛠 **Routes:** Defines API paths & enforces input validation.
🛠 **Controllers:** Manages request handling & response generation.
🛠 **Services:** Handles business logic such as user creation.
🛠 **Models:** Defines database structure, handles password hashing & token generation.

This modular approach ensures **scalability and maintainability**.

-------------------------------------------------------------------------------------------------


# 🔐 User Login Process

## 📌 Overview
This document provides a detailed guide on the **User Login Process**, covering:
- 🔹 API Endpoints
- 🔹 Request & Response Format
- 🔹 Validation Rules
- 🔹 Backend Flow
- 🔹 Project Structure

-------------------------------------------------------------------------------------------------

## 🔗 API Endpoint
### **🔹 POST /users/login**
This endpoint allows existing users to authenticate by providing valid credentials.

-------------------------------------------------------------------------------------------------

## 📥 Request & 📤 Response
### **📌 Request Process**
✅ The client submits a request with the **email and password**.
✅ The system verifies the credentials and returns an authentication token if valid.

### ✅ **Success Response (200 OK)**
✔️ Returns user details (**excluding password**) and a **JWT authentication token**.
✔️ The token can be used for future authenticated requests.

### ❌ **Error Handling**
⚠️ **400 Bad Request:** Invalid input (e.g., incorrect email format, missing password).
⚠️ **401 Unauthorized:** If email or password is incorrect.
⚠️ **500 Internal Server Error:** Unexpected server issue.

-------------------------------------------------------------------------------------------------

## ✅ Validation Rules
Before processing the request, input fields are validated:
- 📧 **Email:** Must be in a valid format.
- 🔑 **Password:** Minimum 6 characters required.

If validation fails, an error message is returned to the client, preventing incorrect login attempts.

-------------------------------------------------------------------------------------------------

## 🔄 Backend Flow
### **📌 Step-by-Step Execution**
1️⃣ **Incoming Request** → User submits email and password to `/login`.
2️⃣ **Validation Checks** → Ensures compliance with input rules.
3️⃣ **Find User in Database** → Checks if the user exists.
4️⃣ **Password Verification** → Compares the provided password with the stored hashed password.
5️⃣ **Token Generation** → Issues a JWT token upon successful authentication.
6️⃣ **Response Sent** → Returns user details and authentication token.

-------------------------------------------------------------------------------------------------

## 📂 Project Structure
### **Key Components & Responsibilities**
🛠 **Routes:** Defines API paths & enforces input validation.
🛠 **Controllers:** Manages request handling & response generation.
🛠 **Services:** Handles business logic such as authentication.
🛠 **Models:** Defines database structure, handles password comparison & token generation.

This modular approach ensures **scalability and maintainability**.

-------------------------------------------------------------------------------------------------
