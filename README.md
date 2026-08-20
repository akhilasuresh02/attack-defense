# Decision-Time Evasion and Data Poisoning: Attack and Defense

Demonstration of machine-learning security using the **Breast Cancer Wisconsin (Diagnostic) dataset**. The project demonstrates decision-time evasion attacks, data-poisoning attacks, probability-based decisions, clustering-based detection, and layered defense strategies.

## 1. Project Objective

The project studies attacks at two stages of a machine-learning pipeline.

**Decision-time / Evasion attack:** the model is already trained, and the attacker modifies an input before prediction.

**Data-poisoning attack:** the attacker modifies training data before the model learns.

The notebook also demonstrates multiple defenses for detecting suspicious inputs, suspicious training samples, and uncertain predictions.

## 2. Dataset

The project uses the **Breast Cancer Wisconsin (Diagnostic)** dataset available through `scikit-learn`.

- **569 observations**
- **30 numerical features**
- **2 classes**
  - `0` = malignant
  - `1` = benign
- **426 training samples**
- **143 test samples**

The dataset is suitable because it is a binary classification problem with numerical features and can run efficiently on a CPU.

The test set is kept clean during the poisoning experiment so the effect of poisoning can be measured.

## 3. Machine Learning Models

Four classifiers were used:

1. Logistic Regression
2. Decision Tree
3. Random Forest
4. Support Vector Machine (SVM)

Logistic Regression is the required **linear model**.

Clean-data baseline accuracy:

| Model | Accuracy |
|---|---:|
| Logistic Regression | **98.60%** |
| SVM | **97.90%** |
| Random Forest | **95.80%** |
| Decision Tree | **93.71%** |

These baseline results provide a reference for measuring attack effects.

## 4. Attacks

The notebook contains **20 attack scenarios**:

**12 decision-time evasion attacks + 8 data-poisoning attacks = 20 attacks.**

### 4.1 Decision-Time Evasion

The first 12 attacks target the four classifiers:

```text
E01–E03 → Logistic Regression
E04–E06 → Decision Tree
E07–E09 → Random Forest
E10–E12 → SVM
```

The attack is performed **after training**. A correctly classified test sample is copied and selected feature values are changed gradually.

The main modification is:

```python
candidate[j] += direction * max_change[j] / steps
```

The modified sample is then passed to the already-trained classifier. If the prediction changes, the attack is considered successful.

### Evasion result

- **12** decision-time attack attempts
- **10** successful attacks
- **83.33%** observed attack success rate

Model-wise:

```text
Logistic Regression → 3/3 successful
SVM                 → 3/3 successful
Random Forest       → 2/3 successful
Decision Tree       → 2/3 successful
```

**Inference:** High clean-data accuracy does not automatically mean robustness against manipulated inputs.

### 4.2 Data Poisoning

The next 8 attacks target the training data of a PyTorch MLP.

The MLP architecture is:

```text
30 → 32 → 16 → 1
```

The eight poisoning scenarios are:

| ID | Attack | Rate |
|---|---|---:|
| P01 | Random label flip | 2% |
| P02 | Random label flip | 5% |
| P03 | Random label flip | 10% |
| P04 | Random label flip | 15% |
| P05 | Boundary-targeted label flip | 5% |
| P06 | Boundary-targeted label flip | 10% |
| P07 | Feature outlier injection | 5% |
| P08 | Feature outlier injection | 10% |

For label poisoning:

```python
yp[ids] = 1 - yp[ids]
```

For feature-outlier poisoning:

```python
Xp[ids] += 4.0 * signs
```

The poisoned training data is then used to train the MLP.

### Main poisoning result

Clean MLP:

```text
Accuracy = 97.20%
F1       = 97.75%
```

After 10% feature-outlier poisoning:

```text
Accuracy = 94.41%
F1       = 95.65%
```

**Inference:** Poisoning changes the training process itself, so the model can perform worse even when the final test set remains clean.

## 5. Defense Strategies

The notebook contains **20 defense strategies**.

### Decision-Time Defenses

1. Input range validation
2. Feature clipping
3. Consistent scaling
4. Probability thresholding
5. Low-confidence abstention
6. K-Means novelty detection
7. DBSCAN noise detection
8. Multi-model ensemble agreement
9. Perturbation consistency checking
10. Human review

### Poisoning Defenses

11. Data provenance validation
12. Duplicate removal
13. Robust scaling
14. Statistical outlier filtering
15. K-Means training-data screening
16. DBSCAN training-data screening
17. Label consistency verification
18. Training/validation drift monitoring
19. Regularization and early stopping
20. Clean holdout validation

These defenses are layered. They do not all perform the same job, and no single defense is guaranteed to stop every attack.

## 6. Main Attack + Defense Demonstration

The clearest demonstrated example is **10% feature-outlier poisoning followed by K-Means + DBSCAN screening**.

The attack is created with:

```python
Xp_t, yp_t = make_poison(0.10, "outlier")
```

Inside the attack function, feature values are modified using:

```python
Xp[ids] += 4.0 * signs
```

The defense is applied with:

```python
X_screened, y_screened, suspicious = screen_training_data(Xp, yp)
```

K-Means checks distance from learned cluster centroids and DBSCAN checks for noise points.

Suspicious samples are removed:

```python
suspicious = km_flag | db_flag
keep = ~suspicious
```

The model is then retrained using the screened data.

### Defense result

| Training condition | Accuracy | F1 |
|---|---:|---:|
| Clean MLP | **97.20%** | **97.75%** |
| 10% poisoned MLP | **94.41%** | **95.65%** |
| 10% poisoned + screening | **97.90%** | **98.32%** |

The demonstrated conservative screening run flagged **54 suspicious training samples**.

**Inference:** The attack reduced performance from 97.20% to 94.41%. After suspicious samples were removed and the model was retrained, accuracy increased to 97.90%, showing that the defense was effective for this poisoning scenario.

An aggressive screening strategy was also tested. It flagged more samples but achieved lower performance (**95.10% accuracy**), showing that removing too much data can also remove legitimate observations.

## 7. Probability-Based Defense

A normal binary decision can use a 0.50 threshold.

A stricter confidence-aware policy used in the notebook is:

```text
P >= 0.80 → Accept Class 1
P <= 0.20 → Accept Class 0
Otherwise → ABSTAIN / REVIEW
```

Example:

| P(class=1) | 0.50 decision | 0.80 policy |
|---:|---|---|
| 0.95 | Class 1 | Class 1 |
| 0.75 | Class 1 | ABSTAIN / REVIEW |
| 0.51 | Class 1 | ABSTAIN / REVIEW |
| 0.48 | Class 0 | ABSTAIN / REVIEW |

The purpose is to avoid automatically trusting predictions that are very close to the decision boundary.

## 8. Layered Defense Architecture

Decision-time:

```text
Input
  ↓
Range Validation
  ↓
Novelty Detection
  ↓
Classifier
  ↓
Probability Check
  ↓
Ensemble Check
  ↓
Accept / Abstain
```

Training-time:

```text
Training Data
  ↓
Provenance
  ↓
Cleaning
  ↓
Outlier Detection
  ↓
Label Verification
  ↓
Robust Training
  ↓
Clean Validation
  ↓
Monitoring
```

This is a **defense-in-depth** approach: several defenses are combined instead of relying on one technique.

## 9. Repository Structure

```text
decision-time-attack-defense/
│
├── Decision_Time_Attack_Defense_Complete.ipynb
├── README.md
└── report/
    └── Decision_Time_Attack_Defense_Report_Revised.docx
```

Because the notebook loads the dataset directly with `sklearn.datasets.load_breast_cancer()`, the dataset does not need to be uploaded separately to GitHub.

## 10. Technologies

- Python
- Google Colab / Jupyter Notebook
- NumPy
- Pandas
- Scikit-learn
- PyTorch
- Matplotlib
- Seaborn

## 11. Conclusion

This project demonstrates both the **attack surface** and **defense surface** of a machine-learning system.

Decision-time attacks manipulate inputs after training, while poisoning attacks manipulate the training process. The experiments show that a model can achieve high accuracy on clean data and still be vulnerable to adversarial manipulation.

The strongest demonstrated poisoning-defense example was the K-Means + DBSCAN screening pipeline, which improved the poisoned MLP's accuracy from **94.41% to 97.90%** after suspicious training samples were removed and the model was retrained.

> **Machine-learning security requires more than good prediction accuracy. It requires protection of the data, model inputs, training process, and final decision.**
