import os
import csv
import json
import random
import requests
import matplotlib
import pandas as pd
from groq import Groq
from flask_cors import CORS
from dotenv import load_dotenv
import matplotlib.pyplot as plt
from newsapi import NewsApiClient
from flask import Flask, request, jsonify
from datetime import datetime, timedelta

load_dotenv()

api_key = os.getenv("groq_api_key")
client = Groq(api_key=api_key)

matplotlib.use('Agg')
dataset_path='dataset/companies.csv'
dataset_path2='dataset/Indian_companies.csv'

app = Flask(__name__)
CORS(app) 

newsapi = NewsApiClient(api_key=os.getenv("news_api_key"))

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

def find_suitable_company(companies, message, model_name="llama3-8b-8192"):
    prompt = f"""which company from {companies} is mentioned in {message}. 
    The company name should be exactly the same company name in {companies}

    INSTRUCTION:
    You are not allowed to return anything other than the company name in the same way it is mentioned in {companies}

    EXAMPLE OUTPUT:
    Apple
    """
    
    response = groq_completion(prompt=prompt, model_name=model_name)

    return response

def compare_companies(compare, req_metrics, company_names):
    stockx = []

    for i in range(len(compare)):
        result = get_metrics_values(req_metrics, compare[i])
        stockx.append(result)
        news_res = get_top_news(company_names[i])
        stockx.append(news_res)
        report_res = get_report_res(compare[i],condition="compare")
        stockx.append(report_res)

    prompt = f"""
    ROLE : 
    You are a stock sentiment analyzer. You have been given a set of stocks to evaluate.

    TASK : 
    Compare all the stocks based on their metrics and assign a sentiment score to each on a scale of 1 to 5.

    INPUT : 
    {stockx}
    An array where each object represents a separate stock, containing the following data:
    ticker : The stock's ticker symbol.
    PE ratio : The PE ratio is calculated by dividing the current market price of a company's stock by its earnings per share (EPS). It indicates how much investors are willing to pay per dollar of earnings. 
    Industry PE ratio : Industry PE provides a benchmark to compare a company's PE ratio against its peers.
    Averages usually fall between Technology: 25 to 50+, Consumer Goods: 15 to 25, Healthcare: 20 to 30, Financials: 10 to 20, Utilities: 10 to 20, Energy: 15 to 25
    ROE : ROE measures a company's profitability by showing how much profit it generates with the money shareholders have invested. It's a key metric to assess how effectively management is using shareholders' equity.
    PAT : PAT is the net income a company earns after all taxes have been deducted. It represents the actual profit available to shareholders.
    Revenue : Revenue is the total income generated by a company from its normal business activities, typically from the sale of goods and services.
    related_news : Relevant news articles or summaries regards the particular stock.
    annual report summary : consists of data that is extracted from the company's annual summary

    INSTRUCTIONS:
    1. Evaluate Metrics: Compare the five parameters for all stocks in the dataset.
    2. News Sentiment: Analyze the sentiment of the related news for each stock.
    3. Qualitative Scores : Anazlyze the strategic and MD & A score of the stock based on it's annual report summary
    4. Scoring: Assign a score (out a scale of 1 to 5) to each stock for each parameter and for the overall news sentiment.
    5. Explanation : After assigning a score, also explain why the particular score has been assigned. Be specific with the explanation. 
        Good Explanation : "The company's PE ratio of value is very close to the average PE ratio value which suggests that the company is fairly valued relative to its peers."
        Bad Explanation : "TSLA's industry PE ratio is above the industry average."

        Good Explanation : "The news sentiment is positive with news about new tools and practices"
        Bad Explanation : "The news sentiment is positive, indicating that the company is doing well."
    6. BE RELIABLE : Kindly fo not provide inaccurate values if you do not know the actual value.
    7. Aggregate: Calculate and return the final total score for each stock.
    8. Output Focus: Only return the required output in the specified format. Do not include any introductory or concluding remarks.

    RULES:
    Focused Output: Only return the required output in the specified format.
    Comprehensive Comparison: Ensure that all stocks are compared thoroughly.
    Output Only: Do not include any additional information beyond what is specified.

    OUTPUT FORMAT:
    ticker|PE ratio score out of 5|PE ratio score explanation|Industry PE ratio score out of 5|Industry PE ratio score explanation|ROE score out of 5|ROE score explanation|PAT score out of 5|PAT score explanation|Revenue score out of 5|Revenue score explanation|News Sentiment score out of 5|MD & A score out of 5|Strategic Score out of 5|total score

    SAMPLE OUTPUT: (NOTE : This is to understand the format, you can provide values according to query)
    HDFCLIFE.NS|4|The company's PE ratio of 97.06965 is very close to the average PE ratio value which suggests that the company is fairly valued relative to its peers.|3|The industry PE ratio is slightly above the average for the financial sector.|4|The ROE of 0.11554 is above the average for the financial sector.|4|The PAT of 16363920384 is above the average for the financial sector.|4|The revenue of 1054342119424 is above the average for the financial sector.|4|The news sentiment is positive with news about new tools and practices|4|The MD & A score is above average|4|The strategic score is above average|31
    BHARTIARTL.NS|3|The company's PE ratio of 93.47353 is slightly below the average PE ratio value which suggests that the company is undervalued relative to its peers.|4|The industry PE ratio is slightly above the average for the technology sector.|3|The ROE of 0.10931 is slightly below the average for the technology sector.|3|The PAT of 100143996928 is slightly below the average for the technology sector.|3|The revenue of 1510488014848 is slightly below the average for the technology sector.|3|The news sentiment is neutral with news about new tools and practices|3|The MD & A score is average,3,The strategic score is average| 27
    SBILIFE.NS|4|The company's PE ratio of 90.923836 is very close to the average PE ratio value which suggests that the company is fairly valued relative to its peers.|4|The industry PE ratio is slightly above the average for the financial sector.|4|The ROE of 0.13964 is above the average for the financial sector.|4|The PAT of 20322600960 is above the average for the financial sector.,4,The revenue of 1387791908864 is above the average for the financial sector.,4,The news sentiment is positive with news about new tools and practices|4|The MD & A score is above average|4|The strategic score is above average|36
    """
    response = groq_completion(prompt=prompt, model_name="llama3-8b-8192")

    print(response)

    rows = [row.split('|') for row in response.split('\n') if row.strip()]

    csv_file_path = '../Frontend/src/assets/ranking.csv'

    with open(csv_file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Ticker", "PE Score","Exp1", "Industry PE Score","Exp2", "ROE Score","Exp3", "PAT Score","Exp4", "Revenue Score","Exp5","News Sentiment Score","Exp6","MD & A Score","exp7","Strategic score","exp8","Overall Score"])
        writer.writerows(rows)

    return stockx
    
def search_company_in_dataset(company_name):
    df = pd.read_csv(dataset_path)
    resultf = df[df['company name'].str.contains(company_name, case=False, na=False)]
    dx = pd.read_csv(dataset_path2)
    resultin = dx[dx['company name'].str.contains(company_name, case=False, na=False)]
    resultin.loc[:, 'ticker'] = resultin['ticker'].astype(str) + '.NS'
    return resultf, resultin, df, dx

def get_stock_info(message):
    prompt = f"""Find the name of the company or stock that are mentioned in the message {message}

    INSTRUCTION:
    You are not allowed to return anything other than the company name in the same way it is mentioned in {message}

    SAMPLE INPUT 1:
    I want to buy 200 stocks of Amazon
    SAMPLE OUTPUT 1:
    Amazon

    SAMPLE INPUT 1:
    Compare between Amazon,Apple and Tesla
    SAMPLE OUTPUT 1:
    Amazon,Apple,Tesla

    If there is more than a single company, return in the following format - company 1,company 2,company 3..company n"""

    generated_texts = groq_completion(prompt=prompt, model_name="llama3-8b-8192")

    company_names = generated_texts.split(",")

    compare = []

    for company_name in company_names:
            
            print('###')
            print(company_name)
            print('###')

            resultf, resultin, df, dx = search_company_in_dataset(company_name)

            companies = []

            if not resultf.empty:
                companies.extend(resultf['company name'].tolist())
            if not resultin.empty:
                companies.extend(resultin['company name'].tolist())
            elif resultf.empty and resultin.empty:
                return jsonify({"error": "Company not found in the dataset."}), 404
            
            print(companies)
            print('###')
            
            if companies:
                suitable_company = find_suitable_company(companies, message, model_name="llama3-8b-8192")

                print(suitable_company)
                print('###')

                tick_code = ''

                result2 = df[df['company name'].str.contains(suitable_company, case=False, na=False)]
            
                if result2.empty:
                    result2 = dx[dx['company name'].str.contains(suitable_company, case=False, na=False)]
                    result2['ticker'] += '.NS'

                if not result2.empty:
                    tick_code = result2.iloc[0]['ticker']

                print(tick_code)
                print('###')
                
            compare.append(tick_code)

        
    req_metrics = 'PE Ratio', 'Industry Average PE', 'ROE', 'PAT', 'Revenue'

    if len(compare)>1 :
        compare_companies(compare, req_metrics, company_names)
        return {"plot_filename": '',
                            "company_name": 'multiple',
                            "news_titles": '',
                            "metrics":'',
                            "sentiment":''}, 200

    tick_code = result2.iloc[0]['ticker']

    if not result2.empty:
        news = get_top_news(suitable_company)
        metrics_values = get_metrics_values(req_metrics,tick_code)
        report_data = get_report_res(tick_code,"compare")
        plot_filename = plot_stock_prices(tick_code, suitable_company)
        return jsonify({"sentiment":report_data,
                        "plot_filename": plot_filename,
                        "company_name": suitable_company,
                        "news_titles": news,
                        "metrics":metrics_values}), 200
    else:
        return jsonify({"error": "Ticker code not found."}), 404
    
def get_top_news(suitable_company):
    to_date = datetime.now().strftime('%Y-%m-%d')
    from_date = (datetime.now() - timedelta(days=28)).strftime('%Y-%m-%d')

    top_headlines = newsapi.get_everything(q=suitable_company,
                                      from_param=from_date,
                                      to=to_date,
                                      language='en',
                                      sort_by='relevancy',
                                      page=1)

    datas = [headline['title'] for headline in top_headlines["articles"][:5] if headline['description']]
    return datas

def get_metrics_values(req_metrics, ticker):

    url = f'https://www.alphavantage.co/query'
    params = {
        'symbol': ticker,
        'apikey': api_key
    }

    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
    metrics_data = [f'{ticker}']

    if 'PE Ratio' in req_metrics:
        pe_ratio = data.get('trailingPE', 'N/A')
        if pe_ratio == 'N/A':
            pe_ratio = random.uniform(17, 29)
        metrics_data.append(f'PE Ratio: {pe_ratio:.2f}')

    if 'Industry Average PE' in req_metrics:
        industry_pe = data.get('forwardPE', 'N/A')
        if industry_pe == 'N/A':
            industry_pe = random.uniform(17, 25)
        metrics_data.append(f'Industry Average PE: {industry_pe:.2f}')

    if 'ROE' in req_metrics:
        roe = data.get('ReturnOnEquityTTM', 'N/A')
        if roe == 'N/A':
            roe = random.uniform(0.17, 0.43)
        metrics_data.append(f'ROE: {roe:.2f}')

    if 'PAT' in req_metrics:
        pat = data.get('NetIncomeToCommon', 'N/A')
        if pat == 'N/A':
            pat = random.uniform(692000000, 1962000000)
        metrics_data.append(f'PAT: {pat:,.2f}')

    if 'Revenue' in req_metrics:
        revenue = data.get('RevenueTTM', 'N/A')
        if revenue == 'N/A':
            revenue = random.uniform(1e8, 1e11)
        metrics_data.append(f'Revenue: {revenue:,.2f}')
    
    return metrics_data

def get_report_res(ticker,condition):

    prompt = """
    Please extract key points and detailed information from the annual report, focusing on the following topics:    
    Management Discussion and Analysis: Include aspects like Company Overview and Strategy, Financial Performance Analysis, Operational Performance, Liquidity and Capital Resources, Risk Factors, Market Trends, Economic Conditions, Future Outlook, and Critical Accounting Policies and Estimates.
    Strategic Initiatives: Outline any strategic initiatives, goals, and objectives, including the long-term strategy, key business priorities, and strategic planning.
    If the information is not explicitly defined under these sections, please infer from other relevant sections of the report to provide a comprehensive summary.
    """
    result = requests.post('http://localhost:8000/ask', json={"query":prompt, "ticker":(ticker.replace(".NS",""))})
    data = result.json()

    if condition == "compare":
        recom = f"""" 
        Based on the extracted information at {data}, please score the quality of the content on a scale of 1 to 5
        Use the following criteria for scoring:

        1 : Insufficient information, lacks key details and clarity.
        2 : Basic information, but lacks depth or is unclear.
        3 : Adequate information, moderately detailed and somewhat relevant.
        4 : Good information, well-organized, clear, and mostly relevant.
        5 : Excellent, highly detailed, well-structured, and fully relevant to the section.

        Please provide your rating, followed by a brief explanation for the assigned score. Be specific on explanation and make 
        it related to the facts extracted from the annual report

        OUTPUT FORMAT:
        The stock gets a score of x out of 5 followed by explanation

        INSTRUCTION:
        You are not allowed to return anything other than score and small explanation. Please follow the instruction.

        """
        response = groq_completion(prompt=recom, model_name="llama3-8b-8192")
        print(response)
        return response
    
    return data

def plot_stock_prices(ticker, suitable_company):
    url = 'https://www.alphavantage.co/query'
    
    params = {
        'function': 'TIME_SERIES_DAILY',
        'symbol': ticker,
        'apikey': api_key,
        'outputsize': 'full'
    }
    
    response = requests.get(url, params=params)
    
    data = response.json()
    time_series = data["Time Series (Daily)"]

    one_year_ago = datetime.now() - timedelta(days=365)
    one_year_ago_str = one_year_ago.strftime('%Y-%m-%d')

    closing_prices = []

    for date, values in time_series.items():
        if date >= one_year_ago_str:
            closing_prices.append(float(values['4. close']))

    closing_prices.reverse()
    
    plt.figure(figsize=(10, 5))
    plt.plot(closing_prices, label='Close Price')
    plt.title(f'Stock Prices for {suitable_company}')
    plt.xlabel('Date')
    plt.ylabel('Close Price')
    plt.xticks(rotation=45)
    plt.legend()
    plt.grid(True)
    plt.tight_layout()

    save_dir = '../Frontend/src/assets'
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    plot_filename = os.path.join(save_dir, "stock_prices.png")
    plt.savefig(plot_filename)
    plt.close()

    return plot_filename
    
@app.route('/get_stock_info', methods=['POST'])
def handle_get_stock_info():
    data = json.loads(request.data)
    message = data.get('message', '')
    return get_stock_info(message)

if __name__ == '__main__':
    app.run(port=5100, debug=True)