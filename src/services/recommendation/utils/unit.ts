import { UNITS } from '../../../constants';

type Converter = (
  data: { value: number; unit: UNITS.CM | UNITS.FEET | UNITS.KG | UNITS.POUND },
  expectedUnit: UNITS.CM | UNITS.FEET | UNITS.KG | UNITS.POUND,
) => number;
type UnitToFormulaMap = {
  [key: string]: (inputValue: number) => number;
};

export const convertHeight: Converter = ({ value, unit }, expectedHeightUnit) => {
  const feetInCm = 30.48;
  const unitToFormulaMap: UnitToFormulaMap = {
    [UNITS.CM]: (inputValue) => inputValue * feetInCm,
    [UNITS.FEET]: (inputValue) => inputValue / feetInCm,
  };

  return expectedHeightUnit === unit ? value : unitToFormulaMap[expectedHeightUnit](value);
};

export const convertWeight: Converter = ({ value, unit }, expectedWeightUnit) => {
  const poundInKg = 2.2;
  const unitToFormulaMap: UnitToFormulaMap = {
    [UNITS.KG]: (inputValue) => inputValue / poundInKg,
    [UNITS.POUND]: (inputValue) => inputValue * poundInKg,
  };

  return expectedWeightUnit === unit ? value : unitToFormulaMap[expectedWeightUnit](value);
};
