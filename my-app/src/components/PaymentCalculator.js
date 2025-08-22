// src/components/PaymentCalculator.js
import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PaymentCalculator() {
  const [homePrice, setHomePrice] = useState(5000000); // default 50 L
  const [downPayment, setDownPayment] = useState(1000000); // default 10 L
  const [interestRate, setInterestRate] = useState(7); // annual %
  const [loanTerm, setLoanTerm] = useState(20); // years

  // Monthly Payment Formula
  const principal = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfMonths = loanTerm * 12;
  const monthlyPayment = principal
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
      (Math.pow(1 + monthlyRate, numberOfMonths) - 1)
    : 0;

  return (<>
    <Navbar/>
    <div style={{ maxWidth: "500px", margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Mortgage / Payment Calculator</h2>

      <label>Home Price (₹):</label>
      <input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} />

      <label>Down Payment (₹):</label>
      <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />

      <label>Interest Rate (% per year):</label>
      <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} step="0.01" />

      <label>Loan Term (years):</label>
      <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} />

      <h3>Estimated Monthly Payment: ₹{monthlyPayment ? monthlyPayment.toFixed(0) : 0}</h3>
    </div>
    <Footer/>
    </>
  );
}
