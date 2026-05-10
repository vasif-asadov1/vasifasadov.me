---
layout: ../../../layouts/ArticleLayout.astro
title: Home Credit Risk Analysis - Problem Description
description: This article provides a detailed problem description for the Home Credit Risk Analysis project, outlining the tasks assigned by the company, the structure of the analysis, the tools and skills used, acknowledgements, and references.
tags: ["SQL", "Tableau", "Data Analysis", "Data Science", "Machine Learning", "XGBoost", "LightGBM", "Logistic Regression", "SHAP"]
---


## **Home Credit Company** 

Home Credit Company is a company that gives credit for the customers who wants to buy something but they don't have enough money to pay for it. The company will give the customers a loan and the customers will pay back the loan in installments. The company will charge interest on the loan and the customers will have to pay back the loan with interest. In the past experience of the company, there were some customers who created problems for the company by not paying back the loan. These type of customers are always headaches for the company because they will cause the company to lose time and money. Therefore, the company hired us as a data scientist to help them to predict which customers will create problems based on the data of previous customers. They called it <font color="orange">**Home Credit Default Risk Predicton Assignment** </font> in which **credt default** means the case when the customero will not pay back the loan. 

Company assigned the following tasks to us:

1. <font color="skyblue">**Advanced Analysis of the Data**:</font> We should analyze the data of previous customers to find out which patterns are common among the customers who created problems for the company. We should also find out which features are important for predicting the credit default. 
2. <font color="skyblue">**Feature Engineering on the Data**:</font> We should define which features are important and explanatory for the default risk. In some cases, we may need to create new features from the existing features to get more predictive features. 
3. <font color="skyblue">**Data Wrangling**:</font> Before building the accurate prediction model, we should clean the data and handle the missing values, outliers, and other issues in the data. We should also split the data into training and testing sets to evaluate the performance of our model.
4. <font color="skyblue">**Building the Prediction Model**:</font> After making the data ready, we should build a prediction model to predict which customers will create problems for the company. We can use different machine learning algorithms to build the model and we should evaluate the performance of the model using appropriate metrics.
5. <font color="skyblue">**Feature Importance Analysis:**</font> The blackbox models are not enought to help the company to understand the reasons behind the default risk. Therefore, we should also analyze the feature importance to find out which features are most important for predicting the credit default. This will help the company to consider these features more carefully when giving loans to customers in the future.
6. <font color="skyblue">**Documentation and Reporting**:</font> Finally, we should document our analysis, feature engineering, data wrangling, model building, and feature importance analysis in a clear and concise manner. We should also prepare a report to present our findings and recommendations to the company.




##  **Structure of the Analysis** 

After taking the assignments from the company, I have structured my analysis into the following steps:

1. <font color="skyblue">**Data Ingestion and Initial Exploration**:</font>  The data consists of multiple csv files, each containing different types of information about the customers. In some tables, the number of rows is more than millions, which makes the data import process slower. Therefore, I will use modern approach - <font color="orange">**using DuckDB SQL**</font> - to import the data and do the initial exploration of the data. It is SQL engine that can run inside Python and it is optimized for analytical queries on large datasets. **It is much faster than tradtional Pandas reading methods** and it can handle large datasets efficiently. I will use DuckDB to read the data from the csv files and do the initial exploration of the data to understand the structure of the data, the types of features, and the distribution of the target variable.
2. <font color="skyblue">**Advanced Analysis of the Data**:</font> After the initial exploration of the data, I will do the advanced analysis of the data to find out which patterns are common among the customers who created problems for the company. By using some AI tools, I will have advanced analytical business questions which will help us to dive deeper into the data and find out more insights about the customers and their behavior. I will also find out which features are important for predicting the credit default by using some statistical methods and visualization techniques.
3. <font color="skyblue">**Feature Engineering on the Data**:</font> After the advanced analysis of the data, I will do the feature engineering on the data to create new features from the existing features. I will also define which features are important and explanatory for the default risk. This will help us to improve the performance of our prediction model. I will generate one table which will contain all the features that I will use for building the prediction model. This table will be used as the input for the model building step.
4. <font color="skyblue">**Data Wrangling**:</font> This is the beginning step for the model building process. Here, I will switch to <font color="orange">**Pandas**</font> to do the data wrangling. I will clean the data and handle the missing values, outliers, and other issues in the data. I will also split the data into training and testing sets to evaluate the performance of our model.
5. <font color="skyblue">**Building the Prediction Model**:</font> After making the data ready, I will build a prediction model to predict which customers will create problems for the company. I will use <font color="orange">**XGBoost, LightGBM and Logistic Regression models**</font> to make the predictions. I will evaluate the performance of the model using appropriate metrics such as AUC-ROC, F1-score, and confusion matrix.
6. <font color="skyblue">**Feature Importance Analysis:**</font> After building the prediction model, I will analyze the feature importance to find out which features are most important for predicting the credit default. For this purpose, I will use <font color="orange">**SHAP Analysis**</font> to analyze the feature importance. This will help the company to consider these features more carefully when giving loans to customers in the future.
7. <font color="skyblue">**Documentation and Reporting**:</font> Finally, I will document my analysis, feature engineering, data wrangling, model building, and feature importance analysis in a clear and concise manner. For this purpose I will use <font color="orange">**Jupyter Notebook for coding and Markdown with MkDocs for documentation**</font> to document my analysis and I will prepare a report to present my findings and recommendations to the company. The report will include the insights that I have found from the data, the performance of the prediction model, and the feature importance analysis. I will also provide some recommendations to the company based on my analysis.


##  **Tools and Skills** 


- **Python**: Data Wrangling, Model Building, Feature Importance Analysis, Documentation
- **DuckDB SQL**: Data Ingestion, Initial Exploration, Advanced SQL Analysis
- **Pandas**: Data Wrangling
- **XGBoost, LightGBM and Logistic Regression**: Model Building
- **SHAP**: Feature Importance Analysis
- **Jupyter Notebook**: Coding and Documentation
- **Markdown with MkDocs**: Documentation and Reporting
- **Domain Knowledge**: Understanding the credit risk, credit default, and the factors that can affect the accuracy of the prediction model.


##  **Acknowlegements** 
The logical structure of this analysis is completely owned by me. Based on my data science experience and knowledge, I have structured the analysis in a way that I think is the best for this problem. Besides my own experience, I have also used **AI tools**  as assistance to improve the quality of the analysis and to find out more insights from the data. I have used AI tools for generating some business questions for the advanced analysis of the data, and for improving the documentation and reporting of the analysis. I have also used online resources, for example the documentation of mkdocs, to improve the documentation experience. 




##  **References** 

1. [Github Repository of the Analysis](https://github.com/vasif-asadov1/Home-Credit-Risk-Analysis)
2. [Database Diagram of the Data](https://github.com/vasif-asadov1/Home-Credit-Risk-Analysis/blob/main/Database%20ER%20Diagram.pdf) (created by me after removing unnecessary columns)
3. [Home Credit Risk Dataset](https://www.kaggle.com/competitions/home-credit-default-risk)
4. [DuckDB Documentation](https://duckdb.org/docs/)
5. [XGBoost Documentation](https://xgboost.readthedocs.io/en/stable/)
6. [LightGBM Documentation](https://lightgbm.readthedocs.io/en/latest/)
7. [Logistic Regression Documentation](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html)
7. [SHAP Documentation](https://shap.readthedocs.io/en/latest/)
8. [MkDocs Documentation](https://www.mkdocs.org/)
















