
# Bluesky-Based Sentiment Analysis System

This repository contains a sentiment analysis system for the Bluesky platform. The system uses AWS cloud services and a Vue.js frontend to provide sentiment trend analysis for specific topics and time periods.

---

## **Repository Structure**

```
root/
├── frontend/                          # Frontend Vue.js application
│   ├── src/                           # Source code for the frontend
│   ├── node_modules/                  # Dependencies (excluded via .gitignore)
│   ├── package.json                   # Frontend dependencies and scripts
│   └── README.md                      # Frontend-specific documentation
│
├── getdata-b61f6d72/                  # Backend Lambda for retrieving data
│   ├── index.js                       # Lambda function code
│   ├── package.json                   # Dependencies for the Lambda function
│   └── node_modules/                  # Dependencies (excluded via .gitignore)
│
├── sentiment-analysis-lambda/         # Backend Lambda for sentiment analysis
│   ├── index.js                       # Lambda function code
│   ├── package.json                   # Dependencies for the Lambda function
│   └── node_modules/                  # Dependencies (excluded via .gitignore)
│
├── .gitignore                         # Specifies files to ignore in the repository
├── README.md                          # Main documentation (this file)
└── lambda-bluesky.yaml                # AWS SAM configuration file for deployment
```

---

## **Setup and Deployment Instructions**

### **1. Access the Application**
The application has been deployed to AWS and is accessible via the following URL:

[Frontend Application](http://frontend-group6.s3-website.us-east-2.amazonaws.com/)

---

### **2. Backend Deployment Details**

#### **a. Prerequisites**
- AWS CLI installed and configured.
- An S3 bucket created to store data.

#### **b. Deploy Lambdas**
Each Lambda function must be deployed separately. Navigate to the respective directories and install dependencies:

For **sentiment-analysis-lambda**:
```bash
cd sentiment-analysis-lambda
npm install
zip -r function.zip .
aws lambda create-function --function-name SentimentAnalysisLambda \
  --runtime nodejs14.x --role <YOUR_IAM_ROLE_ARN> \
  --handler index.handler --zip-file fileb://function.zip
```

For **getdata-b61f6d72**:
```bash
cd ../getdata-b61f6d72
npm install
zip -r function.zip .
aws lambda create-function --function-name GetDataLambda \
  --runtime nodejs14.x --role <YOUR_IAM_ROLE_ARN> \
  --handler index.handler --zip-file fileb://function.zip
```

#### **c. Configure API Gateway**
Use AWS API Gateway to expose the Lambda functions via REST endpoints. Configure the endpoints as follows:
- **Upload Data API**: Connects to `SentimentAnalysisLambda`.
- **Retrieve Data API**: Connects to `GetDataLambda`.

---

## **Application Workflow**

1. **Frontend**: 
   - Users input topic, year, and month through the hosted frontend application.
   - The frontend triggers the Upload Data API to fetch and store data.

2. **Backend**:
   - `SentimentAnalysisLambda`: Fetches data from Bluesky API, processes it using AWS Comprehend, and stores results in S3.
   - `GetDataLambda`: Retrieves processed data from S3 for the frontend.

3. **Visualization**:
   - Frontend displays sentiment trends in dynamic, interactive charts.

---

## **Major Files**

- **frontend/**: Contains the Vue.js application.
- **getdata-b61f6d72/**: Lambda function for retrieving processed data from S3.
- **sentiment-analysis-lambda/**: Lambda function for analyzing sentiment.
- **lambda-bluesky.yaml**: AWS SAM configuration file for deploying the serverless architecture.
- **.gitignore**: Ensures large files (e.g., `node_modules/`) are not committed to the repository.

---

## **Technical Requirements**

- **AWS CLI**: Required for deploying Lambda functions and configuring API Gateway.
- **Node.js**: Ensure `>=14.x` is installed for backend functions.
- **npm**: Required to install backend dependencies.
- **S3 Bucket**: Required for storing raw and processed data.

---

This `README` provides the necessary information to evaluate the project. If additional assistance is required, please refer to the comments in the code or contact the contributors.
