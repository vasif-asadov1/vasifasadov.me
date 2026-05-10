---
layout: ../../../layouts/ArticleLayout.astro
title: Feature Engineering 
description: This article focuses on the feature engineering process for the Home Credit Risk Analysis project, utilizing DuckDB SQL to create new features and prepare the dataset for modeling. The article covers the introduction to feature engineering, connecting to the data, and specific feature engineering techniques applied to the applications table.
---


##  Introduction 

In the previous sections, we defined the important, predictive features in our dataset. In this section, we will implement the feature engineering process using the insights we gained from our analysis. Again, we will be using DuckDB SQL to perform our feature engineering.

Our feature engineering methods will be a mix meaning that we sometimes drop some columns, or sometimes create new features by combining those columns and drop the original columns. We will also be creating some new features by applying some mathematical operations on the existing features.

Feature engineering will be applied on each of the table and then we will combine all the necessary (together with the feature engineered columns) columns from each table to create our final dataset for modeling.


##  Connect to Data 

Let's firstly import the necessary libraries and connect to our data. We will be using DuckDB SQL to perform our feature engineering.


```python
import pandas as pd
import numpy as np
import polars as pl 
import plotly.express as px
import duckdb
import os 


# Set pandas options to display all columns and rows
pd.set_option("display.max_columns", None)
pd.set_option("display.max_rows", None) 

con = duckdb.connect("/home/vasif/Desktop/Home-Credit-Risk-Analysis/home_credit.duckdb") # connect to the duckdb database
```


##  `Applications Table` Feature Engineering

Firstly, create a new table called `home_credit_train` which will be our final dataset for modeling. Firstly, read the `applications.parquet` file and import the data into the `home_credit_train` table. We will be performing feature engineering on this table and then we will be combining it with the other tables to create our final dataset for modeling. 

```python
con.execute(r"""CREATE OR REPLACE TABLE home_credit_train AS SELECT * 
FROM '/home/vasif/Desktop/Home-Credit-Risk-Analysis/parquet_files/applications.parquet'""")
```

###  Feature Engineering on House Parameters

Instead of 50 columns all representing the housing parameters with different scores - average, mean and median, the better option is to choose the columns with average scores and applying feature engineering to them which will result just two columns to represent the house quality of applicants:

- `housing_score_avg` - the average of all non-null values for a client. A high score means the client lives in a high-end building
- `housing_data_count` - The number of these columns that are not null. This is a proxy for "data completeness." Wealthier clients often have more documented housing records.

<details>
<summary>Show Code</summary>


```python
con.execute("""
create or replace table home_credit_train as 
select 
    * exclude (
        apartments_avg, basementarea_avg, years_beginexpluatation_avg, 
        years_build_avg, commonarea_avg, elevators_avg, entrances_avg, 
        floorsmax_avg, floorsmin_avg, landarea_avg, livingapartments_avg, 
        livingarea_avg, nonlivingapartments_avg, nonlivingarea_avg
    ),
    
    -- calculate sum of all 14 columns (treating null as 0) divided by the count of non-nulls 
    (
        coalesce(apartments_avg, 0) + coalesce(basementarea_avg, 0) + 
        coalesce(years_beginexpluatation_avg, 0) + coalesce(years_build_avg, 0) + 
        coalesce(commonarea_avg, 0) + coalesce(elevators_avg, 0) + 
        coalesce(entrances_avg, 0) + coalesce(floorsmax_avg, 0) + 
        coalesce(floorsmin_avg, 0) + coalesce(landarea_avg, 0) + 
        coalesce(livingapartments_avg, 0) + coalesce(livingarea_avg, 0) + 
        coalesce(nonlivingapartments_avg, 0) + coalesce(nonlivingarea_avg, 0)
    ) / nullif(
        (case when apartments_avg is not null then 1 else 0 end) + 
        (case when basementarea_avg is not null then 1 else 0 end) + 
        (case when years_beginexpluatation_avg is not null then 1 else 0 end) + 
        (case when years_build_avg is not null then 1 else 0 end) + 
        (case when commonarea_avg is not null then 1 else 0 end) + 
        (case when elevators_avg is not null then 1 else 0 end) + 
        (case when entrances_avg is not null then 1 else 0 end) + 
        (case when floorsmax_avg is not null then 1 else 0 end) + 
        (case when floorsmin_avg is not null then 1 else 0 end) + 
        (case when landarea_avg is not null then 1 else 0 end) + 
        (case when livingapartments_avg is not null then 1 else 0 end) + 
        (case when livingarea_avg is not null then 1 else 0 end) + 
        (case when nonlivingapartments_avg is not null then 1 else 0 end) + 
        (case when nonlivingarea_avg is not null then 1 else 0 end), 
    0) as housing_score_avg,
    
    -- keep the count of how many columns provided data 
    (
        (case when apartments_avg is not null then 1 else 0 end) + 
        (case when basementarea_avg is not null then 1 else 0 end) + 
        (case when years_beginexpluatation_avg is not null then 1 else 0 end) + 
        (case when years_build_avg is not null then 1 else 0 end) + 
        (case when commonarea_avg is not null then 1 else 0 end) + 
        (case when elevators_avg is not null then 1 else 0 end) + 
        (case when entrances_avg is not null then 1 else 0 end) + 
        (case when floorsmax_avg is not null then 1 else 0 end) + 
        (case when floorsmin_avg is not null then 1 else 0 end) + 
        (case when landarea_avg is not null then 1 else 0 end) + 
        (case when livingapartments_avg is not null then 1 else 0 end) + 
        (case when livingarea_avg is not null then 1 else 0 end) + 
        (case when nonlivingapartments_avg is not null then 1 else 0 end) + 
        (case when nonlivingarea_avg is not null then 1 else 0 end)
    ) as housing_data_count
from home_credit_train
""")
```

</details>
<br>


In this code, we did the following:

- We excluded the original 14 columns that represent the housing parameters with different scores - average, mean and median - using the `exclude` keyword in the `select` statement.
- We created a new column `housing_score_avg` which is the average of all non-null values for a client. We used the `coalesce` function to treat null values as 0 and then divided the sum by the count of non-null values to get the average score.
- We created another column `housing_data_count` which is the count of how many of these columns provided data (i.e., are not null). This is a proxy for "data completeness," as wealthier clients often have more documented housing records.
- Finally, we updated the table `home_credit_train` with the new columns and the original columns that we kept.


In each step of the aggregation or modification in the tables it is best practice to visualize the top 5 rows of the resulted table to investigate the changes made and understand the current structure. 

```python
con.execute("select * from home_credit_train limit 5").fetchdf()
```



<div style="max-height: 400px; overflow: auto;" markdown>

|   SK_ID_CURR |   TARGET | NAME_CONTRACT_TYPE   | CODE_GENDER   | FLAG_OWN_CAR   | FLAG_OWN_REALTY   |   CNT_CHILDREN |   AMT_INCOME_TOTAL |      AMT_CREDIT |   AMT_ANNUITY |   AMT_GOODS_PRICE | NAME_TYPE_SUITE   | NAME_INCOME_TYPE   | NAME_EDUCATION_TYPE           | NAME_FAMILY_STATUS   | NAME_HOUSING_TYPE   |   REGION_POPULATION_RELATIVE |   DAYS_BIRTH |   DAYS_EMPLOYED |   DAYS_REGISTRATION |   DAYS_ID_PUBLISH |   OWN_CAR_AGE |   FLAG_MOBIL |   FLAG_EMP_PHONE |   FLAG_WORK_PHONE |   FLAG_CONT_MOBILE |   FLAG_PHONE |   FLAG_EMAIL | OCCUPATION_TYPE   |   CNT_FAM_MEMBERS |   REGION_RATING_CLIENT |   REGION_RATING_CLIENT_W_CITY | WEEKDAY_APPR_PROCESS_START   |   HOUR_APPR_PROCESS_START |   REG_REGION_NOT_LIVE_REGION |   REG_REGION_NOT_WORK_REGION |   LIVE_REGION_NOT_WORK_REGION |   REG_CITY_NOT_LIVE_CITY |   REG_CITY_NOT_WORK_CITY |   LIVE_CITY_NOT_WORK_CITY | ORGANIZATION_TYPE      |   EXT_SOURCE_1 |   EXT_SOURCE_2 |   EXT_SOURCE_3 |   APARTMENTS_AVG |   BASEMENTAREA_AVG |   YEARS_BEGINEXPLUATATION_AVG |   YEARS_BUILD_AVG |   COMMONAREA_AVG |   ELEVATORS_AVG |   ENTRANCES_AVG |   FLOORSMAX_AVG |   FLOORSMIN_AVG |   LANDAREA_AVG |   LIVINGAPARTMENTS_AVG |   LIVINGAREA_AVG |   NONLIVINGAPARTMENTS_AVG |   NONLIVINGAREA_AVG |   APARTMENTS_MODE |   BASEMENTAREA_MODE |   YEARS_BEGINEXPLUATATION_MODE |   YEARS_BUILD_MODE |   COMMONAREA_MODE |   ELEVATORS_MODE |   ENTRANCES_MODE |   FLOORSMAX_MODE |   FLOORSMIN_MODE |   LANDAREA_MODE |   LIVINGAPARTMENTS_MODE |   LIVINGAREA_MODE |   NONLIVINGAPARTMENTS_MODE |   NONLIVINGAREA_MODE |   APARTMENTS_MEDI |   BASEMENTAREA_MEDI |   YEARS_BEGINEXPLUATATION_MEDI |   YEARS_BUILD_MEDI |   COMMONAREA_MEDI |   ELEVATORS_MEDI |   ENTRANCES_MEDI |   FLOORSMAX_MEDI |   FLOORSMIN_MEDI |   LANDAREA_MEDI |   LIVINGAPARTMENTS_MEDI |   LIVINGAREA_MEDI |   NONLIVINGAPARTMENTS_MEDI |   NONLIVINGAREA_MEDI | FONDKAPREMONT_MODE   | HOUSETYPE_MODE   |   TOTALAREA_MODE | WALLSMATERIAL_MODE   | EMERGENCYSTATE_MODE   |   OBS_30_CNT_SOCIAL_CIRCLE |   DEF_30_CNT_SOCIAL_CIRCLE |   OBS_60_CNT_SOCIAL_CIRCLE |   DEF_60_CNT_SOCIAL_CIRCLE |   DAYS_LAST_PHONE_CHANGE |   FLAG_DOCUMENT_2 |   FLAG_DOCUMENT_3 |   FLAG_DOCUMENT_4 |   FLAG_DOCUMENT_5 |   FLAG_DOCUMENT_6 |   FLAG_DOCUMENT_7 |   FLAG_DOCUMENT_8 |   FLAG_DOCUMENT_9 |   FLAG_DOCUMENT_10 |   FLAG_DOCUMENT_11 |   FLAG_DOCUMENT_12 |   FLAG_DOCUMENT_13 |   FLAG_DOCUMENT_14 |   FLAG_DOCUMENT_15 |   FLAG_DOCUMENT_16 |   FLAG_DOCUMENT_17 |   FLAG_DOCUMENT_18 |   FLAG_DOCUMENT_19 |   FLAG_DOCUMENT_20 |   FLAG_DOCUMENT_21 |   AMT_REQ_CREDIT_BUREAU_HOUR |   AMT_REQ_CREDIT_BUREAU_DAY |   AMT_REQ_CREDIT_BUREAU_WEEK |   AMT_REQ_CREDIT_BUREAU_MON |   AMT_REQ_CREDIT_BUREAU_QRT |   AMT_REQ_CREDIT_BUREAU_YEAR |
|-------------:|---------:|:---------------------|:--------------|:---------------|:------------------|---------------:|-------------------:|----------------:|--------------:|------------------:|:------------------|:-------------------|:------------------------------|:---------------------|:--------------------|-----------------------------:|-------------:|----------------:|--------------------:|------------------:|--------------:|-------------:|-----------------:|------------------:|-------------------:|-------------:|-------------:|:------------------|------------------:|-----------------------:|------------------------------:|:-----------------------------|--------------------------:|-----------------------------:|-----------------------------:|------------------------------:|-------------------------:|-------------------------:|--------------------------:|:-----------------------|---------------:|---------------:|---------------:|-----------------:|-------------------:|------------------------------:|------------------:|-----------------:|----------------:|----------------:|----------------:|----------------:|---------------:|-----------------------:|-----------------:|--------------------------:|--------------------:|------------------:|--------------------:|-------------------------------:|-------------------:|------------------:|-----------------:|-----------------:|-----------------:|-----------------:|----------------:|------------------------:|------------------:|---------------------------:|---------------------:|------------------:|--------------------:|-------------------------------:|-------------------:|------------------:|-----------------:|-----------------:|-----------------:|-----------------:|----------------:|------------------------:|------------------:|---------------------------:|---------------------:|:---------------------|:-----------------|-----------------:|:---------------------|:----------------------|---------------------------:|---------------------------:|---------------------------:|---------------------------:|-------------------------:|------------------:|------------------:|------------------:|------------------:|------------------:|------------------:|------------------:|------------------:|-------------------:|-------------------:|-------------------:|-------------------:|-------------------:|-------------------:|-------------------:|-------------------:|-------------------:|-------------------:|-------------------:|-------------------:|-----------------------------:|----------------------------:|-----------------------------:|----------------------------:|----------------------------:|-----------------------------:|
|       100002 |        1 | Cash loans           | M             | N              | Y                 |              0 |             202500 | 406598          |       24700.5 |   351000          | Unaccompanied     | Working            | Secondary / secondary special | Single / not married | House / apartment   |                     0.018801 |        -9461 |            -637 |               -3648 |             -2120 |           nan |            1 |                1 |                 0 |                  1 |            1 |            0 | Laborers          |                 1 |                      2 |                             2 | WEDNESDAY                    |                        10 |                            0 |                            0 |                             0 |                        0 |                        0 |                         0 | Business Entity Type 3 |       0.083037 |       0.262949 |       0.139376 |           0.0247 |             0.0369 |                        0.9722 |            0.6192 |           0.0143 |            0    |          0.069  |          0.0833 |          0.125  |         0.0369 |                 0.0202 |           0.019  |                    0      |              0      |            0.0252 |              0.0383 |                         0.9722 |             0.6341 |            0.0144 |           0      |           0.069  |           0.0833 |           0.125  |          0.0377 |                   0.022 |            0.0198 |                          0 |                    0 |            0.025  |              0.0369 |                         0.9722 |             0.6243 |            0.0144 |             0    |           0.069  |           0.0833 |           0.125  |          0.0375 |                  0.0205 |            0.0193 |                     0      |                 0    | reg oper account     | block of flats   |           0.0149 | Stone, brick         | False                 |                          2 |                          2 |                          2 |                          2 |                    -1134 |                 0 |                 1 |                 0 |                 0 |                 0 |                 0 |                 0 |                 0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                            0 |                           0 |                            0 |                           0 |                           0 |                            1 |
|       100003 |        0 | Cash loans           | F             | N              | N                 |              0 |             270000 |      1.2935e+06 |       35698.5 |        1.1295e+06 | Family            | State servant      | Higher education              | Married              | House / apartment   |                     0.003541 |       -16765 |           -1188 |               -1186 |              -291 |           nan |            1 |                1 |                 0 |                  1 |            1 |            0 | Core staff        |                 2 |                      1 |                             1 | MONDAY                       |                        11 |                            0 |                            0 |                             0 |                        0 |                        0 |                         0 | School                 |       0.311267 |       0.622246 |     nan        |           0.0959 |             0.0529 |                        0.9851 |            0.796  |           0.0605 |            0.08 |          0.0345 |          0.2917 |          0.3333 |         0.013  |                 0.0773 |           0.0549 |                    0.0039 |              0.0098 |            0.0924 |              0.0538 |                         0.9851 |             0.804  |            0.0497 |           0.0806 |           0.0345 |           0.2917 |           0.3333 |          0.0128 |                   0.079 |            0.0554 |                          0 |                    0 |            0.0968 |              0.0529 |                         0.9851 |             0.7987 |            0.0608 |             0.08 |           0.0345 |           0.2917 |           0.3333 |          0.0132 |                  0.0787 |            0.0558 |                     0.0039 |                 0.01 | reg oper account     | block of flats   |           0.0714 | Block                | False                 |                          1 |                          0 |                          1 |                          0 |                     -828 |                 0 |                 1 |                 0 |                 0 |                 0 |                 0 |                 0 |                 0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                            0 |                           0 |                            0 |                           0 |                           0 |                            0 |
|       100004 |        0 | Revolving loans      | M             | Y              | Y                 |              0 |              67500 | 135000          |        6750   |   135000          | Unaccompanied     | Working            | Secondary / secondary special | Single / not married | House / apartment   |                     0.010032 |       -19046 |            -225 |               -4260 |             -2531 |            26 |            1 |                1 |                 1 |                  1 |            1 |            0 | Laborers          |                 1 |                      2 |                             2 | MONDAY                       |                         9 |                            0 |                            0 |                             0 |                        0 |                        0 |                         0 | Government             |     nan        |       0.555912 |       0.729567 |         nan      |           nan      |                      nan      |          nan      |         nan      |          nan    |        nan      |        nan      |        nan      |       nan      |               nan      |         nan      |                  nan      |            nan      |          nan      |            nan      |                       nan      |           nan      |          nan      |         nan      |         nan      |         nan      |         nan      |        nan      |                 nan     |          nan      |                        nan |                  nan |          nan      |            nan      |                       nan      |           nan      |          nan      |           nan    |         nan      |         nan      |         nan      |        nan      |                nan      |          nan      |                   nan      |               nan    |                      |                  |         nan      |                      | <NA>                  |                          0 |                          0 |                          0 |                          0 |                     -815 |                 0 |                 0 |                 0 |                 0 |                 0 |                 0 |                 0 |                 0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                            0 |                           0 |                            0 |                           0 |                           0 |                            0 |
|       100006 |        0 | Cash loans           | F             | N              | Y                 |              0 |             135000 | 312682          |       29686.5 |   297000          | Unaccompanied     | Working            | Secondary / secondary special | Civil marriage       | House / apartment   |                     0.008019 |       -19005 |           -3039 |               -9833 |             -2437 |           nan |            1 |                1 |                 0 |                  1 |            0 |            0 | Laborers          |                 2 |                      2 |                             2 | WEDNESDAY                    |                        17 |                            0 |                            0 |                             0 |                        0 |                        0 |                         0 | Business Entity Type 3 |     nan        |       0.650442 |     nan        |         nan      |           nan      |                      nan      |          nan      |         nan      |          nan    |        nan      |        nan      |        nan      |       nan      |               nan      |         nan      |                  nan      |            nan      |          nan      |            nan      |                       nan      |           nan      |          nan      |         nan      |         nan      |         nan      |         nan      |        nan      |                 nan     |          nan      |                        nan |                  nan |          nan      |            nan      |                       nan      |           nan      |          nan      |           nan    |         nan      |         nan      |         nan      |        nan      |                nan      |          nan      |                   nan      |               nan    |                      |                  |         nan      |                      | <NA>                  |                          2 |                          0 |                          2 |                          0 |                     -617 |                 0 |                 1 |                 0 |                 0 |                 0 |                 0 |                 0 |                 0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                          nan |                         nan |                          nan |                         nan |                         nan |                          nan |
|       100007 |        0 | Cash loans           | M             | N              | Y                 |              0 |             121500 | 513000          |       21865.5 |   513000          | Unaccompanied     | Working            | Secondary / secondary special | Single / not married | House / apartment   |                     0.028663 |       -19932 |           -3038 |               -4311 |             -3458 |           nan |            1 |                1 |                 0 |                  1 |            0 |            0 | Core staff        |                 1 |                      2 |                             2 | THURSDAY                     |                        11 |                            0 |                            0 |                             0 |                        0 |                        1 |                         1 | Religion               |     nan        |       0.322738 |     nan        |         nan      |           nan      |                      nan      |          nan      |         nan      |          nan    |        nan      |        nan      |        nan      |       nan      |               nan      |         nan      |                  nan      |            nan      |          nan      |            nan      |                       nan      |           nan      |          nan      |         nan      |         nan      |         nan      |         nan      |        nan      |                 nan     |          nan      |                        nan |                  nan |          nan      |            nan      |                       nan      |           nan      |          nan      |           nan    |         nan      |         nan      |         nan      |        nan      |                nan      |          nan      |                   nan      |               nan    |                      |                  |         nan      |                      | <NA>                  |                          0 |                          0 |                          0 |                          0 |                    -1106 |                 0 |                 0 |                 0 |                 0 |                 0 |                 0 |                 1 |                 0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                  0 |                            0 |                           0 |                            0 |                           0 |                           0 |                            0 |


</div>


!!! note
    The amount of columns is quite large in the `home_credit_train` table. Therefore, in each step of the feature engineering process, we will not give the full table with all the columns here. However, you can run the given code above to see the full table in each of the step. 


Besides the `average score` for the house parameters, I also created `mode` calculation for these parameters. The `mode` is the most frequently occurring value in a column. This can be useful to capture the most common housing condition for each client, which might be more representative than the average in some cases.

The metrics with the MODE preffix also will be used to create features to represent them: 

- `housing_score_mode` - represents the mode of housing parameters.
- `housing_data_count_mode` - represents the non-null housing parameters. How many applicants provided full housing details.

<details>
<summary>Show Code</summary>

```python
con.execute("""
create or replace table home_credit_train as 
select 
    * exclude (
        apartments_mode, basementarea_mode, years_beginexpluatation_mode, 
        years_build_mode, commonarea_mode, elevators_mode, entrances_mode, 
        floorsmax_mode, floorsmin_mode, landarea_mode, livingapartments_mode, 
        livingarea_mode, nonlivingapartments_mode, nonlivingarea_mode
    ),
    /* calculate average for mode columns */
    (
        coalesce(apartments_mode, 0) + coalesce(basementarea_mode, 0) + 
        coalesce(years_beginexpluatation_mode, 0) + coalesce(years_build_mode, 0) + 
        coalesce(commonarea_mode, 0) + coalesce(elevators_mode, 0) + 
        coalesce(entrances_mode, 0) + coalesce(floorsmax_mode, 0) + 
        coalesce(floorsmin_mode, 0) + coalesce(landarea_mode, 0) + 
        coalesce(livingapartments_mode, 0) + coalesce(livingarea_mode, 0) + 
        coalesce(nonlivingapartments_mode, 0) + coalesce(nonlivingarea_mode, 0)
    ) / nullif(
        (case when apartments_mode is not null then 1 else 0 end) + 
        (case when basementarea_mode is not null then 1 else 0 end) + 
        (case when years_beginexpluatation_mode is not null then 1 else 0 end) + 
        (case when years_build_mode is not null then 1 else 0 end) + 
        (case when commonarea_mode is not null then 1 else 0 end) + 
        (case when elevators_mode is not null then 1 else 0 end) + 
        (case when entrances_mode is not null then 1 else 0 end) + 
        (case when floorsmax_mode is not null then 1 else 0 end) + 
        (case when floorsmin_mode is not null then 1 else 0 end) + 
        (case when landarea_mode is not null then 1 else 0 end) + 
        (case when livingapartments_mode is not null then 1 else 0 end) + 
        (case when livingarea_mode is not null then 1 else 0 end) + 
        (case when nonlivingapartments_mode is not null then 1 else 0 end) + 
        (case when nonlivingarea_mode is not null then 1 else 0 end), 
    0) as housing_score_mode,
    
    /* count non-null mode columns */
    (
        (case when apartments_mode is not null then 1 else 0 end) + 
        (case when basementarea_mode is not null then 1 else 0 end) + 
        (case when years_beginexpluatation_mode is not null then 1 else 0 end) + 
        (case when years_build_mode is not null then 1 else 0 end) + 
        (case when commonarea_mode is not null then 1 else 0 end) + 
        (case when elevators_mode is not null then 1 else 0 end) + 
        (case when entrances_mode is not null then 1 else 0 end) + 
        (case when floorsmax_mode is not null then 1 else 0 end) + 
        (case when floorsmin_mode is not null then 1 else 0 end) + 
        (case when landarea_mode is not null then 1 else 0 end) + 
        (case when livingapartments_mode is not null then 1 else 0 end) + 
        (case when livingarea_mode is not null then 1 else 0 end) + 
        (case when nonlivingapartments_mode is not null then 1 else 0 end) + 
        (case when nonlivingarea_mode is not null then 1 else 0 end)
    ) as housing_data_count_mode
from home_credit_train
""")
```

</details>


Same procedure is applied to the `median` columns as well. The `median` is the middle value in a sorted list of numbers. This can be useful to capture the central tendency of housing conditions for each client, which might be more robust to outliers than the average.


<details>
<summary>Show Code</summary>

```python
con.execute("""
create or replace table home_credit_train as 
select 
    * exclude (
        apartments_medi, basementarea_medi, years_beginexpluatation_medi, 
        years_build_medi, commonarea_medi, elevators_medi, entrances_medi, 
        floorsmax_medi, floorsmin_medi, landarea_medi, livingapartments_medi, 
        livingarea_medi, nonlivingapartments_medi, nonlivingarea_medi
    ),
    /* calculate average for medi columns */
    (
        coalesce(apartments_medi, 0) + coalesce(basementarea_medi, 0) + 
        coalesce(years_beginexpluatation_medi, 0) + coalesce(years_build_medi, 0) + 
        coalesce(commonarea_medi, 0) + coalesce(elevators_medi, 0) + 
        coalesce(entrances_medi, 0) + coalesce(floorsmax_medi, 0) + 
        coalesce(floorsmin_medi, 0) + coalesce(landarea_medi, 0) + 
        coalesce(livingapartments_medi, 0) + coalesce(livingarea_medi, 0) + 
        coalesce(nonlivingapartments_medi, 0) + coalesce(nonlivingarea_medi, 0)
    ) / nullif(
        (case when apartments_medi is not null then 1 else 0 end) + 
        (case when basementarea_medi is not null then 1 else 0 end) + 
        (case when years_beginexpluatation_medi is not null then 1 else 0 end) + 
        (case when years_build_medi is not null then 1 else 0 end) + 
        (case when commonarea_medi is not null then 1 else 0 end) + 
        (case when elevators_medi is not null then 1 else 0 end) + 
        (case when entrances_medi is not null then 1 else 0 end) + 
        (case when floorsmax_medi is not null then 1 else 0 end) + 
        (case when floorsmin_medi is not null then 1 else 0 end) + 
        (case when landarea_medi is not null then 1 else 0 end) + 
        (case when livingapartments_medi is not null then 1 else 0 end) + 
        (case when livingarea_medi is not null then 1 else 0 end) + 
        (case when nonlivingapartments_medi is not null then 1 else 0 end) + 
        (case when nonlivingarea_medi is not null then 1 else 0 end), 
    0) as housing_score_medi,
    
    /* count non-null medi columns */
    (
        (case when apartments_medi is not null then 1 else 0 end) + 
        (case when basementarea_medi is not null then 1 else 0 end) + 
        (case when years_beginexpluatation_medi is not null then 1 else 0 end) + 
        (case when years_build_medi is not null then 1 else 0 end) + 
        (case when commonarea_medi is not null then 1 else 0 end) + 
        (case when elevators_medi is not null then 1 else 0 end) + 
        (case when entrances_medi is not null then 1 else 0 end) + 
        (case when floorsmax_medi is not null then 1 else 0 end) + 
        (case when floorsmin_medi is not null then 1 else 0 end) + 
        (case when landarea_medi is not null then 1 else 0 end) + 
        (case when livingapartments_medi is not null then 1 else 0 end) + 
        (case when livingarea_medi is not null then 1 else 0 end) + 
        (case when nonlivingapartments_medi is not null then 1 else 0 end) + 
        (case when nonlivingarea_medi is not null then 1 else 0 end)
    ) as housing_data_count_medi
from home_credit_train
""")
```

</details>


###  Feature Engineering on Documents

In addition to the housing parameters, there are also lots of columns representing the documents provided by the applicants. These columns are named as `FLAG_DOCUMENT_2`, `FLAG_DOCUMENT_3`, ..., `FLAG_DOCUMENT_21`. Each of these columns indicates whether a specific document was provided by the applicant (1) or not (0). We can apply engineering methods to replace these columns with only two columns:

- `total_document_count`: representing total count of documents provided by the applicant.
- `flag_document_3_kept`: whether or not document 3 is provided or not.

These two columns is sufficient for predictive performance. The more number of documents provided by the applicant, the more likely they are to be wealthier and less risky. However, document 3 is a special document that is often provided by applicants and has a strong correlation with the target variable. Therefore, we will keep it as a separate feature to capture its specific impact on the target variable.


<details>
<summary>Show Code</summary> 

```python
con.execute("""
create or replace table home_credit_train as 
select 
    * exclude (
        flag_document_2, flag_document_3, flag_document_4, flag_document_5, 
        flag_document_6, flag_document_7, flag_document_8, flag_document_9, 
        flag_document_10, flag_document_11, flag_document_12, flag_document_13, 
        flag_document_14, flag_document_15, flag_document_16, flag_document_17, 
        flag_document_18, flag_document_19, flag_document_20, flag_document_21
    ),
    /* feature 1: the specific most important document */
    flag_document_3 as flag_document_3_kept,
    
    /* feature 2: total count of all documents submitted */
    (
        coalesce(flag_document_2, 0) + coalesce(flag_document_3, 0) + 
        coalesce(flag_document_4, 0) + coalesce(flag_document_5, 0) + 
        coalesce(flag_document_6, 0) + coalesce(flag_document_7, 0) + 
        coalesce(flag_document_8, 0) + coalesce(flag_document_9, 0) + 
        coalesce(flag_document_10, 0) + coalesce(flag_document_11, 0) + 
        coalesce(flag_document_12, 0) + coalesce(flag_document_13, 0) + 
        coalesce(flag_document_14, 0) + coalesce(flag_document_15, 0) + 
        coalesce(flag_document_16, 0) + coalesce(flag_document_17, 0) + 
        coalesce(flag_document_18, 0) + coalesce(flag_document_19, 0) + 
        coalesce(flag_document_20, 0) + coalesce(flag_document_21, 0)
    ) as total_document_count
from home_credit_train
""")
```

</details>

After doing just these two feature engineering steps on the housing parameters and the document flags, we have reduced the number of columns in the `home_credit_train` from 120 to 68. 



```python
train = con.execute("select * from home_credit_train").fetchdf()
train.shape
```

```
(307511, 68)
```


##  `Previous Applications` Table Feature Engineering


Previous Applications table contains the data of applicants who laid more applications to the Home Credit in the past. Some of the current customers are new and they dont have any information on this data, however by running the code below it can be seen that some applicants has more than even 70 previous applications and moreover, some of them reaches up to 40 approved credit applications.


<details>
<summary>Show Code</summary> 

```python
con.execute("""
    select sk_id_curr, 
    count(distinct sk_id_prev),
    sum(
        case when NAME_CONTRACT_STATUS = 'Approved' then 1 else 0 end
    ) as total_approved,
    from previous_applications
    group by 1
    having count(distinct sk_id_prev) > 2
    order by 2 desc, 3 desc
""").fetchdf()
```

</details>

<div style="max-height: 400px; overflow: auto;" markdown>

|   SK_ID_CURR |   count(DISTINCT sk_id_prev) |   total_approved |
|-------------:|-----------------------------:|-----------------:|
|       187868 |                           77 |               10 |
|       265681 |                           73 |                4 |
|       173680 |                           72 |               10 |
|       242412 |                           68 |               15 |
|       206783 |                           67 |               11 |
|       156367 |                           66 |                7 |
|       382179 |                           64 |                4 |
|       389950 |                           64 |                2 |
|       198355 |                           63 |               17 |
|       345161 |                           62 |                8 |
|       446486 |                           62 |                7 |
|       280586 |                           61 |               15 |
|       238250 |                           61 |                6 |
|       227585 |                           60 |               19 |
|       206862 |                           60 |               15 |
|       133023 |                           60 |                2 |
|       401563 |                           59 |                8 |
|       242431 |                           59 |                7 |
|       235163 |                           58 |                7 |
|       110899 |                           58 |                6 |
|       379932 |                           55 |               10 |
|       205430 |                           55 |                6 |
|       344403 |                           54 |               21 |

</div>
<br>

Therefore, blind aggregation on this table will lead to false and misguided results which will deteriorate the classification model. The feature engineering ideas for this table is provided below:

**Feature Engineering Ideas:**

- **`Refusal rate`**: it is a ratio of number of refused previous applications to the number of total applications.
- **`Approval rate`**: it is a ratio of number of approved applications to the number of total applications.
- **`Days since last approval`**: it is the days between last approval date and current application date.
- **`Days since last refusal`**: it represents the time between last refusal date and current application date.
- **`Degree of trust`**: it is a numeric feature representing the ratio of amt_credit to amt_application which shows how much credit did the applicant apply and how much the Home Credit approved. If it is more than 1, then it is sign of high trust meaning that the Home Credit trusted the applicant and gave more money than his request. Otherwise, it means the Home Credit issued less credit to the applicant than his request.
- **`Average Goods Price for Refusal`**: - this shows the average price for the goods for only refused applications.
- **`Average Goods Price for Approval`**: - this shows the average price for the goods for only approved applications.
- **`AVG Rate Interest Refusal`**: - this shows the average rate interest for the previous refused applications.
- **`AVG Rate Interest Approved`**: - this shows the average rate interest for the previous approved applications.
- **`Last Rejection Reason`**: - this feature uses CODE_REJECT_REASON column to show what was the last rejection reason.
- **`Cash Loan Rate`**: - showing the ratio of cash loans to total loans.
- **`Walk In Rate`**: - Percentage of applications that were walk-ins.
- **`Avg_Term_Approved`**: - Average CNT_PAYMENT for approved loans.
- **`Avg_Down_Payment_Rate`**: - Average AMT_DOWN_PAYMENT / AMT_CREDIT. Higher down payments indicate liquid cash on hand (wealth).
- **`Max_Prev_Annuity`**: - The highest monthly payment they have ever successfully applied for using AMT_ANNUITY.
- **`Days_Since_Last_Termination`**: - Current Date - DAYS_TERMINATION. It shows the days passed since the termination of last approval.
- **`High_Yield_Group_Rate`**: - Ratio of applications with NAME_YIELD_GROUP = 'high'. A client consistently in the "high" group is flagged as risky by the bank internally.
- **`Most_Freq_Seller_Industry`**: - Mode of the NAME_SELLER_INDUSTRY
- **`Insurance_Uptake_Rate`**: - People who buy insurance are often risk-averse, meaning they are more careful with money and less likely to default. It is found by NFLAG_INSURED_ON_APPROVAL column.

Now let's create these feature engineering variables and add these to the main train table.


<details>
<summary>Show Code</summary>

```python

con.execute(r"""
create or replace table previous_application_agg as 
select 
    sk_id_curr,
    
    /* --- 0. VOLUME (The Missing Piece) --- */
    count(*) as application_count_prev,

    /* --- 1. RATES & COUNTS --- */
    sum(case when name_contract_status = 'Refused' then 1 else 0 end) * 1.0 / count(*) as refusal_rate_prev,
    sum(case when name_contract_status = 'Approved' then 1 else 0 end) * 1.0 / count(*) as approval_rate_prev,
    sum(case when name_contract_type = 'Cash loans' then 1 else 0 end) * 1.0 / count(*) as cash_loan_rate_prev,
    sum(case when name_product_type = 'walk-in' then 1 else 0 end) * 1.0 / count(*) as walk_in_rate_prev,
    avg(case when nflag_insured_on_approval = 1 then 1 else 0 end) as insurance_uptake_rate_prev,
    sum(case when name_yield_group = 'high' then 1 else 0 end) * 1.0 / count(*) as high_yield_group_rate_prev,

    /* --- 2. RECENCY (CLEANED) --- */
    max(case when name_contract_status = 'Approved' then nullif(days_decision, 365243) else null end) as days_since_last_approval_prev,
    max(case when name_contract_status = 'Refused' then nullif(days_decision, 365243) else null end) as days_since_last_refusal_prev,
    max(nullif(days_termination, 365243)) as days_since_last_termination_prev,

    /* --- 3. TRUST & WEALTH --- */
    avg(case when name_contract_status = 'Approved' then (amt_credit / nullif(amt_application, 0)) else null end) as degree_of_trust_avg_prev,
    avg(amt_down_payment / nullif(amt_credit, 0)) as avg_down_payment_rate_prev,
    max(amt_annuity) as max_prev_annuity_prev,
    avg(case when name_contract_status = 'Approved' then cnt_payment else null end) as avg_term_approved_prev,

    /* --- 4. TWIN VARIABLES --- */
    avg(case when name_contract_status = 'Refused' then amt_goods_price else null end) as avg_goods_price_refused_prev,
    avg(case when name_contract_status = 'Approved' then amt_goods_price else null end) as avg_goods_price_approved_prev,

    /* --- 5. INTEREST RATES --- */
    avg(case when name_contract_status = 'Refused' then rate_interest_primary else null end) as avg_rate_interest_refused_prev,
    avg(case when name_contract_status = 'Approved' then rate_interest_primary else null end) as avg_rate_interest_approved_prev,

    /* --- 6. CATEGORICAL MODES --- */
    mode(name_seller_industry) as most_freq_seller_industry_prev,
    (array_agg(code_reject_reason order by days_decision desc))[1] as last_rejection_reason_prev

from '/home/vasif/Desktop/Home-Credit-Risk-Analysis/parquet_files/previous_applications.parquet'
group by sk_id_curr
""")

```

</details>

Now join the aggregated table with the main `home_credit_train` table to add these features to the main table.

<details>
<summary>Show Code</summary>

```python
con.execute("""
create or replace table home_credit_train as 
select 
    t1.*,
    /* We exclude sk_id_curr from t2 so we don't have duplicate ID columns */
    t2.* exclude (sk_id_curr)
from home_credit_train t1
left join previous_application_agg t2 
    on t1.sk_id_curr = t2.sk_id_curr
""")
```

</details>


##  `Credit Card Balance` Feature Engineering

Now it is time to do feature engineering on the `credit_card_balance` table. Before doing aggregations and feature engineering let's re-analyze this table and understand what it represents in the dataset.

This table represents the monthly behavioral history of clients who possess a Home Credit credit card. Unlike a standard loan (which has a fixed schedule), a credit card is dynamic. This table provides a month-by-month snapshot of:

- Balance: How much they owe right now.

- Drawings: How they used the money (ATM cash withdrawals vs. Point-of-Sale shopping).

- Payments: How much they paid back this month vs. the minimum required.

- Status: Are they active, over limit, or delinquent?

This is arguably the strongest Behavioral Signal in the dataset since it tells behavior of the applicants. 


**The feature engineering ideas on this table:**

- **`cc_total_months_history`**: Total number of months the client has data in the credit card table.
- **`cc_active_months_count`**: Number of months the contract status was 'Active'.
- **`cc_completed_months_count`**: Number of months the contract status was 'Completed' (closed).
- **`cc_utilization_rate_avg`**: Average percentage of the credit limit used (Balance / Limit).
- **`cc_balance_spike_ratio`**: Ratio of the client's maximum balance ever vs. their average balance. High values indicate sudden debt spikes.
- **`cc_avg_interest_burden`**: Average monthly amount owed in interest and fees (Total Receivable - Principal).
- **`cc_payment_over_min_ratio`**: Ratio of Amount Paid / Minimum Required: 1.0 - Paid exactly the minimum., >1.0 - Paid more than minimum (Good), <1.0 - Paid less than minimum (Bad).
- **`cc_atm_drawing_rate`**: Percentage of total spending that was taken as Cash from ATMs.
- **`cc_avg_ticket_size`**: Average amount spent per single transaction.
- **`cc_avg_monthly_drawings_count`**: Average number of times the card is used per month (Total).
- **`cc_avg_monthly_atm_count`**: Average number of ATM withdrawals per month.
- **`cc_avg_monthly_pos_count`**: Average number of shop purchases (Point of Sale) per month.
- **`cc_max_dpd`**: The maximum Days Past Due (DPD) ever recorded.
- **`cc_max_dpd_def`**: The maximum "Tolerant" DPD. This ignores small, negligible amounts and focuses on real missed payments.
- **`cc_late_payment_count`**: Total count of months where the client was late (DPD > 0).
- **`cc_limit_growth_value`**: The difference between the highest credit limit they ever had and the lowest (Max Limit - Min Limit).


<details>
<summary>Show Code</summary>

```python

con.execute(r"""
create or replace table credit_card_agg as 
select 
    sk_id_curr,
    
    /* --- 1. VOLUME & STATUS --- */
    count(*) as cc_total_months_history,
    sum(case when name_contract_status = 'Active' then 1 else 0 end) as cc_active_months_count,
    sum(case when name_contract_status = 'Completed' then 1 else 0 end) as cc_completed_months_count,
    
    /* --- 2. UTILIZATION & DEBT LOAD --- */
    avg(amt_balance / nullif(amt_credit_limit_actual, 0)) as cc_utilization_rate_avg,
    max(amt_balance) / nullif(avg(amt_balance), 0) as cc_balance_spike_ratio,
    
    /* Interest Burden: How much extra are they paying in fees/interest? */
    avg(amt_total_receivable - amt_receivable_principal) as cc_avg_interest_burden,

    /* --- 3. PAYMENT DISCIPLINE --- */
    /* Ratio > 1.0 means paying down debt. Ratio < 1.0 means missing payments. */
    avg(amt_payment_total_current / nullif(amt_inst_min_regularity, 0)) as cc_payment_over_min_ratio,
    
    /* --- 4. SPENDING BEHAVIOR (Amounts) --- */
    /* Cash Usage Rate (High risk) */
    sum(amt_drawings_atm_current) / nullif(sum(amt_drawings_current), 0) as cc_atm_drawing_rate,
    /* Average Ticket Size */
    sum(amt_drawings_current) / nullif(sum(cnt_drawings_current), 0) as cc_avg_ticket_size,

    /* --- 5. USAGE FREQUENCY (Counts) - NEW --- */
    /* Are they heavy users? */
    avg(cnt_drawings_current) as cc_avg_monthly_drawings_count,
    avg(cnt_drawings_atm_current) as cc_avg_monthly_atm_count,
    avg(cnt_drawings_pos_current) as cc_avg_monthly_pos_count,

    /* --- 6. DELINQUENCY (Strict vs Tolerant) --- */
    max(sk_dpd) as cc_max_dpd,
    /* Tolerance DPD: This is the 'real' bad indicator (ignores small $1 debts) */
    max(sk_dpd_def) as cc_max_dpd_def,
    /* Count of late months */
    sum(case when sk_dpd > 0 then 1 else 0 end) as cc_late_payment_count,

    /* --- 7. LIMIT MANAGEMENT --- */
    /* Growth: Max Limit - Min Limit */
    max(amt_credit_limit_actual) - min(amt_credit_limit_actual) as cc_limit_growth_value

from credit_card_balance
group by sk_id_curr
""")

```

</details>

Now join the aggregated table with the main `home_credit_train` table to add these features to the main table.

<details>
<summary>Show Code</summary>

```python
con.execute("""
create or replace table home_credit_train as 
select 
    t1.*,
    t2.* exclude (sk_id_curr)
from home_credit_train t1
left join credit_card_agg t2 
    on t1.sk_id_curr = t2.sk_id_curr
""")
```

</details>


##  `POS CASH Balance Table` Feature Engineering 

**Feature Engineering: POS Cash Balance (`POS_CASH_balance`)**

**1. What is this table?**
This table contains monthly snapshots of **Point-of-Sale (POS)** and **Cash Loans**. These are typically smaller, fixed-term loans for specific goods (like appliances, electronics, or furniture) or small cash advances. Unlike credit cards, these usually have a fixed end date and installment schedule.

**2. Why is it required?**
This table provides a unique view into **"Debt Drag"** and **Contract Stability**.

* **Future Burden:** Unlike other tables, this one explicitly tells us how many installments are *left* (`CNT_INSTALMENT_FUTURE`). A client with 24 months left on a loan is under more pressure than one with 1 month left.
* **Restructuring Signs:** If the term length (`CNT_INSTALMENT`) keeps changing, it usually means the client couldn't pay and had to renegotiate the loan terms.

**3. Feature Explanations**
Below is the explanation for every alias used in the SQL code.

**1. Volume**

* **`pos_total_months_history`**: Total number of monthly records available for the client.

**2. Future Burden (The "Debt Drag")**

* **`pos_avg_future_installments`**: On average, how many months does the client still have to pay? High numbers mean they are locked into long-term debt.
* **`pos_remaining_debt_ratio`**: The ratio of *remaining* installments to the *total* original term.
* **~1.0**: Loan just started (High current burden).
* **~0.0**: Loan is almost finished (Low burden).



**3. Late Payments**

* **`pos_late_payment_count`**: Count of months where `SK_DPD` (Days Past Due) was greater than 0.
* **`pos_max_dpd`**: The worst (maximum) lateness ever recorded for this client.
* **`pos_max_dpd_def`**: The worst "Tolerant" DPD. This metric ignores small, negligible overdue amounts (often errors) and focuses on significant defaults.

**4. Status Rates**

* **`pos_completed_rate`**: Percentage of months where the contract status was 'Completed'. High rates suggest a history of successfully finishing loans.
* **`pos_active_rate`**: Percentage of months where the contract was 'Active' (currently being paid).

**5. Term Stability (Restructuring)**

* **`pos_term_variance`**: The variance in the *original* term length (`CNT_INSTALMENT`).
* **Low Variance**: The loan terms stayed the same (Stable).
* **High Variance**: The term length changed frequently (e.g., extending a 12-month loan to 24 months). This is a strong indicator of financial distress/restructuring.


<details>
<summary>Show Code</summary>

```python
con.execute(r"""
create or replace table pos_cash_agg as 
select 
    sk_id_curr,
    
    /* --- 1. VOLUME --- */
    count(*) as pos_total_months_history,
    
    /* --- 2. FUTURE BURDEN (The Killer Features) --- */
    /* Average remaining months: High = Heavy Debt */
    avg(cnt_instalment_future) as pos_avg_future_installments,
    
    /* Remaining Ratio: (Remaining / Total). 
       1.0 = Just Started (Max Risk). 0.0 = Finished (Min Risk). */
    avg(cnt_instalment_future / nullif(cnt_instalment, 0)) as pos_remaining_debt_ratio,

    /* --- 3. LATE PAYMENTS --- */
    sum(case when sk_dpd > 0 then 1 else 0 end) as pos_late_payment_count,
    max(sk_dpd) as pos_max_dpd,
    /* Tolerance version */
    max(sk_dpd_def) as pos_max_dpd_def,

    /* --- 4. STATUS RATES --- */
    /* Completion Rate: High means they successfully finish contracts */
    sum(case when name_contract_status = 'Completed' then 1 else 0 end) * 1.0 / count(*) as pos_completed_rate,
    
    /* Active Rate: High means they are currently paying */
    sum(case when name_contract_status = 'Active' then 1 else 0 end) * 1.0 / count(*) as pos_active_rate,

    /* --- 5. TERM STABILITY (Restructuring Check) --- */
    /* If Variance of Installment Count is high, they kept changing the terms (bad sign) */
    variance(cnt_instalment) as pos_term_variance

from POS_CASH_balance
group by sk_id_curr
""")

```

</details>


Add these features to the main `home_credit_train` table by joining with the aggregated `pos_cash_agg` table.


```python
con.execute("""
create or replace table home_credit_train as 
select 
    t1.*,
    t2.* exclude (sk_id_curr)
from home_credit_train t1
left join pos_cash_agg t2 
    on t1.sk_id_curr = t2.sk_id_curr
""")

``` 

</details>


##  `Installments Payments` Table Feature Engineering 

**Feature Engineering: Installments Payments (`installments_payments`)**

**1. What is this table?**
This table represents the **"Moment of Truth"** for repayment. It compares the *contractual plan* against the *actual reality*. For every single payment made by the client on previous loans, it records:

* **The Promise:** When it was due (`DAYS_INSTALMENT`) and how much (`AMT_INSTALMENT`).
* **The Reality:** When it was actually paid (`DAYS_ENTRY_PAYMENT`) and how much (`AMT_PAYMENT`).

**2. Why is it required?**
This is often the **single strongest predictor** of default.

* **Credit Card table** shows monthly habits.
* **POS table** shows debt burden.
* **Installments table** shows **Obedience**. It answers the critical questions: "Does this person pay on the exact day they promised?" and "Do they pay the full amount?"

**3. Feature Explanations**
Below is the explanation for every alias used in the SQL code.

**1. Lateness (DPD - Days Past Due)**

* **`ins_late_payment_count`**: Total number of times the client paid *after* the due date.
* **`ins_avg_dpd`**: On average, how many days late are they? (Calculated only on late payments).
* **`ins_max_dpd`**: The worst lateness event ever. (e.g., if they were once 50 days late, this captures that extreme risk).

**2. Diligence (DBD - Days Before Due)**

* **`ins_avg_dbd`**: On average, how many days *early* do they pay?
* Paying early is a strong "Wealth Signal" indicating cash flow stability.


* **`ins_max_dbd`**: The earliest they have ever paid (e.g., paying off a loan 30 days in advance).

**3. Short Payment (Underpayment)**

* **`ins_underpayment_count`**: Number of times they paid *less* than the required installment amount.
* **`ins_payment_ratio`**: Ratio of `Amount Paid / Amount Required`.
* **1.0**: Perfect payment.
* **< 1.0**: Underpayment (Major Red Flag).


* **`ins_total_missed_balance`**: The total sum of money they failed to pay across all historical installments (`Required - Paid`).

**4. Restructuring (Version Changes)**

* **`ins_version_change_count`**: Count of how many different "payment calendars" (`NUM_INSTALMENT_VERSION`) exist for the client.
* **Low (1)**: The original plan was followed perfectly.
* **High (>1)**: The payment schedule was changed mid-loan (Restructuring), usually because the client couldn't pay.



**5. Recent Behavior (Trend)**

* **`ins_recent_late_count_1y`**: A specific count of late payments occurring only in the **last 365 days**. This helps the model distinguish between "Old Mistakes" (5 years ago) and "Current Risk."


<details>
<summary>Show Code</summary>

con.execute(r"""
create or replace table installments_agg as 
select 
    sk_id_curr,
    
    /* --- 1. LATENESS (DPD - Days Past Due) --- */
    /* Only count positive days (Late). If early, it is 0. */
    sum(case when days_entry_payment > days_instalment 
             then 1 else 0 end) as ins_late_payment_count,
    
    avg(case when days_entry_payment > days_instalment 
             then (days_entry_payment - days_instalment) else 0 end) as ins_avg_dpd,
             
    max(case when days_entry_payment > days_instalment 
             then (days_entry_payment - days_instalment) else 0 end) as ins_max_dpd,

    /* --- 2. DILIGENCE (DBD - Days Before Due) --- */
    /* Only count negative days (Early). Paying early is a "Wealth Signal" */
    avg(case when days_entry_payment < days_instalment 
             then (days_instalment - days_entry_payment) else 0 end) as ins_avg_dbd,
    
    max(case when days_entry_payment < days_instalment 
             then (days_instalment - days_entry_payment) else 0 end) as ins_max_dbd,

    /* --- 3. SHORT PAYMENT (Underpayment) --- */
    /* Did they pay LESS than required? */
    sum(case when amt_payment < amt_instalment then 1 else 0 end) as ins_underpayment_count,
    
    /* The Payment Ratio: 1.0 = Perfect. < 1.0 = Short. */
    avg(amt_payment / nullif(amt_instalment, 0)) as ins_payment_ratio,
    
    /* Total 'Missing' Money */
    sum(amt_instalment - amt_payment) as ins_total_missed_balance,

    /* --- 4. RESTRUCTURING (Version Changes) --- */
    /* If they have many versions (1, 2, 3), they changed terms often. */
    count(distinct num_instalment_version) as ins_version_change_count,

    /* --- 5. RECENT BEHAVIOR (Last 1 Year) --- */
    /* We look at behavior only in the last 365 days */
    sum(case when days_instalment > -365 and days_entry_payment > days_instalment 
             then 1 else 0 end) as ins_recent_late_count_1y

from installments_payments
group by sk_id_curr
""")

</details>

Add these features to the main `home_credit_train` table by joining with the aggregated `installments_agg` table.

```python

con.execute("""
create or replace table home_credit_train as 
select 
    t1.*,
    t2.* exclude (sk_id_curr)
from home_credit_train t1
left join installments_agg t2 
    on t1.sk_id_curr = t2.sk_id_curr
""")

```


##  `Bureau` and `Bureau Balance` Table Feature Engineering 


**Feature Engineering: Bureau Balance (`bureau_balance`)**

**1. What is this table?**
This table contains the **monthly delinquency history** for loans held at *other* financial institutions (not Home Credit).

* While the main `bureau` table tells us "This client has a car loan at Bank X," this `bureau_balance` table tells us the month-by-month status of that car loan (e.g., "Paid on time in Jan," "Late in Feb," "Written Off in March").

**2. Why is it required?**
This is the granular **"External Reputation"** check.

* A client might tell Home Credit they are safe, but this table reveals if they are currently failing to pay their debts elsewhere.
* The `STATUS` column is encoded (C, X, 0, 1, 2, 3, 4, 5). We must convert these codes into a numerical "Risk Score" to measure how severe their financial trouble is.

**3. Feature Explanations**
Below is the explanation for every alias used in the SQL code.

**1. Duration**

* **`bb_months_history`**: Total number of months of history available for this specific external loan.
* **`bb_first_month` / `bb_last_month**`: The timeline of the loan relative to the current application. (e.g., Did this history happen 5 years ago or last month?).

**2. Risk Score (The "Max Badness")**

* **`bb_max_delinquency_level`**: We convert the confusing text codes into a generic "Badness Scale":
* **0**: Paid on time / Closed / No Info.
* **1**: Late (1-30 days).
* **2-4**: Significantly Late (30-120 days).
* **5**: Written Off / Sold (The worst possible status).
* *This feature captures the worst status the client ever reached on this loan.*



**3. Recent Risk (Trend)**

* **`bb_delinquency_last_12m_flag`**: A binary flag (1 or 0).
* **1**: The client was late (Status 1-5) at least once in the **last 12 months**.
* **0**: The client has been clean for the last year.
* *This distinguishes "Current Risk" from "Old Mistakes".*



**4. Status Counts**

* **`bb_count_status_1`**: Count of months where they were slightly late (1-30 days). Frequent small delays indicate disorganization.
* **`bb_count_status_5`**: Count of months where the debt was "Written Off" or "Sold." This is a major red flag indicating default at another bank.


<details>
<summary>Show Code</summary>

```python
con.execute("""
create or replace table bureau_balance_agg as 
select 
    sk_id_bureau,
    
    /* --- 1. DURATION --- */
    count(*) as bb_months_history,
    min(months_balance) as bb_first_month,
    max(months_balance) as bb_last_month,
    
    /* --- 2. RISK SCORE (Weighted Status) --- */
    /* We convert char status to numbers to find the "Max Badness" */
    /* 0=OK, 1=Late, 5=Written Off. We ignore C and X for risk calculation */
    max(case 
        when status = '5' then 5 
        when status = '4' then 4 
        when status = '3' then 3 
        when status = '2' then 2 
        when status = '1' then 1 
        else 0 
    end) as bb_max_delinquency_level,
    
    /* --- 3. RECENT RISK (Last 12 Months) --- */
    /* Is the trouble recent? */
    max(case 
        when months_balance >= -12 and status in ('1','2','3','4','5') then 1 
        else 0 
    end) as bb_delinquency_last_12m_flag,

    /* --- 4. STATUS COUNTS --- */
    sum(case when status = '1' then 1 else 0 end) as bb_count_status_1, /* Late < 30 days */
    sum(case when status = '5' then 1 else 0 end) as bb_count_status_5  /* Written Off */

from bureau_balance
group by sk_id_bureau
""")
```

</details>

Add these features to the main `home_credit_train` table by joining with the aggregated `bureau_balance_agg` table through the `bureau` table.

```python
con.execute("""
create or replace table home_credit_train as 
select 
    t1.*,
    t2.* exclude (sk_id_curr)
from home_credit_train t1
left join bureau_agg t2 
    on t1.sk_id_curr = t2.sk_id_curr
""")
```


In the below code, we will do the same for the `bureau` table by creating aggregated features and then joining with the main table. 


<details>
<summary>Show Code</summary>

```python
con.execute(r"""
create or replace table home_credit_train as 
select 
    *,
    
    /* --- 1. INTERNAL AFFORDABILITY (The Basics) --- */
    /* Credit-to-Income: How many years of salary does this loan represent? */
    amt_credit / nullif(amt_income_total, 0) as ratio_credit_to_income,
    
    /* Annuity-to-Income (PTI): What % of monthly salary goes to THIS loan? */
    amt_annuity / nullif(amt_income_total, 0) as ratio_annuity_to_income,
    
    /* Annuity-to-Credit: What is the effective interest rate/term intensity? */
    amt_annuity / nullif(amt_credit, 0) as ratio_annuity_to_credit,

    /* --- 2. EXTERNAL AFFORDABILITY (The "True" Debt Load) --- */
    /* Global Debt-to-Income: (Bureau Debt + New Loan) / Income */
    /* This is the most honest measure of how broke they really are. */
    (coalesce(bureau_total_active_debt, 0) + amt_credit) / nullif(amt_income_total, 0) as ratio_total_debt_to_income,
    
    /* Global Credit Utilization: (Bureau Active Limit + New Loan) / Income */
    (coalesce(bureau_total_active_limit, 0) + amt_credit) / nullif(amt_income_total, 0) as ratio_total_credit_limit_to_income,

    /* --- 3. DISPOSABLE INCOME PROXY --- */
    /* How much money is left after paying the new loan? */
    amt_income_total - amt_annuity as feature_disposable_income,
    
    /* --- 4. CREDIT MATURITY --- */
    /* Age / Employment Ratios */
    days_employed / nullif(days_birth, 0) as ratio_employed_to_age,
    amt_income_total / nullif(days_birth, 0) as ratio_income_to_age

from home_credit_train
""")
```
</details>


## Data Cleaning: Handling Anomalies 

After these steps, in some entries we may encounter some clients whose days_employed is greater than days_birth which is an anomaly in the data. We can replace these values with nulls to avoid misleading the model. This is due to the fact that some clients have `DAYS_EMPLOYED` value of 365243 which is a placeholder for "Not Employed". Since these clients are not employed, it is logical to replace this value with nulls to avoid misleading the model.

```python
con.execute("""
update home_credit_train
set 
    days_employed = null 
where days_employed = 365243;
""")
```

In the next step, we will re-create the age/employment ratio and income/age ratio features to reflect the changes we made in the `days_employed` column. For unemployed clients, these ratios will become null which is a safe outcome since they are not employed and we don't want to mislead the model by giving them a false ratio value.


```python
con.execute("""
update home_credit_train
set 
    /* If days_employed is NULL (unemployed), this ratio becomes NULL, which is safe */
    ratio_employed_to_age = abs(days_employed) / nullif(abs(days_birth), 0),
    
    /* Income to age is always valid */
    ratio_income_to_age = amt_income_total / nullif(abs(days_birth), 0)
""")
```

Finally, let`s check the final version of the train table after all these feature engineering steps.

<br>

<div style="max-height: 400px; overflow: auto;" markdown>

|   SK_ID_CURR |   TARGET | NAME_CONTRACT_TYPE   | CODE_GENDER   | FLAG_OWN_CAR   | FLAG_OWN_REALTY   |   CNT_CHILDREN |   AMT_INCOME_TOTAL |       AMT_CREDIT |   AMT_ANNUITY |   AMT_GOODS_PRICE | NAME_TYPE_SUITE   | NAME_INCOME_TYPE   | NAME_EDUCATION_TYPE           | NAME_FAMILY_STATUS   | NAME_HOUSING_TYPE   |   REGION_POPULATION_RELATIVE |   DAYS_BIRTH | DAYS_EMPLOYED   |   DAYS_REGISTRATION |   DAYS_ID_PUBLISH |   OWN_CAR_AGE |   FLAG_MOBIL |   FLAG_EMP_PHONE |   FLAG_WORK_PHONE |   FLAG_CONT_MOBILE |   FLAG_PHONE |   FLAG_EMAIL | OCCUPATION_TYPE   |   CNT_FAM_MEMBERS |   REGION_RATING_CLIENT |   REGION_RATING_CLIENT_W_CITY | WEEKDAY_APPR_PROCESS_START   |   HOUR_APPR_PROCESS_START |   REG_REGION_NOT_LIVE_REGION |   REG_REGION_NOT_WORK_REGION |   LIVE_REGION_NOT_WORK_REGION |   REG_CITY_NOT_LIVE_CITY |   REG_CITY_NOT_WORK_CITY |   LIVE_CITY_NOT_WORK_CITY | ORGANIZATION_TYPE   |   EXT_SOURCE_1 |   EXT_SOURCE_2 |   EXT_SOURCE_3 | FONDKAPREMONT_MODE    | HOUSETYPE_MODE   |   TOTALAREA_MODE | WALLSMATERIAL_MODE   | EMERGENCYSTATE_MODE   |   OBS_30_CNT_SOCIAL_CIRCLE |   DEF_30_CNT_SOCIAL_CIRCLE |   OBS_60_CNT_SOCIAL_CIRCLE |   DEF_60_CNT_SOCIAL_CIRCLE |   DAYS_LAST_PHONE_CHANGE |   AMT_REQ_CREDIT_BUREAU_HOUR |   AMT_REQ_CREDIT_BUREAU_DAY |   AMT_REQ_CREDIT_BUREAU_WEEK |   AMT_REQ_CREDIT_BUREAU_MON |   AMT_REQ_CREDIT_BUREAU_QRT |   AMT_REQ_CREDIT_BUREAU_YEAR |   housing_score_avg |   housing_data_count |   housing_score_mode |   housing_data_count_mode |   housing_score_medi |   housing_data_count_medi |   flag_document_3_kept |   total_document_count |   application_count_prev |   refusal_rate_prev |   approval_rate_prev |   cash_loan_rate_prev |   walk_in_rate_prev |   insurance_uptake_rate_prev |   high_yield_group_rate_prev |   days_since_last_approval_prev | days_since_last_refusal_prev   |   days_since_last_termination_prev |   degree_of_trust_avg_prev |   avg_down_payment_rate_prev |   max_prev_annuity_prev |   avg_term_approved_prev |   avg_goods_price_refused_prev |   avg_goods_price_approved_prev |   avg_rate_interest_refused_prev |   avg_rate_interest_approved_prev | most_freq_seller_industry_prev   | last_rejection_reason_prev   |   cc_total_months_history |   cc_active_months_count |   cc_completed_months_count |   cc_utilization_rate_avg |   cc_balance_spike_ratio |   cc_avg_interest_burden |   cc_payment_over_min_ratio |   cc_atm_drawing_rate |   cc_avg_ticket_size |   cc_avg_monthly_drawings_count |   cc_avg_monthly_atm_count |   cc_avg_monthly_pos_count |   cc_max_dpd |   cc_max_dpd_def |   cc_late_payment_count |   cc_limit_growth_value |   pos_total_months_history |   pos_avg_future_installments |   pos_remaining_debt_ratio |   pos_late_payment_count |   pos_max_dpd |   pos_max_dpd_def |   pos_completed_rate |   pos_active_rate |   pos_term_variance |   ins_late_payment_count |   ins_avg_dpd |   ins_max_dpd |   ins_avg_dbd |   ins_max_dbd |   ins_underpayment_count |   ins_payment_ratio |   ins_total_missed_balance |   ins_version_change_count |   ins_recent_late_count_1y |   bureau_total_loans_count |   bureau_active_loans_count |   bureau_closed_loans_count |   bureau_credit_card_count |   bureau_mortgage_count |   bureau_car_loan_count |   bureau_total_active_debt |   bureau_total_active_limit |   bureau_total_overdue_amount |   bureau_max_overdue_ever |   bureau_utilization_rate |   bureau_days_since_last_loan |   bureau_days_until_next_end | bureau_max_delinquency_level_ever   |   bureau_total_late_months_history |   ratio_credit_to_income |   ratio_annuity_to_income |   ratio_annuity_to_credit |   ratio_total_debt_to_income |   ratio_total_credit_limit_to_income |   feature_disposable_income |   ratio_employed_to_age |   ratio_income_to_age |
|-------------:|---------:|:---------------------|:--------------|:---------------|:------------------|---------------:|-------------------:|-----------------:|--------------:|------------------:|:------------------|:-------------------|:------------------------------|:---------------------|:--------------------|-----------------------------:|-------------:|:----------------|--------------------:|------------------:|--------------:|-------------:|-----------------:|------------------:|-------------------:|-------------:|-------------:|:------------------|------------------:|-----------------------:|------------------------------:|:-----------------------------|--------------------------:|-----------------------------:|-----------------------------:|------------------------------:|-------------------------:|-------------------------:|--------------------------:|:--------------------|---------------:|---------------:|---------------:|:----------------------|:-----------------|-----------------:|:---------------------|:----------------------|---------------------------:|---------------------------:|---------------------------:|---------------------------:|-------------------------:|-----------------------------:|----------------------------:|-----------------------------:|----------------------------:|----------------------------:|-----------------------------:|--------------------:|---------------------:|---------------------:|--------------------------:|---------------------:|--------------------------:|-----------------------:|-----------------------:|-------------------------:|--------------------:|---------------------:|----------------------:|--------------------:|-----------------------------:|-----------------------------:|--------------------------------:|:-------------------------------|-----------------------------------:|---------------------------:|-----------------------------:|------------------------:|-------------------------:|-------------------------------:|--------------------------------:|---------------------------------:|----------------------------------:|:---------------------------------|:-----------------------------|--------------------------:|-------------------------:|----------------------------:|--------------------------:|-------------------------:|-------------------------:|----------------------------:|----------------------:|---------------------:|--------------------------------:|---------------------------:|---------------------------:|-------------:|-----------------:|------------------------:|------------------------:|---------------------------:|------------------------------:|---------------------------:|-------------------------:|--------------:|------------------:|---------------------:|------------------:|--------------------:|-------------------------:|--------------:|--------------:|--------------:|--------------:|-------------------------:|--------------------:|---------------------------:|---------------------------:|---------------------------:|---------------------------:|----------------------------:|----------------------------:|---------------------------:|------------------------:|------------------------:|---------------------------:|----------------------------:|------------------------------:|--------------------------:|--------------------------:|------------------------------:|-----------------------------:|:------------------------------------|-----------------------------------:|-------------------------:|--------------------------:|--------------------------:|-----------------------------:|-------------------------------------:|----------------------------:|------------------------:|----------------------:|
|       242471 |        0 | Cash loans           | F             | Y              | N                 |              1 |              90000 | 652500           |       21694.5 |            652500 | Unaccompanied     | State servant      | Secondary / secondary special | Married              | House / apartment   |                     0.028663 |       -17798 | -9130           |               -4242 |             -1340 |             7 |            1 |                1 |                 0 |                  1 |            0 |            0 | Laborers          |                 3 |                      2 |                             2 | FRIDAY                       |                        10 |                            0 |                            0 |                             0 |                        0 |                        0 |                         0 | Postal              |     nan        |      0.611574  |       0.609276 |                       | block of flats   |           0.0469 | Panel                | False                 |                          2 |                          0 |                          2 |                          0 |                      -93 |                            0 |                           0 |                            0 |                           1 |                           0 |                            1 |            0.163111 |                    9 |             0.163767 |                         9 |             0.1633   |                         9 |                      1 |                      1 |                        3 |            0        |             1        |              0        |            0        |                     0        |                     0.333333 |                           -1013 | <NA>                           |                               -824 |                   0.954029 |                    0.108272  |                 4367.93 |                      4   |                            nan |                         21937.5 |                              nan |                               nan | Consumer electronics             | XAP                          |                        36 |                       36 |                           0 |                  0.138038 |                  4.01547 |                  293.589 |                    5.68002  |             0.758997  |              5465.68 |                        0.888889 |                   0.222222 |                   0.962963 |            8 |                8 |                       1 |                       0 |                         14 |                       3       |                   0.5      |                        0 |             0 |                 0 |            0.142857  |          0.857143 |              0      |                        1 |     0.277778  |            15 |       5.87037 |            19 |                        0 |            1        |                        0   |                          2 |                          0 |                          5 |                           1 |                           4 |                          1 |                       0 |                       0 |                     301260 |             315000          |                           0   |                       0   |                  0.956382 |                          -176 |                          920 | 1                                   |                                  8 |                 7.25     |                 0.24105   |                 0.0332483 |                     10.5973  |                             10.75    |                     68305.5 |                0.512979 |              -5.05675 |
|       242472 |        1 | Cash loans           | F             | N              | N                 |              0 |              90000 | 647046           |       19048.5 |            463500 | Unaccompanied     | Pensioner          | Secondary / secondary special | Single / not married | House / apartment   |                     0.020713 |       -22396 | <NA>            |               -3994 |             -4008 |           nan |            1 |                0 |                 0 |                  1 |            0 |            0 |                   |                 1 |                      3 |                             3 | MONDAY                       |                         8 |                            0 |                            0 |                             0 |                        0 |                        0 |                         0 | XNA                 |     nan        |      0.0871064 |       0.172495 |                       |                  |         nan      |                      | <NA>                  |                          0 |                          0 |                          0 |                          0 |                    -1095 |                            0 |                           0 |                            0 |                           0 |                           0 |                            3 |          nan        |                    0 |           nan        |                         0 |           nan        |                         0 |                      1 |                      1 |                        5 |            0        |             1        |              0.6      |            0        |                     0.6      |                     0.2      |                           -1095 | <NA>                           |                               -547 |                   1.0897   |                    0.0322524 |                14379.5  |                     10.8 |                            nan |                        117884   |                              nan |                               nan | XNA                              | XAP                          |                        36 |                       36 |                           0 |                  0.49078  |                  3.52269 |                 2852.43  |                    2.18108  |             0.830703  |              5052.85 |                        1.61111  |                   0.916667 |                   0.694444 |            0 |                0 |                       0 |                  270000 |                         59 |                       7.27119 |                   0.475989 |                        0 |             0 |                 0 |            0.0677966 |          0.932203 |             19.0836 |                        0 |     0         |             0 |       4.125   |            19 |                        0 |            1        |                        0   |                          2 |                          0 |                          8 |                           3 |                           5 |                          2 |                       0 |                       0 |                     400622 |             688500          |                         760.5 |                     nan   |                  0.581876 |                          -328 |                         1040 | <NA>                                |                                  0 |                 7.1894   |                 0.21165   |                 0.0294392 |                     11.6408  |                             14.8394  |                     70951.5 |              -16.3084   |              -4.01857 |
|       242476 |        0 | Cash loans           | F             | Y              | Y                 |              1 |             135000 |      1.16672e+06 |       34245   |            913500 | Unaccompanied     | State servant      | Secondary / secondary special | Married              | House / apartment   |                     0.020713 |       -14229 | -6722           |               -7980 |             -4892 |            12 |            1 |                1 |                 0 |                  1 |            0 |            0 | Medicine staff    |                 3 |                      3 |                             2 | WEDNESDAY                    |                        13 |                            0 |                            0 |                             0 |                        0 |                        0 |                         0 | Medicine            |       0.316581 |      0.0350015 |       0.392774 | reg oper spec account | block of flats   |           0.0525 | Panel                | False                 |                          0 |                          0 |                          0 |                          0 |                    -1327 |                            0 |                           0 |                            0 |                           1 |                           2 |                            2 |            0.23792  |                   10 |             0.24063  |                        10 |             0.23878  |                        10 |                      1 |                      1 |                        2 |            0        |             0.5      |              0.5      |            0        |                     0        |                     0.5      |                           -1327 | <NA>                           |                              -1018 |                   1.08251  |                    0         |                13601.6  |                     10   |                            nan |                         98010   |                              nan |                               nan | XNA                              | XAP                          |                        96 |                       96 |                           0 |                  0.339839 |                  8.4301  |                  187.852 |                   12.783    |             0         |              3011.76 |                        0.395833 |                   0        |                   0.395833 |            0 |                0 |                       0 |                   90000 |                         11 |                       5       |                   0.5      |                        0 |             0 |                 0 |            0.0909091 |          0.909091 |              0      |                        2 |     0.0551181 |             5 |       2.82677 |            31 |                        4 |            0.984252 |                    27207.6 |                          2 |                          0 |                          6 |                           2 |                           4 |                          2 |                       0 |                       0 |                     342014 |                  1.1205e+06 |                           0   |                    8415   |                  0.305233 |                          -707 |                          612 | <NA>                                |                                  0 |                 8.6424   |                 0.253667  |                 0.0293514 |                     11.1758  |                             16.9424  |                    100755   |                0.472415 |              -9.48767 |
|       242490 |        0 | Cash loans           | F             | N              | Y                 |              0 |             247500 |  50940           |        5616   |             45000 | Unaccompanied     | Working            | Higher education              | Married              | House / apartment   |                     0.022625 |       -10412 | -2085           |               -2029 |             -2833 |           nan |            1 |                1 |                 0 |                  1 |            0 |            0 | Core staff        |                 2 |                      2 |                             2 | WEDNESDAY                    |                        15 |                            0 |                            0 |                             0 |                        0 |                        0 |                         0 | Kindergarten        |       0.601655 |      0.331324  |       0.598926 |                       |                  |         nan      |                      | <NA>                  |                          3 |                          0 |                          3 |                          0 |                     -716 |                            0 |                           0 |                            0 |                           0 |                           0 |                            3 |          nan        |                    0 |           nan        |                         0 |           nan        |                         0 |                      1 |                      1 |                        9 |            0.222222 |             0.333333 |              0.444444 |            0.111111 |                     0.111111 |                     0.111111 |                            -172 | -172                           |                               -381 |                   1.05555  |                    0.100499  |                27902.8  |                     24   |                            nan |                        294360   |                              nan |                               nan | XNA                              | XAP                          |                         6 |                        6 |                           0 |                  0        |                nan       |                    0     |                  nan        |           nan         |               nan    |                        0        |                 nan        |                 nan        |            0 |                0 |                       0 |                   90000 |                         18 |                      22.6667  |                   0.617424 |                        0 |             0 |                 0 |            0.0555556 |          0.944444 |            555.546  |                        0 |     0         |             0 |      17.8235  |            30 |                        0 |            1.61096  |                  -315000   |                          3 |                          0 |                          3 |                           1 |                           2 |                          1 |                       0 |                       0 |                     207729 |             225000          |                           0   |                    7303.5 |                  0.92324  |                          -848 |                          501 | <NA>                                |                                  0 |                 0.205818 |                 0.0226909 |                 0.110247  |                      1.04513 |                              1.11491 |                    241884   |                0.20025  |             -23.7706  |
|       242504 |        1 | Cash loans           | F             | N              | N                 |              1 |              90000 | 509400           |       37066.5 |            450000 | Unaccompanied     | Working            | Secondary / secondary special | Married              | House / apartment   |                     0.0228   |       -12163 | -2402           |               -5800 |             -2651 |           nan |            1 |                1 |                 1 |                  1 |            0 |            0 | Sales staff       |                 3 |                      2 |                             2 | TUESDAY                      |                        10 |                            0 |                            0 |                             0 |                        0 |                        0 |                         0 | Self-employed       |       0.599388 |      0.477412  |       0.200926 | reg oper account      | block of flats   |           0.0043 | Wooden               | False                 |                          1 |                          0 |                          1 |                          0 |                     -319 |                            0 |                           0 |                            0 |                           1 |                           0 |                            3 |            0.142907 |                   14 |             0.14375  |                        14 |             0.143207 |                        14 |                      1 |                      1 |                        9 |            0.444444 |             0.555556 |              0.333333 |            0.444444 |                     0.111111 |                     0.222222 |                            -319 | -286                           |                               -464 |                   1.08631  |                    0.068268  |                34869.2  |                     12   |                         393750 |                        134557   |                              nan |                               nan | XNA                              | HC                           |                        10 |                       10 |                           0 |                  0.675318 |                  1.76388 |                 3752.55  |                    0.764237 |             0.0563712 |              5442.82 |                        4.4      |                   0.111111 |                   4.55556  |            0 |                0 |                       0 |                  180000 |                         48 |                      10.8125  |                   0.58125  |                        0 |             0 |                 0 |            0.0833333 |          0.916667 |             90.8825 |                        5 |     0.3       |             7 |       8.75    |            76 |                        4 |            0.966667 |                    22174   |                          3 |                          3 |                         19 |                           4 |                          14 |                          3 |                       0 |                       0 |                     543760 |             787500          |                           0   |                       0   |                  0.690489 |                           -53 |                        27305 | 1                                   |                                  3 |                 5.66     |                 0.41185   |                 0.072765  |                     11.7018  |                             14.41    |                     52933.5 |                0.197484 |              -7.39949 |

</div>


The shape of of final `home_credit_train` table is `(307511, 146)` which means we have 122 features including the target variable. We have successfully engineered a large number of features from the `bureau` and `bureau_balance` tables and joined them with the main table to create a rich dataset for modeling. 


##  Convert to Parquet 

After all the feature engineering steps, we can convert the final `home_credit_train` table to parquet format for faster loading in the modeling phase. Parquet is a columnar storage format that is optimized for analytical queries and can significantly reduce the time it takes to load the data into memory.

```python
con.execute(r"""
COPY home_credit_train 
TO '/home/vasif/Desktop/Vasif_Asadov_Website/docs/data_analysis/home_credit_risk/home_credit_train_final.parquet' 
(FORMAT PARQUET)
""")
```

This will create a parquet file named `home_credit_train_final.parquet` in the specified directory which can be used for the modeling phase.


## <font color="#94d6d5"> Conclusion </font>

We did extraordinary amount of feature engineering in this step by creating a final aggregated dataset by combining all of the information from multiple tables. We created a total of 146 features from those tables. If we blindly add the columns from the tables and create aggregated data, then the number of features would have been in the thousands which is not ideal for modeling. Instead, we carefully engineered a set of 122 features based on the deep analysis we did in the previous sections. We focused on creating features that are meaningful and have a strong relationship with the target variable. This will help us build a more accurate and robust model in the next step. 

In the next step, we will load this final parquet file into a pandas dataframe and perform some final preprocessing steps before feeding it into the model. We will also do some exploratory data analysis to understand the distribution of the features and their relationship with the target variable. We will handle missing values and do some feature scaling if necessary. Finally, we will be ready to train our machine learning model on this rich dataset and make predictions on the test set.





























