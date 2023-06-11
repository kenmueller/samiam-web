# SamIam web

SamIam web is a cloud port of the [Automated Reasoning group at UCLA](http://reasoning.cs.ucla.edu/)'s [SamIam software](http://reasoning.cs.ucla.edu/samiam). The original SamIam software is split into SamIam web and SamIam lib and rewritten in TypeScript and React. SamIam web uses SamIam lib as its inference engine. This software is now available at https://samiam.vercel.app.

DAG construction and editing is ported from [DAG Monster](https://github.com/kenmueller/dagger) ([website](https://dag.monster)).

# SamIam lib

SamIam lib is an inference library port the [Automated Reasoning group at UCLA](http://reasoning.cs.ucla.edu/)'s original [SamIam software](http://reasoning.cs.ucla.edu/samiam).

# Status

Tentative roadmap:

## Version 1

Features:

- DAG editor
- Shenoy-Shafer algorithm
  - Probability of evidence
  - Single variable prior and posterior marginals
  - MPE
  - MAP
  - Sensitivity analysis
- Reading/writing network files in the cloud
- Reading/writing network files locally
- Repository of example Bayesian networks

## Version 2

Complete port of [SamIam](https://github.com/uclareasoning/SamIam) with the addition of:

- Interventional causal queries
- Multiple variable prior and posterior marginals

## Version 3

Features:

- Counterfactual causal queries
- Server side inference
