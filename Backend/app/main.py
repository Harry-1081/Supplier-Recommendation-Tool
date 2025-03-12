import os
import faiss
import numpy as np
from groq import Groq
from flask_cors import CORS
from dotenv import load_dotenv
from flask_pydantic import validate
from flask import Flask, request, jsonify, app
from langchain.document_loaders import PyPDFLoader
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import TokenTextSplitter

load_dotenv()

api_key = os.getenv("groq_api_key")
client = Groq(api_key=api_key)

app = Flask(__name__)
CORS(app)

def groq_completion(prompt, model_name="llama3-8b-8192"):
    completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": prompt,
        }
    ],
    model="llama3-8b-8192",
    )
    return completion.choices[0].message.content

def load_pdf_and_split(pdf_path):
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    splitter = TokenTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = splitter.split_documents(documents)
    chunk_texts = [chunk.page_content for chunk in chunks]
    return chunk_texts

def store_embeddings_in_faiss(ticker):
    print(ticker)
    pdf_path = os.path.join('reports', f'{ticker}_Report.pdf')

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"Error: PDF report for ticker '{ticker}' not found at {pdf_path}")
    
    chunks = load_pdf_and_split(pdf_path)
    print("chunked")

    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    chunk_embeddings = model.encode(chunks)

    dimension = chunk_embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(chunk_embeddings)

    ticker_folder = os.path.join('dataset', ticker)
    os.makedirs(ticker_folder, exist_ok=True)

    faiss.write_index(index, os.path.join(ticker_folder, f'{ticker}_faiss.index'))
    np.save(os.path.join(ticker_folder, f'{ticker}_chunks.npy'), chunks)


def search_in_faiss(query, ticker):
    if not os.path.exists(f'dataset/{ticker}/{ticker}_faiss.index') or not os.path.exists(f'dataset/{ticker}/{ticker}_chunks.npy'):
        store_embeddings_in_faiss(ticker)

    print('searching')
    index = faiss.read_index(f'dataset/{ticker}/{ticker}_faiss.index')
    chunks = np.load(f'dataset/{ticker}/{ticker}_chunks.npy', allow_pickle=True)

    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    query_embedding = model.encode([query])

    top_k = 5
    distances, indices = index.search(query_embedding, top_k)
    relevant_chunks = [chunks[i] for i in indices[0]]
    
    return relevant_chunks

def query_local(query, ticker):
    return search_in_faiss(query, ticker)

def get_answer(context, question):
    prompt = f"""
            Compose a comprehensive reply to the query using the search results given.
            Only include information found in the results and don't add any additional information. 
            Make sure the answer is correct and don't output false content.
            If the text does not relate to the query, simply state 'Found Nothing'. 
            Ignore outlier search results which has nothing to do with the question. Only answer what is asked. 
            The answer should be short and concise

            {context}

            Question: {question}
            Answer:
            """
    response = groq_completion(prompt=prompt, model_name="llama3-8b-8192")
    return response

def rag_pipeline(query, ticker):
    try:
        result = query_local(query, ticker)
        answer = get_answer(result, query)
        return {"answer": answer}
    except Exception as e:
        return {"error": str(e)}

@app.route('/ask', methods=['POST'])
@validate()
def ask():
    query = request.json.get('query')
    ticker = request.json.get('ticker')

    print(query)
    print(ticker)
    
    if not query:
        return jsonify({"error": "No query provided"}), 400
    if not ticker:
        ticker = 'MSFT'

    response = rag_pipeline(query, ticker)
    return jsonify(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)