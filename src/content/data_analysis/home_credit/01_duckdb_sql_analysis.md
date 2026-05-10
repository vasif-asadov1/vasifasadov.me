---
layout: ../../../layouts/ArticleLayout.astro
title: 2. DuckDB SQL Analysis Part 1
description:  Dataset will be imported using DuckDB SQL and initial exploration of the data will be done to understand the structure of the data, the types of features, and the distribution of the target variable.
---


## Introduction
This is the first step of the analysis. In this step, I will use DuckDB SQL to do the data ingestion and initial exploration of the data. I will read the data from the csv files and do the initial exploration of the data to understand the structure of the data. The dataset consists of the following tables: 

- `application_data`: This table contains the main information about the customers, including their demographic information, financial information, and the target variable (whether they defaulted or not).
- `bureau`: This table contains information about the customers' credit history from other financial institutions.
- `bureau_balance`: This table contains information about the monthly balance of the customers' credit history from other financial institutions.
- `credit_card_balance`: This table contains information about the customers' credit card balance and payment history.
- `installments_payments`: This table contains information about the customers' installment payments history.
- `previous_application`: This table contains information about the customers' previous loan applications and their outcomes.   
- `POS_CASH_balance`: This table contains information about the customers' point of sale and cash loan balance and payment history.

Each csv file will be read by DuckDB SQL and added to the DuckDB database. After reading the data, I will do the initial exploration of the data, I will do analysis on each table to define the unnecessary or missing features. This will help me to simplify the data and make it easier to work with in the next steps of the analysis. 

## Callouts and Resources

<div class="callout attention">
<h4 class="callout-title">💡 Attention</h4>
<p>Please make sure to check the database connections before running this SQL query.</p>
</div>

<div class="callout note">
<h4 class="callout-title">📝 Note</h4>
<p>In this project, we are using DuckDB instead of standard Pandas for faster execution.</p>
</div>

<div class="callout success">
<h4 class="callout-title">✅ Acceptance Criteria</h4>
<p>The model reached a 92% accuracy, which perfectly aligns with our business requirements.</p>
</div>

## Card Views

<div class="md-grid">

<a href="https://duckdb.org" target="_blank" class="md-card teal">
<h4 class="md-card-title">DuckDB SQL</h4>
<p class="md-card-desc">An in-process SQL OLAP database management system used for fast analytical queries.</p>
</a>

<a href="https://python.org" target="_blank" class="md-card indigo">
<h4 class="md-card-title">Python Environment</h4>
<p class="md-card-desc">Scripts used for final data cleaning and feeding the Machine Learning models.</p>
</a>

<a href="https://xgboost.ai" target="_blank" class="md-card rose">
<h4 class="md-card-title">XGBoost Model</h4>
<p class="md-card-desc">Extreme Gradient Boosting algorithm applied for the final credit default prediction.</p>
</a>

</div>


<div class="md-row">

<a href="/data-analysis/home_credit/01_duckdb_sql_analysis" class="md-card amber">
<h4 class="md-card-title">1. Initial Data Exploration</h4>
<p class="md-card-desc">First look at the application_train data, finding missing values and understanding data types.</p>
</a>

<a href="/data-analysis/home_credit/02_duckdb_feature_engineering" class="md-card amber">
<h4 class="md-card-title">2. Feature Engineering with SQL</h4>
<p class="md-card-desc">Creating new behavioral metrics using aggregate functions and window operations.</p>
</a>

</div>


## Gallery Views

<div class="md-gallery">

<a href="#" class="md-gallery-card">
<img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" alt="Dashboard" class="md-gallery-img">
<div class="md-gallery-content">
<h4 class="md-gallery-title">Executive Dashboard</h4>
<p class="md-gallery-desc">Interactive Tableau dashboard showcasing macro performance and regional sales trends.</p>
</div>
</a>

<a href="#" class="md-gallery-card">
<img src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format&fit=crop" alt="Code" class="md-gallery-img">
<div class="md-gallery-content">
<h4 class="md-gallery-title">Python ML Pipeline</h4>
<p class="md-gallery-desc">End-to-end data cleaning, feature engineering, and predictive modeling using XGBoost.</p>
</div>
</a>

<a href="#" class="md-gallery-card">
<img src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop" alt="GitHub" class="md-gallery-img">
<div class="md-gallery-content">
<h4 class="md-gallery-title">GitHub Automation</h4>
<p class="md-gallery-desc">Shell scripts for full repository control directly from the Linux terminal.</p>
</div>
</a>

</div>


## Different Views with Tags

<div class="md-gallery">

<a href="#" class="md-gallery-card">
<img src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop" alt="GitHub" class="md-gallery-img">
<div class="md-gallery-content">
<div class="md-tags">
<span class="md-tag tag-bash">Bash</span>
<span class="md-tag tag-aws">AWS EC2</span>
<span class="md-tag tag-purple">Automation</span>
</div>
<h4 class="md-gallery-title">GitHub Automation</h4>
<p class="md-gallery-desc">Shell scripts for full repository control directly from the Linux terminal.</p>
</div>
</a>

</div>



## Comparisons

<div class="md-comparison">

<div class="comp-box pros">
<h4>Advantages</h4>
<ul>
<li>Extremely fast execution on large datasets.</li>
<li>Native support for lazy evaluation.</li>
<li>Better memory management with Rust backend.</li>
</ul>
</div>

<div class="comp-box cons">
<h4>Limitations</h4>
<ul>
<li>Steeper learning curve for Pandas users.</li>
<li>Smaller ecosystem of specialized plugins.</li>
<li>API is still evolving with potential breaking changes.</li>
</ul>
</div>

</div>



## Side-by-Side Code Comparison

<div class="md-comparison-row">

<div class="comp-box pros">
<h4>Advantages</h4>
<ul>
<li>Full width layout allows for longer, more descriptive bullet points without feeling cramped.</li>
<li>Maintains consistent professional styling with the grid-based comparison tool.</li>
<li>Perfect for mobile-first documentation or deep-dive technical reviews.</li>
</ul>
</div>

<div class="comp-box cons">
<h4>Limitations</h4>
<ul>
<li>Takes up more vertical space on the page compared to the grid view.</li>
<li>Less immediate visual contrast between the two categories at a single glance.</li>
</ul>
</div>

</div>


## Timeline

<div class="md-timeline">

<div class="timeline-step">
<div class="timeline-content">
<span class="step-date">Step 01 - Data Collection</span>
<h4>AWS S3 Ingestion</h4>
<p>Raw JSON logs were pulled from S3 buckets and converted into a unified schema using DuckDB for initial processing.</p>
</div>
</div>

<div class="timeline-step">
<div class="timeline-content">
<span class="step-date">Step 02 - Feature Engineering</span>
<h4>SQL Transformations</h4>
<p>Created behavioral features like "Rolling 7-day spend" and "Churn risk scores" using complex window functions in PostgreSQL.</p>
</div>
</div>

<div class="timeline-step">
<div class="timeline-content">
<span class="step-date">Step 03 - Modeling</span>
<h4>XGBoost Training</h4>
<p>Trained the model using Bayesian optimization for hyperparameter tuning. Final AUC-ROC score reached 0.89.</p>
</div>
</div>

<div class="timeline-step">
<div class="timeline-content">
<span class="step-date">Step 04 - Deployment</span>
<h4>API Integration</h4>
<p>The model was deployed as a FastAPI endpoint on a local Linux server with Docker containers.</p>
</div>
</div>

</div>


## Interactive File Tree

<div class="file-tree">

<div class="folder">project-root/</div>
<div class="folder indent-1">data/</div>
<div class="file indent-2">raw_data.csv</div>
<div class="file indent-2">processed_data.parquet</div>

<div class="folder indent-1">notebooks/</div>
<div class="file indent-2">01_eda.ipynb</div>
<div class="file indent-2">02_modeling.ipynb</div>

<div class="folder indent-1">src/</div>
<div class="file indent-2 active">main.py</div>
<div class="file indent-2">utils.py</div>
<div class="file indent-2">config.py</div>

<div class="file indent-1">requirements.txt</div>
<div class="file indent-1 active">README.md</div>
<div class="file indent-1">.gitignore</div>

</div>


## Quick Glance

<div class="tech-glance">

<div class="glance-item">
<span class="glance-label">Primary Stack</span>
<span class="glance-value">Python, DuckDB, Polars</span>
</div>

<div class="glance-item">
<span class="glance-label">Dataset Size</span>
<span class="glance-value">2.4 Million Rows</span>
</div>

<div class="glance-item">
<span class="glance-label">Model Type</span>
<span class="glance-value">XGBoost Classifier</span>
</div>

<div class="glance-item">
<span class="glance-label">Execution Time</span>
<span class="glance-value">14m 20s (End-to-End)</span>
</div>

</div>


## Math 

<div class="math-focus">

$$
\min_{u} \int_{0}^{T} (x^T Q x + u^T R u) dt
$$

<p style="font-size: 0.8rem; opacity: 0.6; margin-top: 1rem;">Cost function for Model Predictive Control (MPC)</p>
</div>

## Citation

<div class="md-citation">
"In God we trust, all others must bring data."
<span class="citation-author">— W. Edwards Deming</span>
</div>

## Algorithms

<ul class="algo-steps">
<li><strong>Initialization:</strong> Define the number of clusters and centroids.</li>
<li><strong>Assignment:</strong> Assign each data point to the nearest centroid.</li>
<li><strong>Update:</strong> Re-calculate the positions of centroids based on new assignments.</li>
</ul>

## Highlighting

Bu modelde <span class="term" title="Açıklama buraya">Stochastic Gradient Descent</span> algoritması tercih edilmiştir.

## Details

<details>
<summary>View Mathematical Derivation</summary>
Buraya uzun ispatları veya karmaşık LaTeX formüllerini yazabilirsin. Sadece meraklısı tıklar ve görür.
</details>

## Reference Links

<div class="reference-list">
  <div class="ref-item">
    <a href="https://arxiv.org/..." class="ref-link" target="_blank">Attention Is All You Need (Vaswani et al.)</a>
  </div>
  <div class="ref-item">
    <a href="https://polars.rs/" class="ref-link" target="_blank">Official Polars Documentation</a>
  </div>
</div>


<div class="external-project-card">
  <div class="project-info">
    <h5>Home Credit Default Risk Repo</h5>
    <p>View the full source code and feature engineering pipeline on GitHub.</p>
  </div>
  <a href="https://github.com/..." class="visit-btn" target="_blank">VIEW REPO</a>
</div>



## Summary 

<div class="key-takeaway">
<h5>Key Takeaway</h5>
<p>Our analysis shows that customer commute distance is the primary predictor of bike purchase probability, outweighing income level in the 25-35 age segment.</p>
</div>




##  Data Ingestion 

As is mentioned earlier, the data will be imported into the DuckDB database. **DuckDB** is a modern SQL engine that can run inside Python and it is optimized for analytical queries on large datasets. It is much faster than traditional Pandas reading methods and it can handle large datasets efficiently. It is my preferred method for working with large datasets, because it allows me to set hardware constraints such as *maximum usable ram*, *maximum usable core threads*. As my laptop hardware is limited with 12 GB Ram and Processor with 8 cores, I should definitely set these constraints to avoid any performance issues. 



###  Library and Settings 

Firstly, let's import all necessary libraries and adjust the settings for the libraries. 

```python
import pandas as pd
import numpy as np
import polars as pl 
import plotly.express as px
import duckdb
import os 
import plotly.express as px # for visualization
import plotly.io as pio   
import plotly.graph_objects as go 

pd.set_option("display.max_columns", None) # to display all columns in the output of the queries
pio.renderers.default = "notebook" # for plotly visualizations in Jupyter Notebook
from itables import init_notebook_mode # for interactive tables
init_notebook_mode(all_interactive=True)
```

###  DuckDB Connection and File Import


Then we should define the path to the data and create a connection to the DuckDB database with hardware constraints. 


```python
directory = "/home/vasif/Desktop/Home-Credit-Risk-Analysis/data/"
con = duckdb.connect(
    database="/home/vasif/Desktop/Home-Credit-Risk-Analysis/home_credit.duckdb",
    read_only=False)
con.execute("PRAGMA threads=6;") # define the max number of cpu cores usable by duckdb
con.execute("PRAGMA memory_limit='8GB';") # define the max size of ram usage by duckdb
``` 

The above code will create the DuckDB database with the name `home_credit.duckdb` in the specified path. The `PRAGMA` statements will set the maximum number of CPU cores that DuckDB can use to 6 and the maximum amount of RAM that DuckDB can use to 8 GB. This will help to optimize the performance of DuckDB when working with large datasets.

Now, we can create the tables in the DuckDB database and read the data from the csv files into these tables. 

```python
con.execute(f""" CREATE TABLE applications AS SELECT * FROM read_csv_auto('{directory}application_train.csv'); """)

con.execute(f""" CREATE TABLE pos_cash_balance AS SELECT * FROM read_csv_auto('{directory}POS_CASH_balance.csv'); """)

con.execute(f""" CREATE TABLE bureau AS SELECT * FROM read_csv_auto('{directory}bureau.csv'); """)

con.execute(f""" CREATE TABLE bureau_balance AS SELECT * FROM read_csv_auto('{directory}bureau_balance.csv'); """)

con.execute(f""" CREATE TABLE credit_card_balance AS SELECT * FROM read_csv_auto('{directory}credit_card_balance.csv'); """)

con.execute(f""" CREATE TABLE installments_payments AS SELECT * FROM read_csv_auto('{directory}installments_payments.csv'); """)

con.execute(f""" CREATE TABLE previous_applications AS SELECT * FROM read_csv_auto('{directory}previous_application.csv'); """)
```

The above code will create the tables in the DuckDB database and read the data from the csv files into these tables. The `read_csv_auto` function is a built-in function in DuckDB that automatically detects the schema of the csv file and creates the table accordingly. After executing the above code, we will have all the data from the csv files imported into the DuckDB database and we can start doing the initial exploration of the data.


###  Exporting the Tables as Parquet Files

As we already imported the tables into the DuckDB database, each time we start a new session, we can simply connect to the database and start doing the analysis without the need to import the data again. This will save us a lot of time and resources, especially when working with large datasets. However, to guarantee our analysis is reproducible, it is better experience to convert large csv files into **parquet files** and read the data from parquet files instead of csv files. Parquet files are a columnar storage format that is optimized for analytical queries and it is a lot much faster than reading csv files when working with large datasets. 

By using DuckDB, we can easily export our tables as parquet files with the following code: 

```python
parquet_dir = "/home/vasif/Desktop/Home-Credit-Risk-Analysis/parquet_files/"
os.makedirs(parquet_dir, exist_ok=True)

tables = [
    "applications",
    "pos_cash_balance",
    "bureau",
    "bureau_balance",
    "credit_card_balance",
    "installments_payments",
    "previous_applications"
]

for table in tables:
    file_path = os.path.join(parquet_dir, f"{table}.parquet")
    con.execute(f"""
        COPY (SELECT * FROM {table})
        TO '{file_path}' (FORMAT PARQUET)
    """)
    print(f"{table} exported to {file_path}")
```


###  Initial Data Exploration 

After importing the data into the DuckDB database, we can start doing the initial exploration of the data. Firstly, let's check the number of rows in each table to understand the size of the data. 

```python
tables = [
    "applications",
    "pos_cash_balance",
    "bureau",
    "bureau_balance",
    "credit_card_balance",
    "installments_payments",
    "previous_applications"
]

for table in tables:
    count = con.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    print(f"Table '{table}' has {count:,} rows")
```

**Output:**

```
Table 'applications' has 307,511 rows
Table 'pos_cash_balance' has 10,001,358 rows
Table 'bureau' has 1,716,428 rows
Table 'bureau_balance' has 27,299,925 rows
Table 'credit_card_balance' has 3,840,312 rows
Table 'installments_payments' has 13,605,401 rows
Table 'previous_applications' has 1,670,214 rows
```

We can observe from the results that some tables have more than 10 millions of rows. Therefore, traditional Pandas analysis methods will be very slow and inefficient when working with these tables. **This is why using DuckDB SQL is a much better option for working with this data, because it is optimized for analytical queries on large datasets and it can handle large datasets efficiently.** Hence, I will use DuckDB SQL to do all the analysis and feature engineering steps on the data, then create a final aggregated table with all the important features that I will use for building the prediction model. After creating the final aggregated table, I will switch to Pandas for data wrangling and model building steps, because the size of the final aggregated table will be much smaller than the original tables and it will be easier to work with in Pandas.

###  DuckDB Functions

Now we can start to do our deep analysis on the data. Before starting the analysis, I should mention some of the important functions to use in DuckDB SQL for the analysis.

After writing the SQL queries, we can execute them and retrieve the results with different functions: 

- **`fetchall()`:** This function retrieves all the rows from the result of the query and returns them as a list of tuples. Each tuple represents a row in the result, and each element in the tuple represents a column value. This function is useful when we want to retrieve all the data from the query result and we don't mind about the memory usage. However, if the result of the query is very large, it may consume a lot of memory and cause performance issues.
- **`fetchone()`:** This function retrieves the next row from the result of the query and returns it as a tuple. Each element in the tuple represents a column value. This function is useful when we want to retrieve one row at a time from the query result, especially when the result is very large and we want to avoid memory issues. We can use this function in a loop to retrieve all the rows one by one.
- **`fetchdf()`:** This function retrieves all the rows from the result of the query and returns them as a Pandas DataFrame. Each column in the DataFrame represents a column in the query result, and each row in the DataFrame represents a row in the query result. This function is useful when we want to work with the query result in a tabular format and we want to take advantage of the functionalities provided by Pandas for data manipulation and analysis. However, if the result of the query is very large, it may consume a lot of memory and cause performance issues. 
- **`fetchpolars()`:** This function retrieves all the rows from the result of the query and returns them as a Polars DataFrame. This function is useful when we want to work with the query result in a tabular format and we want to take advantage of the functionalities provided by **Polars** for data manipulation and analysis. Polars is a fast and efficient DataFrame library that is optimized for performance, especially when working with large datasets. Therefore, using `fetchpolars()` can be a better option than `fetchdf()` when working with large query results, as it can help to avoid memory issues and improve performance.

To execute the queries and commands we have two options:

1. **`execute()`:** With this method, we should write the SQL query as a string and pass it to the `execute()` method. This method will execute the query and return a cursor object that we can use to retrieve the results with the `fetch*()` methods. This method is useful when we want to execute a single query or command and we don't need to reuse the query or command multiple times.
2. **`sql()`:** This is a more convenient method for executing SQL queries. With this method, we can write the SQL query directly as a string and pass it to the `sql` method. This method will execute the query and return the results directly without the need to use a cursor object. This method is useful when we want to execute a single query or command and we want to retrieve the results directly without the need for additional steps.



##  Detailed SQL Analysis 

After learning the important functions we are ready to do our deep SQL analysis on the data. Each table will be considered separately and investigated with care. With this method, we will find out the necessary and predictive features for the model building step. We will also find out the patterns and insights from the data that will help us to build a better prediction model. 


### Applications Table 

####  Task 1. The *Family Burden* Matrix 

**Business Question:** Does the interaction between marital status (Single vs. Married) and
number of dependent children materially alter default risk? Is a single parent riskier than a
married parent with the same number of children?

**Objective:** Determine whether family size functions as a financial stressor or a stability anchor. Specifically, assess whether default probability increases linearly with the number of children
and whether marital status mitigates this effect. The outcome informs whether family-related variables should be penalized or interaction-adjusted in the risk model.



<details>
<summary>Show Code</summary>


```python
query = """
select 
    -- 1. Create the Marital Status Groups
    NAME_FAMILY_STATUS,

    -- 2. Bin Children (0, 1, 2, 3+) to handle outliers
    CASE 
        WHEN CNT_CHILDREN >= 3 THEN '3+'
        ELSE CAST(CNT_CHILDREN AS VARCHAR)
    END AS Num_Children,

    -- 3. Calculate Default Rate
    COUNT(*) AS Total_Count,
    ROUND(AVG(TARGET),3) AS Risk_Probability

FROM applications
WHERE NAME_FAMILY_STATUS IS NOT NULL 
  AND NAME_FAMILY_STATUS != 'Unknown'
GROUP BY 1, 2
ORDER BY 
    -- Sort logic: Children 0->3+, then Marital Status
    Risk_Probability desc
"""

t1 = con.execute(query).fetchdf()
markdown_table = t1.to_markdown(index=False)
print(markdown_table)
```

</details>

**Results:**

<div style="max-height: 400px; overflow: auto; white-space: nowrap;">

| NAME_FAMILY_STATUS   | Num_Children   |   Total_Count |   Risk_Probability |
|:---------------------|:---------------|--------------:|-------------------:|
| Civil marriage       | 3+             |           304 |              0.158 |
| Single / not married | 3+             |            98 |              0.153 |
| Widow                | 3+             |            67 |              0.119 |
| Civil marriage       | 2              |          1936 |              0.116 |
| Single / not married | 2              |           958 |              0.111 |
| Single / not married | 1              |          5578 |              0.109 |
| Civil marriage       | 1              |          6588 |              0.103 |
| Civil marriage       | 0              |         20947 |              0.096 |
| Single / not married | 0              |         38810 |              0.096 |
| Separated            | 2              |          1111 |              0.095 |
| Married              | 3+             |          3665 |              0.094 |
| Separated            | 1              |          4389 |              0.094 |
| Separated            | 3+             |           138 |              0.087 |
| Married              | 1              |         43696 |              0.085 |
| Married              | 2              |         22496 |              0.084 |
| Separated            | 0              |         14132 |              0.077 |
| Widow                | 2              |           248 |              0.073 |
| Married              | 0              |        126575 |              0.071 |
| Widow                | 1              |           868 |              0.067 |
| Widow                | 0              |         14905 |              0.057 |

</div>
<br>



**Insights:**

The data reveals a clear red flag: default risk spikes significantly for families with 3 or more children. What stands out most is that 'Civil Marriage' applicants mimic the high-risk behavior of single applicants rather than married ones. This suggests that raising a large family without the legal bond of marriage points to a lower level of stability or formal commitment, making this specific combination—Civil Marriage with 3+ kids—the riskiest profile in our dataset. Single applicants trail closely behind as the second highest risk group, while widowed individuals proved to be the safest. Ultimately, the driving force here is likely simple economics: households with 3+ children operate on tighter budgets, leaving them little room for error when repaying loans.



#### Task 2. The ”Leverage vs. Education” Paradox  

**Business Question: Do higher-educated clients handle high debt burdens better than lower-
educated clients?**


**Objective:** To test the ”Financial Literacy” hypothesis. High debt (high annuity) usually
predicts default. However, we suspect that highly educated clients can manage high debt better
than less educated ones. If true, we can allow higher loan amounts for educated applicants
without increasing risk.

**Solution:** For each of the education level (`NAME_EDUCATION_TYPE`), we should create bins using the ratio of annual credit amount (`AMT_ANNUITY`) to the total income amount (`AMT_INCOME_TOTAL`). Then for each education level - ratio bin groups, total loan volume and risk probability rate can be calculated.


<details>
<summary>Click here to see the solution</summary>
<br>

```python
query = """ 
    select
        NAME_EDUCATION_TYPE as education,
        case 
            when amt_annuity / nullif(amt_income_total, 0) < 0.1 then '0-10%'
            when amt_annuity / nullif(amt_income_total, 0) < 0.2 then '10-20%'
            when amt_annuity / nullif(amt_income_total, 0) < 0.3 then '20-30%'
            when amt_annuity / nullif(amt_income_total, 0) < 0.4 then '30-40%'
            else '40%+'
        end as leverage_bin,
        count(*) as total_count, 
        round(avg(target),3) as risk_probability   
    from applications
    group by 
        1,2   
    order by
        risk_probability desc
"""
t2 = con.execute(query).fetchdf()
t2
```

</details>
<br>

**Results:**

<div style="max-height: 400px; overflow: auto; white-space: nowrap;">

| education                     | leverage_bin   |   total_count |   risk_probability |
|:------------------------------|:---------------|--------------:|-------------------:|
| Lower secondary               | 20-30%         |          1053 |              0.13  |
| Lower secondary               | 30-40%         |           371 |              0.113 |
| Lower secondary               | 10-20%         |          1733 |              0.106 |
| Incomplete higher             | 30-40%         |           606 |              0.097 |
| Secondary / secondary special | 20-30%         |         55254 |              0.096 |
| Lower secondary               | 40%+           |           137 |              0.095 |
| Incomplete higher             | 10-20%         |          5041 |              0.09  |
| Secondary / secondary special | 10-20%         |        104022 |              0.089 |
| Secondary / secondary special | 40%+           |          6261 |              0.087 |
| Incomplete higher             | 20-30%         |          2150 |              0.087 |
| Secondary / secondary special | 30-40%         |         17916 |              0.086 |
| Secondary / secondary special | 0-10%          |         34938 |              0.084 |
| Lower secondary               | 0-10%          |           522 |              0.079 |
| Incomplete higher             | 40%+           |           170 |              0.071 |
| Incomplete higher             | 0-10%          |          2310 |              0.069 |
| Higher education              | 40%+           |          1376 |              0.062 |
| Higher education              | 30-40%         |          4586 |              0.058 |
| Higher education              | 20-30%         |         15454 |              0.056 |
| Higher education              | 10-20%         |         36998 |              0.053 |
| Higher education              | 0-10%          |         16449 |              0.049 |
| Academic degree               | 10-20%         |            73 |              0.027 |
| Academic degree               | 0-10%          |            49 |              0.02  |
| Academic degree               | 20-30%         |            25 |              0     |
| Academic degree               | 30-40%         |            13 |              0     |
| Academic degree               | 40%+           |             4 |              0     |

</div>
<br>

**Insights:**

The analysis reveals a strong association between education level and default risk, as well as a nonlinear relationship between the debt-to-income (DTI) ratio and default probability. Default risk is elevated among applicants with secondary or lower secondary education and materially lower among those with academic or higher education credentials. Risk concentration is most pronounced within the lower secondary education group, particularly for DTI ratios between 10% and 40%, peaking around the 20%–30% range.

This pattern is consistent with the hypothesis that higher education correlates with greater income stability, financial literacy, and job security, which collectively improve debt-servicing capacity. Conversely, lower education levels are associated with income volatility and limited financial buffers, increasing sensitivity to leverage. These interpretations are correlational and do not imply causality.



####  Task 3. The "Age & Occupation" Risk Heatmap

**Business Question: Which specific career stage creates the highest risk?**

**Objective:** To identify ”High-Risk Clusters” that standard models might miss. Age alone is
a strong predictor, but a ”Young Manager” might behave totally differently from a ”Young
Laborer.” Identifying these specific intersections allows us to adjust the credit score for specific
job types based on the applicant’s life stage.

**Solution:** Since the `DAYS_BIRTH` column indicating the applicant age in unit of days is negative, the first thing must be done is changing its sign and divide by 365 which will yield the applicant age in years. Then, ages will be binned with 10 years bin size and for each group joined with the occupation type, total number of loans and risk probability will be obtained.

<details>
<summary>Click here to see the solution</summary>
<br>

```python
query = """
    select
        case 
            when round(-days_birth/365,0) < 25 then '<25'
            when round(-days_birth/365,0) < 35 then '25-35'
            when round(-days_birth/365,0) < 45 then '35-45'
            when round(-days_birth/365,0) < 55 then '45-55'
            else '55+'
        end as age_group, 
        occupation_type,
        count(*) as total_loans, 
        round(avg(target), 3) * 100 as risk_probability

        from 
            applications
        group by 
            1, 2
        order by 
            risk_probability desc            
"""

t3 = con.execute(query).fetchdf()
```
</details>

<br>

**Results:**

<div style="max-height: 400px; overflow: auto; white-space: nowrap;">

| age_group   | OCCUPATION_TYPE       |   total_loans |   risk_probability |
|:------------|:----------------------|--------------:|-------------------:|
| 25-35       | Low-skill Laborers    |           664 |               20   |
| <25         | Low-skill Laborers    |           110 |               20   |
| <25         | HR staff              |            26 |               19.2 |
| 25-35       | Cleaning staff        |           515 |               17.7 |
| 35-45       | Low-skill Laborers    |           707 |               16.8 |
| 25-35       | Security staff        |          1071 |               16.1 |
| 25-35       | Cooking staff         |          1375 |               15.9 |
| <25         | Cleaning staff        |            38 |               15.8 |
| <25         | Laborers              |          2134 |               14.4 |
| 55+         | Low-skill Laborers    |           133 |               14.3 |
| <25         | Medicine staff        |           244 |               14.3 |
| 25-35       | Waiters/barmen staff  |           492 |               14.2 |
| <25         | Drivers               |           549 |               14.2 |
| 45-55       | Low-skill Laborers    |           479 |               13.8 |
| <25         | Security staff        |           132 |               13.6 |
| 25-35       | Drivers               |          4540 |               13.4 |
| <25         | Secretaries           |            83 |               13.3 |
| 25-35       | Laborers              |         15364 |               13.3 |
| <25         | Waiters/barmen staff  |           205 |               13.2 |
| <25         | Cooking staff         |           199 |               13.1 |
| <25         | Sales staff           |          1949 |               12.9 |
| <25         |                       |          1765 |               12.8 |
| 25-35       | Sales staff           |         10343 |               11.7 |
| 25-35       | Realty agents         |           275 |               11.6 |
| 35-45       | Security staff        |          1897 |               11.1 |
| 35-45       | Drivers               |          6353 |               10.9 |
| 35-45       | Cooking staff         |          1987 |               10.7 |
| <25         | Core staff            |          1525 |               10.7 |
| 35-45       | Cleaning staff        |          1170 |               10.7 |
| 35-45       | Laborers              |         18825 |               10.6 |
| 45-55       | IT staff              |            57 |               10.5 |
| 45-55       | Drivers               |          5263 |               10.5 |
| <25         | IT staff              |            40 |               10   |
| 25-35       |                       |         11814 |                9.6 |
| 45-55       | Security staff        |          2155 |                9.6 |
| <25         | Managers              |           261 |                9.6 |
| 25-35       | Medicine staff        |          1683 |                9.4 |
| 55+         | Drivers               |          1898 |                9.3 |
| <25         | High skill tech staff |           443 |                9.3 |
| 25-35       | Private service staff |           787 |                9.3 |
| 35-45       | Waiters/barmen staff  |           356 |                9.3 |
| 35-45       | Sales staff           |         10780 |                9.2 |
| <25         | Private service staff |           120 |                9.2 |
| 45-55       | Cleaning staff        |          1794 |                8.8 |
| 35-45       | Secretaries           |           396 |                8.8 |
| <25         | Accountants           |           286 |                8.7 |
| 45-55       | Waiters/barmen staff  |           223 |                8.5 |
| 25-35       | Managers              |          4798 |                8.5 |
| 45-55       | Laborers              |         14168 |                8.4 |
| 35-45       |                       |         13917 |                8.2 |
| 25-35       | IT staff              |           249 |                8   |
| 55+         | Security staff        |          1466 |                7.8 |
| 45-55       | Cooking staff         |          1907 |                7.6 |
| 25-35       | Core staff            |          9507 |                7.5 |
| 25-35       | HR staff              |           188 |                7.4 |
| 45-55       | Sales staff           |          7484 |                7.3 |
| 35-45       | Realty agents         |           265 |                7.2 |
| 35-45       | Medicine staff        |          3017 |                7.1 |
| 25-35       | High skill tech staff |          3403 |                7   |
| 45-55       |                       |         15536 |                6.8 |
| 25-35       | Secretaries           |           466 |                6.7 |
| 55+         | Laborers              |          4695 |                6.5 |
| 45-55       | Private service staff |           615 |                6.3 |
| 35-45       | High skill tech staff |          3512 |                6.2 |
| 35-45       | HR staff              |           180 |                6.1 |
| 25-35       | Accountants           |          2923 |                6.1 |
| 55+         | Cleaning staff        |          1136 |                5.9 |
| 35-45       | Core staff            |          8676 |                5.9 |
| 55+         | Sales staff           |          1546 |                5.8 |
| 35-45       | Managers              |          7850 |                5.7 |
| 45-55       | Secretaries           |           252 |                5.6 |
| 45-55       | High skill tech staff |          2864 |                5.6 |
| 45-55       | Managers              |          6290 |                5.5 |
| 55+         |                       |         53359 |                5.1 |
| 45-55       | Medicine staff        |          2508 |                4.8 |
| 35-45       | Private service staff |          1004 |                4.8 |
| 45-55       | Core staff            |          5808 |                4.7 |
| 55+         | Managers              |          2172 |                4.7 |
| 45-55       | Realty agents         |           152 |                4.6 |
| 45-55       | HR staff              |           115 |                4.3 |
| 45-55       | Accountants           |          2409 |                4.3 |
| 55+         | Cooking staff         |           478 |                4.2 |
| 35-45       | Accountants           |          3206 |                4.2 |
| 55+         | Waiters/barmen staff  |            72 |                4.2 |
| 55+         | Medicine staff        |          1085 |                4.1 |
| 55+         | Core staff            |          2054 |                3.7 |
| 55+         | High skill tech staff |          1158 |                3.6 |
| 55+         | Private service staff |           126 |                3.2 |
| 55+         | Accountants           |           989 |                3.1 |
| 55+         | Realty agents         |            34 |                2.9 |
| 35-45       | IT staff              |           150 |                2.7 |
| 55+         | HR staff              |            54 |                1.9 |
| 55+         | Secretaries           |           108 |                0.9 |
| 55+         | IT staff              |            30 |                0   |
| <25         | Realty agents         |            25 |                0   |

</div>

<br>

**Insights:**
The results shows default risk across occupations and age groups, where color represents risk level and bubble size reflects the number of applicants. Across all age groups, the majority of applicants are concentrated in laborer (physical worker) occupations, making this segment the largest in the portfolio.

Default risk among laborers varies noticeably with age. Younger laborers exhibit higher default rates, while risk declines steadily for older groups. The default rate for younger laborers is around 14%, which is more than 35% higher than that observed among older laborers. Other low-skill occupations—such as cleaning staff, cooking staff, and security personnel—also display elevated risk levels, generally in the 17%–20% range.

Higher-skilled occupations tend to have lower default risk overall. However, younger applicants within these roles still fall into a moderate-risk category, whereas older applicants are consistently low risk. Overall, the results suggest that age is a strong predictor of default risk, especially when considered together with occupation and education level.


#### Task 4. The ”Asset Shield” Analysis

**Business Question: Does owning ”Hard Assets” (Car/Real Estate) serve as a safety net for clients who don’t own their home (Renters/Living with Parents)?**

**Objective:** To quantify the ”Safety Net” effect of assets. We need to know if owning a car or
real estate compensates for a ”risky” housing situation (like renting). This helps us approve
loans for Renters if they demonstrate stability through other assets (like owning a car)


<details>
<summary>Click here to see the solution</summary>
<br>

```python
query = """ 
    select 
        case
            when flag_own_car = 'Y' then 'Have Car'
            else 'No Car'
        end as Owned_Car, 

        case 
            when flag_own_realty = 'Y' then 'Have Estate'
            else 'No Estate'
        end as Owned_Estate,
        count(*) as total_loans,
        round(avg(target) * 100, 2) as risk_probability
    from applications
    group by 1,2
    order by 4 desc
"""
t4 = con.execute(query).fetchdf()
t4
```
</details>
<br>

**Results:**

| Owned_Car   | Owned_Estate   |   total_loans |   risk_probability |
|:------------|:---------------|--------------:|-------------------:|
| No Car      | No Estate      |         61972 |               8.99 |
| No Car      | Have Estate    |        140952 |               8.28 |
| Have Car    | Have Estate    |         72360 |               7.33 |
| Have Car    | No Estate      |         32227 |               7.04 |

<br>

**Insights:**
The results show no strong relationship between owning a car or real estate and default risk, as the risk rates across groups are very close to each other. Car ownership appears to be weakly associated with lower risk, since applicants who own a car have slightly lower default rates. However, real estate ownership does not show a clear or consistent pattern, as both the highest and lowest risk groups include applicants without real estate. Overall, these variables provide limited predictive power on their own and are unlikely to be strong standalone risk indicators.


#### Task 5. The ”External Score” Validation

**Business Question: Is the external credit score (EXT SOURCE 2) equally predictive for small
”Consumer Loans” vs. large ”Cash Loans”?**

**Objective:** To validate the reliability of external data sources (EXT SOURCE 2) across dif-
ferent product types. If the external score is highly predictive for ”Cash Loans” but fails for
”Revolving Loans,” we need to treat those products differently in our final machine learning
pipeline.


**Solution:** There are 3 external scores in the data and they can be better resembled by the average external score. So, the step is derivation of external source score by taking the null values and division by zero case into consideration. Then, the scores can be binned and for each individual bin group the average risk rate can be obtained.


<details>
<summary>Click here to see the solution</summary>
<br>

```python
query = """
with Score_Calc AS (
    SELECT
        NAME_CONTRACT_TYPE,
        TARGET,
        (
            COALESCE(EXT_SOURCE_1, 0) + 
            COALESCE(EXT_SOURCE_2, 0) + 
            COALESCE(EXT_SOURCE_3, 0)
        ) / NULLIF(
            (CASE WHEN EXT_SOURCE_1 IS NOT NULL THEN 1 ELSE 0 END +
             CASE WHEN EXT_SOURCE_2 IS NOT NULL THEN 1 ELSE 0 END +
             CASE WHEN EXT_SOURCE_3 IS NOT NULL THEN 1 ELSE 0 END), 0
        ) AS Avg_Ext_Score
    FROM applications
)
SELECT 
    NAME_CONTRACT_TYPE as contract_type,
    CASE 
        WHEN Avg_Ext_Score < 0.2 THEN '0.0 - 0.2'
        WHEN Avg_Ext_Score < 0.4 THEN '0.2 - 0.4'
        WHEN Avg_Ext_Score < 0.6 THEN '0.4 - 0.6'
        WHEN Avg_Ext_Score < 0.8 THEN '0.6 - 0.8'
        ELSE '0.8 - 1.0'
    END AS avg_external_score,
    COUNT(*) AS total_loans,
    ROUND(AVG(TARGET) * 100, 3) AS risk_rate
FROM Score_Calc
where Avg_Ext_Score is not null
GROUP BY 1, 2
ORDER BY 
    risk_rate desc
"""

t5 = con.execute(query).fetchdf()
t5
```
</details>
<br>

**Results:**

| contract_type   | avg_external_score   |   total_loans |   risk_rate |
|:----------------|:---------------------|--------------:|------------:|
| Cash loans      | 0.0 - 0.2            |          9569 |      29.031 |
| Revolving loans | 0.0 - 0.2            |           879 |      19.681 |
| Cash loans      | 0.2 - 0.4            |         53331 |      16.634 |
| Revolving loans | 0.2 - 0.4            |          5619 |      11.372 |
| Cash loans      | 0.4 - 0.6            |        129885 |       6.915 |
| Revolving loans | 0.4 - 0.6            |         13838 |       4.473 |
| Cash loans      | 0.6 - 0.8            |         84735 |       3.027 |
| Cash loans      | 0.8 - 1.0            |           560 |       1.964 |
| Revolving loans | 0.6 - 0.8            |          8846 |       1.956 |
| Revolving loans | 0.8 - 1.0            |            77 |       0     |

<br>

**Insights:**

The analysis shows a strong negative relationship between external credit scores and default risk, with default probability decreasing monotonically as credit score increases. This pattern indicates that external credit scores are among the most informative predictors in the dataset.

In addition, default risk differs substantially by loan type. Revolving loans exhibit consistently lower default rates compared to cash loans—approximately 50% lower risk at low credit score levels—and converge toward near-zero default risk at the highest score ranges. In contrast, cash loans display significantly higher risk, with default rates of approximately 30% for low external scores (0–0.2) and remaining non-zero even at high score levels (0.8–1.0).



#### Task 6. The ”Housing Quality” Tier (Feature Engineering) 

**Business Question: Does living in a ”High-Quality” building significantly reduce default risk,
and is the ”Absence of Data” (Missing Housing Info) a risk factor in itself?**

**Objective:** The dataset has 47 columns about the building (ELEVATORS, ENTRANCES,
APARTMENTS AVG). Using them individually is messy. We want to engineer a proxy for
”Wealth” based on where they live. If a client lives in a building with an elevator and a large
apartment, they likely have hidden wealth, even if their reported income is low.


**Solution:** There are lots of columns representing the house parameters in median, mode and average. In my opinion, the better option is doing analysis based on the average scores, then comparing the results with the ones obtained by using the median scores. That will guarantee that there is not such a big difference between using either of the scores and it will let us to drop unnecessary columns. So, in the first query, average house metrics are calculated using the housing parameter columns ended with `_AVG` and then they will be grouped as 'low quality', 'mid quality' and 'high quality' segments. For the applicants falling in each segment, average income amount will be derived to investigate whether there are applicants showing low income but living in the high quality houses which may be a strong predictor of default risk.


<details>
<summary>Click here to see the solution</summary>
<br>

```python
query = """
with housing_feature_averages as (
    select
        sk_id_curr,
        target,

        -- AVERAGE HOUSE METRICS
        nullif(apartments_avg, 0) as apartments_avg,
        nullif(basementarea_avg, 0) as basementarea_avg,
        nullif(commonarea_avg, 0) as commonarea_avg,
        nullif(elevators_avg, 0) as elevators_avg,
        nullif(entrances_avg, 0) as entrances_avg,
        nullif(FLOORSMAX_AVG, 0) as floorsmax_avg, 
        nullif(FLOORSMIN_AVG, 0) as FLOORSMIN_AVG, 
        nullif(LANDAREA_AVG, 0) as LANDAREA_AVG, 
        nullif(LIVINGAPARTMENTS_AVG, 0) as LIVINGAPARTMENTS_AVG , 
        nullif(NONLIVINGAPARTMENTS_AVG, 0) as NONLIVINGAPARTMENTS_AVG, 
        nullif(NONLIVINGAREA_AVG, 0) as NONLIVINGAREA_AVG , 
        coalesce(AMT_INCOME_TOTAL, 0) as total_income
        from applications        
),

house_metric_avg as (
    select 
        target,
        round (
            (
                apartments_avg + basementarea_avg + commonarea_avg + elevators_avg + 
                entrances_avg + FLOORSMAX_AVG + FLOORSMIN_AVG + LANDAREA_AVG +LIVINGAPARTMENTS_AVG +
                NONLIVINGAPARTMENTS_AVG + NONLIVINGAREA_AVG 
            ) / 
            (
                case when apartments_avg is not null then 1 else 0 end + 
                case when basementarea_avg is not null then 1 else 0 end + 
                case when commonarea_avg is not null then 1 else 0 end + 
                case when elevators_avg is not null then 1 else 0 end + 
                case when entrances_avg is not null then 1 else 0 end + 
                case when FLOORSMAX_AVG is not null then 1 else 0 end + 
                case when FLOORSMIN_AVG is not null then 1 else 0 end + 
                case when LANDAREA_AVG is not null then 1 else 0 end + 
                case when LIVINGAPARTMENTS_AVG is not null then 1 else 0 end + 
                case when NONLIVINGAPARTMENTS_AVG is not null then 1 else 0 end + 
                case when NONLIVINGAREA_AVG is not null then 1 else 0 end             
        ), 3) as avg_house_metric, 
        total_income
    from housing_feature_averages
)
select
        case 
            when avg_house_metric is null then 'Missing'
            when avg_house_metric < 0.2 then 'Low Quality House'
            when avg_house_metric < 0.4 then 'Mid Quality House'
            else 'High Quality House'
        end as house_quality,
        count(*) as total_loans,
        round(avg(total_income),2) as avg_income,
        round(avg(target) * 100, 3) as risk_rate
    from house_metric_avg
    group by 1
    order by 
        risk_rate desc,
        avg_income desc
"""

t6 = con.execute(query).fetchdf()
t6
```

</details>
<br>

**Results:**

| house_quality      |   total_loans |   avg_income |   risk_rate |
|:-------------------|--------------:|-------------:|------------:|
| Missing            |        293941 |       167546 |       8.167 |
| High Quality House |           221 |       268364 |       6.335 |
| Low Quality House  |         10078 |       190013 |       6.033 |
| Mid Quality House  |          3271 |       209240 |       6.023 |


<br>

**Insights:**

Green line in the graph corresponds to the risk rate and the blue line corresponds to the total number of credits taken in the corresponding category. The red bubble sizes define the average annual income of the applicants falling in the group. Based on the visual it is observed that the default risk is highest among applicants with missing housing information, exceeding 8%, and this group also represents the largest share of the portfolio, with approximately 294K applicants.

Applicants reporting mid- or low-quality housing exhibit the lowest default risk, at around 6%, representing roughly a 40% reduction relative to applicants with missing housing information. Interestingly, applicants reporting high-quality housing show slightly higher default risk than the mid- and low-quality groups, despite having substantially higher average annual income.

Overall, these results suggest that missing housing information is associated with elevated default risk, while applicants who explicitly report housing characteristics tend to exhibit more stable repayment behavior.


**SOLUTION 2** 

In the second solution, the median values will be used as housing scores.


<details>
<summary>Click here to see the solution</summary>
<br>

```python
query = """
with housing_feature_averages as (
    select
        sk_id_curr,
        target,

        -- AVERAGE HOUSE METRICS
        nullif(APARTMENTS_MEDI, 0) as APARTMENTS_MEDI,
        nullif(BASEMENTAREA_MEDI, 0) as BASEMENTAREA_MEDI,
        nullif(COMMONAREA_MEDI, 0) as COMMONAREA_MEDI,
        nullif(ELEVATORS_MEDI, 0) as ELEVATORS_MEDI,
        nullif(ENTRANCES_MEDI, 0) as ENTRANCES_MEDI,
        nullif(FLOORSMAX_MEDI, 0) as FLOORSMAX_MEDI, 
        nullif(FLOORSMIN_MEDI, 0) as FLOORSMIN_MEDI, 
        nullif(LANDAREA_MEDI, 0) as LANDAREA_MEDI, 
        nullif(LIVINGAPARTMENTS_MEDI, 0) as LIVINGAPARTMENTS_MEDI , 
        nullif(LIVINGAREA_MEDI, 0) as LIVINGAREA_MEDI, 
        nullif(NONLIVINGAPARTMENTS_MEDI, 0) as NONLIVINGAPARTMENTS_MEDI , 
        nullif(NONLIVINGAREA_MEDI,0) as NONLIVINGAREA_MEDI,
        coalesce(AMT_INCOME_TOTAL, 0) as total_income
        from applications        
),

house_metric_avg as (
    select 
        target,
        round (
            (
                apartments_medi + basementarea_medi + commonarea_medi + elevators_medi + 
                entrances_medi + FLOORSMAX_medi + FLOORSMIN_medi + LANDAREA_medi + LIVINGAPARTMENTS_medi +
                LIVINGAREA_MEDI + NONLIVINGAPARTMENTS_MEDI + NONLIVINGAREA_MEDI 
            ) / 
            (
                case when APARTMENTS_MEDI is not null then 1 else 0 end + 
                case when BASEMENTAREA_MEDI is not null then 1 else 0 end + 
                case when COMMONAREA_MEDI is not null then 1 else 0 end + 
                case when ELEVATORS_MEDI is not null then 1 else 0 end + 
                case when entrances_medi is not null then 1 else 0 end + 
                case when FLOORSMAX_medi is not null then 1 else 0 end + 
                case when FLOORSMIN_medi is not null then 1 else 0 end + 
                case when LANDAREA_medi is not null then 1 else 0 end + 
                case when LIVINGAPARTMENTS_medi is not null then 1 else 0 end + 
                case when LIVINGAREA_MEDI is not null then 1 else 0 end + 
                case when NONLIVINGAPARTMENTS_MEDI is not null then 1 else 0 end + 
                case when NONLIVINGAREA_MEDI is not null then 1 else 0 end             
        ), 3) as med_house_metric, 
        total_income
    from housing_feature_averages
)
select
        case 
            when med_house_metric is null then 'Missing'
            when med_house_metric < 0.2 then 'Low Quality House'
            when med_house_metric < 0.4 then 'Mid Quality House'
            else 'High Quality House'
        end as house_quality,
        count(*) as total_loans,
        round(avg(total_income),2) as avg_income,
        round(avg(target) * 100, 3) as risk_rate
    from house_metric_avg
    group by 1
    order by 
        risk_rate desc,
        avg_income desc
"""

t6_2 = con.execute(query).fetchdf()
t6_2
```

</details>

**Results:**

<br>

| house_quality      |   total_loans |   avg_income |   risk_rate |
|:-------------------|--------------:|-------------:|------------:|
| Missing            |        295182 |       167697 |       8.157 |
| High Quality House |           275 |       262860 |       6.182 |
| Low Quality House  |          8736 |       188778 |       6.136 |
| Mid Quality House  |          3318 |       206298 |       5.847 |

<br>

**Insights:**

The results are almost identical with the ones obtained by using average house metrics. Therefore, there is no need such number of columns as this will increase the model size and complexity without giving any beneficial information. These housing parameters can be considered as highly multicollinear features as if average increasing the mid also will increase. **Hence, the best option will be to drop all scores except the average parameters which in my opinion is better score to evaluate.**


#### Task 7. The ”Commuter Stability” Mismatch 

**Business Question: Do clients with a ”Commuter Mismatch” (Living in a different city than
where they work or are registered) have significantly higher default risk, and should we treat them as a separate segment in our risk models?**

**Objective:** To detect ”Flight Risk” or instability. We have flags for whether a client lives
in a different city than where they work or are registered (REG CITY NOT LIVE CITY,
REG CITY NOT WORK CITY). A mismatch suggests a transient lifestyle or a long commute,
which correlates with job turnover or fraud.



**Solution:** The solution is quite straightforward. The applicants will be grouped based on the flags indicating whether they live in a different city than where they work or are registered and for each group the default risk will be calculated.

<details>
<summary>Click here to see the solution</summary>
<br>

```python
query = """

with stats as (
select
    case
        when (
            reg_city_not_live_city + 
            reg_city_not_work_city + 
            live_city_not_work_city
        ) = 0 then 'stable_resident'
        when (
            reg_city_not_live_city + 
            reg_city_not_work_city + 
            live_city_not_work_city
        ) = 1 then 'moderate_instability'
        else 'instable_applicant'
    end as risk_segment,
    count(*) as client_count,
    round(avg(target) * 100, 2) as risk_rate
from applications
group by 
    1
)

select 
    risk_segment, 
    client_count,
    round(client_count / (select count(*) from applications) * 100,2) as percent_of_total,
    risk_rate
from stats
order by 4 desc
"""

t7 = con.execute(query).fetchdf()
t7
```

</details>

| risk_segment         |   client_count |   percent_of_total |   risk_rate |
|:---------------------|---------------:|-------------------:|------------:|
| instable_applicant   |          72192 |              23.48 |       10.61 |
| moderate_instability |           1925 |               0.63 |        8.68 |
| stable_resident      |         233394 |              75.9  |        7.28 |

<br>

**Insights:**

Applicants are classified as unstable if they satisfy at least two of the following conditions: residing in a city different from the one reported, working in a city different from the one reported, or living in a city in which they do not work. Moderately stable applicants satisfy exactly one of these conditions, while stable residents report consistent living and working locations and do not meet any of the listed criteria.

The resulting table indicates that unstable applicants exhibit the highest default risk, at approximately 10.61%, whereas stable residents show the lowest default risk, around 7.3%. Given that nearly 75% of customers are classified as stable, the lower risk observed in this large segment suggests that residential and employment stability is associated with stronger repayment behavior. From a credit risk perspective, customer stability may therefore be considered a relevant factor when assessing default likelihood.


####  Task 8. The ”Bad Influence” Ratio (Social Circle) 

**Business Question: What is the tipping point where a client’s social circle becomes ”Toxic”?
(i.e., If ¿10% of your network defaults, do you follow them?)**

**Objective** To refine the Social Circle analysis. Merely knowing people with loans (OBS 30)
isn’t bad. Knowing people who default (DEF 30) is bad. We need the Ratio of bad apples in
their network.



<details>
<summary>Click here to see the solution</summary>
<br>

```python
query = """ 
with tab1 as(
    select
        sk_id_curr,
        target,
        OBS_60_CNT_SOCIAL_CIRCLE,
        DEF_60_CNT_SOCIAL_CIRCLE,
        case
            when coalesce(OBS_60_CNT_SOCIAL_CIRCLE, 0) = 0  then 0
            else cast(cast(DEF_60_CNT_SOCIAL_CIRCLE as double) / OBS_60_CNT_SOCIAL_CIRCLE as double)
        end as bad_influence_ratio
    
    from applications
),

tab2 as (
    select
        target,
        bad_influence_ratio,
        case 
            when OBS_60_CNT_SOCIAL_CIRCLE = 0 or OBS_60_CNT_SOCIAL_CIRCLE is null then 'no social data'
            when  bad_influence_ratio = 0  then 'clean circle'
            when bad_influence_ratio between 0 and 0.2 then 'low_toxic_circle'
            else 'high_toxic_circle'
        end as social_circle_segments
    from tab1
)
select
    social_circle_segments,
    round(avg(bad_influence_ratio),2) as avg_bad_influence_ratio,
    count(*) as total_loans,
    round(count(*) / (select count(*) from applications),3)*100 as percent_of_total,
    round(avg(target)*100, 3) as risk_rate
from tab2
group by 1
order by 5 desc

"""

t8 = con.execute(query).fetchdf()
t8
```
</details>
<br>

**Results:**

| social_circle_segments   |   avg_bad_influence_ratio |   total_loans |   percent_of_total |   risk_rate |
|:-------------------------|--------------------------:|--------------:|-------------------:|------------:|
| high_toxic_circle        |                      0.67 |         22281 |                7.2 |      10.902 |
| low_toxic_circle         |                      0.16 |          3488 |                1.1 |      10.493 |
| no social data           |                      0    |        165687 |               53.9 |       7.881 |
| clean circle             |                      0    |        116055 |               37.7 |       7.732 |

<br>

**Insights:**


The analysis shows that the majority of applicants either have no recorded social data or belong to a clean social circle, and these groups exhibit the lowest default risk among all segments.

In contrast, applicants associated with highly toxic social circles show substantially higher default risk, reaching approximately 11%, and account for around 7.2% of the total applicant population. Applicants with low toxic social circles represent a much smaller segment—about 1% of the data (approximately 3,500 applicants)—yet they also display elevated default risk at around 10.5%, closely aligning with the high-toxicity group.

Overall, the results suggest that social circle toxicity is positively associated with default risk, indicating that this variable may serve as a useful predictor in default risk modeling.


####  Task 9: The ”Impulse Loan” Timing Analysis 

**Business Question: Do applications submitted during ”Off-Peak” hours (Late Night / Weekends) carry higher default risk?**

**Objective:** Behavioral psychology. People who apply for loans at 10 AM on a Tuesday are
usually treating it as a business transaction. People who apply at 3 AM on a Sunday might be
desperate or impulsive.


<details>
<summary>Click here to see the solution</summary>
<br>

```python
query  =  """

with general_time_data as (
    select
        sk_id_curr,
        target,
        WEEKDAY_APPR_PROCESS_START,
        case when WEEKDAY_APPR_PROCESS_START = 'SUNDAY' or WEEKDAY_APPR_PROCESS_START = 'SATURDAY'
                then 'weekend'
            else 'weekday'
        end as appr_day,
     
        HOUR_APPR_PROCESS_START,
        case 
            when HOUR_APPR_PROCESS_START >= 20 or HOUR_APPR_PROCESS_START <= 8 then 'late night / too early'
            else 'standard time'
        end as appr_time
    from applications 
    where WEEKDAY_APPR_PROCESS_START is not null and HOUR_APPR_PROCESS_START is not null
)
select
    appr_day,
    appr_time,
    count(*) as total_loans, 
    round(count(*) / (select count(*) from applications), 3) * 100 as percent_of_total,
    round(avg(target),3) as risk_rate
from general_time_data
group by 1,2
order by risk_rate desc
"""

t9 = con.execute(query).fetchdf()
t9
```

</details>
<br>

**Results:**

| appr_day   | appr_time              |   total_loans |   percent_of_total |   risk_rate |
|:-----------|:-----------------------|--------------:|-------------------:|------------:|
| weekend    | late night / too early |          7010 |                2.3 |       0.096 |
| weekday    | late night / too early |         32271 |               10.5 |       0.096 |
| weekday    | standard time          |        225207 |               73.2 |       0.079 |
| weekend    | standard time          |         43023 |               14   |       0.076 |


<br>

**Insights:**

The tabular results indicates no relationship between between approving the loan weekend or weekday ; midnight or standard working hours. Hence, this can not be used as a good predictor in the prediction model.


####  Task 10. The ”Document Transparency” Score 

**Business: Question Does the total number of documents provided correlate with repayment? (Are ”Over-documenters” safer?)**

**Objective:** To measure client ”Effort.” The dataset has 20 flags (FLAG DOCUMENT 2 to
FLAG DOCUMENT 21). Most are 0. We hypothesize that clients who provide more docu-
mentation than required (High transparency) are safer.

<details>
<summary>Click here to see the solution</summary>
<br>

```python

query = """
with tab1 as (
    select 
        sk_id_curr,
        target,
        coalesce(FLAG_DOCUMENT_2,0) + coalesce(FLAG_DOCUMENT_3,0) + 
        coalesce(FLAG_DOCUMENT_4,0) + coalesce(FLAG_DOCUMENT_5,0) + coalesce(FLAG_DOCUMENT_6,0) +
        coalesce(FLAG_DOCUMENT_7,0) + coalesce(FLAG_DOCUMENT_8,0) + coalesce(FLAG_DOCUMENT_9,0) +
        coalesce(FLAG_DOCUMENT_10,0) + coalesce(FLAG_DOCUMENT_11,0) + coalesce(FLAG_DOCUMENT_12,0) +
        coalesce(FLAG_DOCUMENT_13,0) + coalesce(FLAG_DOCUMENT_14,0) + coalesce(FLAG_DOCUMENT_15,0) +
        coalesce(FLAG_DOCUMENT_16,0) + coalesce(FLAG_DOCUMENT_17,0) + coalesce(FLAG_DOCUMENT_18,0) +
        coalesce(FLAG_DOCUMENT_19,0) + coalesce(FLAG_DOCUMENT_20,0) + coalesce(FLAG_DOCUMENT_21,0) as total_docs_provided
    from applications
)
select 
    total_docs_provided,
    count(*) as total_loans,
    round(count(*)/(select count(*) from applications) * 100,2) as percent_of_total,
    round(avg(target),2) as risk_rate

    from tab1
    group by 1
    order by risk_rate desc
"""

t10 = con.execute(query).fetchdf()
t10
```

</details>
<br>

**Results:**

|   total_docs_provided |   total_loans |   percent_of_total |   risk_rate |
|----------------------:|--------------:|-------------------:|------------:|
|                     4 |             1 |               0    |        1    |
|                     3 |           163 |               0.05 |        0.1  |
|                     1 |        270056 |              87.82 |        0.08 |
|                     0 |         29549 |               9.61 |        0.06 |
|                     2 |          7742 |               2.52 |        0.05 |


<br>

**Insights:**

According to the results, there is not a clear connection between the risk of being default and the number of documents provided. Moreover, most of the entries for these columns are missing. Hence the best option will be to drop all of these columns as they do not reveal any significant predictive information.



## End of Section 1 

*In this section, we have completed the followings:*

1. **Data Import and Setup with DuckDB:** We created the DuckDB connection, created a database and imported all the csv files into the database as tables. 
2. **Data Export as Parquet Files:** We exported the tables as parquet files to be used in the further sections if the database or connection fails.
3. **Data Analysis with SQL:** We have completed 10 different tasks on the main table - *Applications* - to understand the data and get insights about the default risk across different segments. 

*What will be covered in the next sections:*

1. **Data Analysis with SQL Part 2:** We will do analysis using SQL on all remaining tables to clear out the necessary of features and get insights about the data.
2. **Feature Engineering with SQL:** We will do feature engineering using SQL to create new features that can be used in the model. Also, we will drop unnecessary features that we have identified in the previous sections. At the end of this section, we will have a clean and ready to use dataset for the model building phase.
3. **Data Wrangling with Python:** We will do data wrangling using Python to handle missing values, outliers and do encoding for the categorical variables using the newly created dataset in the previous section. At the end of this section, we will have a clean and ready to use dataset for the model building phase.
4. **Model Building:** We will build a machine learning model to predict the default risk using the clean dataset we have created in the previous sections. We will use different algorithms and compare their performance to select the best model for our use case.
 



 






















