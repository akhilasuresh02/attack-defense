# 🛡️ Machine Learning Security & Defense Platform

An interactive web-based platform and academic notebook demonstration covering **Decision-Time Evasion Attacks** and **Training-Time Data Poisoning Attacks** along with layered **Defense & Detection Mechanisms** on the **Breast Cancer Wisconsin (Diagnostic) Dataset**.

---

## 🌟 Interactive User Guide (How to Use the Web Platform)

When the lab is deployed, any visitor can explore and run live security simulations. Follow this step-by-step guide:

### 1. 🏠 Platform Home (Overview)
- View high-level metrics across the **569-sample dataset**, **4 ML classifiers**, **12 evasion scenarios**, and **8 poisoning scenarios**.
- Examine the 6-stage **Security Experiment Pipeline**: `Clean Data ➔ Model Training ➔ Attack ➔ Behavior ➔ Defense ➔ Recovery`.
- Click **Demonstrate Evasion Attack** or **Demonstrate Poisoning Defense** to jump straight into active simulations.

### 2. ⚡ Evasion Attack Simulator
- Select any of the **12 attack scenarios** from the dropdown menu (e.g. `E01 — Logistic Regression` or `E10 — SVM`).
- Click **▶ Run Demonstration**.
- **Watch Live**:
  - The prediction status animates from `Class 0 (Malignant)` to `Class 1 (Benign)`.
  - In the **Feature Values Table**, see exact values before and after perturbation, highlighted with red **`MODIFIED`** badges.
  - Review the exact Python attack code: `candidate[j] += direction * max_change[j] / steps`.

### 3. 🛡️ Evasion Defense Panel
- **Probability Thresholding**: Drag the probability slider. Values in `0.20 – 0.80` trigger an **`ABSTAIN / REVIEW`** policy decision, while values `≥ 0.80` or `≤ 0.20` are accepted.
- **Ensemble Agreement**: Select **Sample #291** or **Sample #385** to see how model divergence across Logistic Regression, Decision Trees, Random Forests, and SVM automatically triggers an **`ABSTAIN: model disagreement`** security decision.

### 4. 🧪 Data Poisoning Explorer
- Inspect the 4-layer PyTorch MLP architecture (`30 ➔ 32 ➔ 16 ➔ 1`).
- Explore 8 poisoning scenarios (label flipping and feature outlier injection).
- Highlight scenario **P08 (10% Feature Outlier Injection)** which reduces clean MLP accuracy from **97.20% ➔ 94.41%**.

### 5. 🔄 Poisoning Defense Pipeline
- Click **▶ Run Demonstration Pipeline**.
- Experience the 9-step automated pipeline:
  1. **Clean Data** (`97.20% accuracy`)
  2. **10% Outlier Poisoning (P08)** (`94.41% accuracy`)
  3. **K-Means Distance & DBSCAN Noise Screening** (`suspicious = km_flag | db_flag`)
  4. **Removal of 54 Suspicious Training Records**
  5. **MLP Retraining & Performance Recovery** (`97.90% accuracy`, `98.32% F1 score`)

---

## 📊 Core Empirical Results

| Metric / Experiment | Value / Finding |
|---|---|
| **Clean Baseline Models** | Logistic Regression: **98.60%** \| SVM: **97.90%** \| RF: **95.80%** \| DT: **93.71%** |
| **Decision-Time Evasion** | **10 / 12 (83.33%)** attack attempts successfully flipped model predictions |
| **PyTorch MLP Clean Baseline** | **97.20%** accuracy (F1: 97.75%) |
| **10% Feature Outlier Poisoning** | Accuracy dropped to **94.41%** (-2.79% degradation) |
| **K-Means + DBSCAN Defense** | Identified & removed **54 suspicious training samples** |
| **Defended MLP Accuracy** | **97.90%** (Full recovery + F1: 98.32%) |

---


## 💻 Repository & Technology Stack

- **Frontend Web Platform**: React 18, Vite, Recharts, Lucide Icons, Vanilla CSS
- **Notebook & ML Core**: Python 3.10, PyTorch, Scikit-learn, Pandas, NumPy, Seaborn
