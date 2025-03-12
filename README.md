# Marketwatch.ai

MarketWatch.AI is a RAG-based supplier recommendation tool, which could help you make informed financial decisions. This project consists of both backend and frontend components, built using Flask and React respectively.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [Contributors](#contributors)

## Introduction

### MarketWatch.AI: Supplier Recommendation Tool

MarketWatch.AI simplifies investment decisions by leveraging Large Language Models for precise stock sentiment analysis and recommendations. It empowers investors with reliable insights, helping them analyse the market trends. Additionally, MarketWatch.AI supports Retrieval-Augmented Generation (RAG) for financial report analysis, enabling users to obtain inferences and data from company reports, using a chatbot interface.

## Features

- **Precise sentiment analysis**: Delivers accurate stock sentiment insights using advanced AI algorithms.
- **Financial report analysis**: Utilizes RAG to extract valuable inferences and data from financial reports.
- **Chatbot Feature**: You can interact directly with the company's annual report using our chatbot feature.
- **Modular Architecture**: Separate backend and frontend components for flexible development and deployment.

## Installation

Follow the steps below to set up the backend and frontend components of Marketwatch.ai.

### Frontend Setup

1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2. Install the required Node packages:
    ```bash
    npm install
    ```

3. Start the frontend React application:
    ```bash
    npm start
    ```

### Backend Setup

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2. Install the required Python packages:
    ```bash
    pip install -r setup/requirements.txt
    ```

3. Replace the API Keys in `app/app.py` and `app/main.py` files.
4. Run the Flask application:
    ```bash
    python app/app.py
    ```

5. Run the Flask application:
    ```bash
    python app/main.py
    ```

## Usage

Once both the backend and frontend are set up, the application can be accessed through any web browsers. 
1. Before using, Kindly verify if the backend Flask server is running.
2. Open your web browser and navigate to `http://localhost:3000` to interact with the application.

## Contributing

Any contributions to Marketwatch.ai are welcomes! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request. 

To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## Acknowledgements

We would like to thank all the contributors and open-source projects that have made this project possible. Special thanks to the developers of Flask, Groq, Huggingface, Alpha vantage and Kaggle for their invaluable tools, datasets and libraries.

- Source : [Dataset 1](https://www.kaggle.com/datasets/prokaggler22/nse-all-stocks-sybmbol)
- Source : [Dataset 2](https://www.kaggle.com/datasets/marketahead/all-us-stocks-tickers-company-info-logos)
## Contributors

- [Prasanna Venkatesan](https://github.com/Harry-1081)