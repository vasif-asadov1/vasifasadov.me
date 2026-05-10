---
layout: ../../../layouts/ArticleLayout.astro
title: Data Cleaning with Python 
description:  This article focuses on the data cleaning process using Python for the Home Credit Risk Analysis project. It covers the steps taken to handle missing values, outliers, and other data quality issues in preparation for building a predictive model.
---

## Introduction 

Until here, we completed: 

- **Deep SQL Analysis:** We performed a comprehensive analysis of the Home Credit dataset using SQL queries and obtained insights about predictive features. 
- **Feature Engineering with SQL:** We engineered a rich set of features by combining information from multiple tables and created a final aggregated dataset in parquet format.

In this step, we will load the final parquet file into a pandas dataframe and perform some final preprocessing steps before feeding it into the model. We will also do some exploratory data analysis to understand the distribution of the features and their relationship with the target variable. We will handle missing values and do some feature scaling if necessary. Finally, we will be ready to train our machine learning model on this rich dataset and make predictions on the test set.


## Library and Import Statements 

Firstly, we need to import the necessary libraries for data manipulation and analysis. We will use pandas for data handling, matplotlib and seaborn for visualization, and scikit-learn for preprocessing and modeling. As we are working with a large dataset, we will also use polars for efficient data manipulation. Additionally, we will use duckdb to run SQL queries on our parquet file if needed. Finally, we will use lightgbm for modeling and shap for interpretability. Here are the import statements:

```python
import polars as pl
import pandas as pd
import numpy as np
import duckdb
import matplotlib.pyplot as plt
import plotly.express as px
import plotly.io as pio
import polars.selectors as cs
import plotly.graph_objects as go
import lightgbm as lgb
import shap
from sklearn.preprocessing import LabelEncoder
import warnings

warnings.filterwarnings("ignore")
pio.renderers.default = "notebook"
# Reset options (optional, to avoid messing up future prints)
pd.reset_option('display.max_rows')
pd.reset_option('display.max_columns')
```

Now import the final parquet file we created in the previous step into a `polars dataframe`:

```python
train_data = pl.read_parquet("/home/vasif/Desktop/Home-Credit-Risk-Analysis/parquet_files/home_credit_train_final.parquet")
df = train_data.clone()
```

Now we have the final dataset loaded into a polars dataframe called `df`. We can now proceed with exploratory data analysis and preprocessing steps. The first 5 columns of the dataframe can be displayed using the following code:

```python
df.head(5)
```

This will show the following result: 

<div style="max-height: 400px; overflow-x: auto;">

|   SK_ID_CURR |   TARGET | NAME_CONTRACT_TYPE   | CODE_GENDER   | FLAG_OWN_CAR   | FLAG_OWN_REALTY   |   CNT_CHILDREN |   AMT_INCOME_TOTAL |       AMT_CREDIT |   AMT_ANNUITY |   AMT_GOODS_PRICE | NAME_TYPE_SUITE   | NAME_INCOME_TYPE   | NAME_EDUCATION_TYPE           | NAME_FAMILY_STATUS   | NAME_HOUSING_TYPE   |   REGION_POPULATION_RELATIVE |   DAYS_BIRTH |   DAYS_EMPLOYED |   DAYS_REGISTRATION |   DAYS_ID_PUBLISH |   OWN_CAR_AGE |   FLAG_MOBIL |   FLAG_EMP_PHONE |   FLAG_WORK_PHONE |   FLAG_CONT_MOBILE |   FLAG_PHONE |   FLAG_EMAIL | OCCUPATION_TYPE   |   CNT_FAM_MEMBERS |   REGION_RATING_CLIENT |   REGION_RATING_CLIENT_W_CITY | WEEKDAY_APPR_PROCESS_START   |   HOUR_APPR_PROCESS_START |   REG_REGION_NOT_LIVE_REGION |   REG_REGION_NOT_WORK_REGION |   LIVE_REGION_NOT_WORK_REGION |   REG_CITY_NOT_LIVE_CITY |   REG_CITY_NOT_WORK_CITY |   LIVE_CITY_NOT_WORK_CITY | ORGANIZATION_TYPE   |   EXT_SOURCE_1 |   EXT_SOURCE_2 |   EXT_SOURCE_3 | FONDKAPREMONT_MODE    | HOUSETYPE_MODE   |   TOTALAREA_MODE | WALLSMATERIAL_MODE   | EMERGENCYSTATE_MODE   |   OBS_30_CNT_SOCIAL_CIRCLE |   DEF_30_CNT_SOCIAL_CIRCLE |   OBS_60_CNT_SOCIAL_CIRCLE |   DEF_60_CNT_SOCIAL_CIRCLE |   DAYS_LAST_PHONE_CHANGE |   AMT_REQ_CREDIT_BUREAU_HOUR |   AMT_REQ_CREDIT_BUREAU_DAY |   AMT_REQ_CREDIT_BUREAU_WEEK |   AMT_REQ_CREDIT_BUREAU_MON |   AMT_REQ_CREDIT_BUREAU_QRT |   AMT_REQ_CREDIT_BUREAU_YEAR |   housing_score_avg |   housing_data_count |   housing_score_mode |   housing_data_count_mode |   housing_score_medi |   housing_data_count_medi |   flag_document_3_kept |   total_document_count |   application_count_prev |   refusal_rate_prev |   approval_rate_prev |   cash_loan_rate_prev |   walk_in_rate_prev |   insurance_uptake_rate_prev |   high_yield_group_rate_prev |   days_since_last_approval_prev |   days_since_last_refusal_prev |   days_since_last_termination_prev |   degree_of_trust_avg_prev |   avg_down_payment_rate_prev |   max_prev_annuity_prev |   avg_term_approved_prev |   avg_goods_price_refused_prev |   avg_goods_price_approved_prev |   avg_rate_interest_refused_prev |   avg_rate_interest_approved_prev | most_freq_seller_industry_prev   | last_rejection_reason_prev   |   cc_total_months_history |   cc_active_months_count |   cc_completed_months_count |   cc_utilization_rate_avg |   cc_balance_spike_ratio |   cc_avg_interest_burden |   cc_payment_over_min_ratio |   cc_atm_drawing_rate |   cc_avg_ticket_size |   cc_avg_monthly_drawings_count |   cc_avg_monthly_atm_count |   cc_avg_monthly_pos_count |   cc_max_dpd |   cc_max_dpd_def |   cc_late_payment_count |   cc_limit_growth_value |   pos_total_months_history |   pos_avg_future_installments |   pos_remaining_debt_ratio |   pos_late_payment_count |   pos_max_dpd |   pos_max_dpd_def |   pos_completed_rate |   pos_active_rate |   pos_term_variance |   ins_late_payment_count |   ins_avg_dpd |   ins_max_dpd |   ins_avg_dbd |   ins_max_dbd |   ins_underpayment_count |   ins_payment_ratio |   ins_total_missed_balance |   ins_version_change_count |   ins_recent_late_count_1y |   bureau_total_loans_count |   bureau_active_loans_count |   bureau_closed_loans_count |   bureau_credit_card_count |   bureau_mortgage_count |   bureau_car_loan_count |   bureau_total_active_debt |   bureau_total_active_limit |   bureau_total_overdue_amount |   bureau_max_overdue_ever |   bureau_utilization_rate |   bureau_days_since_last_loan |   bureau_days_until_next_end |   bureau_max_delinquency_level_ever |   bureau_total_late_months_history |   ratio_credit_to_income |   ratio_annuity_to_income |   ratio_annuity_to_credit |   ratio_total_debt_to_income |   ratio_total_credit_limit_to_income |   feature_disposable_income |   ratio_employed_to_age |   ratio_income_to_age |
|-------------:|---------:|:---------------------|:--------------|:---------------|:------------------|---------------:|-------------------:|-----------------:|--------------:|------------------:|:------------------|:-------------------|:------------------------------|:---------------------|:--------------------|-----------------------------:|-------------:|----------------:|--------------------:|------------------:|--------------:|-------------:|-----------------:|------------------:|-------------------:|-------------:|-------------:|:------------------|------------------:|-----------------------:|------------------------------:|:-----------------------------|--------------------------:|-----------------------------:|-----------------------------:|------------------------------:|-------------------------:|-------------------------:|--------------------------:|:--------------------|---------------:|---------------:|---------------:|:----------------------|:-----------------|-----------------:|:---------------------|:----------------------|---------------------------:|---------------------------:|---------------------------:|---------------------------:|-------------------------:|-----------------------------:|----------------------------:|-----------------------------:|----------------------------:|----------------------------:|-----------------------------:|--------------------:|---------------------:|---------------------:|--------------------------:|---------------------:|--------------------------:|-----------------------:|-----------------------:|-------------------------:|--------------------:|---------------------:|----------------------:|--------------------:|-----------------------------:|-----------------------------:|--------------------------------:|-------------------------------:|-----------------------------------:|---------------------------:|-----------------------------:|------------------------:|-------------------------:|-------------------------------:|--------------------------------:|---------------------------------:|----------------------------------:|:---------------------------------|:-----------------------------|--------------------------:|-------------------------:|----------------------------:|--------------------------:|-------------------------:|-------------------------:|----------------------------:|----------------------:|---------------------:|--------------------------------:|---------------------------:|---------------------------:|-------------:|-----------------:|------------------------:|------------------------:|---------------------------:|------------------------------:|---------------------------:|-------------------------:|--------------:|------------------:|---------------------:|------------------:|--------------------:|-------------------------:|--------------:|--------------:|--------------:|--------------:|-------------------------:|--------------------:|---------------------------:|---------------------------:|---------------------------:|---------------------------:|----------------------------:|----------------------------:|---------------------------:|------------------------:|------------------------:|---------------------------:|----------------------------:|------------------------------:|--------------------------:|--------------------------:|------------------------------:|-----------------------------:|------------------------------------:|-----------------------------------:|-------------------------:|--------------------------:|--------------------------:|-----------------------------:|-------------------------------------:|----------------------------:|------------------------:|----------------------:|
|       242471 |        0 | Cash loans           | F             | Y              | N                 |              1 |              90000 | 652500           |       21694.5 |            652500 | Unaccompanied     | State servant      | Secondary / secondary special | Married              | House / apartment   |                     0.028663 |       -17798 |           -9130 |               -4242 |             -1340 |             7 |            1 |                1 |                 0 |                  1 |            0 |            0 | Laborers          |                 3 |                      2 |                             2 | FRIDAY                       |                        10 |                            0 |                            0 |                             0 |                        0 |                        0 |                         0 | Postal              |     nan        |      0.611574  |       0.609276 | nan                   | block of flats   |           0.0469 | Panel                | False                 |                          2 |                          0 |                          2 |                          0 |                      -93 |                            0 |                           0 |                            0 |                           1 |                           0 |                            1 |            0.163111 |                    9 |             0.163767 |                         9 |             0.1633   |                         9 |                      1 |                      1 |                        3 |            0        |             1        |              0        |            0        |                     0        |                     0.333333 |                           -1013 |                            nan |                               -824 |                   0.954029 |                    0.108272  |                 4367.93 |                      4   |                            nan |                         21937.5 |                              nan |                               nan | Consumer electronics             | XAP                          |                        36 |                       36 |                           0 |                  0.138038 |                  4.01547 |                  293.589 |                    5.68002  |             0.758997  |              5465.68 |                        0.888889 |                   0.222222 |                   0.962963 |            8 |                8 |                       1 |                       0 |                         14 |                       3       |                   0.5      |                        0 |             0 |                 0 |            0.142857  |          0.857143 |              0      |                        1 |     0.277778  |            15 |       5.87037 |            19 |                        0 |            1        |                        0   |                          2 |                          0 |                          5 |                           1 |                           4 |                          1 |                       0 |                       0 |                     301260 |             315000          |                           0   |                       0   |                  0.956382 |                          -176 |                          920 |                                   1 |                                  8 |                 7.25     |                 0.24105   |                 0.0332483 |                     10.5973  |                             10.75    |                     68305.5 |                0.512979 |              -5.05675 |
|       242472 |        1 | Cash loans           | F             | N              | N                 |              0 |              90000 | 647046           |       19048.5 |            463500 | Unaccompanied     | Pensioner          | Secondary / secondary special | Single / not married | House / apartment   |                     0.020713 |       -22396 |             nan |               -3994 |             -4008 |           nan |            1 |                0 |                 0 |                  1 |            0 |            0 | nan               |                 1 |                      3 |                             3 | MONDAY                       |                         8 |                            0 |                            0 |                             0 |                        0 |                        0 |                         0 | XNA                 |     nan        |      0.0871064 |       0.172495 | nan                   | nan              |         nan      | nan                  |                       |                          0 |                          0 |                          0 |                          0 |                    -1095 |                            0 |                           0 |                            0 |                           0 |                           0 |                            3 |          nan        |                    0 |           nan        |                         0 |           nan        |                         0 |                      1 |                      1 |                        5 |            0        |             1        |              0.6      |            0        |                     0.6      |                     0.2      |                           -1095 |                            nan |                               -547 |                   1.0897   |                    0.0322524 |                14379.5  |                     10.8 |                            nan |                        117884   |                              nan |                               nan | XNA                              | XAP                          |                        36 |                       36 |                           0 |                  0.49078  |                  3.52269 |                 2852.43  |                    2.18108  |             0.830703  |              5052.85 |                        1.61111  |                   0.916667 |                   0.694444 |            0 |                0 |                       0 |                  270000 |                         59 |                       7.27119 |                   0.475989 |                        0 |             0 |                 0 |            0.0677966 |          0.932203 |             19.0836 |                        0 |     0         |             0 |       4.125   |            19 |                        0 |            1        |                        0   |                          2 |                          0 |                          8 |                           3 |                           5 |                          2 |                       0 |                       0 |                     400622 |             688500          |                         760.5 |                     nan   |                  0.581876 |                          -328 |                         1040 |                                 nan |                                  0 |                 7.1894   |                 0.21165   |                 0.0294392 |                     11.6408  |                             14.8394  |                     70951.5 |              -16.3084   |              -4.01857 |
|       242476 |        0 | Cash loans           | F             | Y              | Y                 |              1 |             135000 |      1.16672e+06 |       34245   |            913500 | Unaccompanied     | State servant      | Secondary / secondary special | Married              | House / apartment   |                     0.020713 |       -14229 |           -6722 |               -7980 |             -4892 |            12 |            1 |                1 |                 0 |                  1 |            0 |            0 | Medicine staff    |                 3 |                      3 |                             2 | WEDNESDAY                    |                        13 |                            0 |                            0 |                             0 |                        0 |                        0 |                         0 | Medicine            |       0.316581 |      0.0350015 |       0.392774 | reg oper spec account | block of flats   |           0.0525 | Panel                | False                 |                          0 |                          0 |                          0 |                          0 |                    -1327 |                            0 |                           0 |                            0 |                           1 |                           2 |                            2 |            0.23792  |                   10 |             0.24063  |                        10 |             0.23878  |                        10 |                      1 |                      1 |                        2 |            0        |             0.5      |              0.5      |            0        |                     0        |                     0.5      |                           -1327 |                            nan |                              -1018 |                   1.08251  |                    0         |                13601.6  |                     10   |                            nan |                         98010   |                              nan |                               nan | XNA                              | XAP                          |                        96 |                       96 |                           0 |                  0.339839 |                  8.4301  |                  187.852 |                   12.783    |             0         |              3011.76 |                        0.395833 |                   0        |                   0.395833 |            0 |                0 |                       0 |                   90000 |                         11 |                       5       |                   0.5      |                        0 |             0 |                 0 |            0.0909091 |          0.909091 |              0      |                        2 |     0.0551181 |             5 |       2.82677 |            31 |                        4 |            0.984252 |                    27207.6 |                          2 |                          0 |                          6 |                           2 |                           4 |                          2 |                       0 |                       0 |                     342014 |                  1.1205e+06 |                           0   |                    8415   |                  0.305233 |                          -707 |                          612 |                                 nan |                                  0 |                 8.6424   |                 0.253667  |                 0.0293514 |                     11.1758  |                             16.9424  |                    100755   |                0.472415 |              -9.48767 |
|       242490 |        0 | Cash loans           | F             | N              | Y                 |              0 |             247500 |  50940           |        5616   |             45000 | Unaccompanied     | Working            | Higher education              | Married              | House / apartment   |                     0.022625 |       -10412 |           -2085 |               -2029 |             -2833 |           nan |            1 |                1 |                 0 |                  1 |            0 |            0 | Core staff        |                 2 |                      2 |                             2 | WEDNESDAY                    |                        15 |                            0 |                            0 |                             0 |                        0 |                        0 |                         0 | Kindergarten        |       0.601655 |      0.331324  |       0.598926 | nan                   | nan              |         nan      | nan                  |                       |                          3 |                          0 |                          3 |                          0 |                     -716 |                            0 |                           0 |                            0 |                           0 |                           0 |                            3 |          nan        |                    0 |           nan        |                         0 |           nan        |                         0 |                      1 |                      1 |                        9 |            0.222222 |             0.333333 |              0.444444 |            0.111111 |                     0.111111 |                     0.111111 |                            -172 |                           -172 |                               -381 |                   1.05555  |                    0.100499  |                27902.8  |                     24   |                            nan |                        294360   |                              nan |                               nan | XNA                              | XAP                          |                         6 |                        6 |                           0 |                  0        |                nan       |                    0     |                  nan        |           nan         |               nan    |                        0        |                 nan        |                 nan        |            0 |                0 |                       0 |                   90000 |                         18 |                      22.6667  |                   0.617424 |                        0 |             0 |                 0 |            0.0555556 |          0.944444 |            555.546  |                        0 |     0         |             0 |      17.8235  |            30 |                        0 |            1.61096  |                  -315000   |                          3 |                          0 |                          3 |                           1 |                           2 |                          1 |                       0 |                       0 |                     207729 |             225000          |                           0   |                    7303.5 |                  0.92324  |                          -848 |                          501 |                                 nan |                                  0 |                 0.205818 |                 0.0226909 |                 0.110247  |                      1.04513 |                              1.11491 |                    241884   |                0.20025  |             -23.7706  |
|       242504 |        1 | Cash loans           | F             | N              | N                 |              1 |              90000 | 509400           |       37066.5 |            450000 | Unaccompanied     | Working            | Secondary / secondary special | Married              | House / apartment   |                     0.0228   |       -12163 |           -2402 |               -5800 |             -2651 |           nan |            1 |                1 |                 1 |                  1 |            0 |            0 | Sales staff       |                 3 |                      2 |                             2 | TUESDAY                      |                        10 |                            0 |                            0 |                             0 |                        0 |                        0 |                         0 | Self-employed       |       0.599388 |      0.477412  |       0.200926 | reg oper account      | block of flats   |           0.0043 | Wooden               | False                 |                          1 |                          0 |                          1 |                          0 |                     -319 |                            0 |                           0 |                            0 |                           1 |                           0 |                            3 |            0.142907 |                   14 |             0.14375  |                        14 |             0.143207 |                        14 |                      1 |                      1 |                        9 |            0.444444 |             0.555556 |              0.333333 |            0.444444 |                     0.111111 |                     0.222222 |                            -319 |                           -286 |                               -464 |                   1.08631  |                    0.068268  |                34869.2  |                     12   |                         393750 |                        134557   |                              nan |                               nan | XNA                              | HC                           |                        10 |                       10 |                           0 |                  0.675318 |                  1.76388 |                 3752.55  |                    0.764237 |             0.0563712 |              5442.82 |                        4.4      |                   0.111111 |                   4.55556  |            0 |                0 |                       0 |                  180000 |                         48 |                      10.8125  |                   0.58125  |                        0 |             0 |                 0 |            0.0833333 |          0.916667 |             90.8825 |                        5 |     0.3       |             7 |       8.75    |            76 |                        4 |            0.966667 |                    22174   |                          3 |                          3 |                         19 |                           4 |                          14 |                          3 |                       0 |                       0 |                     543760 |             787500          |                           0   |                       0   |                  0.690489 |                           -53 |                        27305 |                                   1 |                                  3 |                 5.66     |                 0.41185   |                 0.072765  |                     11.7018  |                             14.41    |                     52933.5 |                0.197484 |              -7.39949 |

</div>

<br>


Before starting the data cleaning, normalization and categorical encoding steps, I will apply `Shapley value` analysis to identify the most important features in the dataset. This will help us focus on the most relevant features and potentially reduce the dimensionality of the dataset, which can improve model performance and reduce overfitting. As a result, we will not deal with cleaning of all the features unnecessarily, but rather focus on the most important ones. This is important in large datasets, since the data cleaning and making it ready for modelling is more than 70% of the work in a data science project, and we want to optimize our efforts by focusing on the most impactful features.


##  Feature Selection via SHAP Values 

In this step, I want to filter out the "noise" from the dataset before doing deeper cleaning. Since we have a lot of columns, I need to know which ones actually matter for predicting the target. To do this, I'm using a technique called **"Feature Selection by Model"**.

I will train a quick LightGBM classifier on the data. Then, I'll use **SHAP (SHapley Additive exPlanations) values to calculate exactly how much each feature contributes to the model's decisions**. <font color="skyblue">Using a sample of 150,000 rows (to keep it fast), I can identify features that have effectively zero impact on the prediction. </font>. My goal is to create a cols_to_drop list containing these useless features so I can remove them and focus only on the data that has signal.


<details>
<summary>Show SHAP Feature Selection Code</summary>

```python
# 1. PREPARE DATA
print("Preparing data...")
drop_cols = ["SK_ID_CURR", "TARGET"]
feature_names = [c for c in df.columns if c not in drop_cols]

# Convert to Pandas
train_df = df.select(feature_names + ["TARGET"]).to_pandas()
X = train_df[feature_names].copy()
y = train_df["TARGET"]

# Encode Categorical
cat_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()
for col in cat_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col].astype(str))

# 2. TRAIN MODEL
print("Training model...")
model = lgb.LGBMClassifier(
    n_estimators=100,
    learning_rate=0.1,
    random_state=42,
    n_jobs=-1,
    verbose=-1
)
model.fit(X, y)

# 3. CALCULATE SHAP (150,000 Rows)
print("Calculating SHAP values on 150,000 rows...")
sample_size = 150000
if len(X) > sample_size:
    X_sample = X.sample(n=sample_size, random_state=42)
else:
    X_sample = X.copy()

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_sample)

if isinstance(shap_values, list):
    shap_vals_target = shap_values[1]
else:
    shap_vals_target = shap_values

# 4. CREATE DATAFRAME
mean_shap = np.abs(shap_vals_target).mean(axis=0)

significance_df = pd.DataFrame({
    'Feature': X_sample.columns,
    'SHAP_Importance': mean_shap
})

# Threshold
threshold = 1e-5
significance_df['Status'] = np.where(
    significance_df['SHAP_Importance'] >= threshold, 
    'Significant', 
    'Insignificant'
)

# Sort
significance_df = significance_df.sort_values(by='SHAP_Importance', ascending=False)
significance_df['SHAP_Importance'] = significance_df['SHAP_Importance'].round(6)

# 5. PRINT FULL DATAFRAME (ALL ROWS VISIBLE)
# This forces Pandas to display everything
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)

print("\n" + "="*50)
print(f"FULL FEATURE IMPORTANCE LIST ({len(significance_df)} Features)")
print("="*50)
print(significance_df)

# 6. PRINT DROP LIST
cols_to_drop = significance_df[significance_df['Status'] == 'Insignificant']['Feature'].tolist()
print("\n" + "="*50)
print(f"INSIGNIFICANT FEATURES TO DROP ({len(cols_to_drop)})")
print("="*50)
print(cols_to_drop)
```



**SHAP Feature Importance Analysis Results**

**Interpretation**
The SHAP analysis provides a "global view" of what drives our model's decisions. By aggregating the absolute SHAP values across all samples, we can see which features actually move the needle on probability of default.

Here is the breakdown of the signal we found:

**1. The "Big Three" Dominance (External Sources)**
The top three features are exclusively `EXT_SOURCE_1`, `EXT_SOURCE_2`, and `EXT_SOURCE_3`.

* **What this means:** The model relies heavily on these external credit scores (likely from other credit bureaus like Equifax or Experian).
* **Insight:** This is expected in credit risk. Past credit behavior (captured in these scores) is the single best predictor of future behavior. `EXT_SOURCE_2` alone has an importance of `0.29`, which is nearly **3x more powerful** than the next best feature type.

**2. Demographics and Stability**

* **`CODE_GENDER` (Rank #4):** This is surprisingly high (`0.11`). It suggests a strong statistical difference in default rates between men and women in this dataset.
* **`DAYS_EMPLOYED` (Rank #5) & `DAYS_BIRTH`:** Job stability and age are critical. The model likely sees that older applicants with longer tenure are safer borrowers.
* **`NAME_EDUCATION_TYPE`:** Education level is a key proxy for income potential and financial literacy.

**3. The Power of Ratios (Feature Engineering)**

* **`ratio_annuity_to_credit` (Rank #6):** This is a derived feature (not raw data), and its high ranking validates our feature engineering. It measures "affordability"—how large the monthly payment is relative to the total loan. A high ratio usually indicates a high burden, increasing default risk.

**4. The "Zero Signal" Features (The Drop List)**
Crucially, we identified a block of features with **0.000000** importance. These are the "Insignificant" features we will drop.

* **Contact Flags (`FLAG_MOBIL`, `FLAG_EMAIL`, `FLAG_CONT_MOBILE`):** These failed because they lack variance. In the modern era, nearly everyone provides a mobile number. If 99.9% of rows have a "1", the model cannot use it to separate good from bad borrowers.
* **Region Mismatches (`REG_REGION_NOT_WORK_REGION`, `LIVE_CITY_NOT_WORK_CITY`):** The model found no correlation between living in a different city than you work and defaulting. This is just noise.
* **Granular Bureau Enquiries (`AMT_REQ_CREDIT_BUREAU_HOUR/WEEK`):** While the number of enquiries *total* might matter, the model decided that knowing if an enquiry happened "in the last hour" specifically is irrelevant compared to the bigger picture.

**Conclusion**
We have successfully separated the signal from the noise. We can safely drop the 19 features at the bottom (flags, address mismatches, and granular bureau times) without hurting the model's accuracy. In fact, removing them will likely make the model more robust by reducing overfitting.


##  Dropping Insignificant Features

Now that we have a confirmed list of "noise" features (`cols_to_drop`) from our SHAP analysis, the objective here is to physically remove them from the dataset. This is a critical efficiency step: carrying 19+ useless columns consumes memory and computation power for every subsequent operation (joins, aggregations, training) without adding any value.

Crucially, this block acts as a **safety checkpoint**. Automated cleaning pipelines can sometimes be too aggressive. Therefore, the code explicitly verifies two things:

1. **Dimensionality Reduction:** We print the new shape to confirm the columns were actually deleted (the column count should decrease).
2. **Target Integrity:** We check if the `TARGET` column still exists. If we accidentally drop the column we are trying to predict, the entire dataset becomes useless for supervised learning. This "unit test" prevents us from moving forward with a broken dataset.


<details>
<summary>Click here to see the code</summary>

```python
# 1. Execute Drop
# We check if the list exists and has items to avoid errors
if 'cols_to_drop' in locals() and len(cols_to_drop) > 0:
    print(f"Dropping {len(cols_to_drop)} insignificant features...")
    
    # Polars drop operation
    df = df.drop(cols_to_drop)
    
    print("Drop complete.")
else:
    print("'cols_to_drop' variable not found or empty. Please ensure the SHAP analysis code ran successfully.")

# 2. Verify New Dataset Dimensions
print(f"\n--- DATASET STATUS ---")
print(f"New Shape: {df.shape}")
print(f"Remaining Columns: {len(df.columns)}")
print("-" * 30)

# 3. Quick Check: Ensure Target is still there
if "TARGET" in df.columns:
    print("Target column is present. Ready for modeling.")
else:
    print("ALARM: Target column was accidentally dropped!")
```
</details>

**Output:**

```
Dropping 18 insignificant features...
Drop complete.

--- DATASET STATUS ---
New Shape: (307511, 128)
Remaining Columns: 128
------------------------------
Target column is present. Ready for modeling.
```

The output confirms that the cleaning operation was successful and safe.

* **Dimensionality Reduction:** We successfully removed **18 features**. We have slimmed the dataset down to **128 columns**. This might seem small, but removing 18 columns across 300,000+ rows saves significant memory and will speed up every future calculation (like the missing value check we are about to do).
* **Safety Verification:** Most importantly, the system returned **"Target column is present."** This is our "Green Light." It means we haven't broken the dataset. We still have our labels (0 and 1) and our reduced set of features, so we are cleared to proceed to the next stage of data cleaning.

**Next Step:**
Now that we have removed the *useless* columns, we need to look at the *broken* ones—specifically, columns that are full of missing values (nulls). 


##  Missing Value Analysis (Missingness Report) 

Now that we've removed the useless features, we need to find the "broken" ones. Machine learning models (like LightGBM or XGBoost) can handle some missing data, but too much missingness can ruin predictions.

My objective here is to generate a comprehensive "Health Report" for the dataset. I don't just want the count of missing values (e.g., "50,000 nulls"); I want the percentage.

If a column is 5% missing, I can fix it (impute with mean/median).

If a column is 95% missing, it's mostly empty space and likely needs to be dropped.

This code scans every single column, counts the nulls, and calculates a percentage. It then sorts the list so the "emptiest" columns appear at the top, allowing me to instantly see which features are in the "Danger Zone."

<details>
<summary>Click here to see the code</summary>

```python
# 1. Calculate Null Stats
# We compute null counts for all columns at once
null_stats = df.select([
    pl.col(c).null_count().alias(c) for c in df.columns
])

# 2. Transpose for Readability
# Switches from wide (many columns) to long (Feature, Count) format
null_df = null_stats.transpose(
    include_header=True, 
    header_name="Feature", 
    column_names=["Null_Count"]
)

# 3. Calculate Percentage and Formatting
total_rows = df.height

null_df = (
    null_df
    .with_columns(
        (pl.col("Null_Count") / total_rows * 100).round(2).alias("Null_Percent")
    )
    .filter(pl.col("Null_Count") > 0)  # Optional: Hide columns with 0 nulls
    .sort("Null_Percent", descending=True)
)

# 4. Display Results
print(f"\n--- Missing Value Report (Total Rows: {total_rows}) ---")
print(f"Columns with missing values: {null_df.height}")

# Show all rows of the report
with pl.Config(tbl_rows=-1):
    print(null_df)
```
</details>

<div style="max-height: 500px; overflow-y: auto;"> 


--- Missing Value Report (Total Rows: 307511) ---
Columns with missing values: 102
| Feature                           |   Null_Count |   Null_Percent |
|:----------------------------------|-------------:|---------------:|
| avg_rate_interest_refused_prev    |       307511 |         100    |
| avg_rate_interest_approved_prev   |       302902 |          98.5  |
| cc_avg_ticket_size                |       248339 |          80.76 |
| cc_payment_over_min_ratio         |       248232 |          80.72 |
| cc_balance_spike_ratio            |       247911 |          80.62 |
| cc_atm_drawing_rate               |       247875 |          80.61 |
| cc_avg_monthly_atm_count          |       246371 |          80.12 |
| cc_avg_monthly_pos_count          |       246371 |          80.12 |
| cc_utilization_rate_avg           |       221475 |          72.02 |
| cc_total_months_history           |       220606 |          71.74 |
| cc_active_months_count            |       220606 |          71.74 |
| cc_completed_months_count         |       220606 |          71.74 |
| cc_avg_interest_burden            |       220606 |          71.74 |
| cc_avg_monthly_drawings_count     |       220606 |          71.74 |
| cc_max_dpd                        |       220606 |          71.74 |
| cc_max_dpd_def                    |       220606 |          71.74 |
| cc_late_payment_count             |       220606 |          71.74 |
| cc_limit_growth_value             |       220606 |          71.74 |
| bureau_max_delinquency_level_ever |       215280 |          70.01 |
| avg_goods_price_refused_prev      |       214278 |          69.68 |
| FONDKAPREMONT_MODE                |       210295 |          68.39 |
| days_since_last_refusal_prev      |       207217 |          67.39 |
| OWN_CAR_AGE                       |       202929 |          65.99 |
| EXT_SOURCE_1                      |       173378 |          56.38 |
| WALLSMATERIAL_MODE                |       156341 |          50.84 |
| HOUSETYPE_MODE                    |       154297 |          50.18 |
| housing_score_avg                 |       148810 |          48.39 |
| housing_score_mode                |       148810 |          48.39 |
| housing_score_medi                |       148810 |          48.39 |
| TOTALAREA_MODE                    |       148431 |          48.27 |
| EMERGENCYSTATE_MODE               |       145755 |          47.4  |
| bureau_max_overdue_ever           |       123625 |          40.2  |
| OCCUPATION_TYPE                   |        96391 |          31.35 |
| bureau_utilization_rate           |        95419 |          31.03 |
| EXT_SOURCE_3                      |        60965 |          19.83 |
| DAYS_EMPLOYED                     |        55374 |          18.01 |
| bureau_days_until_next_end        |        46269 |          15.05 |
| bureau_total_active_debt          |        46010 |          14.96 |
| bureau_total_active_limit         |        44021 |          14.32 |
| bureau_total_loans_count          |        44020 |          14.31 |
| bureau_active_loans_count         |        44020 |          14.31 |
| bureau_closed_loans_count         |        44020 |          14.31 |
| bureau_credit_card_count          |        44020 |          14.31 |
| bureau_mortgage_count             |        44020 |          14.31 |
| bureau_car_loan_count             |        44020 |          14.31 |
| bureau_total_overdue_amount       |        44020 |          14.31 |
| bureau_days_since_last_loan       |        44020 |          14.31 |
| bureau_total_late_months_history  |        44020 |          14.31 |
| AMT_REQ_CREDIT_BUREAU_HOUR        |        41519 |          13.5  |
| AMT_REQ_CREDIT_BUREAU_DAY         |        41519 |          13.5  |
| AMT_REQ_CREDIT_BUREAU_WEEK        |        41519 |          13.5  |
| AMT_REQ_CREDIT_BUREAU_MON         |        41519 |          13.5  |
| AMT_REQ_CREDIT_BUREAU_QRT         |        41519 |          13.5  |
| AMT_REQ_CREDIT_BUREAU_YEAR        |        41519 |          13.5  |
| days_since_last_termination_prev  |        40497 |          13.17 |
| avg_down_payment_rate_prev        |        33906 |          11.03 |
| degree_of_trust_avg_prev          |        18467 |           6.01 |
| pos_term_variance                 |        18437 |           6    |
| avg_goods_price_approved_prev     |        18425 |           5.99 |
| pos_total_months_history          |        18067 |           5.88 |
| pos_avg_future_installments       |        18091 |           5.88 |
| pos_remaining_debt_ratio          |        18091 |           5.88 |
| pos_late_payment_count            |        18067 |           5.88 |
| pos_max_dpd                       |        18067 |           5.88 |
| pos_max_dpd_def                   |        18067 |           5.88 |
| pos_completed_rate                |        18067 |           5.88 |
| pos_active_rate                   |        18067 |           5.88 |
| days_since_last_approval_prev     |        17446 |           5.67 |
| avg_term_approved_prev            |        17446 |           5.67 |
| max_prev_annuity_prev             |        16871 |           5.49 |
| application_count_prev            |        16454 |           5.35 |
| refusal_rate_prev                 |        16454 |           5.35 |
| approval_rate_prev                |        16454 |           5.35 |
| cash_loan_rate_prev               |        16454 |           5.35 |
| walk_in_rate_prev                 |        16454 |           5.35 |
| insurance_uptake_rate_prev        |        16454 |           5.35 |
| high_yield_group_rate_prev        |        16454 |           5.35 |
| most_freq_seller_industry_prev    |        16454 |           5.35 |
| last_rejection_reason_prev        |        16454 |           5.35 |
| ins_late_payment_count            |        15868 |           5.16 |
| ins_avg_dpd                       |        15868 |           5.16 |
| ins_max_dpd                       |        15868 |           5.16 |
| ins_avg_dbd                       |        15868 |           5.16 |
| ins_max_dbd                       |        15868 |           5.16 |
| ins_underpayment_count            |        15868 |           5.16 |
| ins_payment_ratio                 |        15879 |           5.16 |
| ins_total_missed_balance          |        15876 |           5.16 |
| ins_version_change_count          |        15868 |           5.16 |
| ins_recent_late_count_1y          |        15868 |           5.16 |
| NAME_TYPE_SUITE                   |         1292 |           0.42 |
| OBS_30_CNT_SOCIAL_CIRCLE          |         1021 |           0.33 |
| DEF_30_CNT_SOCIAL_CIRCLE          |         1021 |           0.33 |
| OBS_60_CNT_SOCIAL_CIRCLE          |         1021 |           0.33 |
| DEF_60_CNT_SOCIAL_CIRCLE          |         1021 |           0.33 |
| EXT_SOURCE_2                      |          660 |           0.21 |
| AMT_GOODS_PRICE                   |          278 |           0.09 |
| AMT_ANNUITY                       |           12 |           0    |
| CNT_FAM_MEMBERS                   |            2 |           0    |
| DAYS_LAST_PHONE_CHANGE            |            1 |           0    |
| ratio_annuity_to_income           |           12 |           0    |
| ratio_annuity_to_credit           |           12 |           0    |
| feature_disposable_income         |           12 |           0    |

</div>


With the following code we can automatically identify the columns with more than 90% missing values and drom them. 

<details>
<summary>Click here to see the code</summary>

```python
# 1. Define Threshold
limit = 90.0
total_rows = df.height

print(f"Analyzing columns with > {limit}% missing values...")

# 2. Calculate Null Percentages
# We check every column and calculate its missing percentage
null_stats = df.select([
    (pl.col(c).null_count() / total_rows * 100).alias(c) for c in df.columns
])

# 3. Identify Columns to Drop
drop_cols_high_null = [
    c for c in null_stats.columns if null_stats[c][0] > limit
]

# 4. Execute Drop
if drop_cols_high_null:
    print(f"Found {len(drop_cols_high_null)} columns to drop:")
    print(drop_cols_high_null)
    
    df = df.drop(drop_cols_high_null)
    print("\nDrop complete.")
else:
    print("\nNo columns found above the 90% missing threshold.")

# 5. Verify Status
print(f"New DataFrame Shape: {df.shape}")
```

</details>

**Output:**

```
Analyzing columns with > 90.0% missing values...
Found 1 columns to drop:
['avg_rate_interest_approved_prev']

Drop complete.
New DataFrame Shape: (307511, 127)
```

The output indicates that the dataset is relatively dense, as only **one feature** exceeded the 90% missingness threshold: `avg_rate_interest_approved_prev`.

* **Sparsity Removal:** We dropped this specific column because a feature missing 90% of its data contains almost no statistical signal. Imputing values for such a large portion of the rows would introduce significant bias and artificial noise into the model.
* **Dimensionality Update:** The dataframe shape has been updated to **127 columns**. This confirms the drop was executed correctly.
* **Data Quality:** The fact that only one column was removed suggests that the remaining features have sufficient data density to be useful for modeling, though they may still require standard imputation techniques later.
* Altough some features have more than 50% missing values, they are not automatically dropped because they might still contain valuable information. This is a type of dataset in which even the missingness is a predictive signal. For example, if `EXT_SOURCE_1` is missing for a large portion of the dataset, that itself might indicate a certain type of borrower (e.g., someone with no credit history), which could be highly relevant for predicting default risk. Therefore, we will keep these features for now and apply WoE method which will be explaind later.


##  Cardinality Check for Categorical Variables 

Before we convert our text columns (categorical variables) into numbers for the machine learning model, we must assess their "Cardinality"—the number of unique values in each column.

This step is crucial for choosing the correct encoding strategy:

* **Low Cardinality (e.g., Gender: M/F):** These are simple to handle. We can use Label Encoding or One-Hot Encoding without increasing the dataset size significantly.
* **High Cardinality (e.g., Organization Type: 50+ job types):** These are dangerous. If we use standard One-Hot Encoding on a column with 100 categories, we add 100 new columns to the dataset. This causes the "Curse of Dimensionality," where the data becomes sparse and the model struggles to find patterns.

This code scans all string/object columns, counts their unique values, and flags any feature with more than 50 categories. This "High Cardinality Alert" tells us which columns require advanced techniques like **Weight of Evidence (WoE)** or **Target Encoding** instead of simple labeling.


<details>
<summary>Click here to see the code</summary>

```python
# 1. Identify Categorical Columns
# We look for String, Object, or Categorical types
cat_cols = [
    c for c, t in df.schema.items() 
    if t in (pl.String, pl.Object, pl.Categorical)
]

print(f"Analyzing {len(cat_cols)} categorical columns...")

if len(cat_cols) > 0:
    # 2. Calculate Unique Counts (Cardinality)
    cardinality_df = df.select([
        pl.col(c).n_unique().alias(c) for c in cat_cols
    ]).transpose(
        include_header=True, 
        header_name="Feature", 
        column_names=["Unique_Count"]
    ).sort("Unique_Count", descending=True)

    # 3. Display Results
    print(f"\n--- Categorical Cardinality Report ---")
    with pl.Config(tbl_rows=-1):
        print(cardinality_df)
        
    # 4. Highlight High Cardinality Suspects
    # A count > 50 usually requires "Rare Label Encoding" (grouping small categories into "OTHER")
    high_card_cols = cardinality_df.filter(pl.col("Unique_Count") > 50)
    
    if high_card_cols.height > 0:
        print(f"\n ALERT: {high_card_cols.height} columns have high cardinality (> 50 unique values).")
        print("We should group rare categories for these.")
else:
    print("No categorical columns found. (Did you already encode them?)")

```

</details>

**Output:** 

```
Analyzing 16 categorical columns...

--- Categorical Cardinality Report ---
shape: (16, 2)
┌────────────────────────────────┬──────────────┐
│ Feature                        ┆ Unique_Count │
│ ---                            ┆ ---          │
│ str                            ┆ u32          │
╞════════════════════════════════╪══════════════╡
│ ORGANIZATION_TYPE              ┆ 58           │
│ OCCUPATION_TYPE                ┆ 19           │
│ most_freq_seller_industry_prev ┆ 12           │
│ NAME_TYPE_SUITE                ┆ 8            │
│ NAME_INCOME_TYPE               ┆ 8            │
│ WALLSMATERIAL_MODE             ┆ 8            │
│ WEEKDAY_APPR_PROCESS_START     ┆ 7            │
│ NAME_FAMILY_STATUS             ┆ 6            │
│ NAME_HOUSING_TYPE              ┆ 6            │
│ NAME_EDUCATION_TYPE            ┆ 5            │
│ FONDKAPREMONT_MODE             ┆ 5            │
│ HOUSETYPE_MODE                 ┆ 4            │
│ CODE_GENDER                    ┆ 3            │
│ NAME_CONTRACT_TYPE             ┆ 2            │
│ FLAG_OWN_CAR                   ┆ 2            │
│ FLAG_OWN_REALTY                ┆ 2            │
└────────────────────────────────┴──────────────┘

 ALERT: 1 columns have high cardinality (> 50 unique values).
We should group rare categories for these.
```

The cardinality analysis provides a clear roadmap for our encoding strategy.

**1. High Cardinality Identified (`ORGANIZATION_TYPE`)**
As suspected, `ORGANIZATION_TYPE` is the outlier with **58 unique values**.

* **Implication:** If we were to use standard One-Hot Encoding here, it would add 58 new columns to our dataset, significantly increasing dimensionality and computational cost.
* **Action:** This confirms that `ORGANIZATION_TYPE` is the primary candidate for **Weight of Evidence (WoE)** encoding. This technique will convert these 58 categories into a single numerical risk score, preserving the information without expanding the dataset.

**2. Moderate Cardinality (`OCCUPATION_TYPE`, `most_freq_seller_industry_prev`)**
These features have 19 and 12 unique values respectively. While not strictly "high" cardinality (usually defined as >50 or >100), they are complex enough that they might benefit from WoE encoding as well, rather than simple Label Encoding which imposes an arbitrary order (e.g., Accountants < Drivers).

**3. Low Cardinality (The Safe Zone)**
The remaining 13 features (like `CODE_GENDER`, `NAME_FAMILY_STATUS`, `FLAG_OWN_CAR`) have fewer than 10 unique values. These are computationally inexpensive and can be handled safely with standard Label Encoding or binary mapping (0 and 1).

**Next Step:**
We will now proceed to apply the **Weight of Evidence (WoE)** transformation, specifically targeting the high-cardinality `ORGANIZATION_TYPE` to mathematically capture the default risk associated with different employers.



###  Analyzing `Organization Type` Distribution 


We identified `ORGANIZATION_TYPE` as our highest cardinality feature (58 categories). Before we apply advanced mathematical transformations like Weight of Evidence (WoE), we must understand its distribution.

My objective here is to inspect the **frequency** of each job type.

* **Dominant Categories:** Which industries make up the majority of our applicants?
* **The "Long Tail" of Rare Labels:** Are there job types with very few samples (e.g., "Industry: Type 13" having only 10 people)?

This distinction is critical. Calculating a default risk score for a category with only 10 people is statistically dangerous—one default would swing the score wildly (high variance). If we find many rare categories, we will know that our WoE calculation needs "smoothing" to prevent overfitting.

<details>
<summary>Click here to see the code</summary>

```python

# 1. Calculate Counts for ORGANIZATION_TYPE
# We use .len() instead of .count()
org_counts = (
    df.group_by("ORGANIZATION_TYPE")
    .len()
    .sort("len", descending=True)
)

# 2. Add Percentage for context
org_counts = org_counts.with_columns(
    (pl.col("len") / df.height * 100).round(2).alias("Percent_of_Total")
)

# 3. Display the Full Table
print(f"\n--- ORGANIZATION_TYPE Distribution ({org_counts.height} unique values) ---")

with pl.Config(tbl_rows=-1):
    print(org_counts)
```

</details>

**Output:**

<div style="max-height: 400px; overflow-y: auto;"> 

```

--- ORGANIZATION_TYPE Distribution (58 unique values) ---
shape: (58, 3)
┌────────────────────────┬───────┬──────────────────┐
│ ORGANIZATION_TYPE      ┆ len   ┆ Percent_of_Total │
│ ---                    ┆ ---   ┆ ---              │
│ str                    ┆ u32   ┆ f64              │
╞════════════════════════╪═══════╪══════════════════╡
│ Business Entity Type 3 ┆ 67992 ┆ 22.11            │
│ XNA                    ┆ 55374 ┆ 18.01            │
│ Self-employed          ┆ 38412 ┆ 12.49            │
│ Other                  ┆ 16683 ┆ 5.43             │
│ Medicine               ┆ 11193 ┆ 3.64             │
│ Business Entity Type 2 ┆ 10553 ┆ 3.43             │
│ Government             ┆ 10404 ┆ 3.38             │
│ School                 ┆ 8893  ┆ 2.89             │
│ Trade: type 7          ┆ 7831  ┆ 2.55             │
│ Kindergarten           ┆ 6880  ┆ 2.24             │
│ Construction           ┆ 6721  ┆ 2.19             │
│ Business Entity Type 1 ┆ 5984  ┆ 1.95             │
│ Transport: type 4      ┆ 5398  ┆ 1.76             │
│ Trade: type 3          ┆ 3492  ┆ 1.14             │
│ Industry: type 9       ┆ 3368  ┆ 1.1              │
│ Industry: type 3       ┆ 3278  ┆ 1.07             │
│ Security               ┆ 3247  ┆ 1.06             │
│ Housing                ┆ 2958  ┆ 0.96             │
│ Industry: type 11      ┆ 2704  ┆ 0.88             │
│ Military               ┆ 2634  ┆ 0.86             │
│ Bank                   ┆ 2507  ┆ 0.82             │
│ Agriculture            ┆ 2454  ┆ 0.8              │
│ Police                 ┆ 2341  ┆ 0.76             │
│ Transport: type 2      ┆ 2204  ┆ 0.72             │
│ Postal                 ┆ 2157  ┆ 0.7              │
│ Security Ministries    ┆ 1974  ┆ 0.64             │
│ Trade: type 2          ┆ 1900  ┆ 0.62             │
│ Restaurant             ┆ 1811  ┆ 0.59             │
│ Services               ┆ 1575  ┆ 0.51             │
│ University             ┆ 1327  ┆ 0.43             │
│ Industry: type 7       ┆ 1307  ┆ 0.43             │
│ Transport: type 3      ┆ 1187  ┆ 0.39             │
│ Industry: type 1       ┆ 1039  ┆ 0.34             │
│ Hotel                  ┆ 966   ┆ 0.31             │
│ Electricity            ┆ 950   ┆ 0.31             │
│ Industry: type 4       ┆ 877   ┆ 0.29             │
│ Trade: type 6          ┆ 631   ┆ 0.21             │
│ Industry: type 5       ┆ 599   ┆ 0.19             │
│ Insurance              ┆ 597   ┆ 0.19             │
│ Telecom                ┆ 577   ┆ 0.19             │
│ Emergency              ┆ 560   ┆ 0.18             │
│ Industry: type 2       ┆ 458   ┆ 0.15             │
│ Advertising            ┆ 429   ┆ 0.14             │
│ Realtor                ┆ 396   ┆ 0.13             │
│ Culture                ┆ 379   ┆ 0.12             │
│ Industry: type 12      ┆ 369   ┆ 0.12             │
│ Trade: type 1          ┆ 348   ┆ 0.11             │
│ Mobile                 ┆ 317   ┆ 0.1              │
│ Legal Services         ┆ 305   ┆ 0.1              │
│ Cleaning               ┆ 260   ┆ 0.08             │
│ Transport: type 1      ┆ 201   ┆ 0.07             │
│ Industry: type 6       ┆ 112   ┆ 0.04             │
│ Industry: type 10      ┆ 109   ┆ 0.04             │
│ Religion               ┆ 85    ┆ 0.03             │
│ Industry: type 13      ┆ 67    ┆ 0.02             │
│ Trade: type 4          ┆ 64    ┆ 0.02             │
│ Trade: type 5          ┆ 49    ┆ 0.02             │
│ Industry: type 8       ┆ 24    ┆ 0.01             │
└────────────────────────┴───────┴──────────────────┘
```

</div>

###  Analyzing `Organization Type` Risk (Bivariate Analysis) 

Previous steps told us *how many* people work in each industry; this step tells us *how risky* they are. This is a classic **Bivariate Analysis** .

We group the data by `ORGANIZATION_TYPE` and calculate the mean of the `TARGET` variable. Since our target is binary (0 = Repaid, 1 = Defaulted), the mean represents the **Default Probability**.

* If the mean is `0.05`, it implies a **5% Default Rate** for that specific group.

We also calculate the **Global Average Default Rate** to use as a baseline.

* Industries **below** this line are "Safe" (protective factors).
* Industries **above** this line are "Risky" (risk factors).

By sorting the table from lowest to highest, we create a clear "Risk Hierarchy." This validates the feature's predictive power: if all industries had the same default rate, the feature would be useless. We expect to see a wide spread (variance) in risk between sectors like "Police" (stable) vs "Restaurant" (volatile).


<details>
<summary>Click here to see the Bivariate Analysis Results</summary>

```python
# 1. Calculate Default Rate for each Organization
risk_stats = (
    df.group_by("ORGANIZATION_TYPE")
    .agg([
        pl.len().alias("Count"),
        pl.col("TARGET").mean().alias("Default_Rate")
    ])
    .with_columns(
        (pl.col("Default_Rate") * 100).round(2).alias("Default_Rate_%")
    )
    .sort("Default_Rate") # Sort from Safest to Riskiest
)

# 2. Display the Full Table
print(f"\n--- Organization Types Sorted by Risk (Target Mean) ---")
print(f"Global Average Default Rate: {(df['TARGET'].mean() * 100):.2f}%")

with pl.Config(tbl_rows=-1):
    print(risk_stats)
```

</details>

**Output:**

<div style="max-height: 400px; overflow-y: auto;"> 

```

--- Organization Types Sorted by Risk (Target Mean) ---
Global Average Default Rate: 8.07%
shape: (58, 4)
┌────────────────────────┬───────┬──────────────┬────────────────┐
│ ORGANIZATION_TYPE      ┆ Count ┆ Default_Rate ┆ Default_Rate_% │
│ ---                    ┆ ---   ┆ ---          ┆ ---            │
│ str                    ┆ u32   ┆ f64          ┆ f64            │
╞════════════════════════╪═══════╪══════════════╪════════════════╡
│ Trade: type 4          ┆ 64    ┆ 0.03125      ┆ 3.13           │
│ Industry: type 12      ┆ 369   ┆ 0.03794      ┆ 3.79           │
│ Transport: type 1      ┆ 201   ┆ 0.044776     ┆ 4.48           │
│ Trade: type 6          ┆ 631   ┆ 0.045959     ┆ 4.6            │
│ Security Ministries    ┆ 1974  ┆ 0.048632     ┆ 4.86           │
│ University             ┆ 1327  ┆ 0.048983     ┆ 4.9            │
│ Police                 ┆ 2341  ┆ 0.049979     ┆ 5.0            │
│ Military               ┆ 2634  ┆ 0.051253     ┆ 5.13           │
│ Bank                   ┆ 2507  ┆ 0.051855     ┆ 5.19           │
│ XNA                    ┆ 55374 ┆ 0.053996     ┆ 5.4            │
│ Culture                ┆ 379   ┆ 0.055409     ┆ 5.54           │
│ Insurance              ┆ 597   ┆ 0.056951     ┆ 5.7            │
│ Religion               ┆ 85    ┆ 0.058824     ┆ 5.88           │
│ School                 ┆ 8893  ┆ 0.059148     ┆ 5.91           │
│ Trade: type 5          ┆ 49    ┆ 0.061224     ┆ 6.12           │
│ Hotel                  ┆ 966   ┆ 0.064182     ┆ 6.42           │
│ Industry: type 10      ┆ 109   ┆ 0.06422      ┆ 6.42           │
│ Medicine               ┆ 11193 ┆ 0.065845     ┆ 6.58           │
│ Services               ┆ 1575  ┆ 0.066032     ┆ 6.6            │
│ Electricity            ┆ 950   ┆ 0.066316     ┆ 6.63           │
│ Industry: type 9       ┆ 3368  ┆ 0.066805     ┆ 6.68           │
│ Industry: type 5       ┆ 599   ┆ 0.068447     ┆ 6.84           │
│ Government             ┆ 10404 ┆ 0.069781     ┆ 6.98           │
│ Trade: type 2          ┆ 1900  ┆ 0.07         ┆ 7.0            │
│ Kindergarten           ┆ 6880  ┆ 0.070349     ┆ 7.03           │
│ Industry: type 6       ┆ 112   ┆ 0.071429     ┆ 7.14           │
│ Emergency              ┆ 560   ┆ 0.071429     ┆ 7.14           │
│ Industry: type 2       ┆ 458   ┆ 0.072052     ┆ 7.21           │
│ Telecom                ┆ 577   ┆ 0.076256     ┆ 7.63           │
│ Other                  ┆ 16683 ┆ 0.076425     ┆ 7.64           │
│ Transport: type 2      ┆ 2204  ┆ 0.07804      ┆ 7.8            │
│ Legal Services         ┆ 305   ┆ 0.078689     ┆ 7.87           │
│ Housing                ┆ 2958  ┆ 0.079446     ┆ 7.94           │
│ Industry: type 7       ┆ 1307  ┆ 0.080337     ┆ 8.03           │
│ Business Entity Type 1 ┆ 5984  ┆ 0.081384     ┆ 8.14           │
│ Advertising            ┆ 429   ┆ 0.081585     ┆ 8.16           │
│ Postal                 ┆ 2157  ┆ 0.084376     ┆ 8.44           │
│ Business Entity Type 2 ┆ 10553 ┆ 0.085284     ┆ 8.53           │
│ Industry: type 11      ┆ 2704  ┆ 0.086538     ┆ 8.65           │
│ Trade: type 1          ┆ 348   ┆ 0.08908      ┆ 8.91           │
│ Mobile                 ┆ 317   ┆ 0.091483     ┆ 9.15           │
│ Transport: type 4      ┆ 5398  ┆ 0.092812     ┆ 9.28           │
│ Business Entity Type 3 ┆ 67992 ┆ 0.092996     ┆ 9.3            │
│ Trade: type 7          ┆ 7831  ┆ 0.094496     ┆ 9.45           │
│ Security               ┆ 3247  ┆ 0.099784     ┆ 9.98           │
│ Industry: type 4       ┆ 877   ┆ 0.101482     ┆ 10.15          │
│ Self-employed          ┆ 38412 ┆ 0.101739     ┆ 10.17          │
│ Trade: type 3          ┆ 3492  ┆ 0.103379     ┆ 10.34          │
│ Agriculture            ┆ 2454  ┆ 0.104727     ┆ 10.47          │
│ Realtor                ┆ 396   ┆ 0.106061     ┆ 10.61          │
│ Industry: type 3       ┆ 3278  ┆ 0.106162     ┆ 10.62          │
│ Industry: type 1       ┆ 1039  ┆ 0.110683     ┆ 11.07          │
│ Cleaning               ┆ 260   ┆ 0.111538     ┆ 11.15          │
│ Construction           ┆ 6721  ┆ 0.116798     ┆ 11.68          │
│ Restaurant             ┆ 1811  ┆ 0.117062     ┆ 11.71          │
│ Industry: type 8       ┆ 24    ┆ 0.125        ┆ 12.5           │
│ Industry: type 13      ┆ 67    ┆ 0.134328     ┆ 13.43          │
│ Transport: type 3      ┆ 1187  ┆ 0.15754      ┆ 15.75          │
└────────────────────────┴───────┴──────────────┴────────────────┘

```

</div>


The risk stratification table confirms that `ORGANIZATION_TYPE` is a powerful predictor. We see a massive spread in default rates, ranging from **3%** (safest) to nearly **16%** (riskiest). This variance is exactly what a machine learning model needs to discriminate between good and bad borrowers.

**1. The "Safe Havens" (State & Stability)**
The safest borrowers are consistently found in stable, often state-funded sectors.

* **Security Ministries (4.86%), Police (5.0%), Military (5.13%):** These default rates are nearly **half** of the global average (8.07%).
* **Bank (5.19%) & University (4.9%):** White-collar professionals in established institutions also show excellent repayment behavior.
* **XNA (5.4%):** This confirms our earlier hypothesis. The 55,000 "XNA" applicants (likely pensioners) are among the safest groups. Their fixed pension income makes them reliable borrowers compared to the active workforce.

**2. The "Danger Zones" (Volatility & Labor)**
On the other end of the spectrum, we see industries characterized by income volatility or manual labor.

* **Transport: type 3 (15.75%):** This is the single riskiest category, with a default rate **double** the global average.
* **Construction (11.68%) & Restaurant (11.71%):** These sectors are economically sensitive. A construction worker or waiter is more likely to face irregular income, leading to higher default rates.
* **Self-employed (10.17%):** With a massive sample size of 38,000, this is a significant finding. Self-employed individuals are statistically **25% riskier** than the average applicant.

**3. The Statistical Trap (Why we need WoE)**
Look at the very top and bottom rows:

* **Safest:** `Trade: type 4` (3.13%) — *But only 64 people.*
* **Riskiest:** `Industry: type 8` (12.5%) — *But only 24 people.*

These extreme values are likely statistical flukes caused by small sample sizes. If we fed these raw numbers to a model, it would overreact. This perfectly justifies our next step: **Weight of Evidence (WoE) with Smoothing**. The smoothing will pull these "tiny" categories closer to the global average (8.07%), preventing the model from making extreme decisions based on just 24 people.

**Next Step:**
Now that we have proven the risk varies by industry (and identified the small-sample danger), we will mathematically encode this using the smoothed WoE formula.


###  Weight of Evidence (WoE) Encoding for `ORGANIZATION_TYPE` 


We have established that `ORGANIZATION_TYPE` is a high-cardinality feature (58 categories) with a strong correlation to default risk. However, machine learning models cannot understand text strings like "Police" or "Construction." Our aim here is to convert these qualitative labels into quantitative "Risk Scores" without exploding the dataset size (which One-Hot Encoding would do).

To do this, we are applying a statistical technique called **Weight of Evidence (WoE)**.

This transformation aims to:

1. **Quantify Risk:** Convert categories into a continuous number where a **positive value** indicates a "Safe" job (higher probability of repayment) and a **negative value** indicates a "Risky" job (higher probability of default).
2. **Handle Rare Categories:** By using **Laplace Smoothing** (adding `+0.5` to our counts), we prevent mathematical errors (division by zero) and stabilize the scores for those tiny industries we found earlier (like `Industry: type 8` with only 24 people). This ensures our model doesn't panic and overfit to small sample sizes.
3. **Linearize the Signal:** WoE scales the data in a way that makes it easier for linear models and gradient boosting trees to distinguish between good and bad borrowers efficiently.

<details>
<summary>Click here to see the WoE Encoding Code</summary>

```python
print("Calculating Weight of Evidence (WoE) for Organization Type...")

# --- 1. SAFE RESET (Fixes the Duplicate Error) ---
# If we already created this column, drop it so we can start fresh.
if "ORGANIZATION_TYPE_WoE" in df.columns:
    print("   Removing existing WoE column to avoid duplicates...")
    df = df.drop("ORGANIZATION_TYPE_WoE")

# --- 2. CALCULATE GLOBAL COUNTS ---
total_goods = df.filter(pl.col("TARGET") == 0).height
total_bads = df.filter(pl.col("TARGET") == 1).height

# --- 3. CALCULATE WoE TABLE ---
woe_df = (
    df.group_by("ORGANIZATION_TYPE")
    .agg([
        pl.len().alias("n_total"),
        pl.col("TARGET").sum().alias("n_bad"),
        (pl.len() - pl.col("TARGET").sum()).alias("n_good")
    ])
    .filter(pl.col("n_total") > 0)
)

# Apply Laplace Smoothing (+0.5) to handle zeros
woe_df = woe_df.with_columns(
    (pl.col("n_good") + 0.5).alias("n_good_smooth"),
    (pl.col("n_bad") + 0.5).alias("n_bad_smooth")
)

# Calculate WoE Log-Odds
woe_df = woe_df.with_columns(
    (
        np.log(
            (pl.col("n_good_smooth") / total_goods) / 
            (pl.col("n_bad_smooth") / total_bads)
        )
    ).alias("ORGANIZATION_TYPE_WoE")
)

# --- 4. MERGE BACK SAFELY ---
df = df.join(
    woe_df.select(["ORGANIZATION_TYPE", "ORGANIZATION_TYPE_WoE"]), 
    on="ORGANIZATION_TYPE", 
    how="left"
)

# --- 5. CHECK RESULTS ---
print("\nWoE Transformation Complete.")
print("Top 5 Safest Jobs (High WoE):")
print(df.select(["ORGANIZATION_TYPE", "ORGANIZATION_TYPE_WoE"]).unique().sort("ORGANIZATION_TYPE_WoE", descending=True).head(5))

print("\nTop 5 Riskiest Jobs (Low WoE):")
print(df.select(["ORGANIZATION_TYPE", "ORGANIZATION_TYPE_WoE"]).unique().sort("ORGANIZATION_TYPE_WoE", descending=False).head(5))
```

</details>

**Output:**

<div style="max-height: 400px; overflow-y: auto;"> 

```
Calculating Weight of Evidence (WoE) for Organization Type...

WoE Transformation Complete.
Top 5 Safest Jobs (High WoE):
shape: (5, 2)
┌─────────────────────┬───────────────────────┐
│ ORGANIZATION_TYPE   ┆ ORGANIZATION_TYPE_WoE │
│ ---                 ┆ ---                   │
│ str                 ┆ f64                   │
╞═════════════════════╪═══════════════════════╡
│ Trade: type 4       ┆ 0.78639               │
│ Industry: type 12   ┆ 0.766891              │
│ Trade: type 6       ┆ 0.584212              │
│ Transport: type 1   ┆ 0.576319              │
│ Security Ministries ┆ 0.5362                │
└─────────────────────┴───────────────────────┘

Top 5 Riskiest Jobs (Low WoE):
shape: (5, 2)
┌───────────────────┬───────────────────────┐
│ ORGANIZATION_TYPE ┆ ORGANIZATION_TYPE_WoE │
│ ---               ┆ ---                   │
│ str               ┆ f64                   │
╞═══════════════════╪═══════════════════════╡
│ Transport: type 3 ┆ -0.758009             │
│ Industry: type 8  ┆ -0.617196             │
│ Industry: type 13 ┆ -0.614751             │
│ Restaurant        ┆ -0.413981             │
│ Construction      ┆ -0.409931             │
└───────────────────┴───────────────────────┘

```

</div>

The WoE transformation has successfully converted our qualitative job labels into a quantitative "Risk Score." The results provide a clear mathematical validation of our risk hypothesis.

**1. The "Scale of Safety" (Understanding the Score)**
The WoE values center around **0.0**.

* **Positive values (> 0)** indicate "Good" borrowers (lower default rates than the population average).
* **Negative values (< 0)** indicate "Bad" borrowers (higher default rates).
* The magnitude tells us the strength. A score of `+0.78` is a massive indicator of safety, while `-0.75` is a screaming red flag for risk.

**2. Validation of Safe Jobs (Positive WoE)**

* **`Trade: type 4` (+0.78) & `Industry: type 12` (+0.76):** These categories received the highest scores, meaning applicants from these fields are statistically the least likely to default.
* **`Security Ministries` (+0.53):** This is the most important finding here. Unlike the smaller "Trade" categories, this is a large, stable government sector. Its strong positive score confirms that state employment acts as a massive "protective factor" against default.

**3. Validation of Risky Jobs (Negative WoE)**

* **`Transport: type 3` (-0.75):** This is the single strongest risk indicator in the entire feature. An applicant listing this job is heavily penalized by the model.
* **`Restaurant` (-0.41) & `Construction` (-0.40):** The presence of these major industries in the bottom 5 is a "sanity check" for our method. These sectors are known for high turnover and income volatility. The model now correctly quantifies that working in Construction is statistically "riskier" than working for the Government (WoE -0.40 vs +0.53).


##  Batch Weight of Evidence (WoE) Transformation

We have successfully tested the WoE logic on `ORGANIZATION_TYPE`. Now, our objective is to scale this solution. We have other complex categorical columns—specifically `OCCUPATION_TYPE` and `most_freq_seller_industry_prev`—that suffer from the same issues: too many categories to One-Hot Encode and potentially valuable patterns hidden in the missing values.

My goal in this code is to automate the risk scoring for these columns. Instead of writing separate code blocks for each one, I am creating a robust loop that:

1. **Calculates Risk Scores:** Converts text labels (e.g., "Accountants") into numeric WoE values.
2. **Captures the "Silence":** This is the most critical technical detail. Instead of deleting missing values or guessing what they are, I am explicitly filling them with the text `"MISSING"`.
* *Hypothesis:* In credit risk, an applicant who *refuses* to state their occupation might be riskier than one who proudly lists "Accountant." By treating "MISSING" as its own category, the WoE formula will calculate a specific risk score for "people who didn't tell us."


3. **Applies Smoothing:** We continue to use Laplace Smoothing (+0.5) to ensure that small categories don't break the model.

By the end of this loop, these columns will be fully converted into numeric features, ready for the machine learning model.


<details>
<summary>Click here to see the Batch WoE Code</summary>

```python

# List of columns to transform
cols_to_woe = ["OCCUPATION_TYPE", "most_freq_seller_industry_prev"]

print(f" Starting WoE Transformation for {len(cols_to_woe)} columns...")

# 1. CALCULATE GLOBAL COUNTS (Needed for the formula)
total_goods = df.filter(pl.col("TARGET") == 0).height
total_bads = df.filter(pl.col("TARGET") == 1).height

# 2. LOOP THROUGH COLUMNS
for col in cols_to_woe:
    woe_col_name = f"{col}_WoE"
    
    # --- A. CLEANUP (Prevent DuplicateError) ---
    if woe_col_name in df.columns:
        print(f"   ⟳  Refreshing existing column: {woe_col_name}")
        df = df.drop(woe_col_name)
    else:
        print(f"   Creating new column: {woe_col_name}")

    # --- B. HANDLE MISSING VALUES ---
    # We treat 'Null' as a specific category called 'MISSING' so it gets a score.
    # (We cast to String first to ensure we can modify it)
    if df.schema[col] != pl.String:
        df = df.with_columns(pl.col(col).cast(pl.String))
        
    df = df.with_columns(pl.col(col).fill_null("MISSING"))

    # --- C. CALCULATE STATS ---
    woe_stats = (
        df.group_by(col)
        .agg([
            pl.len().alias("n_total"),
            pl.col("TARGET").sum().alias("n_bad"),
            (pl.len() - pl.col("TARGET").sum()).alias("n_good")
        ])
    )

    # --- D. APPLY FORMULA (With Smoothing) ---
    woe_stats = woe_stats.with_columns(
        (pl.col("n_good") + 0.5).alias("n_good_smooth"),
        (pl.col("n_bad") + 0.5).alias("n_bad_smooth")
    ).with_columns(
        (np.log(
            (pl.col("n_good_smooth") / total_goods) / 
            (pl.col("n_bad_smooth") / total_bads)
        )).alias(woe_col_name)
    )

    # --- E. JOIN BACK ---
    df = df.join(
        woe_stats.select([col, woe_col_name]),
        on=col,
        how="left"
    )

    # --- F. SHOW REPORT ---
    print(f"       Done. Range: {df[woe_col_name].min():.2f} to {df[woe_col_name].max():.2f}")
    
    # Show Top 3 Safest vs Riskiest
    print(f"      [Safest]   {df.select([col, woe_col_name]).unique().sort(woe_col_name, descending=True).head(3)[col].to_list()}")
    print(f"      [Riskiest] {df.select([col, woe_col_name]).unique().sort(woe_col_name, descending=False).head(3)[col].to_list()}")
    print("-" * 50)

print("\nAll WoE transformations complete.")
```

</details>

**Output:**

<div style="max-height: 400px; overflow-y: auto;">

```
 Starting WoE Transformation for 2 columns...
   Creating new column: OCCUPATION_TYPE_WoE
       Done. Range: -0.86 to 0.55
      [Safest]   ['Accountants', 'High skill tech staff', 'Managers']
      [Riskiest] ['Low-skill Laborers', 'Drivers', 'Waiters/barmen staff']
--------------------------------------------------
   Creating new column: most_freq_seller_industry_prev_WoE
       Done. Range: -0.22 to 0.72
      [Safest]   ['MLM partners', 'Tourism', 'Clothing']
      [Riskiest] ['Jewelry', 'Auto technology', 'Connectivity']
--------------------------------------------------

All WoE transformations complete.
```
</div>



The results of our batch loop are excellent. We have successfully extracted strong risk signals from both categorical columns, and the specific rankings align perfectly with credit risk intuition.

**1. Occupation Type: The Socioeconomic Ladder**
The `OCCUPATION_TYPE_WoE` scores show a massive range (from `-0.86` to `+0.55`), confirming this is a critical predictor.

* **The Safest (+WoE):** `Accountants`, `High skill tech staff`, and `Managers`. These are white-collar roles typically associated with higher, stable salaries and financial literacy. The model now "knows" these are safe bets.
* **The Riskiest (-WoE):** `Low-skill Laborers` (`-0.86`) is the single riskiest category we've found so far. `Drivers` and `Waiters` also show negative scores. These roles often involve variable shifts, tips-based income, or lower job security, which correlates with default risk.

**2. Previous Seller Industry: Spending Habits**
The `most_freq_seller_industry_prev_WoE` feature tells us about the applicant's past consumption behavior.

* **The Riskiest (-WoE):** `Connectivity` (likely mobile phones/electronics) and `Jewelry`. This is a classic pattern in consumer finance: people taking out loans specifically to buy the latest iPhone or expensive jewelry are statistically much more likely to default than those borrowing for other needs.
* **The Safest (+WoE):** `Tourism` and `Clothing`. Applicants who have previously taken loans for travel (Tourism) likely have disposable income, signaling financial health.


###  Dropping Redundant Columns

We have successfully extracted the risk signal from our complex categorical variables (`ORGANIZATION_TYPE`, `OCCUPATION_TYPE`, etc.) and stored it in our new numeric `_WoE` columns.

My objective here is to **remove redundancy**. The original text columns are now "dead weight"—they contain the same information as the WoE columns but in a format (strings) that the model cannot understand without further processing.

* **Efficiency:** Keeping them would be wasteful. If we kept them, we would have to One-Hot Encode them later, which would undo all our hard work by exploding the dataset size again.
* **Verification:** This code also serves as a final safety check. I print the list of `_WoE` columns to confirm that while I am deleting the *raw* data, I am definitely keeping the *engineered* features.

<details>
<summary>Click here to see the code for dropping redundant columns</summary>

```python
# 1. Define columns to remove (Original Categoricals)
cols_to_remove = [
    "ORGANIZATION_TYPE", 
    "OCCUPATION_TYPE", 
    "most_freq_seller_industry_prev"
]

print(f"Dropping {len(cols_to_remove)} original categorical columns...")

# 2. Execute Drop
# We check existence first to prevent errors if you run this cell twice
existing_cols_to_drop = [c for c in cols_to_remove if c in df.columns]

if existing_cols_to_drop:
    df = df.drop(existing_cols_to_drop)
    print("Drop complete.")
else:
    print("Columns already dropped.")

# 3. Verify the WoE columns remain
woe_cols = [c for c in df.columns if "_WoE" in c]
print(f"\nRemaining WoE Features: {woe_cols}")
print(f"Current DataFrame Shape: {df.shape}")

```

</details>

**Output:**

```
Dropping 3 original categorical columns...
Drop complete.

Remaining WoE Features: ['ORGANIZATION_TYPE_WoE', 'OCCUPATION_TYPE_WoE', 'most_freq_seller_industry_prev_WoE']
Current DataFrame Shape: (307511, 146)
```

##  Final Label Encoding for Remaining Categoricals

We have already handled the "difficult" high-cardinality columns using WoE. However, we still have several "simple" categorical features remaining in the dataset, such as `CODE_GENDER`, `NAME_FAMILY_STATUS`, and `FLAG_OWN_CAR`.

My objective here is to convert these remaining text columns into integers (0, 1, 2...) so the machine learning model can process them.

* **Method:** I am using **Label Encoding** (via Polars' `.to_physical()` method).  Unlike One-Hot Encoding, this does not create new columns. It simply maps "Male" to `0` and "Female" to `1`.
* **Why this works:** Modern tree-based models like LightGBM and XGBoost are smart enough to handle integer-encoded categories natively. They don't need the data to be expanded into dummy variables.
* **Handling Nulls:** Instead of leaving holes in the data, I fill missing values with `"MISSING_CATEGORY"` before encoding. This assigns a specific integer ID to "Missing," allowing the model to learn if *not answering a question* is itself a risk factor.

The final block acts as a "Gatekeeper": it scans the entire dataset one last time to confirm that **zero** string columns remain.

<details>
<summary>Click here to see label encoding</summary>

```python
# 1. Identify Remaining Categorical Columns
# We verify ensuring we don't accidentally encode numeric cols
cat_cols = [
    c for c, t in df.schema.items() 
    if t in (pl.String, pl.Object, pl.Categorical)
]

print(f"Found {len(cat_cols)} categorical columns to encode: {cat_cols}")

# 2. Apply Label Encoding (Preserving Nulls)
for col in cat_cols:
    # A. Fill Nulls with specific placeholder (Captures the "Missing Risk")
    # B. Cast to Categorical (Polars creates the mapping)
    # C. Cast to Physical (Converts to integer IDs: 0, 1, 2...)
    df = df.with_columns(
        pl.col(col)
        .fill_null("MISSING_CATEGORY") 
        .cast(pl.Categorical)
        .to_physical()
        .alias(col)
    )

# 3. Final Verification
print("\nENCODING COMPLETE.")
print("-" * 30)

# Check for any remaining non-numeric columns
non_numeric = [c for c, t in df.schema.items() if t == pl.String or t == pl.Object]

if len(non_numeric) == 0:
    print("SUCCESS: Dataset is 100% Numeric. Ready for LightGBM/XGBoost.")
else:
    print(f"WARNING: Some columns remain non-numeric: {non_numeric}")

print(f"Final Data Shape: {df.shape}")

```

</details>


**Output:**

```
Found 14 categorical columns to encode: ['NAME_CONTRACT_TYPE', 'CODE_GENDER', 'FLAG_OWN_CAR', 'FLAG_OWN_REALTY', 'NAME_TYPE_SUITE', 'NAME_INCOME_TYPE', 'NAME_EDUCATION_TYPE', 'NAME_FAMILY_STATUS', 'NAME_HOUSING_TYPE', 'WEEKDAY_APPR_PROCESS_START', 'FONDKAPREMONT_MODE', 'HOUSETYPE_MODE', 'WALLSMATERIAL_MODE', 'last_rejection_reason_prev']

ENCODING COMPLETE.
------------------------------
SUCCESS: Dataset is 100% Numeric. Ready for LightGBM/XGBoost.
Final Data Shape: (307511, 146)

```


##  Final Cleanup and WoE Verification

After performing multiple merge operations to add our new Weight of Evidence (WoE) features, we must check for "merge artifacts." In dataframe operations, joining tables can sometimes accidentally create duplicate columns (often suffixed with `_right` or `_dup`) if the join keys aren't perfectly handled.

My objective here is to:

1. **Remove Duplicates:** I am running a scan to automatically find and delete any columns ending in `_right`. This ensures the dataset is clean and we don't have two versions of the same variable confusing the model.
2. **Verify Feature Engineering:** I explicitly check that our three critical new features (`ORGANIZATION_TYPE_WoE`, `OCCUPATION_TYPE_WoE`, etc.) are actually present in the final dataframe. This is a "Sanity Check"—if these columns are missing, it means our previous engineering steps failed silently, and we need to know that *now* before we try to train a model.


<details>
<summary>Click here to see the final cleanup code</summary>

```python
# 1. Identify Columns to Drop (Ending in '_right')
cols_to_drop = [c for c in df.columns if c.endswith("_right")]

if cols_to_drop:
    print(f"Found duplicate columns to clean: {cols_to_drop}")
    df = df.drop(cols_to_drop)
    print("Duplicates removed.")
else:
    print("No '_right' duplicates found.")

# 2. Verify Final WoE Columns
# We want to make sure we have exactly one of each expected WoE column
expected_woe = [
    "ORGANIZATION_TYPE_WoE", 
    "OCCUPATION_TYPE_WoE", 
    "most_freq_seller_industry_prev_WoE"
]

print("\n--- Final WoE Column Check ---")
for col in expected_woe:
    if col in df.columns:
        print(f"{col} is present.")
    else:
        print(f"WARNING: {col} is MISSING. You may need to re-run the WoE calculation cell.")

print(f"\nFinal Shape: {df.shape}")
```

</details>

**Output:**

```
No '_right' duplicates found.

--- Final WoE Column Check ---
ORGANIZATION_TYPE_WoE is present.
OCCUPATION_TYPE_WoE is present.
most_freq_seller_industry_prev_WoE is present.

Final Shape: (307511, 146)
```


##  Final Data Readiness Scan


We have finished all our cleaning, encoding, and feature engineering. However, before we feed this large dataset into a sensitive algorithm like LightGBM or XGBoost, we must perform a **"Pre-Flight Check"** (Unit Test). Machine learning models are fragile; a single "String" hidden in column 100 or a single "Infinity" value can cause the entire training process to crash after hours of computation.

My objective here is to automatically verify three critical technical constraints:

1. **Type Consistency (The Numeric Check):**
* **What we do:** We scan every column to ensure it is strictly numeric (Float, Integer, or Boolean).
* **Why:** If we missed even one categorical column (e.g., a "Date" string we forgot to drop), the model will throw a `TypeError` and fail immediately.


2. **Mathematical Stability (The Infinity Check):**
* **What we do:** We scan all floating-point columns for `inf` or `-inf` values.
* **Why:** In our feature engineering (e.g., `ratio_annuity_to_income`), we might have divided by zero. If the model sees "Infinity," it cannot calculate gradients (math breaks down), leading to `NaN` losses or crashes.


3. **Target Validity (The Label Check):**
* **What we do:** We verify that the `TARGET` column exists and contains exactly two classes: `0` (Repaid) and `1` (Default).
* **Why:** This ensures we didn't accidentally drop our prediction label during the earlier cleaning steps. We also calculate the balance (e.g., 8% default rate) to confirm the data looks realistic.



**System Status:**
The final block acts as a master switch. It only prints **"SYSTEM STATUS: GO"** if all three checks pass. This gives us 100% confidence to proceed to the Model Training stage.

<details>
<summary>Click here to see the code</summary>

```python
print("STARTING FAST DATA READINESS SCAN...\n")

# 1. TYPE CHECK
# ---------------------------------------------------------
# We check if any column is NOT numeric (Number, Float, Int)
non_numeric_cols = df.select(
    ~cs.numeric() & ~cs.boolean() # Exclude numbers and booleans
).columns

if len(non_numeric_cols) > 0:
    print(f"CRITICAL FAIL: Found {len(non_numeric_cols)} non-numeric columns.")
    print(f"   Must Encode/Drop: {non_numeric_cols}")
else:
    print("TYPE CHECK: All columns are numeric.")


# 2. INFINITY CHECK (Vectorized)
# ---------------------------------------------------------
print("Checking for Infinity values (One-shot scan)...")

# Only Floats can be infinite (Integers cannot), so we only scan Float columns
float_cols = [c for c, t in df.schema.items() if t in (pl.Float32, pl.Float64)]

if float_cols:
    # Build a SINGLE query to sum infinity for all float columns at once
    inf_stats = df.select([
        pl.col(c).is_infinite().sum().alias(c) for c in float_cols
    ])
    
    # Transpose to find the offenders
    inf_summary = (
        inf_stats.transpose(include_header=True, header_name="Column", column_names=["Inf_Count"])
        .filter(pl.col("Inf_Count") > 0)
    )

    if inf_summary.height > 0:
        print(f"MATH FAIL: Found {inf_summary.height} columns with Infinity.")
        print("   Run the 'Fix Infinity' block below.")
        with pl.Config(tbl_rows=10):
            print(inf_summary)
        inf_count = inf_summary.height
    else:
        print("MATH CHECK: No infinite values found.")
        inf_count = 0
else:
    print("MATH CHECK: No Float columns to check (all Integers).")
    inf_count = 0


# 3. TARGET CHECK
# ---------------------------------------------------------
if "TARGET" in df.columns:
    # Use fast aggregation instead of unique().to_list()
    target_stats = df.group_by("TARGET").len().sort("TARGET")
    
    # Check if we have 0 and 1
    targets = target_stats["TARGET"].to_list()
    
    if targets == [0, 1] or targets == [0.0, 1.0]:
        print(f"TARGET CHECK: Valid Binary Target {targets}")
        
        # Calculate Balance
        count_0 = target_stats.filter(pl.col("TARGET") == 0)["len"][0]
        count_1 = target_stats.filter(pl.col("TARGET") == 1)["len"][0]
        ratio = count_1 / (count_0 + count_1)
        print(f"   Balance: {ratio:.2%} Default Rate (Safely Imbalanced)")
    else:
        print(f"TARGET FAIL: Strange values found: {targets}")
else:
    print("TARGET FAIL: 'TARGET' column is MISSING!")


# 4. FINAL STATUS
# ---------------------------------------------------------
print("\n" + "="*30)
if len(non_numeric_cols) == 0 and inf_count == 0 and "TARGET" in df.columns:
    print("SYSTEM STATUS: GO. READY FOR TRAINING.")
else:
    print("SYSTEM STATUS: NO_GO. FIX ERRORS ABOVE.")
print("="*30)
```


</details>


**Output:**

```
STARTING FAST DATA READINESS SCAN...

TYPE CHECK: All columns are numeric.
Checking for Infinity values (One-shot scan)...
MATH CHECK: No infinite values found.
TARGET CHECK: Valid Binary Target [0, 1]
   Balance: 8.07% Default Rate (Safely Imbalanced)

==============================
SYSTEM STATUS: GO. READY FOR TRAINING.
==============================
``` 

##  Save Cleaned Data to Parquet

We have successfully cleaned, encoded, and validated our dataset. It is now ready for machine learning. However, we do not want to re-run this entire 15-step cleaning pipeline every time we want to train a model or tune hyperparameters.

My objective here is to **"Checkpoint"** our work.

* **Why Parquet?** I am saving the data as a `.parquet` file rather than a `.csv`. Parquet is a binary, columnar format that is significantly faster to read/write and, most importantly, **preserves data types**.
* If I saved as CSV, my integer categories (0, 1, 2) might get reloaded as floats (0.0, 1.0), breaking the optimization. Parquet guarantees the schema remains identical.


* **Compression:** Using `zstd` compression keeps the file size small without sacrificing read speed.


<details>
<summary>Click here to see the code</summary>

```python
# 5. SAVE CLEANED DATA
output_path = "/home/vasif/Desktop/Home-Credit-Risk-Analysis/parquet_files/home_credit_train_cleaned.parquet"
print(f"Saving cleaned dataset to: {output_path} ...")

try:
    # We use zstd compression for a good balance of speed and file size
    df.write_parquet(output_path, compression="zstd")
    print("Save complete. Checkpoint created.")
    
    # Optional: Verify file size to confirm it wrote something substantial
    import os
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"File Size: {size_mb:.2f} MB")
    
except Exception as e:
    print(f"Error saving file: {e}")
```

</details>

**Output:**

```
Saving cleaned dataset to: /home/vasif/Desktop/Home-Credit-Risk-Analysis/parquet_files/home_credit_train_cleaned.parquet ...
Save complete. Checkpoint created.
File Size: 54.41 MB
```


##  Conclusion

We have successfully completed the Data Cleaning and Feature Engineering phase. The dataset is now in a pristine, numeric format with powerful new features that capture the underlying risk patterns in the data. We have also implemented robust checks to ensure data integrity and prevent common pitfalls that could cause model training to fail.

We applied advanced techniques like Weight of Evidence (WoE) to extract maximum signal from high-cardinality categorical variables, and we have verified that our transformations align with credit risk intuition. 

The final dataset is saved as a Parquet file, ready for the next phase: **Model Training and Evaluation**. In the next notebook, we will load this cleaned data and apply state-of-the-art algorithms like LightGBM and XGBoost to build our predictive model. We will also perform hyperparameter tuning and evaluate our model's performance using metrics like AUC-ROC and F1 Score. Stay tuned for the next chapter where we will turn this clean data into actionable insights and predictions!












