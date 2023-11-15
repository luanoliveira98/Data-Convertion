export const UnitType: {
  APARTMENT: "apartamento";
  PARKINGSPACE: "vaga";
} = {
  APARTMENT: "apartamento",
  PARKINGSPACE: "vaga",
};

export type UnitType = (typeof UnitType)[keyof typeof UnitType];
