# RouteRadar Setup Instructions for GCP/Firebase

Hi! The codebase for RouteRadar is ready. To get the backend communicating with Gemini 1.5 Pro and our database, we need to set up the Google Cloud Project and Firebase. 

Please follow these exact steps and send back the **Project ID** and **JSON Key File** when done.

---

### Step 1: Create the Google Cloud Project
1. Go to [console.cloud.google.com](https://console.cloud.google.com/).
2. Create a new project and name it **RouteRadar**.
3. **Important:** Note down the **Project ID** (e.g., `routeradar-12345`). I need this!

### Step 2: Enable Vertex AI API
1. In the GCP search bar, search for "Vertex AI API".
2. Click **Enable**. (This requires billing to be linked to the project, though your free credits will cover it).

### Step 3: Setup Firestore Database
1. Go to [console.firebase.google.com](https://console.firebase.google.com/).
2. Click **Add project**.
3. **CRITICAL:** Do NOT create a new name here. Select the **RouteRadar** GCP project you just created from the dropdown.
4. Once in the Firebase dashboard, go to **Build > Firestore Database** in the left menu.
5. Click **Create database**.
6. Choose a location (e.g., `us-central1` or `nam5`).
7. Start in **Production mode** or **Test mode** (doesn't matter for now).
8. Wait for it to provision.

### Step 4: Create the Service Account (The Handoff Key)
We need a key so our local code can talk to GCP without using the CLI.
1. Go back to [console.cloud.google.com](https://console.cloud.google.com/).
2. Go to **IAM & Admin > Service Accounts**.
3. Click **Create Service Account** at the top.
4. Name it something like `routeradar-backend`. Click **Create and Continue**.
5. Under **Grant this service account access to project**, add these **two specific roles**:
   * **Vertex AI User** (allows it to talk to Gemini)
   * **Cloud Datastore User** (allows it to read/write to Firestore)
6. Click **Done**.
7. Click on the newly created service account email in the list.
8. Go to the **Keys** tab at the top.
9. Click **Add Key > Create new key**.
10. Choose **JSON** and click Create. The file will download to your computer.

### Step 5: Enable Anonymous Auth (For the Frontend)
1. Go back to the [Firebase Console](https://console.firebase.google.com/).
2. Go to **Build > Authentication**.
3. Click **Get Started**.
4. Go to the **Sign-in method** tab.
5. Click **Anonymous** and flip the switch to **Enable**. Save.

---

### 🛑 THE HANDOFF
Once you finish, immediately send me (Nrishan) these two things via WhatsApp/Discord:
1. **The exact GCP Project ID** (from Step 1)
2. **The downloaded JSON Key File** (from Step 4)

I will plug these into my `.env` file and verify the whole system works locally before we deploy!
