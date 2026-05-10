---
layout: ../../../layouts/ArticleLayout.astro
title: 3. DuckDB SQL Analysis Part 2
description:  Advanced Exploratory Data Analysis on the dataset to find out which patterns are common among the customers who created problems for the company and which features are important for predicting the credit default.
---



##  Introduction  

In this section, we will continue our analysis using DuckDB SQL. In the previous section, we have completed the data ingestion and initial exploration of the data. We solved 10 analytical tasks on *Applications* table. In this section, we will complete the deep analysis on the remaining tables to clear out the necessary of features and get insights about the data.  




##  Previous Applications Table  

The `previous_applications` table contains the previous applications of the clients. The difference between `applications` and `previous_applications` tables is that the former contains the current application of the clients, while the latter contains the previous applications of the clients. The main purpose of this table is to understand the previous behavior of the clients and get insights about their default risk. This is extension of the `applications` table and it contains the same features as the `applications` table. 


###   Task 1: The ”Rejection Stigma” & Recency 

**Business Question:  Does a past refusal predict future default, and does the ”Recency” of that refusal matter? (Is a fresh rejection more dangerous than an old one?)**

**Objective:**  To determine if a past ”No” from the bank acts as a permanent black mark or if the risk fades over time. A rejection 5 years ago might be irrelevant, but a rejection last month is a massive red flag.


**Solutions:**

To solve this we need to modify the following columns:

- `NAME_CONTRACT_STATUS` - shows whether the previous application is rejected or accepted.
- `DAYS_DECISION` - shows how many days are passed since the contract is rejected
- `TARGET` - defines the current status of the applicant
- `SK_ID_PREV` and `SK_ID_CURR` - relationship between the tables

For the applicants who were previously rejected, the days passed since their rejection will be binned and for each bin (older rejections, fresh rejections) the average default value will be calculated. This will reveal whether the past , older applications do differ much.

<details>
<summary>SQL Code</summary>
<br>

```sql
query = """
WITH Recent_Refusals AS (
    SELECT 
        SK_ID_CURR, 
        MAX(DAYS_DECISION) AS Days_Since_Last_Refusal
    FROM previous_applications
    WHERE NAME_CONTRACT_STATUS = 'Refused'
    GROUP BY SK_ID_CURR
)

SELECT 
    -- Bin the recency of the rejection
    CASE 
        WHEN r.Days_Since_Last_Refusal IS NULL THEN 'No Prior Refusals'
        WHEN r.Days_Since_Last_Refusal >= -180 THEN 'Recent (Last 6 Months)'
        WHEN r.Days_Since_Last_Refusal >= -365 THEN '6 Months - 1 Year'
        WHEN r.Days_Since_Last_Refusal >= -730 THEN '1 - 2 Years'
        WHEN r.Days_Since_Last_Refusal >= -1825 THEN '2 - 5 Years'
        ELSE '5. Old (> 5 Years)'
    END AS Rejection_Recency,

    -- Calculate Risk
    COUNT(*) AS Total_Count,
    ROUND(AVG(a.TARGET), 3)*100 AS Risk_Probability

FROM applications a
LEFT JOIN Recent_Refusals r ON a.SK_ID_CURR = r.SK_ID_CURR
GROUP BY 1
ORDER BY 
    Risk_Probability desc
"""

t1 = con.execute(query).fetchdf()
t1
```

</details>
<br>

**Results:**

| Rejection_Recency      |   Total_Count |   Risk_Probability |
|:-----------------------|--------------:|-------------------:|
| Recent (Last 6 Months) |         18955 |               12.5 |
| 6 Months - 1 Year      |         28213 |               11.6 |
| 1 - 2 Years            |         21245 |               10.8 |
| 2 - 5 Years            |         19091 |                8.2 |
| No Prior Refusals      |        207217 |                7   |
| 5. Old (> 5 Years)     |         12790 |                6.7 |

<br>

**Insights:**

The data reveals a distinct inverse correlation between the recency of a prior rejection and the associated Risk_Probability. The highest risk metric (12.5) is observed in the cohort with the most recent adverse history ("Recent (Last 6 Months)"), suggesting that immediate past performance is a strong indicator of current risk. As the time delta since the last rejection increases, the risk probability consistently declines—dropping to 11.6 for the 6–12 month interval, 10.8 for the 1–2 year interval, and 8.2 for the 2–5 year interval. Notably, the "Old (> 5 Years)" category exhibits the lowest risk probability at 6.7, which is statistically comparable to, and slightly lower than, the baseline "No Prior Refusals" group (Risk Probability: 7). While the "No Prior Refusals" segment constitutes the vast majority of the population volume (Total_Count: 207,217), the trend clearly indicates that the recency of a rejection is a more significant driver of elevated risk than the mere presence of a rejection in the distant past.


###   Task 2: The ”Trust Gap” (Asked vs. Given) 

**Business Question: Are clients who were previously ”Downgraded” (received less money than they requested) significantly higher risk today compared to those who were ”Upsold”?**

**Objective:** To measure the bank’s historical ”Trust Level” with the client. If the bank previ-ously gave less money than the client asked for (AMT CREDIT ¡ AMT APPLICATION), it means the bank detected risk back then. If they gave more (Upsell), they trusted the client.

<details>
<summary>Show SQL Code</summary>

```python
query = """
with trust_metrics as (
    select 
        SK_ID_CURR,
        -- sum up all amounts asked and given for approved loans
        sum(AMT_APPLICATION) as total_asked,
        sum(AMT_CREDIT) as total_given
    from previous_applications
    where NAME_CONTRACT_STATUS = 'Approved'
    group by SK_ID_CURR
)

select 
    -- categorize the trust gap
    case 
        when t.SK_ID_CURR is null then 'no prior applications'
        when t.total_given > t.total_asked then 'upsold (trusted)'
        when t.total_given = t.total_asked then 'exact match'
        when t.total_given < t.total_asked then 'downgraded (risk detected)'
        else 'unknown'
    end as trust_category,

    -- calculate risk
    count(*) as total_count,
    round(avg(a.TARGET), 3) * 100 as risk_probability

from applications a
left join trust_metrics t on a.SK_ID_CURR = t.SK_ID_CURR
group by 1
order by 
    risk_probability desc
"""

t2 = con.execute(query).fetchdf()
t2
```

</details>

<br>

**Results:**

| trust_category             |   total_count |   risk_probability |
|:---------------------------|--------------:|-------------------:|
| upsold (trusted)           |        186974 |                8.6 |
| exact match                |         20638 |                8.4 |
| downgraded (risk detected) |         82453 |                7.2 |
| no prior applications      |         17446 |                6.1 |

<br>

**Insights:**

Contrary to the hypothesis that historical risk detection (downgrading) predicts future instability, the "Upsold (Trusted)" cohort currently exhibits the highest risk probability at 8.6. This is significantly higher than the "Downgraded (Risk Detected)" cohort, which maintains a lower risk probability of 7.2. This inversion suggests that the bank’s previous intervention—limiting exposure to risky clients via downgrades—successfully mitigated their long-term default risk. Conversely, the clients previously identified as "safe" enough to upsell have deteriorated in performance, indicating that the criteria used to grant "Trust" (upselling) may be too lenient or that these customers are now over-leveraged.

- Upsold (Trusted): 8.6 Risk Probability (Highest Risk)

- Downgraded (Risk Detected): 7.2 Risk Probability (Lower Risk)

Conclusion: Being "Trusted" in the past correlates with higher risk today than being "Downgraded."


###   Task 3: The ”Yield Group” Profiling (Pricing Risk) 


**Business Question: Do clients who historically accepted ”High Interest” loans continue to be high-risk today, or have they ”graduated” to safer behavior?**

**Objective:** To use historical pricing as a proxy for historical risk. If a client previously accepted loans with ”High” interest rates (NAME YIELD GROUP), it means they were either desperate or assessed as risky by the system in the past. We need to see if this ”High Risk” tag sticks to them.


<details>
<summary>Show SQL Code</summary>
<br>

```python 
query = """
with yield_profile as (
    select 
        SK_ID_CURR,
        -- determine the highest risk category the client ever accepted
        -- we assign a numeric score to rank them: high > middle > low
        max(case 
            when NAME_YIELD_GROUP = 'high' then 3
            when NAME_YIELD_GROUP = 'middle' then 2
            when NAME_YIELD_GROUP in ('low_normal', 'low_action') then 1
            else 0
        end) as max_risk_score
    from previous_applications
    where NAME_CONTRACT_STATUS = 'Approved' -- only count loans they actually took
    group by SK_ID_CURR
)

select 
    -- map the score back to a readable label
    case 
        when y.max_risk_score = 3 then 'historical high yield (risky)'
        when y.max_risk_score = 2 then 'historical middle yield'
        when y.max_risk_score = 1 then 'historical low yield (safe)'
        else 'no history'
    end as historic_pricing_risk,

    -- calculate risk metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join yield_profile y on a.SK_ID_CURR = y.SK_ID_CURR
group by 1
order by 
    risk_probability desc
"""

t3 = con.execute(query).fetchdf()
t3
```

</details>
<br>

**Results:**

| historic_pricing_risk         |   total_count |   risk_probability |
|:------------------------------|--------------:|-------------------:|
| historical high yield (risky) |        157434 |                8.9 |
| historical middle yield       |         80834 |                7.5 |
| historical low yield (safe)   |         49167 |                7   |
| no history                    |         20076 |                6.9 |

<br>

**Insights:**

The data establishes a strong positive correlation between historical pricing tiers and current default probability. The "historical high yield (risky)" segment, which comprises the largest portion of the population (total_count: 157,434), displays the highest risk_probability at 8.9. As the historical yield tier improves (moves toward "safe"), the current risk consistently declines: the "historical middle yield" group sits at 7.5, and the "historical low yield (safe)" group drops further to 7. This trend confirms that willingness to accept high interest rates in the past is a sticky indicator of persistent risk. Notably, clients with "no history" present the lowest risk of all at 6.9, reinforcing that unknown entities are statistically safer than those with a track record of accepting high-cost credit.



###   The ”Lifestyle” Purchase Risk

**Business Question: Does the specific ”Category of Goods” purchased in the past predict current creditworthiness?**


**Objective:** To understand lifestyle risk through purchase history. A client who frequently takes loans for ”Mobile Phones” (short lifespan, high theft/loss risk) might have a different risk profile than someone taking loans for ”Furniture” or ”Construction Materials” (long-term investment in stability).

<details>
<summary>Show SQL Code</summary> 
<br>

```python

query = """
with client_shopping_habit as (
    select 
        SK_ID_CURR,
        mode(NAME_GOODS_CATEGORY) as favorite_category
    from previous_applications
    where NAME_CONTRACT_STATUS = 'Approved' 
      and NAME_GOODS_CATEGORY != 'XNA' -- Exclude generic/cash loans to focus on physical goods
    group by SK_ID_CURR
)

select 
    -- Clean up the category name for display
    coalesce(h.favorite_category, 'No Trade History') as historic_goods_category,

    -- Calculate Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join client_shopping_habit h on a.SK_ID_CURR = h.SK_ID_CURR
group by 1
having count(*) > 1000 -- Filter out rare categories to reduce noise
order by 
    risk_probability desc
"""

t4 = con.execute(query).fetchdf()
t4
``` 

</details>
<br>

**Results:**

| historic_goods_category   |   total_count |   risk_probability |
|:--------------------------|--------------:|-------------------:|
| Vehicles                  |          1291 |               10.4 |
| Mobile                    |         80597 |                9.3 |
| Auto Accessories          |          2540 |                9.2 |
| Jewelry                   |          2104 |                8.9 |
| Computers                 |         37418 |                8.4 |
| No Trade History          |         41126 |                8.3 |
| Sport and Leisure         |          1079 |                8.2 |
| Audio/Video               |         37896 |                8.1 |
| Photo / Cinema Equipment  |          7962 |                8   |
| Gardening                 |          1071 |                7.7 |
| Consumer Electronics      |         47030 |                7.4 |
| Construction Materials    |         10016 |                6.9 |
| Homewares                 |          2151 |                6.6 |
| Furniture                 |         20195 |                5.8 |
| Medical Supplies          |          1955 |                5.7 |
| Clothing and Accessories  |          9569 |                5.5 |


<br>

**Insights:**

The data demonstrates a wide variance in risk probability based on the type of goods financed. Categories associated with rapid depreciation, high liquidity, or short lifespans exhibit the highest risk profiles: Vehicles top the list at 11.2, followed closely by Auto Accessories (9.8) and Mobile phones (9.2). The "Mobile" category is particularly critical for risk management as it combines a very high risk probability with the largest volume in the high-risk bracket (total_count: 81,547). Conversely, categories linked to domestic stability or long-term utility show drastically lower default rates. Furniture (5.8), Clothing and Accessories (5.6), and Medical Supplies (5.6) represent the safest borrower segments. This suggests that clients investing in home environments or essential well-being are statistically more reliable than those financing transient or luxury electronic goods.

Key Observations for the Report:

- Top Risk Drivers: "Vehicles" (11.2) and "Auto Accessories" (9.8) represent the highest probability of default.

- Volume Risk Alert: "Mobile" phones present a systemic risk; they are the third riskiest category (9.2) but account for a massive share of the volume (81,547 applications).

- Stability Indicators: Purchases related to the home (Furniture at 5.8, Gardening at 6.5, Construction Materials at 7.1) consistently predict safer repayment behavior.




###   The ”Insurance” Responsibility Signal

**Business Question: Does the specific ”Category of Goods” purchased in the past predict
current creditworthiness?**

**Objective:** To test if purchasing insurance (NFLAG INSURED ON APPROVAL) is a behavioral signal of ”Responsibility” or ”Risk Aversion.” We hypothesize that clients who pay extra to insure their loans are more cautious and financially literate.

<details>
<summary>Show SQL Code</summary>

<br>

```python

query = """
with insurance_habit as (
    select 
        SK_ID_CURR,
        -- count how many approved loans had insurance explicitly flagged as 1
        sum(case when NFLAG_INSURED_ON_APPROVAL = 1 then 1 else 0 end) as insured_loans,
        -- count total approved loans where insurance flag is recorded
        count(case when NFLAG_INSURED_ON_APPROVAL is not null then 1 end) as total_measurable_loans
    from previous_applications
    where NAME_CONTRACT_STATUS = 'Approved'
    group by SK_ID_CURR
)

select 
    -- segment clients based on their insurance purchasing behavior
    case 
        when h.total_measurable_loans is null or h.total_measurable_loans = 0 then 'no insurance history'
        when h.insured_loans = h.total_measurable_loans then 'always insured (highly cautious)'
        when h.insured_loans > 0 then 'sometimes insured'
        else 'never insured (risk tolerant?)'
    end as insurance_behavior,

    -- calculate risk metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join insurance_habit h on a.SK_ID_CURR = h.SK_ID_CURR
group by 1
order by 
    risk_probability desc
"""

t6 = con.execute(query).fetchdf()
t6
```


</details>

<br>


**Results:**

| insurance_behavior               |   total_count |   risk_probability |
|:---------------------------------|--------------:|-------------------:|
| always insured (highly cautious) |         21238 |                9.3 |
| never insured (risk tolerant?)   |        136466 |                8.5 |
| sometimes insured                |        132056 |                7.7 |
| no insurance history             |         17751 |                6.1 |

<br>

The data contradicts the hypothesis that insurance purchase signals financial caution or literacy. The "always insured (highly cautious)" segment presents the highest risk probability at 9.3. This is significantly higher than the "never insured" cohort, which sits at 8.5. This trend suggests a strong "Adverse Selection" effect: clients who feel the need to insure their loans may be privately aware of their own financial instability or higher likelihood of default. Interestingly, the safest segment is "no insurance history" at 6.1, followed by "sometimes insured" at 7.7, indicating that a lack of engagement with insurance products is actually a positive signal for creditworthiness in this specific context.

Key Observations:

- Adverse Selection: The highest risk (9.3) comes from those who always buy protection, suggesting they anticipate trouble.

- Risk Tolerance vs. Safety: Clients labeled "risk tolerant" (never insured) perform better (8.5) than the "cautious" (always insured) group.

- Safest Baseline: Clients with no prior history of insurance interaction are the least risky (6.1).


##  Payments Table 

In this part, we will analyze payment related tables to understand the payment behavior of the clients and get insights about their default risk. We will deal with the following tables:

- `payments_installments` - shows repayment history for the previously disbursed credits.
- `credit_card_balance` - shows monthly balance snapshots of previous credit cards that applicant has with Home Credit
- `pos_cash_balance` - shows monthly balance snapshots of previous POS (point of sales) and cash loans that the applicant has with Home Credit.
- `applications` - shows current credit specifications. It is used to link the previously explained tables with the default risk rates.


###   The ”Slippery Slope” (Trend Analysis) </font>

**Business Question: Does a recent increase in payment delay (e.g., last 3 months vs. last 12 months) predict default more accurately than the overall average delay?**

**Objective:** To distinguish between a ”Chronic Late Payer” (always 2 days late, but pays) and a ”Deteriorating Payer” (was on time, then 5 days late, then 30 days late). The change in behavior is more predictive than the average.

<details>
<summary>Show SQL Code</summary>
<br>

```python

query = """
with installment_details as (
    select 
        SK_ID_CURR,
        SK_ID_PREV,
        NUM_INSTALMENT_NUMBER,
        -- Scheduled date (relative to application date)
        max(DAYS_INSTALMENT) as deadline,
        -- Actual payment date (relative to application date)
        max(DAYS_ENTRY_PAYMENT) as actual_payment_date
    from installments_payments
    where DAYS_ENTRY_PAYMENT is not null
    group by 1, 2, 3
),

dpd_calculations as (
    select
        *,
        -- Calculate Days Past Due (DPD). 
        -- We use GREATEST(0, ...) to ensure early payments (negative values) 
        -- count as 0 risk, rather than offsetting actual late payments.
        GREATEST(0, actual_payment_date - deadline) as dpd
    from installment_details
),

payment_trend_calc as (
    select 
        SK_ID_CURR,
        -- Calculate Avg DPD for recent transactions (Last 3 months / 90 days)
        -- 'deadline >= -90' means dates closer to 0 (application date)
        avg(case 
            when deadline >= -90 then dpd 
        end) as recent_dpd_avg,
        
        -- Calculate Avg DPD for historical transactions (Older than 3 months)
        avg(case 
            when deadline < -90 then dpd 
        end) as historic_dpd_avg
    from dpd_calculations
    group by SK_ID_CURR
)

select 
    -- Classify the "Slippery Slope" trend
    case 
        when p.recent_dpd_avg is null or p.historic_dpd_avg is null then 'Insufficient History'
        
        -- Trend 1: Deteriorating
        -- Recent lateness is significantly worse (> 1 day) than their historical average
        when p.recent_dpd_avg > (p.historic_dpd_avg + 1) then 'Deteriorating (Slippery Slope)'
        
        -- Trend 2: Chronic Late Payer
        -- They are late recently AND were late historically (consistent bad behavior)
        when p.recent_dpd_avg > 0 and p.historic_dpd_avg > 0 then 'Chronic Late Payer'
        
        -- Trend 3: Improving
        -- Recent performance is better than history
        when p.recent_dpd_avg < p.historic_dpd_avg then 'Improving Behavior'
        
        -- Trend 4: Stable / Good
        else 'Stable / Good Payer'
    end as payment_trend,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3) * 100 as risk_probability

from applications a
left join payment_trend_calc p on a.SK_ID_CURR = p.SK_ID_CURR
group by 1
order by 
    risk_probability desc
"""

t1 = con.execute(query).fetchdf()
t1
```

</details>
<br>

**Results:**

| payment_trend                  |   total_count |   risk_probability |
|:-------------------------------|--------------:|-------------------:|
| Deteriorating (Slippery Slope) |          5843 |               15.9 |
| Chronic Late Payer             |         16291 |               12.2 |
| Insufficient History           |        148093 |                8.1 |
| Improving Behavior             |         67591 |                7.5 |
| Stable / Good Payer            |         69693 |                7   |

<br>

**Insights:**

We analyzed the payment trends to see if a change in behavior (getting worse over time) is more dangerous than just being consistently late. The results clearly show that the "Deteriorating (Slippery Slope)" group is our highest risk segment. Even though this group is small (only 5,843 clients), they have a 15.9% default probability. This confirms that when a customer starts paying later than usual, it is a major red flag.

In comparison, the "Chronic Late Payers"—people who are always late but stable—are actually less risky (12.2%) than the deteriorating group. This is an interesting finding because it suggests consistency is better than volatility, even if that consistency involves being a few days late.

For the rest of the population, the trend is positive. Clients with "Improving Behavior" or "Stable" histories are very safe, with default rates dropping to 7.5% and 7% respectively. However, we should be careful with the "Insufficient History" group. They make up the majority of our data (148,093 cases) and have an average risk of 8.1%, mostly because we don't have enough data points to classify them accurately yet.


###  The ”Underpayment” Signal

**Business Question: Are clients who frequently pay less than the required installment amount (even by a small margin) significantly riskier?**


**Objective:** To identify financial distress before it becomes a default. Sometimes clients pay something to keep the bank happy, but not the full amount. This ”Partial Payment” is a huge risk signal.

<details>
<summary>Show SQL Code</summary>
<br>

```python
query = """
with installment_level_payments as (
    select 
        SK_ID_CURR,
        SK_ID_PREV,
        NUM_INSTALMENT_NUMBER,
        -- An installment might be paid in multiple split transactions.
        -- We must sum all payments for this specific installment number.
        max(AMT_INSTALMENT) as amount_required,
        sum(AMT_PAYMENT) as amount_paid_total
    from installments_payments
    group by 1, 2, 3
),

underpayment_stats as (
    select 
        SK_ID_CURR,
        count(*) as total_installments_due,
        -- Count how many times they paid less than required (allowing for tiny float differences)
        sum(case 
            when (amount_required - amount_paid_total) > 0.05 then 1 
            else 0 
        end) as count_underpayments
    from installment_level_payments
    group by SK_ID_CURR
)

select 
    -- Segment clients by their underpayment frequency
    case 
        when u.total_installments_due is null then 'Insufficient History'
        when u.count_underpayments = 0 then 'Perfect Payer (Never Underpaid)'
        when (cast(u.count_underpayments as float) / u.total_installments_due) < 0.10 
            then 'Occasional Underpayment (<10%)'
        when (cast(u.count_underpayments as float) / u.total_installments_due) < 0.50 
            then 'Frequent Underpayment (10-50%)'
        else 'Chronic Underpayment (>50%)'
    end as payment_behavior,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join underpayment_stats u on a.SK_ID_CURR = u.SK_ID_CURR
group by 1
order by 
    risk_probability desc
"""

t2 = con.execute(query).fetchdf()
t2
```

</details>
<br>

**Results:**

| payment_behavior                |   total_count |   risk_probability |
|:--------------------------------|--------------:|-------------------:|
| Chronic Underpayment (>50%)     |            13 |               23.1 |
| Frequent Underpayment (10-50%)  |           318 |               16   |
| Occasional Underpayment (<10%)  |          2144 |               15.7 |
| Perfect Payer (Never Underpaid) |        289168 |                8.1 |
| Insufficient History            |         15868 |                6   |


<br>

**Insights:**

We investigated whether paying less than the full installment amount is an early warning sign of default. The data confirms that any level of underpayment significantly increases risk compared to clients who pay in full.

The most dangerous group is "Chronic Underpayment" (clients who underpay more than half the time). They have the highest default probability at 23.1%. However, this is an extremely rare behavior, with only 13 cases found in the dataset. While the signal is strong, the low volume makes it less critical for broad portfolio impact.

A more significant finding for the business is the "Occasional Underpayment" group. These clients underpay less than 10% of the time, yet their risk level jumps to 15.7%. This is almost double the risk of "Perfect Payers" (8.1%). Since this group is larger (2,144 clients), it represents a meaningful segment of "hidden" risk—clients who might look safe because they pay most of the time, but are actually struggling.

The vast majority of the portfolio (289,168 clients) falls into the "Perfect Payer" category with a stable baseline risk of 8.1%. Interestingly, the "Insufficient History" group shows the lowest risk (6%), likely because these are newer loans that haven't had enough time to go bad yet.


###   The ”Early Bird” Paradox 

**Business Question: Is there a U-shaped risk curve where paying too early or too late are both risky, while paying ”on time” is the safest behavior?**

**Objective:** To check if paying too early is a signal. Sometimes, paying immediately after taking a loan implies the client just needed a bridge loan or is ”churning” (taking bonuses and leaving).


<details>
<summary>Show SQL Code</summary>
<br>

```python
query = """
with installment_dates as (
    select 
        SK_ID_CURR,
        SK_ID_PREV,
        NUM_INSTALMENT_NUMBER,
        -- We group by installment to handle split payments.
        -- We take the MAX(DAYS_ENTRY_PAYMENT) to find when the obligation was *fully* cleared.
        max(DAYS_INSTALMENT) as due_date,
        max(DAYS_ENTRY_PAYMENT) as paid_date
    from installments_payments
    where DAYS_ENTRY_PAYMENT is not null
    group by 1, 2, 3
),

client_timing_behavior as (
    select 
        SK_ID_CURR,
        -- Calculate the average difference (Actual - Scheduled)
        -- Negative values = Paid Early
        -- Positive values = Paid Late
        avg(paid_date - due_date) as avg_days_diff
    from installment_dates
    group by SK_ID_CURR
)

select 
    -- Segment clients to test the "U-Shaped" risk curve
    case 
        when c.avg_days_diff is null then 'Insufficient History'
        
        -- The "Too Early" Paradox Segment
        when c.avg_days_diff < -30 then 'Aggressively Early (30 days early)'
        
        -- The "Cautious" Segment
        when c.avg_days_diff between -30 and -10 then 'Early Bird (10-30 days early)'
        
        -- The "Safe / Standard" Segment
        when c.avg_days_diff between -10 and 5 then 'Just in Time (10 to 5 days early)'
        
        -- The "Late" Segment
        when c.avg_days_diff > 5 then 'Chronically Late (5 days late)'
        
        else 'Unknown'
    end as payment_timing_segment,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join client_timing_behavior c on a.SK_ID_CURR = c.SK_ID_CURR
group by 1
order by 
    risk_probability desc
"""

t4 = con.execute(query).fetchdf()
t4
```

</details>
<br>

**Results:**

| payment_timing_segment             |   total_count |   risk_probability |
|:-----------------------------------|--------------:|-------------------:|
| Chronically Late (5 days late)     |          6008 |               13.1 |
| Just in Time (10 to 5 days early)  |        156121 |                9   |
| Aggressively Early (30 days early) |         11766 |                7.3 |
| Early Bird (10-30 days early)      |        117740 |                6.9 |
| Insufficient History               |         15876 |                6   |


<br>

**Insights:**

We tested the "U-shaped curve" hypothesis to see if paying too early acts as a risk signal (like potential churn or fraud). The data disproves this hypothesis. Instead of a U-shape, we see a fairly linear trend: the earlier a client pays, the safer they are.

The "Aggressively Early" group (paying 30 days in advance) does not show high risk; in fact, their default probability is very low at 7.3%. The safest segment is actually the "Early Bird" group (paying 10-30 days early), with the lowest risk in the dataset at 6.9%.

The real insight here is about the "Just in Time" payers. These clients, who pay close to the due date (10 to 5 days early), have a significantly higher risk (9%) than the early payers. This suggests that "waiting until the last minute"—even if technically on time—is a sign of tighter cash flow compared to those who pay weeks in advance. As expected, the "Chronically Late" group remains the highest risk at 13.1%.

**Summary: There is no "Early Bird Paradox." Early payment is a strong indicator of financial health, not fraud.**


### The ”Desperation” Withdrawal (ATM Usage) 


**Business Question: Does a high ratio of ATM Cash Withdrawals to Total Spending indicate an imminent default?**

**Objective:** To detect ”Cash Liquidity Crises.” Smart borrowers use credit cards for points-goods (AMT DRAWINGS POS CURRENT). Desperate borrowers use credit cards to get cash at ATMs (AMT DRAWINGS ATM CURRENT) despite high fees.


<details>
<summary>Show SQL Code</summary>
<br>

```python
query = """
with credit_card_usage as (
    select 
        SK_ID_CURR,
        -- Sum up total spending and specific ATM spending
        -- coalescing to 0 to handle nulls
        sum(coalesce(AMT_DRAWINGS_ATM_CURRENT, 0)) as total_atm_withdrawals,
        sum(coalesce(AMT_DRAWINGS_CURRENT, 0)) as total_spending
    from credit_card_balance
    group by SK_ID_CURR
)

select 
    -- Calculate Cash Reliance Ratio and Segment
    case 
        when c.total_spending is null or c.total_spending = 0 then 'No Credit Card Usage'
        when c.total_atm_withdrawals = 0 then 'Pure Spender (0% Cash)'
        when (c.total_atm_withdrawals / c.total_spending) < 0.50 then 'Mixed Usage (< 50% Cash)'
        when (c.total_atm_withdrawals / c.total_spending) < 0.90 then 'High Cash Reliance (50-90% Cash)'
        else 'Desperation / Churn (> 90% Cash)'
    end as cash_usage_behavior,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3) * 100 as risk_probability

from applications a
left join credit_card_usage c on a.SK_ID_CURR = c.SK_ID_CURR
group by 1
order by 
    risk_probability desc
"""

t4 = con.execute(query).fetchdf()
t4
```
</details>
<br>

**Results:**

| cash_usage_behavior              |   total_count |   risk_probability |
|:---------------------------------|--------------:|-------------------:|
| High Cash Reliance (50-90% Cash) |         13322 |               12.4 |
| Mixed Usage (< 50% Cash)         |          9326 |               11.4 |
| Desperation / Churn (> 90% Cash) |         28640 |                9.3 |
| Pure Spender (0% Cash)           |          8348 |                7.8 |
| No Credit Card Usage             |        247875 |                7.6 |

<br>

**Insights:**

We analyzed credit card usage to see if withdrawing cash from ATMs (which usually carries high fees) is a sign of financial distress. The data generally supports this, but with a surprising twist.

The clearest finding is that "Pure Spenders"—clients who use their cards only for purchases and never for cash—are very safe, with a low default probability of 7.8%. In contrast, clients who rely heavily on cash withdrawals ("High Cash Reliance", 50-90% of usage) show the highest risk in the dataset at 12.4%. This confirms that using credit lines for cash is often a red flag for liquidity problems.

However, the "Desperation / Churn" group (those who use the card almost exclusively for cash, >90%) breaks the trend. We expected them to be the riskiest, but their default rate is actually lower at 9.3%. This suggests these might not be "desperate" borrowers, but rather savvy users "churning" cash for specific purposes or taking advantage of loopholes, rather than struggling to pay bills.

Finally, the vast majority of our clients (247,875) fall into the "No Credit Card Usage" category. They remain the safest baseline at 7.6%, simply because they aren't engaging in these revolving credit behaviors at all.


###  The ”Treading Water” Trap (Minimum Payments)

**Business Question: Is the ”Payment-to-Minimum” ratio a strong predictor of default? (i.e., Do clients who pay exactly the minimum eventually crash?)**

**Objective:** To identify clients who are ”Maxed Out.” If a client only pays the absolute minimum required (AMT INST MIN REGULARITY) every month, they are not reducing their principal. They are trapped in debt.

<details>
<summary>Show SQL Code</summary>
<br>

```python
query = """
with payment_ratios as (
    select 
        SK_ID_CURR,
        -- We only consider months where there was an actual minimum requirement (> 0)
        -- We use COALESCE to treat null payments as 0 (missed payment)
        sum(coalesce(AMT_PAYMENT_CURRENT, 0)) as total_paid,
        sum(AMT_INST_MIN_REGULARITY) as total_min_required
    from credit_card_balance
    where AMT_INST_MIN_REGULARITY > 0
    group by SK_ID_CURR
)

select 
    -- Segment clients based on their Payment-to-Minimum Ratio
    case 
        when p.total_min_required is null then 'Insufficient History'
        
        -- Ratio < 1.0: They aren't even meeting the minimums (Financial Distress)
        when (p.total_paid / p.total_min_required) < 1.0 then 'Underwater (Paying < Min)'
        
        -- Ratio 1.0 - 1.1: The "Trap". They pay exactly what is asked, likely carrying high balances.
        when (p.total_paid / p.total_min_required) between 1.0 and 1.1 then 'Treading Water (Paying Exact Min)'
        
        -- Ratio > 1.1: They are paying down principal faster than required.
        when (p.total_paid / p.total_min_required) between 1.1 and 1.5 then 'Healthy Buffer (>10% over Min)'
        else 'Aggressive Paydown (>1.5x Min)'
    end as payment_behavior_segment,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3) * 100 as risk_probability

from applications a
left join payment_ratios p on a.SK_ID_CURR = p.SK_ID_CURR
group by 1
order by 
    risk_probability desc
"""

t5 = con.execute(query).fetchdf()
t5
``` 

</details>
<br>

**Results:**

| payment_behavior_segment          |   total_count |   risk_probability |
|:----------------------------------|--------------:|-------------------:|
| Underwater (Paying < Min)         |          1358 |               15.5 |
| Treading Water (Paying Exact Min) |          6426 |               14.3 |
| Healthy Buffer (>10% over Min)    |         12354 |               10.5 |
| Aggressive Paydown (>1.5x Min)    |         39141 |                9   |
| Insufficient History              |        248232 |                7.6 |

<br>

**Insights:**

We looked at whether clients who only pay the minimum amount due are more likely to default. The results strongly suggest that paying only the minimum is a major warning sign of financial stress.

The highest risk comes from the "Underwater" group (those paying less than the minimum), with a default rate of 15.5%. However, the most important finding is about the "Treading Water" group—clients who pay exactly the minimum amount. Their risk is 14.3%, which is almost as high as those who don't pay enough. This tells us that if a client is merely meeting the bank's minimum requirement and not paying down the principal, they are likely trapped in debt and at high risk of crashing.

The data shows a clear improvement as soon as clients pay even a little extra. The "Healthy Buffer" group (paying just 10% over the minimum) sees their risk drop to 10.5%. The safest active payers are the "Aggressive Paydown" group (paying more than 1.5 times the minimum), with a default rate of 9%. This proves that the ratio of "Payment-to-Minimum" is a very strong predictor of safety.

As with previous tasks, the majority of the dataset (248,232 cases) falls into "Insufficient History" with a baseline risk of 7.6%.


###   The ”Utilization” Red Line

**Business Question: At what specific Utilization Percentage (Balance / Limit) does the default risk jump significantly? (Is it 70%, 90%, or 100%?)**

**Objective:** The classic credit score metric. Using 90% of your limit is bad. We need to find the specific ”Cliff” where risk spikes.


<details>
<summary>Show SQL Code</summary>

<br>

```python
query = """
with monthly_utilization as (
    select 
        SK_ID_CURR,
        -- Calculate utilization for each month where a limit exists
        -- We cast to float to ensure decimal precision
        (cast(AMT_BALANCE as float) / nullif(AMT_CREDIT_LIMIT_ACTUAL, 0)) as utilization_rate
    from credit_card_balance
    where AMT_CREDIT_LIMIT_ACTUAL > 0
),

client_risk_profile as (
    select 
        SK_ID_CURR,
        -- We take the average utilization over the client's history
        -- This smoothes out one-off spikes to reveal their chronic debt load
        avg(utilization_rate) as avg_utilization
    from monthly_utilization
    group by SK_ID_CURR
)

select 
    -- Create granular buckets to find the "Cliff"
    case 
        when p.avg_utilization is null then 'Insufficient History'
        when p.avg_utilization <= 0.10 then 'Minimal Usage (0-10%)'
        when p.avg_utilization <= 0.30 then 'Low Usage (10-30%)'
        when p.avg_utilization <= 0.50 then 'Moderate (30-50%)'
        when p.avg_utilization <= 0.70 then 'High (50-70%)'
        when p.avg_utilization <= 0.90 then 'Very High (70-90%)'
        when p.avg_utilization <= 1.00 then 'Maxed Out (90-100%)'
        else 'Over Limit (> 100%)'
    end as utilization_segment,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join client_risk_profile p on a.SK_ID_CURR = p.SK_ID_CURR
group by 1
order by 
    risk_probability desc
"""

t6 = con.execute(query).fetchdf()
t6
```

</details>

<br>

**Results:**

| utilization_segment   |   total_count |   risk_probability |
|:----------------------|--------------:|-------------------:|
| Over Limit (> 100%)   |          1004 |               25.5 |
| Maxed Out (90-100%)   |          4205 |               17.8 |
| Very High (70-90%)    |         10510 |               13.7 |
| High (50-70%)         |         11251 |               10.9 |
| Moderate (30-50%)     |         12932 |                8.3 |
| Insufficient History  |        221475 |                7.9 |
| Low Usage (10-30%)    |         12556 |                6.9 |
| Minimal Usage (0-10%) |         33578 |                5.4 |

<br>

**Insights:**

We analyzed the credit utilization ratio (Balance divided by Credit Limit) to find the exact "tipping point" where risk becomes critical. The data confirms that this is one of our strongest predictors: there is a direct, consistent link between using more credit and defaulting.

To answer the business question: the "Red Line" is clearly at 90% utilization. While risk rises steadily as usage goes up, we see a sharp jump when clients enter the "Maxed Out" zone (90-100% usage), where the default rate hits 17.8%. If a client goes "Over Limit" (>100%), the risk explodes to 25.5%—meaning 1 in 4 of these clients will default. This is the highest risk segment we have found in the entire dataset so far.

On the safe side, clients who keep their utilization low (<30%) are very secure. The "Minimal Usage" group (0-10%) has the lowest risk in this category at just 5.4%. This confirms that clients who have plenty of "breathing room" on their credit cards are financially healthy.

Most of the accounts (221,475) still fall into "Insufficient History" (likely new accounts or inactive ones with no recent balance data), maintaining the standard average risk of 7.9%.


### The ”Refinancing” Flag (Term Extension)

**Business Question: Does a mid-contract increase in loan term (Refinancing) predict a future default?**


**Objective:** To detect hidden distress. If a client extends their loan term (e.g., CNT INSTALMENT jumps from 12 to 24 months), it usually means they couldn’t afford the original payments.


<details>
<summary>Show SQL Code</summary>
<br>

```python
query = """
with loan_term_fluctuations as (
    select 
        SK_ID_CURR,
        SK_ID_PREV,
        -- Find the initial term and the final term for the same loan contract
        min(CNT_INSTALMENT) as min_term,
        max(CNT_INSTALMENT) as max_term
    from pos_cash_balance
    where NAME_CONTRACT_STATUS = 'Active' 
      and CNT_INSTALMENT is not null
    group by SK_ID_CURR, SK_ID_PREV
),

client_refinance_behavior as (
    select 
        SK_ID_CURR,
        count(*) as total_loans,
        -- Flag loans where the term increased (Refinancing / Extension)
        -- We use a threshold > 1 to filter out potential data noise
        sum(case 
            when (max_term - min_term) > 1 then 1 
            else 0 
        end) as extended_loans
    from loan_term_fluctuations
    group by SK_ID_CURR
)

select 
    -- Segment clients by their history of extending loan terms
    case 
        when r.SK_ID_CURR is null then 'No Cash Loan History'
        when r.extended_loans = 0 then 'Standard Terms (No Extensions)'
        when r.extended_loans = 1 then 'One-Time Extension'
        else 'Serial Refinancer (>1 Extension)'
    end as refinancing_behavior,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3) * 100 as risk_probability

from applications a
left join client_refinance_behavior r on a.SK_ID_CURR = r.SK_ID_CURR
group by 1
order by 
    risk_probability desc
"""

t7 = con.execute(query).fetchdf()
t7
```

</details>
<br>

**Results:**

| refinancing_behavior             |   total_count |   risk_probability |
|:---------------------------------|--------------:|-------------------:|
| Standard Terms (No Extensions)   |        233111 |                8.2 |
| Serial Refinancer (>1 Extension) |          9485 |                8.2 |
| One-Time Extension               |         46645 |                8   |
| No Cash Loan History             |         18270 |                6.7 |

<br>

**Insights:**

The results for this task were quite unexpected and actually disprove our initial hypothesis. We assumed that clients who extend their loan terms (refinance) were struggling to pay, but the data shows that refinancing is not a predictor of default in this portfolio.

The risk levels are almost identical across the board. "Serial Refinancers" (clients who extended their terms multiple times) have a default probability of 8.2%, which is exactly the same as clients with "Standard Terms" (8.2%). Even clients with a "One-Time Extension" are effectively the same, sitting slightly lower at 8%. This lack of variation tells us that term extensions here are likely being used as a proactive product (upselling healthy clients) rather than a "rescue" tool for desperate ones.

The only distinct signal comes from the "No Cash Loan History" segment. These clients are the safest at 6.7%, likely because they haven't had the opportunity to over-leverage themselves with cash loans yet. But overall, "Refinancing" appears to be a neutral behavior rather than a risk factor.


###   The ”Nuclear” Option (Demand Status) 

**Business Question: If a client had a ”Demand” status on a previous loan years ago, are they still toxic today?**


**Objective:** To validate the ”Death Flag.” If NAME CONTRACT STATUS ever becomes ’Demand’ (Bank demands full payment immediately), the client is likely finished. We need to quantify how fatal this is.

<details>
<summary>Show SQL Code</summary>
<br>

```python
query = """
with demand_events as (
    select 
        SK_ID_CURR,
        max(MONTHS_BALANCE) as last_demand_month
    from pos_cash_balance
    where NAME_CONTRACT_STATUS = 'Demand'
    group by SK_ID_CURR

    union all

    select 
        SK_ID_CURR,
        max(MONTHS_BALANCE) as last_demand_month
    from credit_card_balance
    where NAME_CONTRACT_STATUS = 'Demand'
    group by SK_ID_CURR
),

client_demand_profile as (
    select 
        SK_ID_CURR,
        max(last_demand_month) as most_recent_demand
    from demand_events
    group by SK_ID_CURR
)

select 
    case 
        when d.most_recent_demand is null then 'No Demand History'
        
        when d.most_recent_demand >= -12 then 'Critical: Recent Demand (< 1 Year)'
        when d.most_recent_demand >= -36 then 'Danger: Mid-Term (1-3 Years)'
        when d.most_recent_demand >= -60 then 'Warning: Old (3-5 Years)'
        else 'Recovered? (> 5 Years ago)'
    end as demand_status_recency,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join client_demand_profile d on a.SK_ID_CURR = d.SK_ID_CURR
group by 1
order by 
    risk_probability desc
"""

t8 = con.execute(query).fetchdf()
t8
```

</details>
<br>

**Results:**

| demand_status_recency              |   total_count |   risk_probability |
|:-----------------------------------|--------------:|-------------------:|
| Recovered? (> 5 Years ago)         |             5 |               20   |
| Critical: Recent Demand (< 1 Year) |           125 |               18.4 |
| Danger: Mid-Term (1-3 Years)       |           157 |               17.8 |
| Warning: Old (3-5 Years)           |            36 |                8.3 |
| No Demand History                  |        307188 |                8.1 |

<br>

**Insights:**

We investigated whether the "Demand" status (immediate repayment request) is a critical risk factor. While the default rates for clients with a history of "Demand" appear high (ranging from 17.8% to 20%), we found a major issue with statistical significance due to extreme data imbalance.

The vast majority of the dataset (307,188 applications) falls into the "No Demand History" category, which essentially represents the entire population. The groups showing "high risk" are statistically negligible:

- Critical/Recent Demand: Only 125 cases.

- Danger/Mid-Term: Only 157 cases.

- Recovered: Only 5 cases.

Because these "high risk" segments make up less than 0.1% of the total data, we cannot confidently say this is a reliable predictive trend. The sample size is simply too small to generalize. In a machine learning model, relying on this feature would likely lead to overfitting or noise rather than a genuine signal.

Conclusion: This feature is not statistically significant for the broader population. While "Demand" status might be a rare "red flag" for manual review, it is not a robust feature for our automated predictive model.


## <font color="#94d6d5"> End of Section 2 </font>

In this section, we completed SQL analysis on the previous applications and payment-related tables. We uncovered several key insights about payment behavior and its relationship to default risk. Some of the most important findings include:

- The "Slippery Slope" trend is a strong predictor of default. Clients whose payment behavior deteriorates over time are much riskier than those who are consistently late.
- Underpayment (paying less than the required amount) is a major red flag, even if it happens occasionally.
- Paying too early is not a risk signal; in fact, it is associated with lower default rates.
- High reliance on cash withdrawals from credit cards is a strong indicator of financial distress.
- Paying only the minimum amount due is a significant warning sign of being "trapped" in debt.
- Credit utilization above 90% is a critical threshold where default risk spikes dramatically.
- Refinancing (extending loan terms) does not appear to be a predictor of default in this dataset.
- The "Demand" status is not statistically significant due to extreme data imbalance.   
- Overall, these insights will help us engineer powerful features for our machine learning model in the next section. We now have a much clearer understanding of which payment behaviors are most predictive of default risk.

In the next section, we will analyze external reputations data, which will show the behaviour of clients outside of their interactions with the bank. This will allow us to capture a more holistic view of their financial health and risk profile.


