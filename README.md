# Research AI Hub

A beautiful, light-themed AI research archive.

## How to Add Research

1.  **Place your files** (PDFs, Images) into the `assets/research/` folder.
2.  **Deployment**: Push your changes to GitHub.
3.  **Automatic Indexing**: The GitHub Action will automatically run `npm run index` and update the manifest.

## Local Development

1.  **Install**:
    ```bash
    npm install
    ```
2.  **Update Index**:
    ```bash
    npm run index
    ```
3.  **Run Server**:
    ```bash
    npm start
    ```
    Open `http://localhost:8000`

## Features

- **Node.js Backend**: Uses Express to serve files.
- **Auto-Indexing**: JavaScript script automatically finds your files.
- **Premium Dashboard**: Sidebar navigation with real-time search.
- **GitHub Actions**: Fully automated deployment and indexing.
