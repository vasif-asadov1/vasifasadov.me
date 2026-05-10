---
layout: ../../../layouts/ArticleLayout.astro
title:  Advanced SQL Analysis (Part 3)
description: This article continues the advanced SQL analysis for the Home Credit Risk Analysis project, focusing on the external behavior of clients and bridge analysis to understand the relationships between different tables in the dataset.
---


## Introduction  

In this section, we will continue our SQL analysis on the remaining tables in the dataset. We will focus on the external behavior of the clients, such as their payment behavior on the other banks and their credit history. Besides that, we will do **bridge analysis** to understand the relationship between the different tables and how they can be used together to get insights about the default risk. 


##  External Reputation Analysis  

### The ”Hidden Leverage” Ratio 

**Business Question: (AMT CREDIT SUM DEBT) divided by the client’s Income predict default better than just the internal loan amount?**

**Objective:** Home Credit knows the client’s income, but only bureau knows their total debt. A client might look safe with a small loan here, but have $100k debt elsewhere. We must calculate the True Debt-to-Income Ratio.

<details>
<summary>Show Code</summary>
<br>

```python
query = """
with external_debt_agg as (
    select 
        SK_ID_CURR,
        -- Sum up the current debt reported by the Credit Bureau
        -- We filter for 'Active' credits to measure current burden
        sum(coalesce(AMT_CREDIT_SUM_DEBT, 0)) as total_external_debt
    from bureau
    where CREDIT_ACTIVE = 'Active'
    group by SK_ID_CURR
)

select 
    -- Calculate True Debt-to-Income Ratio (External Debt / Annual Income)
    case 
        when b.total_external_debt is null or b.total_external_debt = 0 then 'No External Debt'
        
        -- Safe Zone: Debt is less than half of annual income
        when (b.total_external_debt / nullif(a.AMT_INCOME_TOTAL, 0)) < 0.5 then 'Low Leverage (< 0.5x Income)'
        
        -- Manageable Zone: Debt is roughly equal to one year's income
        when (b.total_external_debt / nullif(a.AMT_INCOME_TOTAL, 0)) < 1.0 then 'Moderate (0.5x - 1.0x Income)'
        
        -- Warning Zone: Debt is 1x to 3x annual income
        when (b.total_external_debt / nullif(a.AMT_INCOME_TOTAL, 0)) < 3.0 then 'High Leverage (1.0x - 3.0x Income)'
        
        -- Danger Zone: Debt is more than 3x annual income (Very hard to service)
        else 'Extreme Leverage (> 3.0x Income)'
    end as external_dti_segment,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join external_debt_agg b on a.SK_ID_CURR = b.SK_ID_CURR
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

| external_dti_segment               |   total_count |   risk_probability |
|:-----------------------------------|--------------:|-------------------:|
| Extreme Leverage (> 3.0x Income)   |         84528 |                9.3 |
| High Leverage (1.0x - 3.0x Income) |         51935 |                8.4 |
| Low Leverage (< 0.5x Income)       |         27657 |                7.7 |
| Moderate (0.5x - 1.0x Income)      |         20734 |                7.5 |
| No External Debt                   |        122657 |                7.3 |


<br>

**Insights:**

The data clearly validates the hypothesis that "hidden" debt held at other institutions is a strong predictor of default risk. Unlike the previous task where the sample size was an issue, this feature shows a robust signal across large population segments.

There is a direct, positive correlation between external leverage and risk. Clients with "No External Debt" are the safest cohort in this category, with a baseline default rate of 7.3%. As the ratio of Debt-to-Income rises, the risk steadily increases, peaking in the "Extreme Leverage" segment (>3.0x Income). This group has a default probability of 9.3%, which is a significant jump from the baseline.

Crucially, this "Extreme Leverage" group is not a small outlier—it contains 84,528 applicants. This means a substantial portion of our portfolio is carrying heavy external debt loads that we wouldn't see if we only looked at their application data. The fact that nearly 1 in 10 of these highly leveraged clients defaults makes this a critical feature for the model.

Interestingly, the risk remains relatively flat for low-to-moderate leverage (hovering around 7.5% - 7.7%), suggesting that having some debt is normal and manageable. The danger signal really only activates once the debt exceeds the client's annual income.


### The ”Active Burden” Check

**Business Question Is the raw count of Active loans at other banks a linear risk factor? (i.e.,Is 5 active loans riskier than 2, or is there a threshold?)**


**Objective:** To distinguish between ”Past Experience” and ”Current Stress.” Having 10 closed loans is good (experience). Having 10 active loans is bad (desperation/stress).

<details>
<summary>Show Code</summary>

```python
query = """
with active_loan_counts as (
    select 
        SK_ID_CURR,
        -- Count only the loans that are currently Active
        count(*) as active_count
    from bureau
    where CREDIT_ACTIVE = 'Active'
    group by SK_ID_CURR
)

select 
    -- Segment clients by their number of Active external loans
    case 
        when b.active_count is null or b.active_count = 0 then 'No Active Loans'
        when b.active_count = 1 then 'Single Loan (1)'
        when b.active_count between 2 and 3 then 'Manageable (2-3)'
        when b.active_count between 4 and 6 then 'High Load (4-6)'
        when b.active_count between 7 and 10 then 'Very High (7-10)'
        else 'Extreme (> 10)'
    end as active_burden_segment,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join active_loan_counts b on a.SK_ID_CURR = b.SK_ID_CURR
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

| active_burden_segment   |   total_count |   risk_probability |
|:------------------------|--------------:|-------------------:|
| Extreme (> 10)          |           445 |               25.8 |
| Very High (7-10)        |          6009 |               14.2 |
| High Load (4-6)         |         40199 |               10   |
| No Active Loans         |         90361 |                7.8 |
| Manageable (2-3)        |         96394 |                7.8 |
| Single Loan (1)         |         74103 |                7.1 |

<br>

**Insights:**

We investigated whether the sheer number of active loans a client has at other institutions is a direct indicator of stress. The results confirm that while having a history of loans is fine, carrying too many active loans simultaneously is a massive risk factor.

The data shows a clear "danger zone" starting at 4 active loans.

- Safe Zone (1-3 Active Loans): Clients with a manageable number of loans (1-3) are actually the safest in the portfolio, with default rates between 7.1% and 7.8%. This suggests that moderate credit activity is a healthy sign of financial stability.

- Warning Zone (4-6 Active Loans): As soon as a client hits 4 active loans, the risk jumps to 10%.

- Critical Zone (>7 Active Loans): The risk accelerates rapidly here. Clients with 7-10 active loans have a 14.2% default rate.

- Extreme Risk (>10 Active Loans): This group is almost guaranteed to be problematic. With a default rate of 25.8%, more than 1 in 4 of these clients will crash. Although this group is small (445 cases), the signal is incredibly strong.

This proves that loan count is not linear; it is exponential. There is a distinct threshold at 4 active loans where the "experience" benefit turns into a "burden" risk.



### The ”Blacklist” Check (Bureau Balance Status) 

**Business Question: If a client had a ”Written Off” or ”Severe Default” status (Status 5) at any point in the last 2 years, is their default probability effectively 100%?**


**Objective:** This is the most critical query in the file. bureau balance tracks if a client was ever 120+ days late (STATUS = ’5’) or Sold (STATUS = ’5’) at another bank.


<details>
<summary>Show Code</summary>

```python
query = """
with blacklist_events as (
    select 
        b.SK_ID_CURR
    from bureau_balance bb
    -- We must join to the BUREAU table first to get the Client ID (SK_ID_CURR)
    join bureau b on bb.SK_ID_BUREAU = b.SK_ID_BUREAU
    where bb.STATUS = '5' -- Status 5 = Sold, Written Off, or > 120 Days Past Due
      and bb.MONTHS_BALANCE >= -24 -- Restrict to the last 2 years (recency matters)
    group by b.SK_ID_CURR
)

select 
    -- Segment clients based on presence of a "Nuclear" event
    case 
        when bl.SK_ID_CURR is not null then 'Blacklisted (Severe Default < 2 Yrs)'
        else 'Clean (No Recent Severe Default)'
    end as blacklist_check,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join blacklist_events bl on a.SK_ID_CURR = bl.SK_ID_CURR
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

| blacklist_check                      |   total_count |   risk_probability |
|:-------------------------------------|--------------:|-------------------:|
| Blacklisted (Severe Default < 2 Yrs) |          1285 |               11.4 |
| Clean (No Recent Severe Default)     |        306226 |                8.1 |

<br>

**Insights:**

The investigation into severe past defaults produced a counter-intuitive result that challenges the common assumption that a "written off" client is automatically a lost cause.

First, looking at the volume, the vast majority of our applicants are indeed "Clean." Out of the entire dataset, 306,226 applicants have no record of severe defaults in the last two years. Only a tiny fraction—1,285 applicants—fall into the "Blacklisted" category. This confirms that severe delinquency (Status 5) is a very rare event in this population.

Second, and most importantly, the data disproves the hypothesis that these clients have a "100% default probability." While the "Blacklisted" group is definitely riskier than average (11.4% vs 8.1%), they are nowhere near a guaranteed default. In fact, nearly 89% of the people who had a severe default in the past are currently paying their new loans successfully.

This tells us that while a past "write-off" is a negative signal, it is not a "fatal" one. A client can have a terrible history at another bank and still perform reasonably well with us, perhaps because our loan terms are different or their financial situation has improved.

<br>


### The ”Prolongation” Red Flag 

**Business Question: Does the act of ”Prolonging” a loan (even if eventually paid) signal a high-risk personality?**


**Objective:** To detect ”Struggling” borrowers. CNT CREDIT PROLONG counts how many times a client asked to extend a loan deadline. This is a subtle sign of inability to pay on time.

<details>
<summary>Show Code</summary>

<br>

```python
query = """
with prolongation_stats as (
    select 
        SK_ID_CURR,
        -- Sum how many times the client prolonged ANY loan at the bureau
        sum(CNT_CREDIT_PROLONG) as total_prolongations,
        -- Count how many active loans involved prolongations
        count(case when CNT_CREDIT_PROLONG > 0 then 1 end) as loans_with_prolongation
    from bureau
    group by SK_ID_CURR
)

select 
    -- Segment clients by their history of pushing deadlines
    case 
        when p.total_prolongations is null then 'No Bureau History'
        when p.total_prolongations = 0 then 'Never Prolonged (Disciplined)'
        when p.total_prolongations = 1 then 'Occasional Slip-up (1 time)'
        when p.total_prolongations between 2 and 5 then 'Struggling (2-5 times)'
        else 'Chronic Extender (> 5 times)'
    end as prolongation_behavior,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3) * 100 as risk_probability

from applications a
left join prolongation_stats p on a.SK_ID_CURR = p.SK_ID_CURR
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

| prolongation_behavior         |   total_count |   risk_probability |
|:------------------------------|--------------:|-------------------:|
| No Bureau History             |         44020 |               10.1 |
| Chronic Extender (> 5 times)  |            11 |                9.1 |
| Occasional Slip-up (1 time)   |          6869 |                8.9 |
| Struggling (2-5 times)        |          1628 |                7.9 |
| Never Prolonged (Disciplined) |        254983 |                7.7 |

<br>

**Insights:**

We investigated whether asking for a loan extension (prolongation) is a sign of a "high-risk personality." The data actually disproves this hypothesis. We found that "Prolongation" is a very weak predictor of default, unlike the strong signals we saw with "Active Loans" or "Utilization."

First, the vast majority of applicants (254,983) fall into the "Never Prolonged" category, establishing a stable baseline risk of 7.7%. When we look at clients who have extended loans, the risk barely changes. Those with an "Occasional Slip-up" (1 extension) rise slightly to 8.9%, and interestingly, the "Struggling" group (2-5 extensions) actually has a lower risk of 7.9%, effectively identical to the disciplined payers.

We also found a "Chronic Extender" group (>5 times), but with only 11 applicants, this segment is statistically irrelevant and should be ignored.

The most significant finding here actually concerns the "No Bureau History" group. These 44,020 applicants have the highest default rate in this entire analysis at 10.1%. This suggests that having no track record is actually more dangerous than having a track record of extending loans. In summary, existing clients who negotiate extensions tend to pay them back; it is the unknown clients who pose the real risk.


### The ”Microloan” vs. ”Mortgage” Profile

**Business Question: Does the Type of Credit held at other banks (CREDIT TYPE) radically change the risk profile?**

**Objective:** Not all debt is equal. A ”Mortgage” usually implies stability (Homeowner). A ”Microloan” usually implies poverty or desperation.

<details>
<summary>Show Code</summary>
<br>

```python
query = """
with credit_type_flags as (
    select 
        SK_ID_CURR,
        -- Check for specific high-signal credit types
        -- 'Microloan' often signals inability to get bank financing (Desperation)
        max(case when CREDIT_TYPE = 'Microloan' then 1 else 0 end) as has_microloan,
        -- 'Mortgage' signals asset ownership and stability
        max(case when CREDIT_TYPE = 'Mortgage' then 1 else 0 end) as has_mortgage
    from bureau
    group by SK_ID_CURR
)

select 
    -- Create a Hierarchy of Credit Profile Risk
    case 
        when c.SK_ID_CURR is null then 'No Bureau History'
        
        -- Priority 1: The Microloan Signal (Desperation overrides Stability)
        -- Even if they have a mortgage, needing a microloan is a major distress signal.
        when c.has_microloan = 1 then 'Microloan User (High Risk / Desperation)'
        
        -- Priority 2: The Mortgage Signal (Stability)
        -- Has Mortgage, but NO Microloans.
        when c.has_mortgage = 1 then 'Mortgage Holder (Stability / Asset Owner)'
        
        -- Priority 3: Standard Borrowers
        else 'Standard Consumer Credit Only'
    end as credit_profile_segment,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join credit_type_flags c on a.SK_ID_CURR = c.SK_ID_CURR
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

| credit_profile_segment                    |   total_count |   risk_probability |
|:------------------------------------------|--------------:|-------------------:|
| Microloan User (High Risk / Desperation)  |          3499 |               20.1 |
| No Bureau History                         |         44020 |               10.1 |
| Standard Consumer Credit Only             |        245806 |                7.7 |
| Mortgage Holder (Stability / Asset Owner) |         14186 |                5.1 |

<br>

**Insights:**

We tested whether the type of credit a client holds at other institutions is a signal of their financial health. The results provide one of the clearest risk segmentations in the entire project: Credit Type is a massive predictor of default.

The data reveals a stark contrast between "desperation" credit and "stability" credit:

The Danger Zone: Clients who use "Microloans" show an incredibly high default rate of 20.1%. This confirms that reliance on high-interest, short-term micro-credit is a major indicator of financial distress. Even though this group is smaller (3,499 applicants), their risk is nearly 3x the portfolio average.

The Safe Zone: On the opposite end, "Mortgage Holders" are the safest group in the entire dataset, with a default probability of just 5.1%. Owning a home (and qualifying for a mortgage) implies asset ownership and long-term stability, making these clients excellent borrowers.

The Average: The vast majority of applicants (245,806) hold "Standard Consumer Credit", sitting right at the average risk level of 7.7%.

Interestingly, the "No Bureau History" group again shows elevated risk (10.1%), reinforcing the finding that "unknown" entities are riskier than established "average" borrowers.


### The ”Credit Seeker” Velocity (Recency) 

**Business Question: Does a spike in New Loans Opened (e.g., in the last 90 days) correlate with default risk?**

**Objective:** To measure ”Hunger” for credit. DAYS CREDIT tells us when they opened the loan. If they opened 3 new loans in the last 30 days, they are ”Credit Seeking.”


<details>
<summary>Show Code</summary>
<br>

```python
query = """
with recent_activity as (
    select 
        SK_ID_CURR,
        -- Count loans opened in the last 90 days (DAYS_CREDIT is negative relative to application)
        -- -90 means "90 days ago"
        count(*) as new_loans_90d
    from bureau
    where DAYS_CREDIT >= -90
    group by SK_ID_CURR
)

select 
    -- Segment clients based on their "Velocity" of opening new accounts
    case 
        when r.new_loans_90d is null then 'No Recent Activity (Stable/Cold)'
        when r.new_loans_90d = 1 then 'Moderate Seeking (1 New Loan)'
        when r.new_loans_90d = 2 then 'High Seeking (2 New Loans)'
        else 'Desperate / Bust-out Behavior (> 2 New Loans)'
    end as credit_velocity_segment,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join recent_activity r on a.SK_ID_CURR = r.SK_ID_CURR
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

| credit_velocity_segment                       |   total_count |   risk_probability |
|:----------------------------------------------|--------------:|-------------------:|
| Desperate / Bust-out Behavior (> 2 New Loans) |          1791 |               22   |
| High Seeking (2 New Loans)                    |          5147 |               14.3 |
| Moderate Seeking (1 New Loan)                 |         31541 |               10.6 |
| No Recent Activity (Stable/Cold)              |        269032 |                7.6 |

<br>

**Insights:**

We analyzed whether a sudden spike in opening new loans (Credit Seeking) is a predictor of default. The results confirm that "Credit Hunger" is one of the most immediate and dangerous risk signals we have found.

There is a clear, stair-step increase in risk as a client opens more loans:

- The Baseline: The vast majority of clients (269,032) have "No Recent Activity". They are the safest group with a default rate of 7.6%. This confirms that stability is key to safety.

- The Warning: Clients who opened just 1 New Loan recently see their risk jump to 10.6%.

- The Danger Zone: Opening 2 New Loans pushes the risk to 14.3%.

- The Bust-Out: The most critical finding is the "Desperate / Bust-out" group (>2 new loans). Although this group is smaller (1,791 applicants), their default rate explodes to 22%. This suggests that anyone aggressively opening 3+ loans in a short window is likely planning to bust out (take the money and run) or is in severe distress.

Conclusion: Velocity matters. A client who was safe yesterday becomes toxic today if they suddenly open multiple accounts in a short period.


### The ”Currency” Risk (Macro Economics) 

**Business Question: Are clients with loans in foreign currencies (Currency 2, 3, etc.) riskier than those with local currency loans?**


**Objective:** (Optional but impressive). Some loans are in different currencies (CREDIT CURRENCY). In emerging markets, foreign currency loans can be risky if the local currency crashes.

<details>
<summary>Show Code</summary>
<br>

```python
query = """
with currency_exposure as (
    select 
        SK_ID_CURR,
        -- 'currency 1' is the standard local currency.
        -- We flag anyone who has ever touched a different currency (2, 3, or 4).
        max(case when CREDIT_CURRENCY != 'currency 1' then 1 else 0 end) as has_foreign_currency
    from bureau
    group by SK_ID_CURR
)

select 
    -- Segment clients by their FX (Foreign Exchange) exposure
    case 
        when c.SK_ID_CURR is null then 'No Bureau History'
        
        -- These clients have loans susceptible to exchange rate fluctuations
        when c.has_foreign_currency = 1 then 'Foreign Currency Exposure (High Risk)'
        
        -- These clients borrow exclusively in the local currency
        else 'Local Currency Only (Standard)'
    end as currency_profile,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join currency_exposure c on a.SK_ID_CURR = c.SK_ID_CURR
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

| currency_profile                      |   total_count |   risk_probability |
|:--------------------------------------|--------------:|-------------------:|
| No Bureau History                     |         44020 |               10.1 |
| Local Currency Only (Standard)        |        262523 |                7.7 |
| Foreign Currency Exposure (High Risk) |           968 |                5.4 |

<br>

**Insights:**

We investigated whether holding loans in foreign currencies (which can be volatile) is a risk factor. The results were surprising and completely inverted our hypothesis. We assumed foreign currency debt would be dangerous, but the data shows it is actually a strong signal of safety.

Clients with "Foreign Currency Exposure" have the lowest default probability in this category at just 5.4%. This is significantly safer than the "Local Currency Only" group, which sits at the standard portfolio average of 7.7%.

Why is this happening? In many emerging markets, foreign currency loans (like USD or EUR) are often reserved for "Premium" or "Corporate" clients with high stability, while the general public is restricted to local currency. Therefore, this feature acts as a proxy for "Wealth" or "Sophistication" rather than distress.

Once again, the highest risk actually comes from the "No Bureau History" group (10.1%), confirming that the "Unknown" is always riskier than the "Known".


##  Bridge Analysis 


### The ”True” Debt-to-Income Ratio (Bureau + Application)


**Business Question: When we combine the Annual Payment of the current loan (AMT ANNUITY) with the estimated monthly payments of their external debts (Bureau: AMT ANNUITY), does the risk profile change for ”seemingly safe” clients?**


**Objective:** In applications table, we only calculate the ratio for our loan. But the client might be drowning in debt elsewhere. We need the Global DTI.


<details>
<summary>Show Code</summary>
<br>

```python
query = """
with external_commitments as (
    select 
        SK_ID_CURR,
        -- Summing up the annuity (periodic payment) for all ACTIVE external loans.
        -- We filter for 'Active' because closed loans don't require current payments.
        -- Note: AMT_ANNUITY in bureau is often NULL, implying missing data, so we coalesce to 0.
        sum(coalesce(AMT_ANNUITY, 0)) as external_annuity_total
    from bureau
    where CREDIT_ACTIVE = 'Active'
    group by SK_ID_CURR
)

select 
    -- Calculate Global DTI: (Current Loan Payment + External Debt Payments) / Total Income
    -- We measure what % of the client's Total Income is eaten up by debt obligations.
    case 
        when a.AMT_INCOME_TOTAL is null or a.AMT_INCOME_TOTAL = 0 then 'Invalid Income'
        
        -- Safe: Total debt payments are less than 20% of income. Plenty of buffer.
        when ((coalesce(a.AMT_ANNUITY, 0) + coalesce(e.external_annuity_total, 0)) / a.AMT_INCOME_TOTAL) < 0.20 
            then 'Very Safe (< 20% DTI)'
            
        -- Standard: 20-40% of income goes to debt. This is the banking norm.
        when ((coalesce(a.AMT_ANNUITY, 0) + coalesce(e.external_annuity_total, 0)) / a.AMT_INCOME_TOTAL) < 0.40 
            then 'Manageable (20-40% DTI)'
            
        -- High: 40-60% of income. Any income shock (job loss, sickness) will cause default.
        when ((coalesce(a.AMT_ANNUITY, 0) + coalesce(e.external_annuity_total, 0)) / a.AMT_INCOME_TOTAL) < 0.60 
            then 'High Burden (40-60% DTI)'
            
        -- Critical: > 60% of income goes to debt service. They are likely borrowing just to pay interest.
        else 'Over-Leveraged (> 60% DTI)'
    end as global_dti_segment,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join external_commitments e on a.SK_ID_CURR = e.SK_ID_CURR
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

| global_dti_segment         |   total_count |   risk_probability |
|:---------------------------|--------------:|-------------------:|
| Over-Leveraged (> 60% DTI) |          7606 |               10.9 |
| High Burden (40-60% DTI)   |         16092 |                8.8 |
| Manageable (20-40% DTI)    |        104414 |                8.5 |
| Very Safe (< 20% DTI)      |        179399 |                7.6 |

<br>

**Insights:**

We calculated the "Global DTI" by combining the loan payments for the current application with the payments the client is already making to other banks. This gives us a much more realistic picture of their monthly burden than just looking at our loan in isolation.

The data confirms that as the total debt burden rises, the risk of default increases steadily. The safest clients are those with "Very Safe" ratios (< 20% of income going to debt), who make up the majority of the portfolio (179,399 applicants) and have a low default rate of 7.6%. As we move up the ladder, the risk climbs: clients with a "High Burden" (40-60% DTI) sit at 8.8% risk.

The most critical finding is the "Over-Leveraged" group (> 60% DTI). These 7,606 clients are paying more than half their income just to service debt. Their default rate jumps to 10.9%, which is significantly higher than the baseline. This proves that we cannot accurately assess a client's safety unless we look at their total wallet, including debts at other institutions.


### The ”Jekyll & Hyde” Borrower (Bureau + Installments) 


**Business Question: Are clients who are ”Perfect Payers” with Home Credit (0 days late) but ”Delinquent” with other banks (Bureau Status ¿ 0) highly likely to default on us eventually?**

**Objective:** To detect ”Selective Default.” Some clients pay their Mortgage (to keep their house) but default on their Credit Cards. Others pay Home Credit (to keep their phone) but default on other banks.


<details>
<summary>Show Code</summary>
<br>

```python
query = """
with internal_performance as (
    select 
        SK_ID_CURR,
        -- Calculate max DPD on Home Credit loans.
        -- GREATEST(0, ...) ensures we don't count early payments as negative days.
        -- A max_dpd of 0 means they have NEVER been late on a recorded installment.
        max(GREATEST(0, DAYS_ENTRY_PAYMENT - DAYS_INSTALMENT)) as max_internal_dpd
    from installments_payments
    where DAYS_ENTRY_PAYMENT is not null
    group by SK_ID_CURR
),

external_performance as (
    select 
        b.SK_ID_CURR,
        -- Check if client has ANY record of delinquency (Status 1-5) in Bureau Balance
        -- Status 0 = OK, C = Closed, X = Unknown. 
        -- Status 1-5 = Days Past Due ranges (Bad).
        max(case 
            when bb.STATUS in ('1', '2', '3', '4', '5') then 1 
            else 0 
        end) as has_external_delinquency
    from bureau b
    join bureau_balance bb on b.SK_ID_BUREAU = bb.SK_ID_BUREAU
    group by b.SK_ID_CURR
)

select 
    -- Segment the Borrower Types
    case 
        when i.max_internal_dpd is null then 'Insufficient Internal History'
        
        -- Segment 1: The "Jekyll & Hyde" (Selective Defaulter)
        -- They pay US perfectly (0 DPD), but have defaulted elsewhere.
        -- This signals they are prioritizing bills and we might be next to be dropped.
        when i.max_internal_dpd = 0 and e.has_external_delinquency = 1 
            then 'Jekyll & Hyde (Perfect Internal / Bad External)'
            
        -- Segment 2: The "True Saint"
        -- Perfect record with us AND perfect record externally.
        when i.max_internal_dpd = 0 and (e.has_external_delinquency = 0 or e.has_external_delinquency is null)
            then 'True Saint (Perfect Everywhere)'
            
        -- Segment 3: The "Known Risk"
        -- They are already late with us. External data just confirms what we know.
        when i.max_internal_dpd > 0 
            then 'Known Internal Risk (Late with Home Credit)'
            
        else 'Unknown / No External Data'
    end as borrower_profile,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
-- We only analyze clients who have at least some payment history with Home Credit
inner join internal_performance i on a.SK_ID_CURR = i.SK_ID_CURR
left join external_performance e on a.SK_ID_CURR = e.SK_ID_CURR
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

| borrower_profile                                |   total_count |   risk_probability |
|:------------------------------------------------|--------------:|-------------------:|
| Known Internal Risk (Late with Home Credit)     |        154999 |                9.4 |
| Jekyll & Hyde (Perfect Internal / Bad External) |          8830 |                8.4 |
| True Saint (Perfect Everywhere)                 |        127806 |                6.7 |

<br>

**Insights:**

We tested the "Selective Default" theory to see if clients who treat us well (Perfect Internal history) but treat other banks badly (Bad External history) are a hidden risk. The data confirms that looking outside our own walls is valuable for spotting these "fakers."

The safest borrowers are the "True Saints"—people who pay everyone on time. They have the lowest default rate of 6.7%.

The "Jekyll & Hyde" group (perfect with us, but bad elsewhere) is definitely riskier, with a default rate of 8.4%. This confirms that even if a client looks perfect on our internal reports, trouble at another bank is a strong warning sign that we might be next. This helps us flag 8,830 clients who would otherwise fly under the radar.

However, the strongest predictor is still how they treat us directly. The "Known Internal Risk" group (people who are already late with Home Credit) remains the most dangerous segment at 9.4%. This tells us that while external data adds value, a client's behavior with our own loans is still the "loudest" signal of all.


### The ”Living Beyond Means” Flag (Credit Card + Income)

**Business Question: Is the ratio of ”Credit Card Limit” to ”Reported Income” a risk factor? (Does having access to credit 5x your salary make you safer or riskier?)**

**Objective:** To validate reported income. If a client reports 30k income but has a credit card limit of `$100k` and spends `$50k/year`, they are likely lying about their income (or have hidden wealth).

<details>
<summary>Show Code</summary>
<br>

```python
query = """
with client_credit_limits as (
    select 
        SK_ID_CURR,
        -- We look for the maximum credit limit the client has ever been approved for.
        -- This serves as a proxy for the maximum "trust" banks have extended to them.
        -- Using MAX avoids issues with recent months missing or limits fluctuating temporarily.
        max(AMT_CREDIT_LIMIT_ACTUAL) as max_credit_limit
    from credit_card_balance
    where AMT_CREDIT_LIMIT_ACTUAL > 0
    group by SK_ID_CURR
)

select 
    -- Calculate the "Limit-to-Income" Ratio (Credit Limit / Annual Income)
    case 
        when c.max_credit_limit is null then 'No Credit Card History'
        when a.AMT_INCOME_TOTAL is null or a.AMT_INCOME_TOTAL = 0 then 'Invalid Income Data'
        
        -- Segment 1: Low Trust. Limit is a small fraction of annual income.
        when (c.max_credit_limit / a.AMT_INCOME_TOTAL) <= 0.20 
            then 'Conservative Limit (< 20% Income)'
            
        -- Segment 2: Standard Banking Practice.
        when (c.max_credit_limit / a.AMT_INCOME_TOTAL) <= 0.50 
            then 'Standard Limit (20-50% Income)'
            
        -- Segment 3: High Trust. Limit approaches full annual salary.
        when (c.max_credit_limit / a.AMT_INCOME_TOTAL) <= 1.00 
            then 'High Trust (50-100% Income)'
            
        -- Segment 4: Very High. Limit exceeds annual salary.
        when (c.max_credit_limit / a.AMT_INCOME_TOTAL) <= 2.00 
            then 'Very High Trust (1x - 2x Income)'
            
        -- Segment 5: Outlier. Limit is massive compared to reported income.
        else '"Hidden Wealth" or Extreme (> 2x Income)'
    end as limit_income_ratio,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join client_credit_limits c on a.SK_ID_CURR = c.SK_ID_CURR
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

| limit_income_ratio                       |   total_count |   risk_probability |
|:-----------------------------------------|--------------:|-------------------:|
| Very High Trust (1x - 2x Income)         |         26978 |                9.1 |
| High Trust (50-100% Income)              |         23146 |                8.5 |
| "Hidden Wealth" or Extreme (> 2x Income) |         21861 |                8.4 |
| Standard Limit (20-50% Income)           |         12522 |                8.2 |
| No Credit Card History                   |        221475 |                7.9 |
| Conservative Limit (< 20% Income)        |          1529 |                7.8 |

<br>

**Insights:**

We investigated whether having a Credit Card Limit that is significantly higher than the client's reported income is a sign of danger (living beyond means) or a sign of trust (hidden wealth). The data suggests it is primarily a risk factor, disproving the "hidden wealth" safety theory for this specific portfolio.

There is a clear positive correlation: as the limit grows relative to income, the default risk increases.

The Safest Group: Clients with "Conservative Limits" (< 20% of their income) are the safest, with a default probability of 7.8%. This indicates that keeping credit lines proportional to income is a healthy sign.

The Risk Escalation: As the limit rises to "Standard" (20-50%) and "High Trust" (50-100%), the risk creeps up to 8.2% and 8.5% respectively.

The Danger Peak: The highest risk is found in the "Very High Trust" group (Limit is 1x - 2x Income), where the default rate hits 9.1%. This suggests that when banks extend too much credit relative to a salary, it often backfires.

However, there is an interesting twist at the very top. The "Hidden Wealth / Extreme" group (Limit > 2x Income) actually sees the risk drop slightly to 8.4%. This implies that at the extreme end, some of these clients likely do have unreported income or assets that justify the massive limits, making them slightly safer than the "Very High Trust" group, but still riskier than the conservative borrowers.


### The ”Shopping Spree” Velocity (Previous App + Bureau) 

**Business Question: If a client applied for a Home Credit loan (Previous App) AND an External Loan (Bureau) in the same month, does this ”Simultaneous Seeking” signal high risk?**

**Objective:** To measure ”Total Market Thirst.” We want to know if they are applying for loans everywhere simultaneously.


<details>
<summary>Show Code</summary>
<br>

```python
query = """
with internal_dates as (
    select SK_ID_CURR, DAYS_DECISION
    from previous_applications
),

external_dates as (
    select SK_ID_CURR, DAYS_CREDIT
    from bureau
),

simultaneous_events as (
    select 
        i.SK_ID_CURR,
        -- Count how many times an internal application 'overlapped' with an external one
        -- ABS(diff) <= 30 checks if they happened within the same month-long window
        count(*) as spree_count
    from internal_dates i
    join external_dates e on i.SK_ID_CURR = e.SK_ID_CURR
    where abs(i.DAYS_DECISION - e.DAYS_CREDIT) <= 30
    group by i.SK_ID_CURR
)

select 
    -- Segment clients by their "Market Thirst"
    case 
        when s.spree_count is null then 'No Simultaneous Activity'
        when s.spree_count = 0 then 'No Simultaneous Activity'
        
        -- Occasional overlap could be coincidence or normal mortgage shopping
        when s.spree_count between 1 and 2 then 'Coincidence / Normal Shopping (1-2)'
        
        -- Multiple overlaps indicate a pattern of applying everywhere at once
        when s.spree_count between 3 and 5 then 'High Thirst (3-5 Overlaps)'
        
        -- Extreme overlap is a "Bust-out" signal (Desperation)
        else 'Desperate / Shotgun Approach (> 5 Overlaps)'
    end as shopping_spree_behavior,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join simultaneous_events s on a.SK_ID_CURR = s.SK_ID_CURR
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

| shopping_spree_behavior                     |   total_count |   risk_probability |
|:--------------------------------------------|--------------:|-------------------:|
| Desperate / Shotgun Approach (> 5 Overlaps) |         12071 |               12.7 |
| High Thirst (3-5 Overlaps)                  |         22239 |                9.8 |
| Coincidence / Normal Shopping (1-2)         |         64305 |                7.9 |
| No Simultaneous Activity                    |        208896 |                7.7 |

<br>

**Insights:**

We analyzed whether applying for loans at Home Credit and other banks at the exact same time ("Simultaneous Seeking") is a sign of desperation. The results show a clear distinction between "healthy shopping" and "desperate shotgunning."

For most clients, a little bit of overlap is perfectly normal. The "Coincidence / Normal Shopping" group (1-2 overlaps) has a default rate of 7.9%, which is almost identical to the baseline of 7.7% for clients with "No Simultaneous Activity". This tells us that if a client is just checking a couple of options to find the best rate, they are safe.

The red flag only appears when the behavior becomes aggressive.

High Thirst: Clients with 3-5 simultaneous applications see their risk rise to 9.8%.

The Shotgun Approach: The real danger zone is clients with >5 overlaps. These 12,071 applicants have a default rate of 12.7%.

This confirms that applying for credit "everywhere at once" is a strong predictor of default, but only when the volume is high. It signals that the client is likely being rejected elsewhere and is frantically trying to get approved by anyone who will say yes.


###  The ”Asset Contradiction” (Housing + Credit Card) 

**Business Question: Are clients who list ”High Status” housing but show ”Desperate” spending behavior (High Cash Withdrawals) actually high risk?**


**Objective** To find ”Fake Wealth.” A client claims to live in a ”High-End Apartment” (Application data) but frequently withdraws Cash from ATMs (Credit Card data). This contradiction suggests they might be living in a family home but are personally broke.

<details>
<summary>Show Code</summary>
<br>

```python
query = """
with spending_behavior as (
    select 
        SK_ID_CURR,
        -- Summing ATM withdrawals and Total Spend
        sum(coalesce(AMT_DRAWINGS_ATM_CURRENT, 0)) as atm_spend,
        sum(coalesce(AMT_DRAWINGS_CURRENT, 0)) as total_spend
    from credit_card_balance
    where AMT_DRAWINGS_CURRENT > 0 -- Filter for active cards only
    group by SK_ID_CURR
)

select 
    -- Segment: Cross-reference Housing Status (Region Rating) with Spending Behavior (ATM Usage)
    case 
        when s.SK_ID_CURR is null then 'No Credit Card Data'
        
        -- The "Contradiction": Living in a Top Region (Rating 1) but living on Cash (Desperate?)
        -- ATM usage > 50% of total spending
        when a.REGION_RATING_CLIENT = 1 and (s.atm_spend / s.total_spend) > 0.50 
            then 'Fake Wealth (Top Region / High Cash Reliance)'
            
        -- The "Real Deal": Top Region and uses card for goods (Financially Sophisticated)
        when a.REGION_RATING_CLIENT = 1 and (s.atm_spend / s.total_spend) <= 0.50 
            then 'True Wealth (Top Region / Card Spender)'
            
        -- The "Struggling": Lower Region and living on Cash
        when a.REGION_RATING_CLIENT > 1 and (s.atm_spend / s.total_spend) > 0.50 
            then 'Struggling (Lower Region / High Cash Reliance)'
            
        -- The "Standard": Lower Region but standard card usage
        else 'Standard (Lower Region / Card Spender)'
    end as asset_contradiction_segment,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join spending_behavior s on a.SK_ID_CURR = s.SK_ID_CURR
group by 1
order by 
    risk_probability desc
"""

t5 = con.execute(query).fetchdf()
t5
```

</details>
<br>


| asset_contradiction_segment                    |   total_count |   risk_probability |
|:-----------------------------------------------|--------------:|-------------------:|
| Struggling (Lower Region / High Cash Reliance) |         37167 |               10.8 |
| Standard (Lower Region / Card Spender)         |         15274 |               10.4 |
| No Credit Card Data                            |        247875 |                7.6 |
| Fake Wealth (Top Region / High Cash Reliance)  |          4784 |                6.1 |
| True Wealth (Top Region / Card Spender)        |          2411 |                5.3 |

<br>

**Insights:**

This cross-check between where clients live and how they spend money produced a surprising result that actually contradicts our "Fake Wealth" theory. We initially thought that people living in expensive areas but relying on cash withdrawals (ATM usage) would be hiding financial stress, but the data shows they are actually quite safe.

The "Fake Wealth" group (Top Region + High Cash Reliance) has a very low default rate of just 6.1%. This is significantly better than the portfolio average. This suggests that for wealthier clients, using cash isn't necessarily a sign of desperation—it might just be a lifestyle preference or used for specific types of purchases that require cash. The safest group of all is the "True Wealth" segment (Top Region + Card Spenders), with a rock-bottom risk of 5.3%.

The real danger zone is clearly determined by the region rather than the spending method. The "Struggling" group (Lower Region + High Cash Reliance) has the highest default rate in this category at 10.8%. Even the "Standard" group in these lower regions is risky at 10.4%. Essentially, the economic stability of the region is a much stronger predictor than whether the client uses an ATM or a POS terminal.


###  The ”Loyalty” Defense (Previous App + Current Risk) 


**Business Question: Does a high count of ”Previously Completed Loans” neutralize the risk of ”Bad Demographics” (e.g., Young Age, Low Income)?**

**Objective:** To see if ”Relationship History” overrides ”Demographic Risk.” Can a ”Young, Single Laborer” (usually High Risk) become ”Low Risk” if they have successfully paid off 3 previous Home Credit loans?


<details>
<summary>Show Code</summary>
<br>

```python
query = """
with loyalty_history as (
    select 
        SK_ID_CURR,
        -- Count how many previous loans were actually flagged as 'Completed'
        -- We count DISTINCT SK_ID_PREV to count contracts, not installments.
        count(distinct SK_ID_PREV) as count_completed_loans
    from pos_cash_balance
    where NAME_CONTRACT_STATUS = 'Completed'
    group by SK_ID_CURR
)

select 
    -- 1. Define the Demographic Risk Profile
    -- 'Young' (< 30 years old) is typically the highest risk demographic segment.
    -- DAYS_BIRTH is negative days. -10950 days is approx 30 years.
    case 
        when a.DAYS_BIRTH >= -10950 then 'High Risk Demo (Young < 30)'
        else 'Low Risk Demo (Mature 30+)'
    end as demographic_profile,

    -- 2. Define the Relationship / Loyalty Depth
    case 
        when l.count_completed_loans is null or l.count_completed_loans = 0 then 'No History (New)'
        when l.count_completed_loans = 1 then 'Testing Waters (1 Loan)'
        when l.count_completed_loans = 2 then 'Recurring (2 Loans)'
        else 'Loyal (> 2 Loans)'
    end as loyalty_status,

    -- Risk Metrics
    count(*) as total_count,
    round(avg(a.TARGET), 3)*100 as risk_probability

from applications a
left join loyalty_history l on a.SK_ID_CURR = l.SK_ID_CURR
group by 1, 2
order by 
    risk_probability desc
"""

t6 = con.execute(query).fetchdf()
t6
```

</details>
<br>

**Results:**

| demographic_profile         | loyalty_status          |   total_count |   risk_probability |
|:----------------------------|:------------------------|--------------:|-------------------:|
| High Risk Demo (Young < 30) | Testing Waters (1 Loan) |         17419 |               13.1 |
| High Risk Demo (Young < 30) | No History (New)        |          7938 |               11   |
| High Risk Demo (Young < 30) | Recurring (2 Loans)     |         10077 |               11   |
| High Risk Demo (Young < 30) | Loyal (> 2 Loans)       |          9587 |                9.3 |
| Low Risk Demo (Mature 30+)  | Testing Waters (1 Loan) |         87445 |                8.3 |
| Low Risk Demo (Mature 30+)  | No History (New)        |         42357 |                8.2 |
| Low Risk Demo (Mature 30+)  | Recurring (2 Loans)     |         57215 |                7.2 |
| Low Risk Demo (Mature 30+)  | Loyal (> 2 Loans)       |         75473 |                6.5 |

<br>

**Insights:**

This final cross-check reveals that while customer loyalty is valuable, it is not a magic shield against demographic risk. We hoped that a young, "high-risk" client who has paid off multiple loans would become as safe as an older client, but the data tells a different story.

Loyalty definitely helps reduce risk within each group. For "High Risk" applicants (Young < 30), the default rate drops from a dangerous 13.1% (for those testing the waters) down to 9.3% for "Loyal" clients who have completed more than 2 loans. This is a significant improvement, proving that trust is earned over time.

However, the "Demographic Gravity" is still stronger than loyalty. The most critical finding is that a "Loyal" Young client (9.3% risk) is still riskier than a "New" Mature client (8.2% risk). Even after proving themselves multiple times, a young borrower cannot reach the safety level of a standard older borrower.

Conclusion: Loyalty acts as a discount on risk, but it does not neutralize it. A young applicant is always inherently riskier, no matter how many times they have paid us back in the past.


##  Conclusion 

Finally, we have completed our comprehensive risk analysis by cross-checking multiple data sources to uncover hidden patterns and contradictions. The key takeaways from this deep dive are:

- **Behavioral Velocity Matters:** Clients who suddenly open multiple loans in a short period are significantly riskier, confirming that "Credit Hunger" is a powerful signal of distress.
- **Foreign Currency Loans Are Not Always Risky:** Contrary to our initial hypothesis, clients with foreign currency exposure were actually safer, likely because these loans are reserved for wealthier, more stable clients.
- **Global DTI Is Essential:** Assessing a client's total debt burden across all institutions provides a much clearer picture of their financial health than looking at our loan in isolation.
- **Selective Default Exists:** Clients who are perfect with us but delinquent elsewhere are a hidden risk segment that we can now identify and monitor.
- **Credit Limits Relative to Income Are Telling:** Having a credit limit that is too high compared to reported income is a strong risk factor, while conservative limits are a sign of safety.
- **Simultaneous Loan Seeking Is a Red Flag:** Applying for multiple loans at the same time is a strong predictor of default, especially when the volume of applications is high.
- **Contradictory Signals Can Be Misleading:** Living in a high-end area but relying heavily on cash withdrawals was initially thought to be a sign of fake wealth, but it turned out to be a lifestyle choice that is actually associated with lower risk.
- **Loyalty Reduces but Does Not Eliminate Risk:** While having a history of completed loans reduces risk, it does not fully neutralize the inherent risk associated with certain demographics, such as young age.  
- **Data-Driven Decision Making Is Key:** These insights allow us to refine our risk models, improve our credit policies, and ultimately make smarter lending decisions that balance growth with portfolio health. By leveraging the full spectrum of data available, we can move beyond surface-level analysis and uncover the deeper truths about our clients' financial behaviors and risks.

**Next Steps:** We defined the important risk signals and segments. Now we will use these insights to engineer new features for our machine learning models, and also to create targeted strategies for monitoring and managing high-risk clients. We will create a final dataframe which consists of all the important features we have discovered, and then we will move on to the modeling phase where we will build predictive models to forecast default risk based on these features.




















