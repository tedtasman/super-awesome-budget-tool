import { useFinancialStore } from "../state/store/financial";
import { useNecessitiesStore, useMiscStore, useSavingsStore } from "../state/store/expenses";

export default function ParseJson({ contents }: { contents: string }) {
  // Financial store setters
  const setFederalTaxBrackets = useFinancialStore((state) => state.setFederalTaxBrackets);
  const setStateTaxBrackets = useFinancialStore((state) => state.setStateTaxBrackets);
  const setSocialSecurityTaxRate = useFinancialStore((state) => state.setSocialSecurityTaxRate);
  const setMedicareTaxRate = useFinancialStore((state) => state.setMedicareTaxRate);
  const setFederalStandardDeduction = useFinancialStore((state) => state.setFederalStandardDeduction);
  const setStateStandardDeduction = useFinancialStore((state) => state.setStateStandardDeduction);
  const setAdditionalClaimedDeductions = useFinancialStore((state) => state.setAdditionalClaimedDeductions);
  const setAdditionalWithholding = useFinancialStore((state) => state.setAdditionalWithholding);
  const setSalary = useFinancialStore((state) => state.setSalary);
  const setPaychecksPerYear = useFinancialStore((state) => state.setPaychecksPerYear);
  const setHourlyPay = useFinancialStore((state) => state.setHourlyPay);
  // End financial store setters

  // Necessities store setters
  const setNecessities = useNecessitiesStore((state) => state.setExpenses);
  const setPreTaxNecessities = useNecessitiesStore((state) => state.setPreTaxDeductions);
  const setPostTaxNecessities = useNecessitiesStore((state) => state.setPostTaxDeductions);
  // End necessities store setters

  // Savings store setters
  const setSavings = useSavingsStore((state) => state.setExpenses);
  const setPreTaxSavings = useSavingsStore((state) => state.setPreTaxDeductions);
  const setPostTaxSavings = useSavingsStore((state) => state.setPostTaxDeductions);
  // End savings store setters

  // Misc store setters
  const setMisc = useMiscStore((state) => state.setExpenses);
  const setPreTaxMisc = useMiscStore((state) => state.setPreTaxDeductions);
  const setPostTaxMisc = useMiscStore((state) => state.setPostTaxDeductions);
  // End misc store setters

  const missingFields: string[] = [];
  try {
    const parsedData = JSON.parse(contents);
    // Validate and set financial store data
    if (parsedData.federalTaxBrackets) {
      setFederalTaxBrackets(parsedData.federalTaxBrackets);
    } else {
      missingFields.push("federalTaxBrackets");
    }
    if (parsedData.stateTaxBrackets) {
      setStateTaxBrackets(parsedData.stateTaxBrackets);
    } else {
      missingFields.push("stateTaxBrackets");
    }
    if (parsedData.socialSecurityTaxRate !== undefined) {
      setSocialSecurityTaxRate(parsedData.socialSecurityTaxRate);
    } else {
      missingFields.push("socialSecurityTaxRate");
    }
    if (parsedData.medicareTaxRate !== undefined) {
      setMedicareTaxRate(parsedData.medicareTaxRate);
    } else {
      missingFields.push("medicareTaxRate");
    }
    if (parsedData.federalStandardDeduction !== undefined) {
      setFederalStandardDeduction(parsedData.federalStandardDeduction);
    } else {
      missingFields.push("federalStandardDeduction");
    }
    if (parsedData.stateStandardDeduction !== undefined) {
      setStateStandardDeduction(parsedData.stateStandardDeduction);
    } else {
      missingFields.push("stateStandardDeduction");
    }
    if (parsedData.additionalClaimedDeductions !== undefined) {
      setAdditionalClaimedDeductions(parsedData.additionalClaimedDeductions);
    } else {
      missingFields.push("additionalClaimedDeductions");
    }
    if (parsedData.additionalWithholding !== undefined) {
      setAdditionalWithholding(parsedData.additionalWithholding);
    } else {
      missingFields.push("additionalWithholding");
    }
    if (parsedData.salary !== undefined) {
      setSalary(parsedData.salary);
    } else {
      missingFields.push("salary");
    }
    if (parsedData.paychecksPerYear !== undefined) {
      setPaychecksPerYear(parsedData.paychecksPerYear);
    } else {
      missingFields.push("paychecksPerYear");
    }
    if (parsedData.hourlyPay) {
      setHourlyPay(parsedData.hourlyPay);
    } else {
      missingFields.push("hourlyPay");
    }

    // Validate and set necessities
    if (parsedData.necessities) {
      setNecessities(parsedData.necessities);
    } else {
      missingFields.push("necessities");
    }
    if (parsedData.preTaxNecessities) {
      setPreTaxNecessities(parsedData.preTaxNecessities);
    } else {
      missingFields.push("preTaxNecessities");
    }
    if (parsedData.postTaxNecessities) {
      setPostTaxNecessities(parsedData.postTaxNecessities);
    } else {
      missingFields.push("postTaxNecessities");
    }

    // Validate and set savings
    if (parsedData.savings) {
      setSavings(parsedData.savings);
    } else {
      missingFields.push("savings");
    }
    if (parsedData.preTaxSavings) {
      setPreTaxSavings(parsedData.preTaxSavings);
    } else {
      missingFields.push("preTaxSavings");
    }
    if (parsedData.postTaxSavings) {
      setPostTaxSavings(parsedData.postTaxSavings);
    } else {
      missingFields.push("postTaxSavings");
    }

    // Validate and set misc
    if (parsedData.misc) {
      setMisc(parsedData.misc);
    } else {
      missingFields.push("misc");
    }
    if (parsedData.preTaxMisc) {
      setPreTaxMisc(parsedData.preTaxMisc);
    } else {
      missingFields.push("preTaxMisc");
    }
    if (parsedData.postTaxMisc) {
      setPostTaxMisc(parsedData.postTaxMisc);
    } else {
      missingFields.push("postTaxMisc");
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}
