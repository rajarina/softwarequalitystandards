const QUESTIONS = [
  {
    id: 1,
    question: "According to IEEE, software quality is best described as:",
    options: [
      "The absence of bugs and errors in the codebase",
      "The degree to which a system meets specified requirements and customer needs",
      "A product's ability to pass all automated test suites",
      "Compliance with ISO/IEC 25010:2023 characteristics"
    ],
    correct: 1,
    explanation: "IEEE defines quality as conformance to specified requirements AND customer needs — not just bug counts or test results."
  },
  {
    id: 2,
    question: "Which stakeholder perspective focuses on ROI, reliability, and competitive feature delivery speed?",
    options: [
      "Developer perspective",
      "End user perspective",
      "Business owner perspective",
      "Regulator perspective"
    ],
    correct: 2,
    explanation: "Business owners evaluate quality based on return on investment, system reliability, and how fast competitive features are delivered."
  },
  {
    id: 3,
    question: "A mobile banking app crashes silently and logs an error internally, but the user sees no impact. What has occurred?",
    options: [
      "A failure has occurred",
      "A fault has been triggered into a failure",
      "A fault exists but no failure has occurred",
      "An error has occurred with no resulting fault"
    ],
    correct: 2,
    explanation: "A fault (defect in code) exists, but because no externally observable behaviour deviation occurred, it has not become a failure. These are called dormant faults."
  },
  {
    id: 4,
    question: "Which of the following is a NEW characteristic added to ISO/IEC 25010 in the 2023 update?",
    options: [
      "Security",
      "Maintainability",
      "Safety",
      "Reliability"
    ],
    correct: 2,
    explanation: "Safety and Flexibility were the two new additions in the 2023 revision. The others existed in the 2011 version."
  },
  {
    id: 5,
    question: "A team deploys 15 times per week with a 0.5% change failure rate. Which DORA performance tier best describes them?",
    options: [
      "Low performer",
      "Medium performer",
      "High performer",
      "Elite performer"
    ],
    correct: 3,
    explanation: "Elite performers deploy on-demand with a change failure rate under 1%. This team qualifies as elite on both metrics."
  },
  {
    id: 6,
    question: "ISO/IEC 25059:2023 introduces quality dimensions specifically for AI systems. Which of these is NOT among its dimensions?",
    options: [
      "Fairness",
      "Model drift",
      "Deployment frequency",
      "Explainability"
    ],
    correct: 2,
    explanation: "Deployment frequency is a DORA metric, not an AI quality dimension. ISO 25059 covers fairness, explainability, robustness, model accuracy, transparency, and model drift."
  },
  {
    id: 7,
    question: "FURPS+ was developed by which organisation in 1992?",
    options: [
      "ISO",
      "IEEE",
      "Hewlett-Packard",
      "Google"
    ],
    correct: 2,
    explanation: "FURPS+ was developed by HP (Hewlett-Packard) in 1992 and remains widely used in Agile planning and software requirements specification today."
  },
  {
    id: 8,
    question: "In McCall's 1977 model, which category includes correctness, reliability, efficiency, integrity, and usability?",
    options: [
      "Product Revision",
      "Product Transition",
      "Product Operation",
      "Product Delivery"
    ],
    correct: 2,
    explanation: "McCall's Product Operation category covers the runtime-facing qualities: correctness, reliability, efficiency, integrity, and usability."
  },
  {
    id: 9,
    question: "What does MTTR stand for in DORA metrics?",
    options: [
      "Maximum Time To Release",
      "Mean Time To Restore",
      "Minimum Test-to-Release Ratio",
      "Mean Time To Report"
    ],
    correct: 1,
    explanation: "MTTR = Mean Time To Restore — the average time from a production failure occurring to the service being fully restored."
  },
  {
    id: 10,
    question: "Which ISO standard specifically measures internal code structural quality — finding SQL injection risks, race conditions, and code complexity?",
    options: [
      "ISO/IEC 25010:2023",
      "ISO/IEC 25059:2023",
      "ISO/IEC 5055:2021",
      "ISO 9126:2001"
    ],
    correct: 2,
    explanation: "ISO/IEC 5055:2021 measures structural weaknesses inside the codebase: security (SQL injection, hardcoded credentials), reliability (crashes, leaks), performance (slow code), and maintainability (complexity, duplication)."
  },
  {
    id: 11,
    question: "Which sub-characteristic under ISO/IEC 25010 Operability covers the ability for users with disabilities to use the software?",
    options: [
      "Learnability",
      "Helpfulness",
      "Accessibility",
      "User error protection"
    ],
    correct: 2,
    explanation: "Accessibility is an Operability sub-characteristic covering comfortable use for all users including those using screen readers, voice assistants, and other assistive technologies. Governed by WCAG 2.2."
  },
  {
    id: 12,
    question: "\"Accepting quality as compliance to explicit requirements ONLY leads to poor user experience.\" What concept does this statement support?",
    options: [
      "That implicit requirements must also be considered",
      "That ISO 25010 is the only valid quality model",
      "That testing should be automated",
      "That DORA metrics are irrelevant"
    ],
    correct: 0,
    explanation: "Explicit requirements are formally documented (specs, SLAs, API contracts). Implicit requirements are reasonably expected but not written — e.g. a mobile app should not drain battery. Ignoring implicit requirements leads to poor UX."
  },
  {
    id: 13,
    question: "Which DORA metric was added in 2024 to measure unplanned deployments made to fix issues?",
    options: [
      "Change failure rate",
      "Lead time for changes",
      "Reliability index",
      "Rework rate"
    ],
    correct: 3,
    explanation: "Rework Rate was added to DORA in 2024. It measures the proportion of deployments that are unplanned fixes — a proxy for technical debt and instability."
  },
  {
    id: 14,
    question: "The relationship between errors, faults, and failures is described as:",
    options: [
      "One-to-one — each error produces exactly one fault and one failure",
      "Non-linear — one error can cause multiple faults; one fault can trigger multiple failures",
      "Linear — faults always cause failures in all usage scenarios",
      "Inverse — more errors mean fewer failures"
    ],
    correct: 1,
    explanation: "The relationship is complex and non-linear. One error can produce multiple faults in different code areas. One fault may trigger multiple failures under different inputs, or may never trigger any failure (dormant bug)."
  },
  {
    id: 15,
    question: "A developer misunderstood a requirement that GPS coordinates can return null in tunnels. In defect terminology, this misunderstanding is called:",
    options: [
      "A fault",
      "A failure",
      "An error",
      "A defect"
    ],
    correct: 2,
    explanation: "An error is the human root cause — an incorrect or missing human action. The misunderstanding leads to a fault (missing null check in code), which may then cause a failure (app crash when GPS is weak)."
  },
  {
    id: 16,
    question: "Which modern principle embeds quality checks from day one of development, catching errors before they become faults?",
    options: [
      "Shift-right testing",
      "Regression testing",
      "Shift-left testing",
      "Exploratory testing"
    ],
    correct: 2,
    explanation: "Shift-left testing means moving quality activities earlier in the development lifecycle — catching errors before they become faults, and faults before they become failures. Standard in modern DevOps."
  },
  {
    id: 17,
    question: "What is the key limitation of both McCall (1977) and Boehm (1978) quality models?",
    options: [
      "They do not include usability as a factor",
      "They have no availability metric, no standalone security factor, and no AI or cloud considerations",
      "They are too complex for modern software teams",
      "They were never adopted by any industry standard"
    ],
    correct: 1,
    explanation: "McCall and Boehm are foundational but limited. They lack an availability metric, standalone security factor, and have no AI, cloud-native, or IoT considerations — all addressed by modern standards like ISO 25010:2023."
  },
  {
    id: 18,
    question: "In Software Quality Assurance (SQA) vs Software Quality Control (SQC), which statement is correct?",
    options: [
      "SQA is product-focused and detective; SQC is process-focused and proactive",
      "SQA and SQC are interchangeable terms",
      "SQA is process-focused and proactive; SQC is product-focused and detective",
      "SQC prevents defects before they occur"
    ],
    correct: 2,
    explanation: "SQA is process-focused and proactive — it prevents defects before they occur. SQC is product-focused and detective — it finds defects in existing artefacts. Both are needed in a complete quality strategy."
  },
  {
    id: 19,
    question: "According to the 2025 DORA Report, what is the effect of AI tools on software delivery?",
    options: [
      "AI reduces both throughput and instability",
      "AI has no measurable effect on delivery quality",
      "AI boosts throughput but can increase instability",
      "AI eliminates the need for change failure rate tracking"
    ],
    correct: 2,
    explanation: "The 2025 DORA Report found that AI tools boost deployment throughput but can increase system instability — teams ship more but with higher rework rates if quality gates are not maintained."
  },
  {
    id: 20,
    question: "Best practice recommends using multiple quality models together. Which combination is recommended?",
    options: [
      "McCall for product, Boehm for delivery, FURPS+ for AI",
      "ISO 25010 for product, DORA for delivery, ISO 25059 for AI, ISO 5055 for code health",
      "ISO 9126 for product, DORA for AI, FURPS+ for delivery",
      "A single model should cover all quality dimensions"
    ],
    correct: 1,
    explanation: "No single model covers everything. Best practice: ISO/IEC 25010:2023 for product quality, DORA Metrics for delivery pipeline, ISO/IEC 25059:2023 for AI/ML components, and ISO/IEC 5055:2021 via SonarQube for internal code structural health."
  }
];

const SORT_ITEMS = [
  { id: 's1', text: 'Deployment frequency', correct: 'dora' },
  { id: 's2', text: 'Model fairness — no bias against demographic groups', correct: 'ai' },
  { id: 's3', text: 'Operability sub-characteristics', correct: 'iso25010' },
  { id: 's4', text: 'Change failure rate (CFR)', correct: 'dora' },
  { id: 's5', text: 'Supportability', correct: 'furps' },
  { id: 's6', text: 'Model drift monitoring', correct: 'ai' },
  { id: 's7', text: 'Flexibility — new 2023 addition', correct: 'iso25010' },
  { id: 's8', text: 'Functionality, usability, reliability', correct: 'furps' },
];

const SORT_BUCKETS = [
  { id: 'iso25010', label: 'ISO/IEC 25010:2023' },
  { id: 'dora',     label: 'DORA Metrics' },
  { id: 'ai',       label: 'ISO/IEC 25059:2023' },
  { id: 'furps',    label: 'FURPS+' },
];

const SCENARIO_TEXT = `MySihat is a Malaysian e-health app used by 2 million patients to book clinic appointments, view lab results, and track medication. A recent sprint deployed on a Friday. By Saturday morning, 3,000 appointment confirmations were sent to the wrong patients due to a session management bug. The app was technically functional — no crashes, no errors thrown — but patients showed up at the wrong clinics. The team fixed and redeployed within 4 hours.`;

const SCENARIO_QUESTIONS = [
  {
    id: 'c1',
    label: 'C1',
    question: 'Identify the error, fault, and failure in this scenario.'
  },
  {
    id: 'c2',
    label: 'C2',
    question: 'The app had zero crashes. Why does it still represent a quality failure? Reference at least two ISO/IEC 25010:2023 characteristics.'
  },
  {
    id: 'c3',
    label: 'C3',
    question: 'The team redeployed in 4 hours. Which DORA metric does this represent and what performance tier does it indicate?'
  },
  {
    id: 'c4',
    label: 'C4',
    question: 'If MySihat adds an AI feature to predict appointment no-shows, which standard applies on top of ISO 25010, and name two quality dimensions it must address.'
  }
];

const MODEL_ANSWERS = {
  c1: "Error — Developer incorrectly implemented session token isolation during parallel requests. Fault — The code assigned session data from one user's request context to another user's appointment record. Failure — 3,000 patients received appointment confirmations with wrong clinic/time details — an externally observable deviation from expected behaviour.",
  c2: "The app failed on Functional Suitability (did not perform its intended function correctly) and Reliability (fault tolerance and integrity sub-characteristics — produced incorrect data under concurrent load). Security is also compromised — user data was exposed to the wrong identity, a confidentiality breach.",
  c3: "This measures Mean Time to Restore (MTTR). 4 hours is within the high/elite performer range. The incident also counts toward Change Failure Rate, and the redeployment is a Rework Rate event (2024 DORA addition).",
  c4: "ISO/IEC 25059:2023 applies. Two dimensions: (1) Fairness — the model must not predict higher no-shows for patients based on demographic group. (2) Explainability — clinicians and patients must understand why a no-show was predicted, especially critical in healthcare."
};
