# 🚀 Ustaad.ai - #AISeekho2026 Deployment Guide

Congratulations! Your app is vibe-ready for the **Google Cloud AI Seekho 2026** hackathon. This guide will help you deploy **Ustaad.ai** to **Google Cloud Run** as per the competition requirements.

## 📋 Prerequisites
1.  **Google Cloud Project:** Ensure you have a project created in the Google Cloud Console.
2.  **Google Cloud CLI:** Installed and authenticated (`gcloud auth login`).
3.  **Gemini API Key:** Obtain one from [Google AI Studio](https://aistudio.google.com/).

## 🛠️ Step-by-Step Deployment

### 1. Enable Required APIs
Run the following command to enable Cloud Run and Artifact Registry:
```bash
gcloud services enable run.googleapis.com artifactregistry.googleapis.com
```

### 2. Build and Push the Container
Use Google Cloud Build to create your container image and store it in Artifact Registry:
```bash
gcloud builds submit --tag gcr.io/[PROJECT_ID]/ustaad-ai
```
*(Replace `[PROJECT_ID]` with your actual Google Cloud Project ID)*

### 3. Deploy to Cloud Run
Deploy the image and set your environment variables:
```bash
gcloud run deploy ustaad-ai \
  --image gcr.io/[PROJECT_ID]/ustaad-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=your_actual_api_key_here"
```

## ✨ Vibe Coding Features Included
-   **Gemini 2.0 Flash:** Powered by Google's latest multimodal model.
-   **#VibeKarega UI:** Dark holographic theme with animated background blobs.
-   **Local Context:** Roman Urdu + English (Hinglish) mix with Pakistani daily life analogies.
-   **Multimodal:** Supports image uploads for homework solving.
-   **PWA Ready:** Optimized for mobile "Add to Home Screen".

## 🔗 Submission Checklist
- [ ] App deployed on **Cloud Run**.
- [ ] Demo video recorded (show off the "Vibe").
- [ ] Post on LinkedIn with **#AISeekho2026** & **#VibeKaregaPakistan**.
- [ ] Submit the link via the official completion form.

---
*Built with ❤️ by Antigravity for #AISeekho2026*
