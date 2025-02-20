# `CreateAsynThunk`

## **🔷 Step 1: What is `createAsyncThunk`?**

It’s just an **async function inside Redux** that:  
✅ Fetches data (like `fetch`).  
✅ Automatically updates Redux state (`pending`, `fulfilled`, `rejected`).  
✅ Helps manage API calls without manually handling loading/errors.

---

## **🔷 Step 2: How is it Different from `fetch`?**

A normal `fetch` function:

```javascript
async function getUser() {
  try {
    const response = await fetch("https://api.example.com/user");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}
```

🛑 **Problem:** We have to manually update loading, success, and error states in Redux.

---

## **🔷 Step 3: The `createAsyncThunk` Way**

Instead of manually handling state, Redux **does it for us**.

```javascript
import { createAsyncThunk } from "@reduxjs/toolkit";

// Creating an async function inside Redux
export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const response = await fetch("https://api.example.com/user");
  return response.json();
});
```

🔹 Just like `fetch`, but now Redux automatically:  
✔️ **Dispatches a pending action** when API starts.  
✔️ **Dispatches a fulfilled action** when API succeeds.  
✔️ **Dispatches a rejected action** if API fails.

---

## **🔷 Step 4: Handling the State in a Slice**

Now, we **modify Redux state based on API response** inside a `userSlice`.

```javascript
import { createSlice } from "@reduxjs/toolkit";
import { fetchUser } from "./userActions";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {}, // We don't need extra reducers, since async thunk handles it
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
```

🚀 **Now Redux will automatically update the state based on the API response.**

---

## **🔷 Step 5: Using it in a React Component**

Now, we **dispatch `fetchUser`** inside a React component.

```javascript
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/userActions";

function UserProfile() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <div>User: {data?.name}</div>;
}

export default UserProfile;
```

🔥 **Now, Redux automatically handles everything!**

---

## **🔷 Step 6: Summary**

1️⃣ `createAsyncThunk` is just an **async function inside Redux**.  
2️⃣ It’s like `fetch`, but Redux **automatically updates state** (`pending`, `fulfilled`, `rejected`).  
3️⃣ We handle state in a **Redux slice** with `extraReducers`.  
4️⃣ We use it in React with `useDispatch` and `useSelector`.

---

## **💡 Why Use `createAsyncThunk`?**

✔ **No need to manually manage loading & errors.**  
✔ **Code is cleaner and easier to maintain.**  
✔ **Redux automatically tracks API state.**
