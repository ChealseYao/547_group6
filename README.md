
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
└── lambda-bluesky.yaml                # lambda_bluesky is used to upload data from bluesky to S3
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

For **bluesky-lambda**:
Bluesky Lambda Deployment with Docker
Overview
This guide provides step-by-step instructions to package, push, and deploy the bluesky-lambda function using Docker and AWS Lambda with a container image.
Prerequisites
AWS CLI installed and configured with proper permissions. 
Docker installed and running. 
IAM Role ARN with permissions for Lambda execution and ECR access. 
AWS ECR Repository (Elastic Container Registry) setup. 
Steps to Deploy
1. Navigate to the Project Directory
Go to the bluesky-lambda folder:
cd bluesky-lambda
2. Build the Docker Image
Run the following command to build the Docker image:
docker build -t bluesky-lambda-image .
3. Push the Docker Image to AWS ECR
a. Authenticate Docker to AWS ECR
aws ecr get-login-password --region <YOUR_REGION> | \
docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.<YOUR_REGION>.amazonaws.com
b. Create an ECR Repository (if it doesn’t exist)
aws ecr create-repository --repository-name bluesky-lambda-repo
c. Tag and Push the Image
Tag the local image and push it to AWS ECR:
docker tag bluesky-lambda-image:latest <YOUR_ACCOUNT_ID>.dkr.ecr.<YOUR_REGION>.amazonaws.com/bluesky-lambda-repo:latest

docker push <YOUR_ACCOUNT_ID>.dkr.ecr.<YOUR_REGION>.amazonaws.com/bluesky-lambda-repo:latest
4. Deploy the Lambda Function
Deploy the Lambda function with the Docker image:
aws lambda create-function --function-name BlueskyLambda \
    --package-type Image \
    --code ImageUri=<YOUR_ACCOUNT_ID>.dkr.ecr.<YOUR_REGION>.amazonaws.com/bluesky-lambda-repo:latest \
    --role <YOUR_IAM_ROLE_ARN>
Dockerfile Example
Ensure your Dockerfile contains the following:
FROM public.ecr.aws/lambda/nodejs14.x
COPY index.js ${LAMBDA_TASK_ROOT}
CMD [ "index.handler" ]
Verify Deployment
Invoke the Lambda function to confirm it's working:
aws lambda invoke --function-name BlueskyLambda response.json
Check the response.json file for the output.
Cleanup Resources
To remove the Lambda function and ECR repository:
aws lambda delete-funct

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
- **Upload Data API**: Connects to `GetDataLambda`.
- **Analysis Data API**: Connects to `SentimentAnalysisLambda`.

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
