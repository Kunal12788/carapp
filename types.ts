export enum PaymentMode {
  CASH = 'Cash',
  UPI = 'UPI',
  BANK_TRANSFER = 'Bank Transfer'
}

export enum PaymentStatus {
  PAID = 'Paid',
  PENDING = 'Pending'
}

export interface ExpenseData {
  fuelCost: number;
  fuelQty: number; // in liters
  tollCharges: number;
  parkingCharges: number;
  otherExpenses: number;
}

export interface DriverPaymentData {
  totalDriverPay: number;
  advancePaid: number;
  balancePayable: number; // Derived
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
}

export interface Trip {
  id: string;
  // Core Trip Info
  date: string; // ISO Date string
  vehicleId: string;
  driverName: string;
  driverContact: string;
  customerName: string;
  customerContact: string;
  pickupLocation: string;
  dropLocation: string;
  startTime: string;
  endTime: string;
  
  // Financials - Income
  totalAmount: number; // Gross Income

  // Financials - Expenses
  expenses: ExpenseData;
  driverPayment: DriverPaymentData;

  // Operational - Odometer
  startOdometer: number;
  endOdometer: number;
  totalDistance: number; // Derived

  // Profitability
  totalExpense: number; // Derived (Fuel + Toll + Parking + Other + DriverPay)
  netProfit: number; // Derived (TotalAmount - TotalExpense)

  // Misc
  notes: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  makeModel: string;
  
  // Maintenance Dates
  lastServiceDate: string;
  nextServiceDueDate: string;
  oilChangeDate: string;
  tyreChangeDate: string;
  brakeServiceDate: string;
  batteryReplacementDate: string;
  insuranceExpiryDate: string;
  pollutionExpiryDate: string;
}

export type ViewState = 'DASHBOARD' | 'TRIPS' | 'VEHICLES';