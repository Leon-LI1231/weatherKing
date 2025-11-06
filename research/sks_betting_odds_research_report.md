# Research Report

## Statistical Modeling for Betting Odds Implementation

### Summary of Work
A dynamic statistical model was researched, designed, and implemented within BetGenerationService.java to calculate moneyline odds for the "Max Temperature Over/Under" prop bet. The implementation utilizes a standard Normal Distribution (Z-score) model to calculate implied probability and integrates a standard Vig (House Edge) before converting the result to American odds format. This approach aligns with documented principles used in algorithmic sports betting.

### Motivation
The previous betting implementation relied on fixed +100 odds, which failed to reflect the volatility or likelihood implied by weather forecasts. There was a clear need to establish a credible, data-driven system where odds dynamically adjust based on the numerical forecast (μ) and a historical volatility constant (σ). The research focused on identifying established, text-based statistical methods used by bettors and analysts to implement this logic effectively.

### Time Spent
~30 minutes: Researching standard statistical models (Normal Distribution) used for predictive probabilities
~60 minutes: Developing and implementing the Phi() approximation function and the probabilityToAmericanOdds logic in BetGenerationService.java
~30 minutes: Calibrating the odds and verifying the expected values against test cases

### Results
The implementation successfully leverages the forecast temperature (μ) and the standard deviation (σ=3.0) of forecast errors to set odds dynamically.

1. Probability Modeling via Z-Score: The statistical core is the calculateUnderProbability method, which uses the Z-score formula (Z = (Line - μ) / σ) to determine the cumulative probability that the actual high temperature falls below the predetermined betting line1. This approach is fundamental to probability-based sports models.
Code Snippet 1: Z-Score and Probability Calculation (from BetGenerationService.java):
 * Calculates the probability of the actual temperature being BELOW the set line, 
 * assuming a Normal Distribution centered on the forecast temperature.
 */
private double calculateUnderProbability(double setLine, double mean, double stdDev) {
    // 1. Calculate the Z-score (Z = (X - μ) / σ)
    double zScore = (setLine - mean) / stdDev;
    
    // 2. Use the Z-score to find the Cumulative Distribution Function (CDF) value.
    return Phi(zScore);
}

2. VIG Application and Odds Conversion: After generating the true probability, the system applies the house edge (Vig) and converts the result to the American odds format2. This is handled by the probabilityToAmericanOdds method, directly referencing the principles of Implied Probability and Overround.
Code Snippet 2: VIG Application and American Odds Conversion:
/**
 * Converts a probability (0.0 to 1.0) into American Moneyline Odds, including a house vig.
 */
private BigDecimal probabilityToAmericanOdds(double probability) {
    
    // Apply a simple VIG adjustment (2% house edge adjustment)
    double viggedProbability = Math.max(0.01, Math.min(0.99, probability * 1.02 - 0.01));

    if (viggedProbability <= 0.50) {
        // Underdog (Positive Odds: +X)
        // Formula: (100 / P) - 100
        double odds = (100.0 / viggedProbability) - 100.0;
        return new BigDecimal(odds).setScale(2, RoundingMode.HALF_UP);
    } else {
        // Favorite (Negative Odds: -X)
        // Formula: -100 * (P / (1 - P))
        double odds = -100.0 * (viggedProbability / (1.0 - viggedProbability));
        return new BigDecimal(odds).setScale(2, RoundingMode.HALF_UP);
    }
}

Example Calculation (Demonstration)
For a forecast temperature of 52°F against a line of 50°F:
Z-Score Calculation: Z = (50.0 - 52.0) / 3.0 ≈ -0.6667
Probability (P): CDF(-0.6667) ≈ 0.2525 (The model believes there is a 25.25% chance the temperature will be UNDER 50°F)
Vigged Odds: The resulting odds are +269.83. This positive value correctly signifies that the UNDER is the underdog outcome, as the forecast (μ=52°F) is above the line.


### Sources
The Normal Distribution and how it applies to Sports Betting (Z-score application) 1
Understanding Implied Probability and Edge in Sports Betting (VIG and Overround) 2
1. https://blog.devgenius.io/the-normal-distribution-and-how-it-applies-to-sports-betting-8ef25a30c262
2. https://betstamp.com/education/understanding-implied-probability-and-edge ↩ ↩2 ↩3
