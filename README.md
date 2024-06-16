<h1>AWS Leetcode Analyzer</h1>
<br>
<img src="https://github.com/sid507/leetcodeAnalyzer/blob/master/leetcodeAnalyzeArch.png" >
<br>
Our goal is to create leetcode analytics tool, which sends mail consisting of total number of questions and current ranking of different users in our coding group using AWS services.
So lets get started 🔥
First we will store all the user's id in DynamoDB
<br>
<h2>DynamoDB</h2>
DynamoDB is a fully managed NoSQL database service provided by AWS. It's designed to deliver single-digit millisecond performance at any scale, with built-in security, backup and restore capabilities, and flexible data models for applications requiring low-latency data access.
Start by creating table "LeetcodeUsers" which has users as property containing list of leetcode ids.
Create TableLets add the data using AWS dashboard
Adding dataNow we are all done with db part.
<br>
<br>
<h2>Amazon SES</h2>

AWS SES (Simple Email Service) is a scalable and cost-effective email sending and receiving service for businesses and developers. It allows you to send transactional, marketing, and notification emails, and also handle incoming email. SES provides reliable delivery, built-in analytics, and easy integration with other AWS services.
We are using email to validate identity, and as we are running on development mode(sandbox) we need to verify the mail ids for sender as well as reciever.
Verified two mails

Lets jump to functioning
<br>
<br>
<h2>AWS Lambda</h2>
AWS Lambda lets you run code in response to events such as changes to data in Amazon S3 buckets, updates to Amazon DynamoDB tables, or HTTP requests via Amazon API Gateway, without needing to manage servers. It scales automatically, from a few requests per day to thousands per second, and you only pay for the compute time you consume.
 Lets jump to getAll Data from dynamoDB
We take tableName and key to search and it will return us all users.
In this we are using one api "leetcode-stats-api.herokuapp.com" which return analytics and merging those data for different users we create data that will be passed in sendEmail function.
Lets start with creating sendEmail function.
In above code:
Destination: List of all verified users
Template: Email Template name which consist of table in mustache form
TemplateData: Data used in template
Source: Mail id from which data will be sent
<br>
<br>
<h2>AWS Eventbridge</h2>

AWS EventBridge is a serverless event bus service that makes it easy to connect different applications using events. It allows you to route events from AWS services, SaaS applications, and your own custom applications to targets like AWS Lambda functions, Amazon SNS topics, AWS Step Functions, and more.
Create event bridge rule which has cron enabled and specify the lambda function to invoke.

<br>
<h2>Result</h2>
<img src="https://github.com/sid507/leetcodeAnalyzer/blob/master/result.png">
