# Amazon Seller Revenue Diagnostics

A dashboard prototype for small third-party Amazon sellers who find out about
sales problems only after revenue has already dropped.

Existing seller reports show *what* happened. This prototype explains the
*likely why* and tells the seller *what to do first*.

## The problem
Small brand owners have thin margins, no analyst, and limited time. A sales
decline can come from lost search rank, lost Buy Box, competitor price changes,
weaker conversion, stockouts, or rising returns, and checking each report
manually is slow.

## The aha moment
In under 30 seconds the seller sees why sales dropped, what is *not* the
problem, and the one action to take first, through a revenue bridge that
splits the decline into likely driver contributions.

## Key screens
1. Overview: health metric, sales trend, Act Now actions
2. Sales-change diagnostic: driver comparison, evidence, impact, next action
3. Product/SKU performance table with priority status
4. Product deep dive: search, Buy Box and pricing, conversion, inventory, returns
5. Act Now action centre: ranked actions with status tracking

## Primary metric
Net sales after returns (or contribution profit per SKU, if cost and fee
data are assumed).

## Design principles
- Decisions over metrics: every number supports an action
- "Likely driver", never "proven cause"
- RAG colours only where they lead to an action
- No automatic price cuts; margin is always considered



